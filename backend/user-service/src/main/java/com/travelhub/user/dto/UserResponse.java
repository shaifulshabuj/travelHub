package com.travelhub.user.dto;

import com.travelhub.user.entity.User;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * User Response DTO
 */
@Data
@Builder
@Jacksonized
public class UserResponse {
    
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private User.UserStatus status;
    private Set<User.UserRole> roles;
    private Integer geneticGeneration;
    private Double fitnessScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
