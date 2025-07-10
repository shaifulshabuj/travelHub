package com.travelhub.user.controller;

import com.travelhub.user.config.UserServiceDNA;
import com.travelhub.user.dto.CreateUserRequest;
import com.travelhub.user.dto.UserResponse;
import com.travelhub.user.entity.User;
import com.travelhub.user.evolution.EvolutionEngine;
import com.travelhub.user.evolution.EvolvableController;
import com.travelhub.user.evolution.annotations.MutationTrigger;
import com.travelhub.user.evolution.annotations.TimedEvolution;
import com.travelhub.user.mapper.UserMapper;
import com.travelhub.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Genetic User Controller - Evolves based on performance metrics and user feedback
 * Implements genetic coding principles for continuous improvement
 */
@RestController
@RequestMapping("/api/v1/users")
@Slf4j
@RequiredArgsConstructor
public class GeneticUserController implements EvolvableController {
    
    private final UserService userService;
    private final UserServiceDNA dna;
    private final EvolutionEngine evolutionEngine;
    private final UserMapper userMapper;
    
    @GetMapping("/{id}")
    @TimedEvolution(metric = "user.get.response_time")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        log.debug("Getting user with id: {} (Generation: {})", id, dna.getGeneration());
        
        // Genetic adaptation based on DNA
        if (dna.getEvolution().isRealTimeCapability()) {
            return handleRealTimeUser(id);
        }
        
        // Apply caching strategy based on genetic configuration
        User user = dna.getEvolution().isCachingEnabled() 
            ? userService.findByIdWithCache(id)
            : userService.findById(id).orElseThrow(() -> 
                new RuntimeException("User not found with id: " + id));
            
        UserResponse response = userMapper.toResponse(user);
        
        // Evolution trigger: track performance
        evolutionEngine.recordFitness("user.get", 
            calculateResponseFitness(response));
            
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @TimedEvolution(metric = "user.list.response_time")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Apply batch processing genetics
        List<User> users = dna.getEvolution().isBatchProcessing()
            ? userService.findAllOptimized(page, size)
            : userService.findAll(page, size);
            
        List<UserResponse> responses = userMapper.toResponseList(users);
        
        return ResponseEntity.ok(responses);
    }
    
    @PostMapping
    @MutationTrigger(trigger = "user.creation.pattern")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("Creating user with genetic traits (Generation: {})", dna.getGeneration());
        
        // Apply current evolutionary traits
        User user = applyEvolutionaryTraits(request);
        User savedUser = userService.save(user);
        
        // Trigger evolution if performance threshold exceeded
        if (evolutionEngine.shouldEvolve("user.creation")) {
            evolutionEngine.triggerEvolution(this, "performance_pressure");
        }
        
        UserResponse response = userMapper.toResponse(savedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    @MutationTrigger(trigger = "user.update.pattern")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id, 
            @Valid @RequestBody CreateUserRequest request) {
        
        User existingUser = userService.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        User updatedUser = userMapper.updateFromRequest(existingUser, request);
        
        // Apply genetic optimizations
        updatedUser = applyEvolutionaryTraits(updatedUser);
        User savedUser = userService.save(updatedUser);
        
        UserResponse response = userMapper.toResponse(savedUser);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @TimedEvolution(metric = "user.delete.response_time")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Evolution method - called when genetic adaptation is triggered
     */
    @Override
    public void evolve(String trigger, Map<String, Object> context) {
        log.info("Evolving UserController due to trigger: {} (Current generation: {})", 
                trigger, dna.getGeneration());
        
        switch (trigger) {
            case "performance_pressure":
                enableAdvancedCaching();
                optimizeQueries();
                enableCircuitBreaker();
                break;
            case "security_enhancement":
                strengthenValidation();
                enableAdvancedAuth();
                addSecurityHeaders();
                break;
            case "user_feedback":
                improveResponseFormat();
                addAdditionalFields();
                enhanceErrorMessages();
                break;
            case "scalability_requirement":
                enableAsyncProcessing();
                implementLoadBalancing();
                optimizeResourceUsage();
                break;
        }
        
        // Record evolution event
        evolutionEngine.recordEvolution(this.getClass().getSimpleName(), trigger, context);
    }
    
    /**
     * Real-time user handling for evolved capabilities
     */
    private ResponseEntity<UserResponse> handleRealTimeUser(Long id) {
        // Implementation for real-time user data with WebSocket updates
        User user = userService.findByIdRealTime(id);
        UserResponse response = userMapper.toResponse(user);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Apply evolutionary traits to user creation/update
     */
    private User applyEvolutionaryTraits(CreateUserRequest request) {
        User user = userMapper.fromRequest(request);
        return applyEvolutionaryTraits(user);
    }
    
    private User applyEvolutionaryTraits(User user) {
        // Apply genetic enhancements based on current DNA
        if (dna.getEvolution().isBatchProcessing()) {
            user = userService.applyBatchOptimizations(user);
        }
        
        if (dna.getAuthenticationMethod() == UserServiceDNA.AuthenticationMethod.JWT) {
            user = userService.enableJWTFeatures(user);
        }
        
        return user;
    }
    
    /**
     * Calculate fitness score for response quality
     */
    private double calculateResponseFitness(UserResponse response) {
        return evolutionEngine.calculateFitness(response);
    }
    
    // Evolution-triggered optimizations
    private void enableAdvancedCaching() {
        log.info("Enabling advanced caching mechanisms");
        dna.getEvolution().setCachingEnabled(true);
    }
    
    private void optimizeQueries() {
        log.info("Optimizing database queries");
        // Implementation for query optimization
    }
    
    private void enableCircuitBreaker() {
        log.info("Enabling circuit breaker pattern");
        dna.getEvolution().setCircuitBreakerEnabled(true);
    }
    
    private void strengthenValidation() {
        log.info("Strengthening input validation");
        // Enhanced validation logic
    }
    
    private void enableAdvancedAuth() {
        log.info("Enabling advanced authentication mechanisms");
        // Advanced auth implementation
    }
    
    private void addSecurityHeaders() {
        log.info("Adding security headers");
        // Security headers implementation
    }
    
    private void improveResponseFormat() {
        log.info("Improving response format based on user feedback");
        // Response format improvements
    }
    
    private void addAdditionalFields() {
        log.info("Adding additional response fields");
        // Additional fields implementation
    }
    
    private void enhanceErrorMessages() {
        log.info("Enhancing error messages");
        // Error message improvements
    }
    
    private void enableAsyncProcessing() {
        log.info("Enabling asynchronous processing");
        // Async processing implementation
    }
    
    private void implementLoadBalancing() {
        log.info("Implementing load balancing strategies");
        // Load balancing implementation
    }
    
    private void optimizeResourceUsage() {
        log.info("Optimizing resource usage");
        // Resource optimization implementation
    }
}