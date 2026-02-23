#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_help() {
    echo "Memo Spring Boot Server Management Script"
    echo ""
    echo "Usage: ./server-manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  up              Start all services (PostgreSQL, Keycloak, Spring Boot)"
    echo "  down            Stop all services"
    echo "  restart         Restart all services"
    echo "  logs            View logs from all services"
    echo "  logs-api        View Spring Boot API logs only"
    echo "  logs-keycloak   View Keycloak logs only"
    echo "  build           Build the Spring Boot application"
    echo "  test            Run tests"
    echo "  clean           Clean build artifacts"
    echo "  format          Format code with Spotless"
    echo "  checkstyle      Run checkstyle validation"
    echo "  status          Check status of all services"
    echo "  db-migrate      Run database migrations manually"
    echo "  help            Show this help message"
}

case "${1:-help}" in
    up)
        echo -e "${GREEN}Starting all services...${NC}"
        docker-compose up -d
        echo ""
        echo -e "${GREEN}Services started!${NC}"
        echo "- API: http://localhost:8080"
        echo "- Swagger UI: http://localhost:8080/swagger-ui.html"
        echo "- Keycloak: http://localhost:8081 (admin/admin)"
        echo ""
        echo "Run './server-manage.sh logs' to view logs"
        ;;
    down)
        echo -e "${YELLOW}Stopping all services...${NC}"
        docker-compose down
        echo -e "${GREEN}Services stopped${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Restarting all services...${NC}"
        docker-compose restart
        echo -e "${GREEN}Services restarted${NC}"
        ;;
    logs)
        docker-compose logs -f
        ;;
    logs-api)
        docker-compose logs -f server
        ;;
    logs-keycloak)
        docker-compose logs -f keycloak
        ;;
    build)
        echo -e "${GREEN}Building Spring Boot application...${NC}"
        ./gradlew build
        echo -e "${GREEN}Build complete!${NC}"
        ;;
    test)
        echo -e "${GREEN}Running tests...${NC}"
        ./gradlew test
        ;;
    clean)
        echo -e "${YELLOW}Cleaning build artifacts...${NC}"
        ./gradlew clean
        echo -e "${GREEN}Clean complete${NC}"
        ;;
    format)
        echo -e "${GREEN}Formatting code...${NC}"
        ./gradlew spotlessApply
        echo -e "${GREEN}Formatting complete${NC}"
        ;;
    checkstyle)
        echo -e "${GREEN}Running checkstyle...${NC}"
        ./gradlew checkstyleMain
        ;;
    status)
        echo -e "${GREEN}Service Status:${NC}"
        docker-compose ps
        ;;
    db-migrate)
        echo -e "${GREEN}Running database migrations...${NC}"
        docker-compose exec server ./gradlew flywayMigrate
        echo -e "${GREEN}Migrations complete${NC}"
        ;;
    help)
        print_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        print_help
        exit 1
        ;;
esac
