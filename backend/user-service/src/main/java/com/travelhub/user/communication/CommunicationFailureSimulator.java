package com.travelhub.user.communication;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Communication Failure Simulator for testing microservices resilience
 */
@Component
@Slf4j
public class CommunicationFailureSimulator {
    
    private final Random random = new Random();
    private final Map<String, FailureConfiguration> failureConfigurations = new ConcurrentHashMap<>();
    
    public static class FailureConfiguration {
        private double timeoutProbability = 0.0;      // 0.0 - 1.0
        private double connectionFailureProbability = 0.0;
        private double apiErrorProbability = 0.0;
        private double dataCorruptionProbability = 0.0;
        private int artificialDelayMs = 0;
        private boolean enabled = false;
        
        // Getters and setters
        public double getTimeoutProbability() { return timeoutProbability; }
        public void setTimeoutProbability(double timeoutProbability) { this.timeoutProbability = timeoutProbability; }
        public double getConnectionFailureProbability() { return connectionFailureProbability; }
        public void setConnectionFailureProbability(double connectionFailureProbability) { this.connectionFailureProbability = connectionFailureProbability; }
        public double getApiErrorProbability() { return apiErrorProbability; }
        public void setApiErrorProbability(double apiErrorProbability) { this.apiErrorProbability = apiErrorProbability; }
        public double getDataCorruptionProbability() { return dataCorruptionProbability; }
        public void setDataCorruptionProbability(double dataCorruptionProbability) { this.dataCorruptionProbability = dataCorruptionProbability; }
        public int getArtificialDelayMs() { return artificialDelayMs; }
        public void setArtificialDelayMs(int artificialDelayMs) { this.artificialDelayMs = artificialDelayMs; }
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
    
    /**
     * Configure failure simulation for a service
     */
    public void configureFailures(String serviceName, FailureConfiguration config) {
        failureConfigurations.put(serviceName, config);
        log.info("Configured failure simulation for service: {} with config: {}", serviceName, config);
    }
    
    /**
     * Enable timeout simulation for a service
     */
    public void enableTimeoutSimulation(String serviceName, double probability) {
        FailureConfiguration config = failureConfigurations.computeIfAbsent(serviceName, k -> new FailureConfiguration());
        config.setTimeoutProbability(probability);
        config.setEnabled(true);
        log.info("Enabled timeout simulation for {}: {}% probability", serviceName, probability * 100);
    }
    
    /**
     * Enable connection failure simulation
     */
    public void enableConnectionFailureSimulation(String serviceName, double probability) {
        FailureConfiguration config = failureConfigurations.computeIfAbsent(serviceName, k -> new FailureConfiguration());
        config.setConnectionFailureProbability(probability);
        config.setEnabled(true);
        log.info("Enabled connection failure simulation for {}: {}% probability", serviceName, probability * 100);
    }
    
    /**
     * Enable API error simulation
     */
    public void enableApiErrorSimulation(String serviceName, double probability) {
        FailureConfiguration config = failureConfigurations.computeIfAbsent(serviceName, k -> new FailureConfiguration());
        config.setApiErrorProbability(probability);
        config.setEnabled(true);
        log.info("Enabled API error simulation for {}: {}% probability", serviceName, probability * 100);
    }
    
    /**
     * Enable data corruption simulation
     */
    public void enableDataCorruptionSimulation(String serviceName, double probability) {
        FailureConfiguration config = failureConfigurations.computeIfAbsent(serviceName, k -> new FailureConfiguration());
        config.setDataCorruptionProbability(probability);
        config.setEnabled(true);
        log.info("Enabled data corruption simulation for {}: {}% probability", serviceName, probability * 100);
    }
    
    /**
     * Add artificial delay to simulate slow responses
     */
    public void addArtificialDelay(String serviceName, int delayMs) {
        FailureConfiguration config = failureConfigurations.computeIfAbsent(serviceName, k -> new FailureConfiguration());
        config.setArtificialDelayMs(delayMs);
        config.setEnabled(true);
        log.info("Added artificial delay for {}: {}ms", serviceName, delayMs);
    }
    
