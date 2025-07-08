package com.travelhub.user.mapper;

import com.travelhub.user.dto.CreateUserRequest;
import com.travelhub.user.dto.UserResponse;
import com.travelhub.user.entity.User;
import org.springframework.stereotype.Component;

/**
 * User Mapper for DTO conversions
 */
@Component
public class UserMapper {
    
    public UserResponse toResponse(User user) {
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
    
    public User toEntity(CreateUserRequest request) {
        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(request.getPassword())
                .phone(request.getPhone())
                .build();
    }
}
