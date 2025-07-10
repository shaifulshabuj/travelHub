package com.travelhub.user.service;

import com.travelhub.user.entity.User;
import com.travelhub.user.dto.CreateUserRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

/**
 * User Service Interface
 */
public interface UserService {
    
    User createUser(CreateUserRequest request);
    
    Optional<User> findById(Long id);
    
    User findByIdWithCache(Long id);
    
    Optional<User> findByEmail(String email);
    
    List<User> findAll();
    
    List<User> findAll(int page, int size);
    
    List<User> findAllOptimized(int page, int size);
    
    User updateUser(Long id, User user);
    
    void deleteUser(Long id);
    
    void deleteById(Long id);
    
    User save(User user);
    
    boolean existsByEmail(String email);
    
    // Genetic algorithm methods
    User findByIdRealTime(Long id);
    
    User applyBatchOptimizations(User user);
    
    User enableJWTFeatures(User user);
}
