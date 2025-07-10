package com.travelhub.user.mapper;

import com.travelhub.user.dto.CreateUserRequest;
import com.travelhub.user.dto.UserResponse;
import com.travelhub.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * User Mapper for DTO conversions
 */
@Component
public class UserMapper {
    
    public UserResponse toResponse(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .status(user.getStatus())
                .roles(user.getRoles())
                .geneticGeneration(user.getGeneticGeneration())
                .fitnessScore(user.getFitnessScore())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
    
    public List<UserResponse> toResponseList(List<User> users) {
        if (users == null) {
            throw new IllegalArgumentException("User list cannot be null");
        }
        
        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public User toEntity(CreateUserRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("CreateUserRequest cannot be null");
        }
        
        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(request.getPassword())
                .phone(request.getPhone())
                .build();
    }
    
    public User fromRequest(CreateUserRequest request) {
        return toEntity(request);
    }
    
    public List<UserResponse> toResponseList(List<User> users) {
        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public User updateFromRequest(User existingUser, CreateUserRequest request) {
        existingUser.setEmail(request.getEmail());
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setPhone(request.getPhone());
        return existingUser;
    }
}
