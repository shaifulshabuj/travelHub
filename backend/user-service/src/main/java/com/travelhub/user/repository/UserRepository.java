package com.travelhub.user.repository;

import com.travelhub.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User Repository with Genetic Evolution Queries
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE'")
    List<User> findActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.fitnessScore > :minScore ORDER BY u.fitnessScore DESC")
    List<User> findHighPerformingUsers(Double minScore);
    
    @Query("SELECT u FROM User u WHERE u.geneticGeneration = :generation")
    List<User> findByGeneticGeneration(Integer generation);
}
