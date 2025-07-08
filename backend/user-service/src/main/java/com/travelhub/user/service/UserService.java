package com.travelhub.user.service;

import com.travelhub.user.entity.User;
import com.travelhub.user.dto.CreateUserRequest;
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
    
    User updateUser(Long id, User user);
    
    void deleteUser(Long id);
    
    boolean existsByEmail(String email);
}
