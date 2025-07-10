package com.travelhub.user.evolution;

import com.travelhub.user.dto.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Evolution Engine for Genetic Coding
 */
@Component
@Slf4j
public class EvolutionEngine {
    
    private final Map<String, Double> fitnessMetrics = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> operationCounters = new ConcurrentHashMap<>();
    private final Map<String, Long> lastEvolutionTime = new ConcurrentHashMap<>();
    
    public void evolve(Object component) {
        log.debug("Evolution engine triggered for component: {}", component.getClass().getSimpleName());
        // Evolution logic will be implemented here
    }
    
    public void trackPerformance(String metric, double value) {
        log.debug("Performance metric {} recorded: {}", metric, value);
        // Performance tracking logic
    }
    
    public void recordFitness(String operation, double fitnessScore) {
        log.debug("Recording fitness for operation {}: {}", operation, fitnessScore);
        fitnessMetrics.put(operation, fitnessScore);
        operationCounters.computeIfAbsent(operation, k -> new AtomicInteger(0)).incrementAndGet();
    }
    
    public boolean shouldEvolve(String operation) {
        AtomicInteger counter = operationCounters.get(operation);
        Long lastEvolution = lastEvolutionTime.get(operation);
        long currentTime = System.currentTimeMillis();
        
        // Evolve if we have many operations or it's been a while since last evolution
        boolean shouldEvolve = (counter != null && counter.get() > 10) || 
                              (lastEvolution != null && currentTime - lastEvolution > 60000); // 1 minute
        
        log.debug("Should evolve {}: {} (counter: {}, last evolution: {})", 
                operation, shouldEvolve, counter != null ? counter.get() : 0, lastEvolution);
        
        return shouldEvolve;
    }
    
    public void triggerEvolution(Object component, String trigger) {
        log.info("Triggering evolution for {} with trigger: {}", 
                component.getClass().getSimpleName(), trigger);
        
        if (component instanceof EvolvableController) {
            EvolvableController evolvable = (EvolvableController) component;
            Map<String, Object> context = Map.of(
                "timestamp", System.currentTimeMillis(),
                "trigger", trigger,
                "component", component.getClass().getSimpleName()
            );
            evolvable.evolve(trigger, context);
        }
        
        // Record evolution time
        String key = component.getClass().getSimpleName();
        lastEvolutionTime.put(key, System.currentTimeMillis());
        
        // Reset counters after evolution
        String operationKey = key.toLowerCase() + ".creation";
        operationCounters.put(operationKey, new AtomicInteger(0));
    }
    
    public double calculateFitness(UserResponse response) {
        // Calculate fitness based on response characteristics
        double fitness = 0.0;
        
        if (response != null) {
            // Base fitness for valid response
            fitness += 50.0;
            
            // Fitness bonus for genetic generation (evolution advancement)
            if (response.getGeneticGeneration() != null) {
                fitness += response.getGeneticGeneration() * 5.0;
            }
            
            // Fitness bonus for existing fitness score
            if (response.getFitnessScore() != null) {
                fitness += response.getFitnessScore() * 10.0;
            }
            
            // Fitness bonus for complete data
            if (response.getEmail() != null && response.getFirstName() != null 
                && response.getLastName() != null) {
                fitness += 20.0;
            }
        }
        
        log.debug("Calculated fitness for user response: {}", fitness);
        return fitness;
    }
    
    public void recordEvolution(String componentName, String trigger, Map<String, Object> context) {
        log.info("Recording evolution: component={}, trigger={}, context={}", 
                componentName, trigger, context);
        
        // Store evolution record for analysis
        String evolutionKey = componentName + "_" + trigger;
        fitnessMetrics.put(evolutionKey, System.currentTimeMillis() / 1000.0);
    }
    
    public Map<String, Double> getFitnessMetrics() {
        return Map.copyOf(fitnessMetrics);
    }
    
    public Map<String, Integer> getOperationCounts() {
        Map<String, Integer> counts = new ConcurrentHashMap<>();
        operationCounters.forEach((k, v) -> counts.put(k, v.get()));
        return counts;
    }
}
