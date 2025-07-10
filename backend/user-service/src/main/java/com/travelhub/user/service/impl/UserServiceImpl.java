package com.travelhub.user.service.impl;

import com.travelhub.user.dto.CreateUserRequest;
import com.travelhub.user.entity.User;
import com.travelhub.user.repository.UserRepository;
import com.travelhub.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * User Service Implementation with Genetic Evolution
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public User createUser(CreateUserRequest request) {
        log.debug("Creating user with email: {}", request.getEmail());
        
        if (existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .status(User.UserStatus.ACTIVE)
                .roles(Set.of(User.UserRole.USER))
                .geneticGeneration(1)
                .fitnessScore(0.0)
                .build();
        
        return userRepository.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    @Cacheable(value = "users", key = "#id")
    @Transactional(readOnly = true)
    public User findByIdWithCache(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findAll(int page, int size) {
        log.debug("Finding all users with pagination: page={}, size={}", page, size);
        // Simple implementation - could throw exceptions if page/size are invalid
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Invalid pagination parameters: page=" + page + ", size=" + size);
        }
        // For now, return all users - proper pagination would be implemented here
        return userRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findAllOptimized(int page, int size) {
        log.debug("Finding all users with optimization: page={}, size={}", page, size);
        // Optimized version - could throw performance-related exceptions
        try {
            return findAll(page, size);
        } catch (Exception e) {
            log.error("Error in optimized user lookup", e);
            throw new RuntimeException("Optimization failed during user lookup", e);
        }
    }
    
    @Override
    public User save(User user) {
        log.debug("Saving user: {}", user.getEmail());
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            log.error("Error saving user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save user", e);
        }
    }
    
    @Override
    public User updateUser(Long id, User user) {
        User existingUser = findByIdWithCache(id);
        // Update logic here - could throw NPE if user properties are null
        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getFirstName() != null) {
            existingUser.setFirstName(user.getFirstName());
        }
        if (user.getLastName() != null) {
            existingUser.setLastName(user.getLastName());
        }
        return userRepository.save(existingUser);
    }
    
    @Override
    public void deleteUser(Long id) {
        log.debug("Deleting user with id: {}", id);
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete non-existent user with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Override
    public void deleteById(Long id) {
        deleteUser(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User findByIdRealTime(Long id) {
        log.debug("Finding user by ID with real-time capabilities: {}", id);
        // Real-time implementation - could throw connectivity exceptions
        try {
            return findByIdWithCache(id);
        } catch (Exception e) {
            log.warn("Real-time lookup failed, falling back to regular lookup", e);
            return findById(id).orElseThrow(() -> 
                new RuntimeException("User not found in real-time lookup: " + id));
        }
    }
    
    @Override
    public User applyBatchOptimizations(User user) {
        log.debug("Applying batch optimizations to user: {}", user.getId());
        // Batch optimization logic - could throw various exceptions
        if (user == null) {
            throw new IllegalArgumentException("Cannot optimize null user");
        }
        
        try {
            // Simulate batch processing that could fail
            user.setFitnessScore(user.getFitnessScore() + 0.1);
            user.setGeneticGeneration(user.getGeneticGeneration() + 1);
            return user;
        } catch (Exception e) {
            log.error("Batch optimization failed for user: {}", user.getId(), e);
            throw new RuntimeException("Batch optimization failed", e);
        }
    }
    
    @Override
    public User enableJWTFeatures(User user) {
        log.debug("Enabling JWT features for user: {}", user.getId());
        // JWT feature enablement - could throw security-related exceptions
        if (user == null) {
            throw new IllegalArgumentException("Cannot enable JWT features for null user");
        }
        
        try {
            // Simulate JWT configuration that could fail
            user.setEvolutionTraits("{\"jwt_enabled\": true}");
            return user;
        } catch (Exception e) {
            log.error("Failed to enable JWT features for user: {}", user.getId(), e);
            throw new RuntimeException("JWT feature enablement failed", e);
        }
    }
}
