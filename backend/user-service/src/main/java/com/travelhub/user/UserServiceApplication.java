package com.travelhub.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * TravelHub User Service - Genetic Coding Microservice
 * 
 * This service evolves based on genetic programming principles:
 * - Performance metrics drive evolution
 * - User behavior shapes mutations
 * - Best practices emerge through selection
 */
@SpringBootApplication
@EnableConfigurationProperties
@EnableJpaRepositories
@EnableMongoAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
