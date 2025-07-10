package com.travelhub.booking.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

/**
 * Simple Booking Controller to simulate a second microservice
 */
@RestController
@RequestMapping("/api/v1/bookings")
@Slf4j
public class BookingController {
    
    private final Random random = new Random();
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "booking-service",
            "timestamp", LocalDateTime.now()
        ));
    }
    
    @GetMapping("/user/{userId}/bookings")
    public ResponseEntity<Map<String, Object>> getUserBookings(@PathVariable Long userId) {
        log.info("Getting bookings for user: {}", userId);
        
        // Simulate processing delay
        try {
            Thread.sleep(random.nextInt(100) + 50); // 50-150ms delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        return ResponseEntity.ok(Map.of(
            "userId", userId,
            "bookings", java.util.List.of(
                Map.of("id", 1, "destination", "Paris", "status", "CONFIRMED"),
                Map.of("id", 2, "destination", "Tokyo", "status", "PENDING")
            ),
            "timestamp", LocalDateTime.now()
        ));
    }
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> createBooking(@PathVariable Long userId, 
                                                            @RequestBody Map<String, Object> booking) {
        log.info("Creating booking for user {}: {}", userId, booking);
        
        // Simulate processing
        try {
            Thread.sleep(random.nextInt(200) + 100); // 100-300ms delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        return ResponseEntity.ok(Map.of(
            "id", random.nextLong(1000),
            "userId", userId,
            "destination", booking.get("destination"),
            "status", "CREATED",
            "timestamp", LocalDateTime.now()
        ));
    }
    
    @GetMapping("/simulate-failure")
    public ResponseEntity<Map<String, Object>> simulateFailure(@RequestParam(defaultValue = "false") boolean timeout) {
        log.warn("Simulating failure scenario");
        
        if (timeout) {
            try {
                Thread.sleep(5000); // 5 second delay to simulate timeout
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        if (random.nextBoolean()) {
            throw new RuntimeException("Simulated internal server error");
        }
        
        return ResponseEntity.status(500).body(Map.of(
            "error", "Simulated failure",
            "timestamp", LocalDateTime.now()
        ));
    }
}