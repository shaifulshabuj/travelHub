package com.travelhub.user.communication;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service Communication Monitor for tracking inter-service communication failures
 */
@Component
@Slf4j
public class ServiceCommunicationMonitor {
    
    private final Map<String, ServiceHealth> serviceHealthMap = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> failureCounters = new ConcurrentHashMap<>();
    private final RestTemplate restTemplate = new RestTemplate();
    
    public static class ServiceHealth {
        private String serviceName;
        private boolean isHealthy;
        private LocalDateTime lastCheckTime;
        private Duration responseTime;
        private String lastError;
        private int consecutiveFailures;
        
        public ServiceHealth(String serviceName) {
            this.serviceName = serviceName;
            this.isHealthy = true;
            this.lastCheckTime = LocalDateTime.now();
            this.consecutiveFailures = 0;
        }
        
        // Getters and setters
        public String getServiceName() { return serviceName; }
        public boolean isHealthy() { return isHealthy; }
        public void setHealthy(boolean healthy) { isHealthy = healthy; }
        public LocalDateTime getLastCheckTime() { return lastCheckTime; }
        public void setLastCheckTime(LocalDateTime lastCheckTime) { this.lastCheckTime = lastCheckTime; }
        public Duration getResponseTime() { return responseTime; }
        public void setResponseTime(Duration responseTime) { this.responseTime = responseTime; }
        public String getLastError() { return lastError; }
        public void setLastError(String lastError) { this.lastError = lastError; }
        public int getConsecutiveFailures() { return consecutiveFailures; }
        public void setConsecutiveFailures(int consecutiveFailures) { this.consecutiveFailures = consecutiveFailures; }
    }
    
    /**
     * Monitor API call to external service
     */
    public <T> CommunicationResult<T> monitorApiCall(String serviceName, String endpoint, 
            Class<T> responseType, int timeoutMs) {
        LocalDateTime startTime = LocalDateTime.now();
        ServiceHealth health = serviceHealthMap.computeIfAbsent(serviceName, ServiceHealth::new);
        
        try {
            log.debug("Monitoring API call to {}: {}", serviceName, endpoint);
            
            // Set timeout using HttpComponentsClientHttpRequestFactory
            org.springframework.http.client.SimpleClientHttpRequestFactory factory = 
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(timeoutMs);
            factory.setReadTimeout(timeoutMs);
            restTemplate.setRequestFactory(factory);
            
            ResponseEntity<T> response = restTemplate.getForEntity(endpoint, responseType);
            Duration responseTime = Duration.between(startTime, LocalDateTime.now());
            
            // Update health status
            updateHealthStatus(health, true, responseTime, null);
            
            // Validate response data
            if (response.getBody() == null) {
                recordDataExchangeFailure(serviceName, "Empty response body received");
                return CommunicationResult.failure("Empty response body", null);
            }
            
            log.info("Successful API call to {} in {}ms", serviceName, responseTime.toMillis());
            return CommunicationResult.success(response.getBody(), responseTime);
            
        } catch (ResourceAccessException ex) {
            Duration responseTime = Duration.between(startTime, LocalDateTime.now());
            
            if (responseTime.toMillis() >= timeoutMs) {
                recordTimeoutFailure(serviceName, endpoint, timeoutMs);
                updateHealthStatus(health, false, responseTime, "Timeout after " + timeoutMs + "ms");
                return CommunicationResult.timeout("Request timeout after " + timeoutMs + "ms", responseTime);
            } else {
                recordConnectionFailure(serviceName, endpoint, ex.getMessage());
                updateHealthStatus(health, false, responseTime, ex.getMessage());
                return CommunicationResult.failure("Connection failed: " + ex.getMessage(), responseTime);
            }
            
        } catch (Exception ex) {
            Duration responseTime = Duration.between(startTime, LocalDateTime.now());
            recordApiCallFailure(serviceName, endpoint, ex.getMessage());
            updateHealthStatus(health, false, responseTime, ex.getMessage());
            return CommunicationResult.failure("API call failed: " + ex.getMessage(), responseTime);
        }
    }
    
