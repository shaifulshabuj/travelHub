package com.travelhub.user.controller;

import com.travelhub.user.dto.CreateUserRequest;
import com.travelhub.user.dto.UserResponse;
import com.travelhub.user.entity.User;
import com.travelhub.user.mapper.UserMapper;
import com.travelhub.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Simple User Controller - Basic CRUD Operations
 */
@RestController
@RequestMapping("/api/v1/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    private final UserMapper userMapper;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        log.debug("Getting user with id: {}", id);
        
        return userService.findById(id)
                .map(userMapper::toResponse)
                .map(response -> ResponseEntity.ok(response))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.debug("Getting all users");
        
        List<User> users = userService.findAll();
        List<UserResponse> responses = users.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.debug("Creating user with email: {}", request.getEmail());
        
        User user = userService.createUser(request);
        UserResponse response = userMapper.toResponse(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, 
            @Valid @RequestBody CreateUserRequest request) {
        log.debug("Updating user with id: {}", id);
        
        return userService.findById(id)
                .map(existingUser -> {
                    User updatedUser = userService.updateUser(id, userMapper.toEntity(request));
                    UserResponse response = userMapper.toResponse(updatedUser);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.debug("Deleting user with id: {}", id);
        
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
