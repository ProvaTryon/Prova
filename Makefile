# Fashion Platform - Development Commands (Cross-Platform)

# Default target
.DEFAULT_GOAL := help

# Variables
BACKEND_DIR = backend-web
FRONTEND_DIR = frontend

# Detect OS
ifeq ($(OS),Windows_NT)
    detected_OS := Windows
    RM := del /Q
    RMDIR := rmdir /S /Q
    MKDIR := mkdir
    SEP := \\
    NULL := NUL
else
    detected_OS := $(shell uname -s)
    RM := rm -f
    RMDIR := rm -rf
    MKDIR := mkdir -p
    SEP := /
    NULL := /dev/null
endif

# Colors for output (Linux/Mac only)
ifneq ($(detected_OS),Windows)
    GREEN = \033[0;32m
    YELLOW = \033[0;33m
    RED = \033[0;31m
    NC = \033[0m
else
    GREEN = 
    YELLOW = 
    RED = 
    NC = 
endif

## Backend Commands
.PHONY: backend-dev
backend-dev: ## Start backend development server
	@echo "$(GREEN)Starting backend development server...$(NC)"
ifeq ($(detected_OS),Windows)
	cd $(BACKEND_DIR) && npm run dev
else
	cd $(BACKEND_DIR) && npm run dev
endif

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

## Frontend Commands
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
install: backend-install frontend-install ## Install all dependencies
	@echo "$(GREEN)All dependencies installed!$(NC)"

.PHONY: dev
dev: backend-dev frontend-dev ## Start all development servers

.PHONY: clean
clean: ## Clean node_modules and package-lock files
	@echo "$(YELLOW)Cleaning project...$(NC)"
ifeq ($(detected_OS),Windows)
	@if exist "$(BACKEND_DIR)$(SEP)node_modules" ( rmdir /S /Q "$(BACKEND_DIR)$(SEP)node_modules" )
	@if exist "$(BACKEND_DIR)$(SEP)package-lock.json" ( del "$(BACKEND_DIR)$(SEP)package-lock.json" )
	@if exist "$(FRONTEND_DIR)$(SEP)node_modules" ( rmdir /S /Q "$(FRONTEND_DIR)$(SEP)node_modules" )
	@if exist "$(FRONTEND_DIR)$(SEP)package-lock.json" ( del "$(FRONTEND_DIR)$(SEP)package-lock.json" )
else
	$(RMDIR) $(BACKEND_DIR)/node_modules $(BACKEND_DIR)/package-lock.json
	$(RMDIR) $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/package-lock.json
endif
	@echo "$(GREEN)Clean complete!$(NC)"

.PHONY: setup
setup: ## Setup development environment
	@echo "$(GREEN)Setting up development environment...$(NC)"
	@echo "Detected OS: $(detected_OS)"
	@echo "Make sure you have Node.js and npm installed"
	@echo "Run 'make install' to install dependencies"
	@echo "$(GREEN)Setup instructions displayed!$(NC)"

.PHONY: status
status: ## Show project status
	@echo "$(GREEN)Project Status:$(NC)"
	@echo "OS: $(detected_OS)"
	@echo "Backend Directory: $(BACKEND_DIR)"
	@echo "Frontend Directory: $(FRONTEND_DIR)"
ifeq ($(detected_OS),Windows)
	@if exist "$(BACKEND_DIR)$(SEP)node_modules" (echo "Backend dependencies: INSTALLED") else (echo "Backend dependencies: NOT INSTALLED")
	@if exist "$(FRONTEND_DIR)$(SEP)node_modules" (echo "Frontend dependencies: INSTALLED") else (echo "Frontend dependencies: NOT INSTALLED")
else
	@if [ -d "$(BACKEND_DIR)/node_modules" ]; then echo "Backend dependencies: INSTALLED"; else echo "Backend dependencies: NOT INSTALLED"; fi
	@if [ -d "$(FRONTEND_DIR)/node_modules" ]; then echo "Frontend dependencies: INSTALLED"; else echo "Frontend dependencies: NOT INSTALLED"; fi
endif

.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)Fashion Platform - Available Commands:$(NC)"
	@echo "Detected OS: $(detected_OS)"
	@echo ""
ifeq ($(detected_OS),Windows)
	@powershell -ExecutionPolicy Bypass -NoProfile -Command "Get-Content $(MAKEFILE_LIST) | Select-String -Pattern '^[a-zA-Z_-]+:.*?##' | ForEach-Object { $$line = $$_; $$parts = $$line -split ':.*?##\\s*'; Write-Host ('  $(YELLOW)' + $$parts[0].PadRight(20) + '$(NC) ' + $$parts[1]) }"
else
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
endif
	@echo ""
	@echo "$(GREEN)Usage:$(NC)"
	@echo "  make <command>"
	@echo ""
	@echo "$(GREEN)Examples:$(NC)"
	@echo "  make backend-dev    # Start backend development server"
	@echo "  make dev           # Same as backend-dev (shortcut)"
	@echo "  make install       # Install all dependencies"
	@echo "  make status        # Show project status"
	@echo "  make help          # Show this help"