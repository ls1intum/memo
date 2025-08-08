#!/bin/bash

# Memo Docker Management Script
# Usage: ./docker-manage.sh [command] [environment]

set -e

ENVIRONMENTS=("development" "staging" "production")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
    cat << EOF
Memo Docker Management Script

Usage: $0 [COMMAND] [ENVIRONMENT]

Commands:
    up          Start services
    down        Stop services
    restart     Restart services
    logs        Show logs
    build       Build images
    clean       Clean up containers and images
    db-shell    Connect to database shell
    app-shell   Connect to app container shell

Environments:
    development
    staging
    production

Examples:
    $0 up development
    $0 logs staging
    $0 down production
    $0 build staging
EOF
}

validate_environment() {
    local env=$1
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${env} " ]]; then
        echo "Error: Invalid environment '$env'"
        echo "Valid environments: ${ENVIRONMENTS[*]}"
        exit 1
    fi
}

get_compose_file() {
    local env=$1
    echo "$SCRIPT_DIR/docker/$env/docker-compose.yml"
}

run_docker_compose() {
    local env=$1
    local cmd=$2
    shift 2
    local compose_file=$(get_compose_file $env)
    
    cd "$SCRIPT_DIR/docker/$env"
    docker-compose -f docker-compose.yml $cmd "$@"
}

case "${1:-}" in
    up)
        validate_environment "$2"
        echo "Starting $2 environment..."
        run_docker_compose "$2" up -d
        echo "Services started. Access the application at:"
        if [ "$2" = "development" ]; then
            echo "  Application: http://localhost:3000"
            echo "  Database: localhost:5432"
        else
            echo "  Application: http://localhost:80"
        fi
        ;;
    down)
        validate_environment "$2"
        echo "Stopping $2 environment..."
        run_docker_compose "$2" down
        ;;
    restart)
        validate_environment "$2"
        echo "Restarting $2 environment..."
        run_docker_compose "$2" restart
        ;;
    logs)
        validate_environment "$2"
        run_docker_compose "$2" logs -f
        ;;
    build)
        validate_environment "$2"
        echo "Building images for $2 environment..."
        run_docker_compose "$2" build --no-cache
        ;;
    clean)
        validate_environment "$2"
        echo "Cleaning up $2 environment..."
        run_docker_compose "$2" down -v --rmi all
        ;;
    db-shell)
        validate_environment "$2"
        echo "Connecting to database in $2 environment..."
        run_docker_compose "$2" exec db psql -U memo_user -d "memo_$2"
        ;;
    app-shell)
        validate_environment "$2"
        echo "Connecting to app container in $2 environment..."
        run_docker_compose "$2" exec app sh
        ;;
    *)
        show_help
        exit 1
        ;;
esac
