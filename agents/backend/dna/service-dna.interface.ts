// Service DNA Interface - Genetic blueprint for microservices
export interface ServiceDNA {
  // Core genetics
  serviceId: string;
  serviceType: 'CRUD' | 'Search' | 'Booking' | 'Payment' | 'Gateway' | 'Analytics';
  version: string;
  generation: number;
  
  // Architectural patterns
  patterns: ('Repository' | 'Strategy' | 'Observer' | 'Factory' | 'Saga' | 'CQRS')[];
  
  // Environmental adaptation
  scalingStrategy: 'Horizontal' | 'Vertical' | 'Hybrid';
  cachingStrategy: 'Redis' | 'Hazelcast' | 'Local' | 'None';
  persistenceStrategy: 'JPA' | 'MongoDB' | 'Hybrid';
  
  // Communication genetics
  apiStyle: 'REST' | 'GraphQL' | 'gRPC';
  messagingPatterns: 'Sync' | 'Async' | 'EventDriven' | 'Hybrid';
  
  // Security genetics
  authenticationMethod: 'JWT' | 'OAuth2' | 'Basic' | 'Custom';
  authorizationLevel: 'Role' | 'Permission' | 'Attribute';
  
  // Mutation possibilities
  features: {
    apiVersioning: boolean;
    realTimeCapability: boolean;
    batchProcessing: boolean;
    cachingEnabled: boolean;
    metricsEnabled: boolean;
    tracingEnabled: boolean;
    circuitBreakerEnabled: boolean;
    retryMechanism: boolean;
  };
  
  // Fitness criteria
  performance: {
    targetResponseTime: number; // milliseconds
    targetThroughput: number;   // requests/second
    targetAvailability: number; // percentage
    targetCpuUsage: number;     // percentage
    targetMemoryUsage: number;  // MB
  };
  
  quality: {
    maintainabilityScore: number;
    testCoverage: number;
    codeComplexity: number;
    securityScore: number;
    documentationScore: number;
  };
  
  // Evolution history
  parentServices: string[];
  evolutionTriggers: string[];
  fitnessHistory: FitnessRecord[];
  
  // Dependencies genetics
  dependencies: {
    databases: string[];
    externalServices: string[];
    messagingSystems: string[];
    cacheProviders: string[];
    monitoringTools: string[];
  };
  
  // Resource requirements
  resources: {
    minCpu: string;
    maxCpu: string;
    minMemory: string;
    maxMemory: string;
    storageSize: string;
  };
}

export interface FitnessRecord {
  timestamp: Date;
  generation: number;
  performanceScore: number;
  qualityScore: number;
  userSatisfactionScore: number;
  overallFitness: number;
  evolutionTrigger?: string;
}

export interface EvolutionContext {
  trigger: string;
  metrics: Record<string, number>;
  userFeedback?: UserFeedback;
  performanceData?: PerformanceMetrics;
  securityReport?: SecurityReport;
}

export interface UserFeedback {
  satisfactionScore: number;
  usabilityScore: number;
  performanceRating: number;
  comments: string[];
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface SecurityReport {
  vulnerabilityCount: number;
  securityScore: number;
  complianceLevel: number;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}