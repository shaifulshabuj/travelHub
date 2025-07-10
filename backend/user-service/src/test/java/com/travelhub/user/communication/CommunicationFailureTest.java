package com.travelhub.user.communication;

import com.travelhub.user.client.BookingServiceClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for microservices communication failure simulation
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestPropertySource(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration,org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration",
    "services.booking-service.url=http://localhost:8082",
    "services.booking-service.timeout=1000"
})
class CommunicationFailureTest {
    
    @Autowired
    private ServiceCommunicationMonitor communicationMonitor;
    
    @Autowired
    private CommunicationFailureSimulator failureSimulator;
    
    @Autowired
    private BookingServiceClient bookingServiceClient;
    
    @BeforeEach
    void setUp() {
        // Reset failure counters before each test
        communicationMonitor.resetFailureCounters("booking-service");
        failureSimulator.disableFailureSimulation("booking-service");
    }
    
    @Test
    void testTimeoutSimulation() {
        // Enable timeout simulation with 100% probability
        failureSimulator.enableTimeoutSimulation("booking-service", 1.0);
        
        // Make a call that should timeout
        CommunicationResult<java.util.Map> result = bookingServiceClient.getUserBookings(1L);
        
        // Verify the timeout was simulated
        assertFalse(result.isSuccessful());
        assertTrue(result.isTimeout());
        assertNotNull(result.getErrorMessage());
        assertTrue(result.getErrorMessage().contains("timeout"));
    }
    
    @Test
    void testConnectionFailureSimulation() {
        // Enable connection failure simulation with 100% probability
        failureSimulator.enableConnectionFailureSimulation("booking-service", 1.0);
        
        // Make a call that should fail connection
        CommunicationResult<java.util.Map> result = bookingServiceClient.getUserBookings(1L);
        
        // Verify the connection failure was simulated
        assertFalse(result.isSuccessful());
        assertTrue(result.isConnectionError());
        assertNotNull(result.getErrorMessage());
        assertTrue(result.getErrorMessage().contains("connection"));
    }
    
    @Test
    void testApiErrorSimulation() {
        // Enable API error simulation with 100% probability
        failureSimulator.enableApiErrorSimulation("booking-service", 1.0);
        
        // Make a call that should have API error
        CommunicationResult<java.util.Map> result = bookingServiceClient.getUserBookings(1L);
        
        // Verify the API error was simulated
        assertFalse(result.isSuccessful());
        assertTrue(result.isApiError());
        assertNotNull(result.getErrorMessage());
        assertTrue(result.getErrorMessage().contains("API error"));
    }
    
    @Test
    void testFailureReporting() {
        // Create stress test scenario
        failureSimulator.createStressTestScenario("booking-service");
        
        // Make multiple calls
        for (int i = 0; i < 5; i++) {
            bookingServiceClient.getUserBookings((long) i);
        }
        
        // Get failure report
        java.util.Map<String, Integer> report = communicationMonitor.getFailureReport();
        
        // Verify that failures are being tracked
        assertNotNull(report);
        // Report should contain some failure entries for booking-service
        boolean hasBookingServiceFailures = report.keySet().stream()
                .anyMatch(key -> key.startsWith("booking-service:"));
        
        assertTrue(hasBookingServiceFailures, "Should track failures for booking-service");
    }
    
    @Test
    void testServiceHealthTracking() {
        // Initially, service health should be unknown
        ServiceCommunicationMonitor.ServiceHealth health = communicationMonitor.getServiceHealth("booking-service");
        
        // Make a call to establish health status
        bookingServiceClient.getUserBookings(1L);
        
        // Check health status again
        health = communicationMonitor.getServiceHealth("booking-service");
        assertNotNull(health);
        assertEquals("booking-service", health.getServiceName());
    }
    
    @Test
    void testRealisticFailureScenario() {
        // Test realistic failure scenario
        failureSimulator.createRealisticFailureScenario("booking-service");
        
        // Verify configuration was applied
        CommunicationFailureSimulator.FailureConfiguration config = 
            failureSimulator.getFailureConfiguration("booking-service");
        
        assertNotNull(config);
        assertTrue(config.isEnabled());
        assertEquals(0.05, config.getTimeoutProbability(), 0.001);
        assertEquals(0.02, config.getConnectionFailureProbability(), 0.001);
        assertEquals(0.03, config.getApiErrorProbability(), 0.001);
        assertEquals(0.01, config.getDataCorruptionProbability(), 0.001);
    }
}