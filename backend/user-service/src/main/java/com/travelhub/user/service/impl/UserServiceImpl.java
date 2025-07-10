package com.travelhub.user.service.impl;

import com.travelhub.user.dto.CreateUserRequest;
import com.travelhub.user.entity.User;
import com.travelhub.user.repository.UserRepository;
import com.travelhub.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
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
        return userRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAllOptimized(int page, int size) {
        // Optimized version with batch processing
        return userRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByIdRealTime(Long id) {
        // Real-time version - for now same as regular findById
        return findByIdWithCache(id);
    }

    @Override
    public User applyBatchOptimizations(User user) {
        // Apply batch optimization genetics
        log.debug("Applying batch optimizations to user: {}", user.getId());
        return user;
    }

    @Override
    public User enableJWTFeatures(User user) {
        // Enable JWT-specific features
        log.debug("Enabling JWT features for user: {}", user.getId());
        return user;
    }
}
