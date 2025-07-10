package com.travelhub.user.client;

import com.travelhub.user.communication.CommunicationResult;
import com.travelhub.user.communication.ServiceCommunicationMonitor;
import com.travelhub.user.communication.CommunicationFailureSimulator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Client for communicating with the Booking Service
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceClient {
    
    private final ServiceCommunicationMonitor communicationMonitor;
    private final CommunicationFailureSimulator failureSimulator;
    
    @Value("${services.booking-service.url:http://localhost:8082}")
    private String bookingServiceUrl;
    
    @Value("${services.booking-service.timeout:2000}")
    private int timeoutMs;
    
    /**
     * Get user bookings from booking service
     */
    public CommunicationResult<Map> getUserBookings(Long userId) {
        String serviceName = "booking-service";
        String endpoint = bookingServiceUrl + "/api/v1/bookings/user/" + userId + "/bookings";
        
        log.debug("Calling booking service to get bookings for user: {}", userId);
        
        // Apply failure simulations if configured
        if (failureSimulator.shouldSimulateConnectionFailure(serviceName)) {
            return CommunicationResult.connectionError("Simulated connection failure", null);
        }
        
        if (failureSimulator.shouldSimulateTimeout(serviceName)) {
            return CommunicationResult.timeout("Simulated timeout", null);
        }
        
        if (failureSimulator.shouldSimulateApiError(serviceName)) {
            return CommunicationResult.failure("Simulated API error", null);
        }
        
        // Apply artificial delay
        failureSimulator.applyArtificialDelay(serviceName);
        
        // Make the actual call with monitoring
        CommunicationResult<Map> result = communicationMonitor.monitorApiCall(
            serviceName, endpoint, Map.class, timeoutMs);
        
        // Check for data corruption simulation
        if (result.isSuccessful() && failureSimulator.shouldSimulateDataCorruption(serviceName)) {
            log.warn("Simulating data corruption for booking service response");
            return CommunicationResult.dataValidationError("Simulated data corruption", result.getResponseTime());
        }
        
        return result;
    }
    
    /**
     * Create a booking through booking service
     */
    public CommunicationResult<Map> createBooking(Long userId, Map<String, Object> bookingData) {
        String serviceName = "booking-service";
        String endpoint = bookingServiceUrl + "/api/v1/bookings/user/" + userId;
        
        log.debug("Calling booking service to create booking for user: {}", userId);
        
        // Apply failure simulations
        if (failureSimulator.shouldSimulateConnectionFailure(serviceName)) {
            return CommunicationResult.connectionError("Simulated connection failure", null);
        }
        
        if (failureSimulator.shouldSimulateTimeout(serviceName)) {
            return CommunicationResult.timeout("Simulated timeout", null);
        }
        
        failureSimulator.applyArtificialDelay(serviceName);
        
        // For now, return a simulated successful response
        // In a real implementation, this would use RestTemplate with POST
        return CommunicationResult.success(Map.of(
            "id", 123L,
            "userId", userId,
            "status", "CREATED"
        ), java.time.Duration.ofMillis(150));
    }
    
    /**
     * Check booking service health
     */
    public CommunicationResult<Map> checkBookingServiceHealth() {
        String serviceName = "booking-service";
        String endpoint = bookingServiceUrl + "/api/v1/bookings/health";
        
        log.debug("Checking booking service health");
        
        return communicationMonitor.monitorApiCall(serviceName, endpoint, Map.class, timeoutMs);
    }
    
    /**
     * Test failure scenarios by calling the simulate-failure endpoint
     */
    public CommunicationResult<Map> testFailureScenario(boolean timeout) {
        String serviceName = "booking-service";
        String endpoint = bookingServiceUrl + "/api/v1/bookings/simulate-failure?timeout=" + timeout;
        
        log.warn("Testing failure scenario with booking service");
        
        return communicationMonitor.monitorApiCall(serviceName, endpoint, Map.class, 
                timeout ? 10000 : timeoutMs);
    }
}