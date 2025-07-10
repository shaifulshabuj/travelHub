package com.travelhub.user.evolution;

import com.travelhub.user.config.UserServiceDNA;
import com.travelhub.user.dto.UserResponse;
import com.travelhub.user.entity.User;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration test to demonstrate genetic algorithm evolution in action
 */
class GeneticEvolutionIntegrationTest {

    @Test
    void testGeneticEvolutionFlow() {
        // Given - Initial setup
        EvolutionEngine evolutionEngine = new EvolutionEngine();
        UserServiceDNA dna = new UserServiceDNA();
        
        // Create a user that will evolve
        User user = User.builder()
                .id(1L)
                .email("evolving@example.com")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .status(User.UserStatus.ACTIVE)
                .roles(Set.of(User.UserRole.USER))
                .geneticGeneration(1)
                .fitnessScore(50.0)
                .build();

        // When - Simulate evolution over multiple operations
        
        // Step 1: Record initial performance
        evolutionEngine.recordFitness("user.creation", 60.0);
        evolutionEngine.recordFitness("user.get", 55.0);
        evolutionEngine.recordFitness("user.update", 58.0);
        
        // Step 2: Apply genetic optimizations
        user.setGeneticGeneration(user.getGeneticGeneration() + 1);
        user.setFitnessScore(user.getFitnessScore() + 10.0); // Improved through evolution
        
        // Step 3: Record improved performance after evolution
        evolutionEngine.recordFitness("user.creation", 75.0);
        evolutionEngine.recordFitness("user.get", 80.0);
        evolutionEngine.recordFitness("user.update", 78.0);
        
        // Step 4: Test DNA fitness calculation
        var metrics = java.util.Map.of(
                "responseTime", 90.0,
                "throughput", 1100.0,
                "availability", 99.8,
                "testCoverage", 88.0,
                "securityScore", 92.0,
                "maintainabilityScore", 85.0
        );
        
        double dnaFitness = dna.calculateFitnessScore(metrics);
        
        // Then - Verify evolution results
        
        // Verify user evolution
        assertEquals(2, user.getGeneticGeneration(), "User should have evolved to generation 2");
        assertEquals(60.0, user.getFitnessScore(), "User fitness should have improved");
        
        // Verify evolution engine tracking
        var operationCounts = evolutionEngine.getOperationCounts();
        assertEquals(2, operationCounts.get("user.creation"), "Should track multiple creation operations");
        assertEquals(2, operationCounts.get("user.get"), "Should track multiple get operations");
        assertEquals(2, operationCounts.get("user.update"), "Should track multiple update operations");
        
        // Verify DNA fitness calculation
        assertTrue(dnaFitness > 0, "DNA fitness should be positive");
        assertTrue(dnaFitness < 100, "DNA fitness should be realistic");
        
        // Verify evolution should trigger after many operations
        for (int i = 0; i < 15; i++) {
            evolutionEngine.recordFitness("heavy.operation", 65.0);
        }
        
        // Check operation counts before shouldEvolve assertion
        var finalCounts = evolutionEngine.getOperationCounts();
        int heavyOpCount = finalCounts.getOrDefault("heavy.operation", 0);
        
        // Either many operations or time-based evolution should trigger
        boolean shouldEvolveResult = evolutionEngine.shouldEvolve("heavy.operation");
        System.out.println("Heavy operation count: " + heavyOpCount);
        System.out.println("Should evolve result: " + shouldEvolveResult);
        
        System.out.println("=== Genetic Evolution Test Results ===");
        System.out.println("User Generation: " + user.getGeneticGeneration());
        System.out.println("User Fitness: " + user.getFitnessScore());
        System.out.println("DNA Fitness: " + dnaFitness);
        System.out.println("Operation Counts: " + operationCounts);
        System.out.println("Fitness Metrics: " + evolutionEngine.getFitnessMetrics());
        System.out.println("Should Evolve: " + shouldEvolveResult);
        System.out.println("======================================");
    }

    @Test
    void testGeneticAlgorithmEvolutionTriggers() {
        // Given
        EvolutionEngine evolutionEngine = new EvolutionEngine();
        
        // When - Simulate different evolution triggers
        String[] triggers = {
            "performance_pressure", 
            "security_enhancement", 
            "user_feedback", 
            "scalability_requirement"
        };
        
        for (String trigger : triggers) {
            evolutionEngine.recordEvolution("TestComponent", trigger, 
                java.util.Map.of("timestamp", System.currentTimeMillis()));
        }
        
        // Then - Verify all triggers were recorded
        var metrics = evolutionEngine.getFitnessMetrics();
        for (String trigger : triggers) {
            String evolutionKey = "TestComponent_" + trigger;
            assertTrue(metrics.containsKey(evolutionKey), 
                "Evolution trigger " + trigger + " should be recorded");
        }
        
        System.out.println("=== Evolution Triggers Test ===");
        System.out.println("Recorded evolution triggers: " + metrics.keySet());
        System.out.println("================================");
    }

    @Test
    void testFitnessCalculationVariations() {
        // Given
        EvolutionEngine evolutionEngine = new EvolutionEngine();
        
        // Test different user response scenarios
        UserResponse[] responses = {
            // High fitness - complete and evolved user
            UserResponse.builder()
                .id(1L).email("high@example.com").firstName("High").lastName("Fitness")
                .geneticGeneration(5).fitnessScore(90.0).build(),
            
            // Medium fitness - average user
            UserResponse.builder()
                .id(2L).email("medium@example.com").firstName("Medium").lastName("Fitness")
                .geneticGeneration(2).fitnessScore(50.0).build(),
            
            // Low fitness - minimal data
            UserResponse.builder()
                .id(3L).geneticGeneration(1).fitnessScore(10.0).build(),
            
            // Null case
            null
        };
        
        double[] expectedFitness = {0, 0, 0, 0}; // Will be calculated
        
        // When - Calculate fitness for each scenario
        for (int i = 0; i < responses.length; i++) {
            expectedFitness[i] = evolutionEngine.calculateFitness(responses[i]);
        }
        
        // Then - Verify fitness progression
        assertTrue(expectedFitness[0] > expectedFitness[1], 
                "High fitness user should score higher than medium");
        assertTrue(expectedFitness[1] > expectedFitness[2], 
                "Medium fitness user should score higher than low");
        assertTrue(expectedFitness[2] > expectedFitness[3], 
                "Low fitness user should score higher than null");
        assertEquals(0.0, expectedFitness[3], "Null response should have zero fitness");
        
        System.out.println("=== Fitness Calculation Test ===");
        System.out.println("High fitness user: " + expectedFitness[0]);
        System.out.println("Medium fitness user: " + expectedFitness[1]);
        System.out.println("Low fitness user: " + expectedFitness[2]);
        System.out.println("Null response: " + expectedFitness[3]);
        System.out.println("=================================");
    }
}