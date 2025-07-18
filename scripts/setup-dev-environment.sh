#!/bin/bash

# Planeswalker's Primer - Development Environment Setup Script
# This script sets up the complete local development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "\n${CYAN}${1}${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..50})${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is running
is_docker_running() {
    docker info >/dev/null 2>&1
}

# Check if port is in use
is_port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Wait for service to be ready
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=30
    local attempt=1

    log_info "Waiting for $service_name to be ready..."

    while [ $attempt -le $max_attempts ]; do
        if nc -z $host $port 2>/dev/null; then
            log_success "$service_name is ready!"
            return 0
        fi

        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    log_error "$service_name failed to start within $((max_attempts * 2)) seconds"
    return 1
}

# Main setup function
main() {
    log_header "🚀 Planeswalker's Primer - Development Environment Setup"

    # Check prerequisites
    log_header "📋 Checking Prerequisites"

    if ! command_exists docker; then
        log_error "Docker is not installed. Please install Docker first."
        log_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    log_success "Docker is installed"

    if ! command_exists docker-compose; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        log_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    log_success "Docker Compose is installed"

    if ! is_docker_running; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    log_success "Docker is running"

    if ! command_exists node; then
        log_error "Node.js is not installed. Please install Node.js first."
        log_info "Visit: https://nodejs.org/"
        exit 1
    fi
    log_success "Node.js is installed ($(node --version))"

    if ! command_exists npm; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    log_success "npm is installed ($(npm --version))"

    # Check if we're in the right directory
    if [ ! -f "docker-compose.yml" ]; then
        log_error "docker-compose.yml not found. Please run this script from the project root directory."
        exit 1
    fi

    # Check for port conflicts
    log_header "🔍 Checking Port Availability"

    if is_port_in_use 5432; then
        log_warning "Port 5432 (PostgreSQL) is already in use"
        read -p "Do you want to continue? This might conflict with the Docker database. (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Setup cancelled. Please free port 5432 and try again."
            exit 1
        fi
    else
        log_success "Port 5432 is available"
    fi

    if is_port_in_use 3001; then
        log_warning "Port 3001 (Backend) is already in use"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Setup cancelled. Please free port 3001 and try again."
            exit 1
        fi
    else
        log_success "Port 3001 is available"
    fi

    if is_port_in_use 3000; then
        log_warning "Port 3000 (Frontend) is already in use"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Setup cancelled. Please free port 3000 and try again."
            exit 1
        fi
    else
        log_success "Port 3000 is available"
    fi

    # Setup environment files
    log_header "📁 Setting Up Environment Files"

    if [ ! -f "backend/.env" ]; then
        log_info "Creating backend/.env from development template"
        cp backend/.env.development backend/.env
        log_success "Backend environment file created"
    else
        log_warning "Backend .env file already exists, skipping"
    fi

    if [ ! -f "frontend/.env.local" ]; then
        log_info "Creating frontend/.env.local"
        cat > frontend/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
EOL
        log_success "Frontend environment file created"
    else
        log_warning "Frontend .env.local file already exists, skipping"
    fi

    # Start database
    log_header "🐘 Starting PostgreSQL Database"

    log_info "Starting PostgreSQL container..."
    docker-compose up -d postgres

    # Wait for database to be ready
    if wait_for_service localhost 5432 "PostgreSQL"; then
        log_success "PostgreSQL database is running"
    else
        log_error "Failed to start PostgreSQL database"
        exit 1
    fi

    # Install dependencies
    log_header "📦 Installing Dependencies"

    log_info "Installing backend dependencies..."
    cd backend
    npm install
    log_success "Backend dependencies installed"

    log_info "Installing frontend dependencies..."
    cd ../frontend
    npm install
    log_success "Frontend dependencies installed"

    cd ..

    # Test database connection
    log_header "🔗 Testing Database Connection"

    log_info "Testing backend database connection..."
    cd backend
    if timeout 10 npm run test:db 2>/dev/null || node -e "
        require('dotenv').config();
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        pool.query('SELECT NOW()').then(() => {
            console.log('Database connection successful');
            process.exit(0);
        }).catch(err => {
            console.error('Database connection failed:', err.message);
            process.exit(1);
        });
    "; then
        log_success "Database connection successful"
    else
        log_error "Database connection failed"
        log_info "The database might still be starting up. You can test it later with: npm run test:connection"
    fi

    cd ..

    # Setup complete
    log_header "🎉 Setup Complete!"

    echo -e "${GREEN}"
    echo "Your development environment is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend server:"
    echo "   cd backend && npm run dev"
    echo ""
    echo "2. In a new terminal, start the frontend:"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "3. Visit your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:3001"
    echo ""
    echo "Database Management:"
    echo "• PostgreSQL is running on localhost:5432"
    echo "• Database: plansewalker_primer"
    echo "• Username: postgres"
    echo "• Password: password"
    echo ""
    echo "Optional - Start pgAdmin for database management:"
    echo "   docker-compose --profile tools up -d pgadmin"
    echo "   Then visit: http://localhost:8080"
    echo "   Email: admin@plansewalker.com"
    echo "   Password: admin"
    echo ""
    echo "Useful commands:"
    echo "• Stop database: docker-compose down"
    echo "• View database logs: docker-compose logs postgres"
    echo "• Reset database: docker-compose down -v && docker-compose up -d postgres"
    echo "• Test connection: cd backend && npm run test:connection"
    echo -e "${NC}"

    # Ask if user wants to start services now
    echo ""
    read -p "Would you like to start the backend server now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Starting backend server..."
        cd backend
        echo ""
        log_success "Backend starting! Press Ctrl+C to stop."
        npm run dev
    else
        log_info "You can start the backend manually with: cd backend && npm run dev"
    fi
}

# Cleanup function for interrupted setup
cleanup() {
    log_warning "Setup interrupted. Cleaning up..."
    docker-compose down 2>/dev/null || true
    exit 1
}

# Set up trap for cleanup
trap cleanup INT TERM

# Run main function
main "$@"