    /**
     * Check service health
     */
    public boolean isServiceHealthy(String serviceName) {
        ServiceHealth health = serviceHealthMap.get(serviceName);
        return health != null && health.isHealthy() && 
               Duration.between(health.getLastCheckTime(), LocalDateTime.now()).toMinutes() < 5;
    }
    
    /**
     * Get service health status
     */
    public ServiceHealth getServiceHealth(String serviceName) {
        return serviceHealthMap.get(serviceName);
    }
    
    /**
     * Record API call failure
     */
    private void recordApiCallFailure(String serviceName, String endpoint, String error) {
        AtomicInteger counter = failureCounters.computeIfAbsent(serviceName + ":api_failure", k -> new AtomicInteger(0));
        int failures = counter.incrementAndGet();
        
        log.error("API call failure #{} to service {}: {} - Error: {}", failures, serviceName, endpoint, error);
        
        if (failures > 5) {
            log.warn("Service {} has exceeded failure threshold with {} API call failures", serviceName, failures);
        }
    }
    
    /**
     * Record timeout failure
     */
    private void recordTimeoutFailure(String serviceName, String endpoint, int timeoutMs) {
        AtomicInteger counter = failureCounters.computeIfAbsent(serviceName + ":timeout", k -> new AtomicInteger(0));
        int timeouts = counter.incrementAndGet();
        
        log.error("Timeout failure #{} to service {}: {} after {}ms", timeouts, serviceName, endpoint, timeoutMs);
        
        if (timeouts > 3) {
            log.warn("Service {} has excessive timeouts: {} timeout failures", serviceName, timeouts);
        }
    }
    
    /**
     * Record connection failure
     */
    private void recordConnectionFailure(String serviceName, String endpoint, String error) {
        AtomicInteger counter = failureCounters.computeIfAbsent(serviceName + ":connection", k -> new AtomicInteger(0));
        int failures = counter.incrementAndGet();
        
        log.error("Connection failure #{} to service {}: {} - Error: {}", failures, serviceName, endpoint, error);
    }
    
    /**
     * Record data exchange failure
     */
    private void recordDataExchangeFailure(String serviceName, String reason) {
        AtomicInteger counter = failureCounters.computeIfAbsent(serviceName + ":data_exchange", k -> new AtomicInteger(0));
        int failures = counter.incrementAndGet();
        
        log.error("Data exchange failure #{} with service {}: {}", failures, serviceName, reason);
    }
    
    /**
     * Update service health status
     */
    private void updateHealthStatus(ServiceHealth health, boolean isSuccessful, Duration responseTime, String error) {
        health.setLastCheckTime(LocalDateTime.now());
        health.setResponseTime(responseTime);
        
        if (isSuccessful) {
            health.setHealthy(true);
            health.setConsecutiveFailures(0);
            health.setLastError(null);
        } else {
            health.setConsecutiveFailures(health.getConsecutiveFailures() + 1);
            health.setLastError(error);
            
            // Mark unhealthy after 3 consecutive failures
            if (health.getConsecutiveFailures() >= 3) {
                health.setHealthy(false);
            }
        }
    }
    
    /**
     * Get failure report for all services
     */
    public Map<String, Integer> getFailureReport() {
        Map<String, Integer> report = new ConcurrentHashMap<>();
        failureCounters.forEach((key, counter) -> report.put(key, counter.get()));
        return report;
    }
    
    /**
     * Reset failure counters for a service
     */
    public void resetFailureCounters(String serviceName) {
        failureCounters.entrySet().removeIf(entry -> entry.getKey().startsWith(serviceName + ":"));
        log.info("Reset failure counters for service: {}", serviceName);
    }
}