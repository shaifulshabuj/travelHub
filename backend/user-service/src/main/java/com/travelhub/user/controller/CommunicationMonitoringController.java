package com.travelhub.user.controller;

import com.travelhub.user.client.BookingServiceClient;
import com.travelhub.user.communication.CommunicationResult;
import com.travelhub.user.communication.ServiceCommunicationMonitor;
import com.travelhub.user.communication.CommunicationFailureSimulator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

/**
 * Communication Monitoring Controller for demonstrating and managing inter-service communication failures
 */
@RestController
@RequestMapping("/api/v1/communication")
@RequiredArgsConstructor
@Slf4j
public class CommunicationMonitoringController {
    
    private final ServiceCommunicationMonitor communicationMonitor;
    private final CommunicationFailureSimulator failureSimulator;
    private final BookingServiceClient bookingServiceClient;
    
    /**
     * Get communication failure report for all services
     */
    @GetMapping("/failures/report")
    public ResponseEntity<Map<String, Object>> getFailureReport() {
        log.info("Generating communication failure report");
        
        Map<String, Integer> failureReport = communicationMonitor.getFailureReport();
        
        Map<String, Object> report = new HashMap<>();
        report.put("timestamp", LocalDateTime.now());
        report.put("failures", failureReport);
        
        // Add service health status
        Map<String, Object> serviceHealth = new HashMap<>();
        serviceHealth.put("booking-service", getServiceHealthStatus("booking-service"));
        report.put("serviceHealth", serviceHealth);
        
        return ResponseEntity.ok(report);
    }
    
