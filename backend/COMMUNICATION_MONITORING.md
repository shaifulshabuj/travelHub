# Microservices Communication Failure Simulation

This implementation provides a comprehensive framework for simulating and monitoring communication failures between microservices in the TravelHub ecosystem.

## Features

### 1. Communication Monitoring
- **ServiceCommunicationMonitor**: Tracks API calls, response times, and failure patterns
- **Real-time health status**: Monitors service availability and consecutive failure counts
- **Automatic failure detection**: Identifies timeouts, connection issues, and API errors

### 2. Failure Simulation
- **CommunicationFailureSimulator**: Configurable failure injection for testing resilience
- **Multiple failure types**: Timeout, connection failure, API errors, data corruption
- **Realistic scenarios**: Pre-configured failure patterns mimicking real-world issues
- **Stress testing**: High-failure scenarios for load testing

### 3. Failure Types Simulated

#### API Call Failures
- HTTP 500 errors
- HTTP 404 errors  
- Invalid response formats

#### Timeout Failures
- Configurable timeout thresholds
- Network latency simulation
- Slow response simulation

#### Data Exchange Failures
- Corrupted response data
- Missing required fields
- Invalid data formats

## API Endpoints

### Communication Monitoring
- `GET /api/v1/communication/failures/report` - Get comprehensive failure report
- `GET /api/v1/communication/test/booking-service/{userId}` - Test communication with booking service

### Failure Simulation Controls
- `POST /api/v1/communication/simulate/timeout/{serviceName}` - Enable timeout simulation
- `POST /api/v1/communication/simulate/connection-failure/{serviceName}` - Enable connection failure simulation
- `POST /api/v1/communication/simulate/api-error/{serviceName}` - Enable API error simulation
- `POST /api/v1/communication/simulate/data-corruption/{serviceName}` - Enable data corruption simulation

### Predefined Scenarios
- `POST /api/v1/communication/simulate/realistic/{serviceName}` - Create realistic failure scenario (5% timeout, 2% connection failure, 3% API error, 1% data corruption)
- `POST /api/v1/communication/simulate/stress/{serviceName}` - Create stress test scenario (20% timeout, 15% connection failure, 10% API error, 5% data corruption)

### Management
- `DELETE /api/v1/communication/simulate/{serviceName}` - Disable failure simulation
- `POST /api/v1/communication/failures/reset/{serviceName}` - Reset failure counters
- `POST /api/v1/communication/test/batch/{serviceName}` - Run batch test with multiple calls

## Usage Examples

### Enable Realistic Failure Simulation
```bash
curl -X POST http://localhost:8081/api/v1/communication/simulate/realistic/booking-service
```

### Test Communication
```bash
curl http://localhost:8081/api/v1/communication/test/booking-service/123
```

### Get Failure Report
```bash
curl http://localhost:8081/api/v1/communication/failures/report
```

### Run Batch Test
```bash
curl -X POST "http://localhost:8081/api/v1/communication/test/batch/booking-service?numberOfCalls=20"
```

## Implementation Details

### Services
- **User Service** (Port 8081): Primary service with communication monitoring
- **Booking Service** (Port 8082): Target service for testing inter-service communication

### Key Components
1. **ServiceCommunicationMonitor**: Monitors and tracks all inter-service calls
2. **CommunicationFailureSimulator**: Injects configurable failures for testing
3. **BookingServiceClient**: Client wrapper with failure simulation support
4. **CommunicationMonitoringController**: REST API for managing and reporting failures

### Testing
- Comprehensive test suite in `CommunicationFailureTest`
- Tests cover all failure simulation types
- Validates monitoring and reporting functionality

## Configuration

### User Service (`application.yml`)
```yaml
services:
  booking-service:
    url: http://localhost:8082
    timeout: 2000
```

The system automatically tracks and reports:
- Number of API call failures by type
- Service health status and consecutive failure counts
- Response time metrics
- Error patterns and trends

This implementation fulfills the requirement to "simulate communication between self-evolving microservices and identify and report failures in API calls, unexpected timeouts, or incorrect data exchanges."