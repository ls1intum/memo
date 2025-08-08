# Memo

A Next.js application for memo management with Docker-based development and deployment.

## 🚀 Quick Start for Development

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ls1intum/memo.git
   cd memo
   ```

2. **Start the development environment**
   ```bash
   ./docker-manage.sh up development
   ```
   
   This will:
   - Build the Next.js application with hot reload
   - Start a PostgreSQL database
   - Set up the complete development environment

3. **Access the application**
   - **Web Application**: [http://localhost:3000](http://localhost:3000)
   - **Database**: `localhost:5432` (for debugging tools)

4. **Stop the development environment**
   ```bash
   ./docker-manage.sh down development
   ```

### Development Workflow

- **Code changes** are automatically reflected (hot reload enabled)
- **Database data** persists between restarts
- **Logs**: View with `./docker-manage.sh logs development`
- **Database shell**: Access with `./docker-manage.sh db-shell development`

## 🛠 Alternative Development Methods

### Using npm/yarn directly (without Docker)

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables**
   ```bash
   cp docker/development/.env .env.local
   # Edit .env.local to use localhost database connection
   ```

3. **Start a PostgreSQL database** (using Docker)
   ```bash
   docker run -d \
     --name memo-postgres \
     -e POSTGRES_DB=memo_dev \
     -e POSTGRES_USER=memo_user \
     -e POSTGRES_PASSWORD=memo_password \
     -p 5432:5432 \
     postgres:16-alpine
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🐳 Docker Management

The project includes a convenient management script for all Docker operations:

```bash
# Start development environment
./docker-manage.sh up development

# View logs
./docker-manage.sh logs development

# Restart services
./docker-manage.sh restart development

# Connect to database
./docker-manage.sh db-shell development

# Connect to app container
./docker-manage.sh app-shell development

# Clean up (removes containers and volumes)
./docker-manage.sh clean development
```

## 📁 Project Structure

```
memo/
├── app/                          # Next.js app directory
├── components/                   # React components
├── lib/                         # Utility libraries
├── docker/                      # Environment-specific configs
│   ├── development/             # Local development
│   ├── staging/                 # Testing environment
│   └── production/              # Production environment
├── scripts/                     # Database initialization
├── .github/workflows/           # CI/CD workflows
├── docker-manage.sh            # Docker management script
├── Dockerfile                  # Multi-stage Docker build
└── README.md                   # This file
```

## 🔧 Development Configuration

The development environment is configured with:
- **Hot Reload**: Automatic code updates
- **Volume Mounting**: Source code changes reflected immediately  
- **Database**: PostgreSQL with persistent data
- **Port Mapping**: Direct access to app (3000) and database (5432)

### Environment Variables (Development)

Located in `docker/development/.env`:
- `NODE_ENV=development`
- `DATABASE_URL=postgresql://memo_user:memo_password@localhost:5432/memo_dev`
- `NEXT_PUBLIC_API_URL=http://localhost:3000/api`

## 🚀 Deployment

This project uses automated deployment via GitHub Actions:

- **Staging**: For testing features
- **Production**: Live environment

See [DOCKER.md](DOCKER.md) for detailed Docker setup information.
See [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md) for CI/CD setup information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Start development environment: `./docker-manage.sh up development`
4. Make your changes
5. Test thoroughly
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Docker Documentation](https://docs.docker.com/) - containerization platform
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - database system

## 🆘 Troubleshooting

### Common Issues

**Port already in use**:
```bash
./docker-manage.sh down development  # Stop any running containers
```

**Permission issues with docker-manage.sh**:
```bash
chmod +x docker-manage.sh
```

**Database connection issues**:
```bash
./docker-manage.sh logs development  # Check if database is running
./docker-manage.sh restart development  # Restart all services
```

**Fresh start**:
```bash
./docker-manage.sh clean development  # Remove all containers and volumes
./docker-manage.sh up development     # Start fresh
```

For more detailed troubleshooting, see [DOCKER.md](DOCKER.md).

## 📄 License

This project is part of the ls1intum organization.
