# Memo - Competency-Based Education Benchmark Platform

Platform for scientists and educators to collect and combine educational data into benchmarks for
competency-based learning.

## 🚀 Quick Start

### Prerequisites

- **Java 17 JDK** (for Spring Boot backend)
- **Node.js 20+** (for Vite frontend)
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

3. **Start the Vite frontend** (in a new terminal)

   ```bash
   cd ..  # Back to root directory
   npm install
   npm run dev
   ```

4. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8080
   - **Swagger UI**: http://localhost:8080/swagger-ui.html
   - **Keycloak Admin**: http://localhost:8081 (admin/admin)

5. **Login**
   - Use `demo@memo.local` / `demo` or `admin@memo.local` / `admin`

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Vite + React Frontend                  │
│                      (Port 5173)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │   React     │  │ React Query  │  │   Keycloak    │   │
│  │ Components  │  │ + Axios API  │  │     Auth      │   │
│  └─────────────┘  └──────────────┘  └───────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API (JWT)
┌───────────────────────▼─────────────────────────────────┐
│                 Spring Boot Backend                     │
│                    (Port 8080)                          │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │     REST     │  │ Service  │  │  Spring Data JPA │   │
│  │ Controllers  │  │  Layer   │  │  + PostgreSQL    │   │
│  └──────────────┘  └──────────┘  └──────────────────┘   │
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
├── src/                       # Vite + React frontend
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   ├── components/           # Reusable React components
│   │   ├── ui/              # UI primitives (button, card, etc.)
│   │   └── session/         # Session-specific components
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── SessionPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── OnboardingPage.tsx
│   ├── lib/                 # Frontend utilities
│   │   ├── api/            # REST API client and services
│   │   └── utils.ts        # Utility functions
│   └── hooks/              # Custom React hooks
├── server/                   # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   │   └── de/tum/cit/memo/
│   │       ├── controller/  # REST endpoints
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── entity/      # JPA entities
│   │       ├── dto/         # Data transfer objects
│   │       ├── security/    # OAuth2 config
│   │       └── config/      # Application config
│   ├── src/main/resources/
│   │   ├── application.yml  # Spring config
│   │   └── db/migration/    # Flyway migrations
│   ├── docker-compose.yml   # Backend services
│   └── server-manage.sh     # Management script
├── public/                   # Static assets
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

## 🔧 Development

### Frontend Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
npm run quality      # Run all checks
npm run quality:fix  # Fix all auto-fixable issues
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

| Email              | Password | Role  |
| ------------------ | -------- | ----- |
| `demo@memo.local`  | `demo`   | USER  |
| `admin@memo.local` | `admin`  | ADMIN |

### Keycloak Admin Console

- **URL**: http://localhost:8081
- **Username**: `admin`
- **Password**: `admin`

## 🛠 Tech Stack

### Frontend

- **Build Tool**: Vite 6
- **UI**: React 19, shadcn/ui, Tailwind CSS 4
- **State**: TanStack Query (React Query)
- **Routing**: React Router 7
- **HTTP**: Axios
- **Auth**: Keycloak JS

### Backend

- **Framework**: Spring Boot 3.4.1
- **Language**: Java 17
- **Database**: PostgreSQL 16
- **ORM**: JPA/Hibernate
- **Migrations**: Flyway
- **Security**: Spring Security + OAuth2
- **API Docs**: OpenAPI/Swagger
- **Build**: Gradle 8.11.1

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

If ports 5173, 5433, 8080, or 8081 are in use:

- **Frontend**: `vite --port 3001` or edit `vite.config.ts`
- **Backend**: Edit `server/docker-compose.yml` port mappings

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Project conventions and AI assistant guidelines
- **[server/README.md](server/README.md)** - Backend-specific documentation
- **[SECURITY.md](SECURITY.md)** - Security guidelines
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines

## 📄 License

This project is part of the ls1intum organization.

## 🔗 Resources

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com/)
