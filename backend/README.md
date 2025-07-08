# TravelHub Backend Services

This directory contains the microservices that make up the TravelHub backend, built using genetic coding principles with Spring Boot.

## Services Architecture

### Core Services
- **user-service**: User management and authentication with genetic evolution
- **flight-service**: Flight search and booking with adaptive algorithms
- **hotel-service**: Hotel search and reservation with learning capabilities
- **booking-service**: Booking orchestration with evolutionary patterns
- **payment-service**: Payment processing with adaptive security
- **evolution-service**: Genetic algorithm engine for system evolution

## Genetic Coding Features

### Service DNA
Each service has genetic characteristics:
- **Service Type**: CRUD, Search, Booking, Payment, Gateway
- **Scaling Strategy**: Horizontal, Vertical, Hybrid
- **Caching Strategy**: Redis, Hazelcast, Local
- **Communication**: REST, GraphQL, Event-driven

### Evolution Capabilities
- **Performance Adaptation**: Services evolve based on performance metrics
- **Security Enhancement**: Automatic security improvements
- **Pattern Crossover**: Successful patterns spread across services
- **Fitness Selection**: Best performing implementations survive

## Technology Stack

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Cloud**
- **Spring Data JPA/MongoDB**
- **Spring Security**
- **Apache Kafka**
- **Redis**
- **Oracle Database**
- **Kubernetes**

## Quick Start

1. **Build all services:**
```bash
./gradlew build
```

2. **Start databases:**
```bash
docker-compose up -d databases
```

3. **Run services:**
```bash
./gradlew bootRun --parallel
```

## Evolution Monitoring

Each service reports evolution metrics:
- Fitness scores
- Performance improvements
- Genetic adaptations
- Cross-pollination events

## Service Communication

Services communicate using:
- **Synchronous**: REST APIs with circuit breakers
- **Asynchronous**: Kafka event streams
- **Real-time**: WebSocket connections

## Testing Strategy

- **Unit Tests**: Test individual DNA traits
- **Integration Tests**: Test service evolution
- **Contract Tests**: API contract verification
- **Load Tests**: Evolution under pressure