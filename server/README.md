# Memo API - Spring Boot Backend

Competency-Based Education Benchmark Platform API built with Spring Boot 4.0, Java 25, PostgreSQL, and Keycloak.

## Tech Stack

- **Spring Boot 4.0.1** - Application framework
- **Java 25** - Programming language
- **PostgreSQL 18** - Database
- **Keycloak 26.4** - Authentication & Authorization (OAuth2/JWT)
- **Flyway** - Database migrations
- **Spring Data JPA** - Data access
- **Lombok** - Boilerplate reduction
- **SpringDoc OpenAPI** - API documentation
- **Gradle 9.2.1** - Build tool

## Prerequisites

- Java 25 JDK
- Docker & Docker Compose
- Gradle 9.2.1 (or use the wrapper)

## Quick Start

### 1. Start all services with Docker Compose

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5433)
- Keycloak (port 8081)
- Spring Boot API (port 8080)

### 2. Access the services

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Keycloak Admin**: http://localhost:8081 (admin/admin)
- **API Docs**: http://localhost:8080/api-docs

### 3. Default Users

The Keycloak realm comes with pre-configured users:

- **Demo User**: demo@memo.local / demo (USER role)
- **Admin User**: admin@memo.local / admin (ADMIN role)

## Development

### Run locally (without Docker)

1. Start PostgreSQL and Keycloak:
```bash
docker-compose up postgres keycloak-postgres keycloak -d
```

2. Run the Spring Boot application:
```bash
./gradlew bootRun
```

### Build

```bash
./gradlew build
```

### Run tests

```bash
./gradlew test
```

### Code formatting

```bash
./gradlew spotlessApply
```

### Checkstyle validation

```bash
./gradlew checkstyleMain
```

## API Endpoints

All endpoints require JWT authentication (except Swagger UI and health checks).

### Users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/by-email?email=` - Get user by email
- `GET /api/users` - Get all users
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Competencies
- `POST /api/competencies` - Create competency
- `GET /api/competencies/{id}` - Get competency by ID
- `GET /api/competencies` - Get all competencies
- `GET /api/competencies/random?count=2` - Get random competencies
- `PUT /api/competencies/{id}` - Update competency
- `DELETE /api/competencies/{id}` - Delete competency

### Learning Resources
- `POST /api/learning-resources` - Create learning resource
- `GET /api/learning-resources/{id}` - Get resource by ID
- `GET /api/learning-resources/by-url?url=` - Get resource by URL
- `GET /api/learning-resources` - Get all resources
- `PUT /api/learning-resources/{id}` - Update resource
- `DELETE /api/learning-resources/{id}` - Delete resource

### Competency Relationships
- `POST /api/competency-relationships` - Create relationship
- `GET /api/competency-relationships/{id}` - Get relationship by ID
- `GET /api/competency-relationships` - Get all relationships
- `DELETE /api/competency-relationships/{id}` - Delete relationship

### Competency Resource Links
- `POST /api/competency-resource-links` - Create link
- `GET /api/competency-resource-links/{id}` - Get link by ID
- `GET /api/competency-resource-links` - Get all links
- `DELETE /api/competency-resource-links/{id}` - Delete link

## Authentication

The API uses OAuth2/JWT via Keycloak. To authenticate:

1. Obtain a token from Keycloak:
```bash
curl -X POST http://localhost:8081/realms/memo/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=memo-client" \
  -d "username=demo@memo.local" \
  -d "password=demo" \
  -d "grant_type=password"
```

2. Use the `access_token` in API requests:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/competencies
```

## Database

- **Migrations**: Located in `src/main/resources/db/migration`
- **Auto-apply**: Flyway runs migrations on startup
- **Connection**: PostgreSQL on port 5433

## Configuration

Environment variables (see `.env.example`):

```bash
DB_HOST=localhost
DB_PORT=5433
DB_NAME=memo
DB_USER=postgres
DB_PASSWORD=memo
KEYCLOAK_ISSUER_URI=http://localhost:8081/realms/memo
KEYCLOAK_JWK_SET_URI=http://localhost:8081/realms/memo/protocol/openid-connect/certs
SERVER_PORT=8080
```

## Project Structure

```
server/
├── src/main/java/de/tum/cit/memo/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/             # Request/Response objects
│   ├── entity/          # JPA entities
│   ├── enums/           # Enumerations
│   ├── exception/       # Exception handling
│   ├── repository/      # Data access layer
│   ├── security/        # Security configuration
│   ├── service/         # Business logic
│   └── util/            # Utility classes
├── src/main/resources/
│   ├── db/migration/    # Flyway SQL scripts
│   └── application.yml  # Application configuration
├── docker/
│   └── keycloak/        # Keycloak realm configuration
├── Dockerfile           # Container image
└── docker-compose.yml   # Multi-container setup
```

## Troubleshooting

### Port already in use
If ports 5433, 8080, or 8081 are already in use, stop the conflicting services or modify the ports in `docker-compose.yml`.

### Keycloak not starting
Keycloak takes 30-40 seconds to fully start. Check logs:
```bash
docker-compose logs keycloak
```

### Database migration errors
If migrations fail, check Flyway status:
```bash
docker-compose exec server ./gradlew flywayInfo
```
