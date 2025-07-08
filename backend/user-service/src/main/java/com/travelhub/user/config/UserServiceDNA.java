package com.travelhub.user.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

/**
 * User Service Genetic DNA Configuration
 * Defines the evolutionary characteristics and capabilities of the user service
 */
@Configuration
@ConfigurationProperties(prefix = "service.dna")
@Data
public class UserServiceDNA {
    
    private String serviceId = "user-service";
    private String serviceType = "CRUD";
    private String version = "1.0.0";
    private int generation = 1;
    
    // Genetic configuration
    private ScalingStrategy scalingStrategy = ScalingStrategy.HORIZONTAL;
    private CachingStrategy cachingStrategy = CachingStrategy.REDIS;
    private PersistenceStrategy persistenceStrategy = PersistenceStrategy.JPA;
    private ApiStyle apiStyle = ApiStyle.REST;
    private MessagingPattern messagingPattern = MessagingPattern.ASYNC;
    
    // Authentication genetics
    private AuthenticationMethod authenticationMethod = AuthenticationMethod.JWT;
    private AuthorizationLevel authorizationLevel = AuthorizationLevel.ROLE;
    
    // Evolution configuration
    private EvolutionConfig evolution = new EvolutionConfig();
    
    // Performance genetics
    private PerformanceTargets performance = new PerformanceTargets();
    
    // Quality genetics
    private QualityTargets quality = new QualityTargets();
    
    // Dependencies
    private Dependencies dependencies = new Dependencies();
    
    // Resource requirements
    private ResourceRequirements resources = new ResourceRequirements();
    
    public enum ScalingStrategy { HORIZONTAL, VERTICAL, HYBRID }
    public enum CachingStrategy { REDIS, HAZELCAST, LOCAL, NONE }
    public enum PersistenceStrategy { JPA, MONGODB, HYBRID }
    public enum ApiStyle { REST, GRAPHQL, GRPC }
    public enum MessagingPattern { SYNC, ASYNC, EVENT_DRIVEN, HYBRID }
    public enum AuthenticationMethod { JWT, OAUTH2, BASIC, CUSTOM }
    public enum AuthorizationLevel { ROLE, PERMISSION, ATTRIBUTE }
    
    @Data
    public static class EvolutionConfig {
        private boolean apiVersioning = true;
        private boolean realTimeCapability = false;
        private boolean batchProcessing = true;
        private boolean cachingEnabled = true;
        private boolean metricsEnabled = true;
        private boolean tracingEnabled = true;
        private boolean circuitBreakerEnabled = true;
        private boolean retryMechanism = true;
        
        private List<String> evolutionTriggers = List.of(
            "performance_degradation",
            "error_rate_increase",
            "user_feedback_decline"
        );
    }
    
    @Data
    public static class PerformanceTargets {
        private int targetResponseTime = 100; // milliseconds
        private int targetThroughput = 1000;  // requests/second
        private double targetAvailability = 99.9; // percentage
        private double targetCpuUsage = 70.0; // percentage
        private int targetMemoryUsage = 512; // MB
    }
    
    @Data
    public static class QualityTargets {
        private int maintainabilityScore = 85;
        private double testCoverage = 80.0;
        private int codeComplexity = 10;
        private int securityScore = 95;
        private int documentationScore = 80;
    }
    
    @Data
    public static class Dependencies {
        private List<String> databases = List.of("H2", "Redis");
        private List<String> externalServices = List.of();
        private List<String> messagingSystems = List.of("Kafka");
        private List<String> cacheProviders = List.of("Redis");
        private List<String> monitoringTools = List.of("Prometheus", "Micrometer");
    }
    
    @Data
    public static class ResourceRequirements {
        private String minCpu = "100m";
        private String maxCpu = "500m";
        private String minMemory = "256Mi";
        private String maxMemory = "1Gi";
        private String storageSize = "5Gi";
    }
    
    /**
     * Calculate fitness score based on current performance and quality metrics
     */
    public double calculateFitnessScore(Map<String, Double> currentMetrics) {
        double performanceScore = calculatePerformanceScore(currentMetrics);
        double qualityScore = calculateQualityScore(currentMetrics);
        
        // Weighted fitness calculation
        return (performanceScore * 0.4) + (qualityScore * 0.6);
    }
    
    private double calculatePerformanceScore(Map<String, Double> metrics) {
        double responseTimeScore = Math.max(0, 100 - (metrics.getOrDefault("responseTime", 0.0) / performance.targetResponseTime * 100));
        double throughputScore = Math.min(100, metrics.getOrDefault("throughput", 0.0) / performance.targetThroughput * 100);
        double availabilityScore = metrics.getOrDefault("availability", 0.0);
        
        return (responseTimeScore + throughputScore + availabilityScore) / 3;
    }
    
    private double calculateQualityScore(Map<String, Double> metrics) {
        double testCoverageScore = metrics.getOrDefault("testCoverage", 0.0);
        double securityScore = metrics.getOrDefault("securityScore", 0.0);
        double maintainabilityScore = metrics.getOrDefault("maintainabilityScore", 0.0);
        
        return (testCoverageScore + securityScore + maintainabilityScore) / 3;
    }
}