    /**
     * Test communication with booking service
     */
    @GetMapping("/test/booking-service/{userId}")
    public ResponseEntity<Map<String, Object>> testBookingServiceCommunication(@PathVariable Long userId) {
        log.info("Testing communication with booking service for user: {}", userId);
        
        CommunicationResult<Map> result = bookingServiceClient.getUserBookings(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("userId", userId);
        response.put("successful", result.isSuccessful());
        response.put("responseTime", result.getResponseTime() != null ? result.getResponseTime().toMillis() : null);
        
        if (result.isSuccessful()) {
            response.put("data", result.getData());
        } else {
            response.put("error", result.getErrorMessage());
            response.put("failureType", result.getFailureType());
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Simulate timeout failures
     */
    @PostMapping("/simulate/timeout/{serviceName}")
    public ResponseEntity<Map<String, Object>> simulateTimeoutFailures(
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "0.1") double probability) {
        
        log.warn("Enabling timeout simulation for service {} with probability {}", serviceName, probability);
        
        failureSimulator.enableTimeoutSimulation(serviceName, probability);
        
        return ResponseEntity.ok(Map.of(
            "message", "Timeout simulation enabled",
            "serviceName", serviceName,
            "probability", probability,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Simulate connection failures
     */
    @PostMapping("/simulate/connection-failure/{serviceName}")
    public ResponseEntity<Map<String, Object>> simulateConnectionFailures(
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "0.1") double probability) {
        
        log.warn("Enabling connection failure simulation for service {} with probability {}", serviceName, probability);
        
        failureSimulator.enableConnectionFailureSimulation(serviceName, probability);
        
        return ResponseEntity.ok(Map.of(
            "message", "Connection failure simulation enabled",
            "serviceName", serviceName,
            "probability", probability,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Simulate API errors
     */
    @PostMapping("/simulate/api-error/{serviceName}")
    public ResponseEntity<Map<String, Object>> simulateApiErrors(
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "0.1") double probability) {
        
        log.warn("Enabling API error simulation for service {} with probability {}", serviceName, probability);
        
        failureSimulator.enableApiErrorSimulation(serviceName, probability);
        
        return ResponseEntity.ok(Map.of(
            "message", "API error simulation enabled",
            "serviceName", serviceName,
            "probability", probability,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Simulate data corruption
     */
    @PostMapping("/simulate/data-corruption/{serviceName}")
    public ResponseEntity<Map<String, Object>> simulateDataCorruption(
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "0.05") double probability) {
        
        log.warn("Enabling data corruption simulation for service {} with probability {}", serviceName, probability);
        
        failureSimulator.enableDataCorruptionSimulation(serviceName, probability);
        
        return ResponseEntity.ok(Map.of(
            "message", "Data corruption simulation enabled",
            "serviceName", serviceName,
            "probability", probability,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Create realistic failure scenario
     */
    @PostMapping("/simulate/realistic/{serviceName}")
    public ResponseEntity<Map<String, Object>> createRealisticFailureScenario(@PathVariable String serviceName) {
        log.warn("Creating realistic failure scenario for service: {}", serviceName);
        
        failureSimulator.createRealisticFailureScenario(serviceName);
        
        return ResponseEntity.ok(Map.of(
            "message", "Realistic failure scenario created",
            "serviceName", serviceName,
            "description", "5% timeout, 2% connection failure, 3% API error, 1% data corruption",
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Create stress test scenario
     */
    @PostMapping("/simulate/stress/{serviceName}")
    public ResponseEntity<Map<String, Object>> createStressTestScenario(@PathVariable String serviceName) {
        log.warn("Creating stress test scenario for service: {}", serviceName);
        
        failureSimulator.createStressTestScenario(serviceName);
        
        return ResponseEntity.ok(Map.of(
            "message", "Stress test scenario created",
            "serviceName", serviceName,
            "description", "20% timeout, 15% connection failure, 10% API error, 5% data corruption",
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Disable failure simulation
     */
    @DeleteMapping("/simulate/{serviceName}")
    public ResponseEntity<Map<String, Object>> disableFailureSimulation(@PathVariable String serviceName) {
        log.info("Disabling failure simulation for service: {}", serviceName);
        
        failureSimulator.disableFailureSimulation(serviceName);
        
        return ResponseEntity.ok(Map.of(
            "message", "Failure simulation disabled",
            "serviceName", serviceName,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Reset failure counters
     */
    @PostMapping("/failures/reset/{serviceName}")
    public ResponseEntity<Map<String, Object>> resetFailureCounters(@PathVariable String serviceName) {
        log.info("Resetting failure counters for service: {}", serviceName);
        
        communicationMonitor.resetFailureCounters(serviceName);
        
        return ResponseEntity.ok(Map.of(
            "message", "Failure counters reset",
            "serviceName", serviceName,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    /**
     * Test multiple calls to demonstrate failures
     */
    @PostMapping("/test/batch/{serviceName}")
    public ResponseEntity<Map<String, Object>> testBatchCommunication(
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "10") int numberOfCalls) {
        
        log.info("Testing batch communication with {} - {} calls", serviceName, numberOfCalls);
        
        Map<String, Integer> results = new HashMap<>();
        results.put("successful", 0);
        results.put("timeouts", 0);
        results.put("connectionErrors", 0);
        results.put("apiErrors", 0);
        results.put("dataErrors", 0);
        
        for (int i = 0; i < numberOfCalls; i++) {
            CommunicationResult<Map> result = bookingServiceClient.getUserBookings((long) (i + 1));
            
            if (result.isSuccessful()) {
                results.put("successful", results.get("successful") + 1);
            } else if (result.isTimeout()) {
                results.put("timeouts", results.get("timeouts") + 1);
            } else if (result.isConnectionError()) {
                results.put("connectionErrors", results.get("connectionErrors") + 1);
            } else if (result.isApiError()) {
                results.put("apiErrors", results.get("apiErrors") + 1);
            } else if (result.isDataValidationError()) {
                results.put("dataErrors", results.get("dataErrors") + 1);
            }
        }
        
        return ResponseEntity.ok(Map.of(
            "serviceName", serviceName,
            "numberOfCalls", numberOfCalls,
            "results", results,
            "timestamp", LocalDateTime.now()
        ));
    }
    
    private Map<String, Object> getServiceHealthStatus(String serviceName) {
        ServiceCommunicationMonitor.ServiceHealth health = communicationMonitor.getServiceHealth(serviceName);
        
        if (health == null) {
            return Map.of("status", "UNKNOWN", "message", "No health data available");
        }
        
        return Map.of(
            "status", health.isHealthy() ? "HEALTHY" : "UNHEALTHY",
            "lastCheckTime", health.getLastCheckTime(),
            "responseTime", health.getResponseTime() != null ? health.getResponseTime().toMillis() : null,
            "consecutiveFailures", health.getConsecutiveFailures(),
            "lastError", health.getLastError()
        );
    }
}