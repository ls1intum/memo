# Memo Docker Setup

This document describes the Docker setup for the Memo Next.js application across three environments:
development, staging, and production.

## Architecture Overview

### Development Environment

- **App**: Next.js application running in development mode with hot reload
- **Database**: PostgreSQL database
- **Ports**:
  - App: 3000 (direct access)
  - Database: 5432 (exposed for debugging)

### Staging Environment

- **Nginx**: Reverse proxy handling external requests
- **App**: Next.js application in production mode
- **Database**: PostgreSQL database (internal network only)
- **Ports**:
  - Nginx: 80 (external access)

### Production Environment

- **Nginx**: Reverse proxy with enhanced security and SSL support
- **App**: Next.js application in production mode
- **Database**: PostgreSQL database (internal network only)
- **Ports**:
  - Nginx: 80, 443 (external access)

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git repository cloned

### Using the Management Script

The `docker-manage.sh` script provides convenient commands for managing all environments:

```bash
# Start development environment
./docker-manage.sh up development

# Start staging environment
./docker-manage.sh up staging

# Start production environment
./docker-manage.sh up production

# View logs
./docker-manage.sh logs development

# Stop environment
./docker-manage.sh down development

# Build images
./docker-manage.sh build staging

# Connect to database
./docker-manage.sh db-shell production

# Connect to app container
./docker-manage.sh app-shell development
```

### Manual Docker Compose Commands

If you prefer using Docker Compose directly:

```bash
# Development
cd docker/development
docker-compose up -d

# Staging
cd docker/staging
docker-compose up -d

# Production
cd docker/production
docker-compose up -d
```

## Environment Configuration

Each environment has its own configuration:

- `docker/development/.env` - Development environment variables
- `docker/staging/.env` - Staging environment variables
- `docker/production/.env` - Production environment variables

### Important Environment Variables

Update these variables according to your needs:

```env
# Database connection
DATABASE_URL=postgresql://memo_user:memo_password@db:5432/memo_dev

# Next.js public variables
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Database Setup

### Initial Database Setup

The PostgreSQL databases are automatically created with:

- Database names: `memo_dev`, `memo_staging`, `memo_prod`
- User: `memo_user`
- Password: `memo_password` (change this in production!)

### Database Initialization

Custom initialization scripts can be added to `scripts/init-db.sql`. This script runs when the
database container starts for the first time.

### Connecting to Database

```bash
# Using the management script
./docker-manage.sh db-shell development

# Using docker-compose directly
docker-compose exec db psql -U memo_user -d memo_dev
```

## Nginx Configuration

### Staging and Production

Nginx is configured as a reverse proxy with:

- Security headers
- Gzip compression
- Rate limiting (production only)
- Health check endpoint (`/health`)

### SSL Configuration (Production)

To enable SSL in production:

1. Add your SSL certificates to `docker/production/ssl/`
2. Uncomment SSL-related lines in `docker/production/nginx.conf`
3. Update the nginx service volumes in `docker/production/docker-compose.yml`

## Development Workflow

### Development Mode

```bash
./docker-manage.sh up development
# App available at http://localhost:3000
# Database available at localhost:5432
```

Features:

- Hot reload enabled
- Source code mounted as volume
- Direct access to application
- Database port exposed for debugging

### Staging Mode

```bash
./docker-manage.sh up staging
# App available at http://localhost:80
```

Features:

- Production build
- Nginx proxy
- Internal database communication
- Staging environment variables

### Production Mode

```bash
./docker-manage.sh up production
# App available at http://localhost:80
```

Features:

- Production build
- Nginx with security features
- Rate limiting
- SSL ready
- Restart policies

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 5432, and 80 are not in use
2. **Permission issues**: Ensure the script is executable: `chmod +x docker-manage.sh`
3. **Database connection**: Check that the database is fully started before the app tries to connect

### Viewing Logs

```bash
# All services
./docker-manage.sh logs development

# Specific service
cd docker/development && docker-compose logs app
cd docker/development && docker-compose logs db
```

### Rebuilding Images

```bash
# Rebuild everything
./docker-manage.sh build development

# Rebuild specific service
cd docker/development && docker-compose build app
```

### Cleaning Up

```bash
# Remove containers and volumes
./docker-manage.sh clean development

# Remove everything including images
cd docker/development && docker-compose down -v --rmi all
```

## Security Considerations

### Development

- Database password is visible in docker-compose files
- Database port is exposed externally
- No rate limiting or security headers

### Staging/Production

- Database is only accessible internally
- Nginx provides security headers
- Rate limiting enabled (production)
- SSL support ready

### Recommendations

1. Change default database passwords
2. Use Docker secrets for sensitive data in production
3. Configure SSL certificates for production
4. Set up proper backup strategies
5. Monitor resource usage and logs

## File Structure

```
docker/
├── development/
│   ├── docker-compose.yml
│   ├── .env
├── staging/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── .env
├── production/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── .env
scripts/
└── init-db.sql
docker-manage.sh
Dockerfile
.dockerignore
```
