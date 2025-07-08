package com.travelhub.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * User Entity with Genetic Evolution Tracking
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<UserRole> roles;
    
    // Genetic evolution tracking
    @Builder.Default
    private Integer geneticGeneration = 1;
    
    @Column(name = "fitness_score")
    @Builder.Default
    private Double fitnessScore = 0.0;
    
    @Column(name = "evolution_traits")
    private String evolutionTraits; // JSON stored as string
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION
    }
    
    public enum UserRole {
        USER, ADMIN, MODERATOR, AGENT
    }
}
