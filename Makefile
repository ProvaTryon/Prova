# Fashion Platform - Development Commands

# Default target
.DEFAULT_GOAL := help

# Variables
BACKEND_DIR = backend-web
FRONTEND_DIR = frontend

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

## Backend Commands
.PHONY: backend-dev
backend-dev: ## Start backend development server
	@echo "$(GREEN)Starting backend development server...$(NC)"
	cd $(BACKEND_DIR) && npm run dev

.PHONY: backend-start
backend-start: ## Start backend production server
	@echo "$(GREEN)Starting backend production server...$(NC)"
	cd $(BACKEND_DIR) && npm start

.PHONY: backend-install
backend-install: ## Install backend dependencies
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	cd $(BACKEND_DIR) && npm install

.PHONY: backend-test
backend-test: ## Run backend tests
	@echo "$(GREEN)Running backend tests...$(NC)"
	cd $(BACKEND_DIR) && npm test

## Frontend Commands (for future use)
.PHONY: frontend-dev
frontend-dev: ## Start frontend development server
	@echo "$(GREEN)Starting frontend development server...$(NC)"
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: frontend-install
frontend-install: ## Install frontend dependencies
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	cd $(FRONTEND_DIR) && npm install

## Combined Commands
.PHONY: install
install: backend-install ## Install all dependencies
	@echo "$(GREEN)All dependencies installed!$(NC)"

.PHONY: dev
dev: backend-dev ## Start development servers (alias for backend-dev)

.PHONY: clean
clean: ## Clean node_modules and package-lock files
	@echo "$(YELLOW)Cleaning backend...$(NC)"
	cd $(BACKEND_DIR) && rm -rf node_modules package-lock.json
	@echo "$(GREEN)Clean complete!$(NC)"

.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)Fashion Platform - Available Commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Usage:$(NC)"
	@echo "  make <command>"
	@echo ""
	@echo "$(GREEN)Examples:$(NC)"
	@echo "  make backend-dev    # Start backend development server"
	@echo "  make dev           # Same as backend-dev (shortcut)"
	@echo "  make install       # Install all dependencies"
	@echo "  make help          # Show this help"