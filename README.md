# Memo - Competency-Based Education Benchmark Platform

Platform for scientists and educators to collect and combine educational data into benchmarks for competency-based learning.

## 🚀 Quick Start

### Prerequisites

- **Java 25 JDK** (for Spring Boot backend)
- **Node.js 24+** (for Next.js frontend)
- **Docker & Docker Compose**
- **Git**

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ls1intum/memo.git
   cd memo
   ```

2. **Start the Spring Boot backend**
   ```bash
   cd server
   ./server-manage.sh up
   ```
   Wait ~60 seconds for all services to start (PostgreSQL, Keycloak, Spring Boot)

3. **Start the Next.js frontend** (in a new terminal)
   ```bash
   cd ..  # Back to root directory
   npm install
   npm run dev
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Swagger UI**: http://localhost:8080/swagger-ui.html
   - **Keycloak Admin**: http://localhost:8081 (admin/admin)

5. **Login**
   - Use `demo@memo.local` / `demo` or `admin@memo.local` / `admin`

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                     │
│                    (Port 3000)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   React     │  │ React Query  │  │   Keycloak    │ │
│  │ Components  │  │ + Axios API  │  │     Auth      │ │
│  └─────────────┘  └──────────────┘  └───────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API (JWT)
┌───────────────────────▼─────────────────────────────────┐
│                 Spring Boot Backend                     │
│                    (Port 8080)                          │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │     REST     │  │ Service  │  │  Spring Data JPA │ │
│  │ Controllers  │  │  Layer   │  │  + PostgreSQL    │ │
│  └──────────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌──────────────────┐              ┌─────────────────────┐
│    Keycloak      │              │    PostgreSQL       │
│   (Port 8081)    │              │    (Port 5433)      │
│  OAuth2 + JWT    │              │  Application DB     │
└──────────────────┘              └─────────────────────┘
```

## 📁 Project Structure

```
memo/
├── app/                    # Next.js pages and components
│   ├── session/           # Mapping session page
│   ├── about/             # About page
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable React components
├── lib/                   # Frontend utilities
│   ├── api/              # REST API client and services
│   └── auth/             # Keycloak authentication
├── server/                # Spring Boot backend
│   ├── src/main/java/    # Java source code
│   │   └── de/tum/cit/memo/
│   │       ├── controller/   # REST endpoints
│   │       ├── service/      # Business logic
│   │       ├── repository/   # Data access
│   │       ├── entity/       # JPA entities
│   │       └── security/     # OAuth2 config
│   ├── src/main/resources/
│   │   ├── application.yml   # Spring config
│   │   └── db/migration/     # Flyway migrations
│   ├── docker-compose.yml    # Backend services
│   └── server-manage.sh      # Management script
├── .env.local             # Frontend environment variables
├── QUICKSTART.md          # Detailed setup guide
└── README.md              # This file
```

## 🔧 Development

### Frontend Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
npm run quality      # Run all checks
```

### Backend Commands

```bash
cd server

./server-manage.sh up        # Start all services
./server-manage.sh down      # Stop all services
./server-manage.sh logs      # View logs
./server-manage.sh status    # Check service status
./server-manage.sh build     # Build Spring Boot app
./server-manage.sh test      # Run tests
```

## 🔐 Authentication

The application uses Keycloak for OAuth2/JWT authentication.

### Default Users

| Email | Password | Role |
|-------|----------|------|
| `demo@memo.local` | `demo` | USER |
| `admin@memo.local` | `admin` | ADMIN |

### Keycloak Admin Console

- **URL**: http://localhost:8081
- **Username**: `admin`
- **Password**: `admin`

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, shadcn/ui, Tailwind CSS 4
- **State**: TanStack Query (React Query)
- **HTTP**: Axios
- **Auth**: Keycloak JS

### Backend
- **Framework**: Spring Boot 4.0
- **Language**: Java 25
- **Database**: PostgreSQL 16
- **ORM**: JPA/Hibernate
- **Migrations**: Flyway
- **Security**: Spring Security + OAuth2
- **API Docs**: OpenAPI/Swagger
- **Build**: Gradle 9.2.1

### Infrastructure
- **Authentication**: Keycloak 26.4
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (production)

## 📚 API Documentation

Full API documentation with interactive testing:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

### Main Endpoints

- `GET /api/competencies` - List all competencies
- `GET /api/competencies/random?count=2` - Get random competencies
- `POST /api/competencies` - Create competency
- `POST /api/competency-relationships` - Create relationship
- `GET /api/users` - List users
- `GET /api/learning-resources` - List resources

All endpoints require JWT authentication via Bearer token.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run quality checks: `npm run quality`
5. Test thoroughly (backend and frontend)
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Pre-commit Checklist

- [ ] Frontend: `npm run quality` passes
- [ ] Backend: `cd server && ./server-manage.sh test` passes
- [ ] Code is properly formatted
- [ ] No console.log statements in production code
- [ ] API changes documented in Swagger

## 🆘 Troubleshooting

### Backend won't start

```bash
cd server
./server-manage.sh down
./server-manage.sh up
./server-manage.sh logs  # Check for errors
```

### Frontend can't connect to backend

1. Verify backend is running: http://localhost:8080/actuator/health
2. Check `.env.local` has correct URLs
3. Clear browser cache and cookies
4. Restart frontend: `npm run dev`

### Authentication errors

1. Check Keycloak is running: http://localhost:8081
2. Clear browser local storage and cookies
3. Try incognito/private browsing mode
4. Check `server/docker-compose.yml` for Keycloak config

### Database issues

```bash
cd server
./server-manage.sh down
docker volume rm memo_postgres_data  # Warning: deletes all data
./server-manage.sh up
```

### Port conflicts

If ports 3000, 5433, 8080, or 8081 are in use:

- **Frontend**: `PORT=3001 npm run dev`
- **Backend**: Edit `server/docker-compose.yml` port mappings

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup and usage guide
- **[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)** - Migration summary and architecture details
- **[CLAUDE.md](CLAUDE.md)** - Project conventions and AI assistant usage
- **[server/README.md](server/README.md)** - Backend-specific documentation
- **[SECURITY.md](SECURITY.md)** - Security guidelines

## 📄 License

This project is part of the ls1intum organization.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com/)
