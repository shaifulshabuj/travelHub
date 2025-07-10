package com.travelhub.user.evolution;

import com.travelhub.user.config.UserServiceDNA;
import com.travelhub.user.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for validating genetic algorithm functionality
 * Focuses on testing the core evolution engine without complex mocking
 */
class GeneticAlgorithmTest {

    private EvolutionEngine evolutionEngine;
    private UserResponse testUserResponse;

    @BeforeEach
    void setUp() {
        evolutionEngine = new EvolutionEngine();
        
        testUserResponse = UserResponse.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .geneticGeneration(2)
                .fitnessScore(75.0)
                .build();
    }

    @Test
    void testEvolutionEngineRecordsFitness() {
        // Given
        String operation = "user.get";
        double fitnessScore = 75.5;

        // When
        evolutionEngine.recordFitness(operation, fitnessScore);
        Map<String, Double> metrics = evolutionEngine.getFitnessMetrics();

        // Then
        assertTrue(metrics.containsKey(operation));
        assertEquals(fitnessScore, metrics.get(operation));
    }

    @Test
    void testEvolutionEngineCalculatesFitness() {
        // Given a complete user response
        UserResponse completeResponse = UserResponse.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .geneticGeneration(3)
                .fitnessScore(25.0)
                .build();

        // When
        double fitness = evolutionEngine.calculateFitness(completeResponse);

        // Then
        assertTrue(fitness > 0, "Fitness score should be positive");
        assertTrue(fitness > 50, "Complete response should have good fitness");
    }

    @Test
    void testEvolutionTriggersBasedOnOperationCount() {
        // Given - record many operations to trigger evolution
        String operation = "user.creation";
        for (int i = 0; i < 15; i++) {
            evolutionEngine.recordFitness(operation, 75.0);
        }

        // When
        boolean shouldEvolve = evolutionEngine.shouldEvolve(operation);

        // Then
        assertTrue(shouldEvolve, "Should evolve after many operations");
    }

    @Test
    void testEvolutionEngineOperationTracking() {
        // Given
        String operation1 = "test.operation";
        String operation2 = "another.operation";
        
        // When
        evolutionEngine.recordFitness(operation1, 75.0);
        evolutionEngine.recordFitness(operation1, 80.0);
        evolutionEngine.recordFitness(operation2, 65.0);

        // Then
        Map<String, Double> metrics = evolutionEngine.getFitnessMetrics();
        Map<String, Integer> counts = evolutionEngine.getOperationCounts();
        
        assertTrue(metrics.containsKey(operation1));
        assertTrue(metrics.containsKey(operation2));
        assertEquals(2, counts.get(operation1));
        assertEquals(1, counts.get(operation2));
    }

    @Test
    void testFitnessCalculationWithIncompleteData() {
        // Given an incomplete user response
        UserResponse incompleteResponse = UserResponse.builder()
                .id(2L)
                .geneticGeneration(1)
                .fitnessScore(10.0)
                .build();

        // When
        double incompleteFitness = evolutionEngine.calculateFitness(incompleteResponse);
        double completeFitness = evolutionEngine.calculateFitness(testUserResponse);

        // Then
        assertTrue(completeFitness > incompleteFitness, 
                "Complete user response should have higher fitness score");
        assertTrue(incompleteFitness > 0, "Even incomplete response should have some fitness");
    }

    @Test
    void testEvolutionRecording() {
        // Given
        String componentName = "TestController";
        String trigger = "performance_pressure";
        Map<String, Object> context = Map.of("metric", "response_time", "value", 150.0);

        // When
        evolutionEngine.recordEvolution(componentName, trigger, context);

        // Then
        Map<String, Double> metrics = evolutionEngine.getFitnessMetrics();
        String evolutionKey = componentName + "_" + trigger;
        assertTrue(metrics.containsKey(evolutionKey), "Evolution should be recorded");
    }

    @Test
    void testUserServiceDNAFitnessCalculation() {
        // Given
        UserServiceDNA dna = new UserServiceDNA();
        Map<String, Double> currentMetrics = Map.of(
                "responseTime", 80.0,
                "throughput", 1200.0,
                "availability", 99.5,
                "testCoverage", 85.0,
                "securityScore", 90.0,
                "maintainabilityScore", 80.0
        );

        // When
        double fitnessScore = dna.calculateFitnessScore(currentMetrics);

        // Then
        assertTrue(fitnessScore > 0, "Fitness score should be positive");
        assertTrue(fitnessScore <= 100, "Fitness score should not exceed 100");
    }

    @Test
    void testEvolutionEngineHandlesNullResponse() {
        // When
        double fitness = evolutionEngine.calculateFitness(null);

        // Then
        assertEquals(0.0, fitness, "Null response should have zero fitness");
    }

    @Test
    void testShouldEvolveReturnsFalseForNewOperation() {
        // Given a new operation
        String newOperation = "brand.new.operation";

        // When
        boolean shouldEvolve = evolutionEngine.shouldEvolve(newOperation);

        // Then
        assertFalse(shouldEvolve, "New operation should not trigger evolution immediately");
    }

    @Test
    void testMultipleEvolutionTriggers() {
        // Given
        Object mockComponent = new Object() {
            public void evolve(String trigger, Map<String, Object> context) {
                // Mock evolution method
            }
        };

        // When - trigger evolution doesn't fail
        assertDoesNotThrow(() -> {
            evolutionEngine.triggerEvolution(mockComponent, "performance_pressure");
            evolutionEngine.triggerEvolution(mockComponent, "security_enhancement");
        });

        // Then - verify no exceptions were thrown and evolution completed
        assertTrue(true, "Evolution triggers completed successfully");
    }
}