    /**
     * Check if a timeout should be simulated
     */
    public boolean shouldSimulateTimeout(String serviceName) {
        FailureConfiguration config = failureConfigurations.get(serviceName);
        if (config != null && config.isEnabled() && config.getTimeoutProbability() > 0) {
            boolean simulate = random.nextDouble() < config.getTimeoutProbability();
            if (simulate) {
                log.warn("Simulating timeout for service: {}", serviceName);
            }
            return simulate;
        }
        return false;
    }
    
    /**
     * Check if a connection failure should be simulated
     */
    public boolean shouldSimulateConnectionFailure(String serviceName) {
        FailureConfiguration config = failureConfigurations.get(serviceName);
        if (config != null && config.isEnabled() && config.getConnectionFailureProbability() > 0) {
            boolean simulate = random.nextDouble() < config.getConnectionFailureProbability();
            if (simulate) {
                log.warn("Simulating connection failure for service: {}", serviceName);
            }
            return simulate;
        }
        return false;
    }
    
    /**
     * Check if an API error should be simulated
     */
    public boolean shouldSimulateApiError(String serviceName) {
        FailureConfiguration config = failureConfigurations.get(serviceName);
        if (config != null && config.isEnabled() && config.getApiErrorProbability() > 0) {
            boolean simulate = random.nextDouble() < config.getApiErrorProbability();
            if (simulate) {
                log.warn("Simulating API error for service: {}", serviceName);
            }
            return simulate;
        }
        return false;
    }
    
    /**
     * Check if data corruption should be simulated
     */
    public boolean shouldSimulateDataCorruption(String serviceName) {
        FailureConfiguration config = failureConfigurations.get(serviceName);
        if (config != null && config.isEnabled() && config.getDataCorruptionProbability() > 0) {
            boolean simulate = random.nextDouble() < config.getDataCorruptionProbability();
            if (simulate) {
                log.warn("Simulating data corruption for service: {}", serviceName);
            }
            return simulate;
        }
        return false;
    }
    
    /**
     * Apply artificial delay if configured
     */
    public void applyArtificialDelay(String serviceName) {
        FailureConfiguration config = failureConfigurations.get(serviceName);
        if (config != null && config.isEnabled() && config.getArtificialDelayMs() > 0) {
            try {
                log.debug("Applying artificial delay of {}ms for service: {}", config.getArtificialDelayMs(), serviceName);
                Thread.sleep(config.getArtificialDelayMs());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("Artificial delay interrupted for service: {}", serviceName);
            }
        }
    }
    
    /**
     * Disable all failure simulations for a service
     */
    public void disableFailureSimulation(String serviceName) {
        FailureConfiguration config = failureConfigurations.get(serviceName);
        if (config != null) {
            config.setEnabled(false);
            log.info("Disabled failure simulation for service: {}", serviceName);
        }
    }
    
    /**
     * Get failure configuration for a service
     */
    public FailureConfiguration getFailureConfiguration(String serviceName) {
        return failureConfigurations.get(serviceName);
    }
    
    /**
     * Create a realistic failure scenario
     */
    public void createRealisticFailureScenario(String serviceName) {
        FailureConfiguration config = new FailureConfiguration();
        config.setTimeoutProbability(0.05);           // 5% timeout rate
        config.setConnectionFailureProbability(0.02); // 2% connection failure rate
        config.setApiErrorProbability(0.03);          // 3% API error rate
        config.setDataCorruptionProbability(0.01);    // 1% data corruption rate
        config.setArtificialDelayMs(100);             // 100ms additional delay
        config.setEnabled(true);
        
        failureConfigurations.put(serviceName, config);
        log.info("Created realistic failure scenario for service: {}", serviceName);
    }
    
    /**
     * Create a stress test scenario
     */
    public void createStressTestScenario(String serviceName) {
        FailureConfiguration config = new FailureConfiguration();
        config.setTimeoutProbability(0.20);           // 20% timeout rate
        config.setConnectionFailureProbability(0.15); // 15% connection failure rate
        config.setApiErrorProbability(0.10);          // 10% API error rate
        config.setDataCorruptionProbability(0.05);    // 5% data corruption rate
        config.setArtificialDelayMs(500);             // 500ms additional delay
        config.setEnabled(true);
        
        failureConfigurations.put(serviceName, config);
        log.info("Created stress test scenario for service: {}", serviceName);
    }
}