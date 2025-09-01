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
    # Windows PowerShell color commands
    GREEN := powershell -Command "Write-Host -ForegroundColor Green"
    YELLOW := powershell -Command "Write-Host -ForegroundColor Yellow"
    RED := powershell -Command "Write-Host -ForegroundColor Red"
    ECHO := powershell -Command "Write-Host"
else
    detected_OS := $(shell uname -s)
    RM := rm -f
    RMDIR := rm -rf
    MKDIR := mkdir -p
    SEP := /
    NULL := /dev/null
    # Unix/Linux ANSI colors
    GREEN := echo -e "\033[0;32m"
    YELLOW := echo -e "\033[0;33m"
    RED := echo -e "\033[0;31m"
    ECHO := echo
endif

## Backend Commands
.PHONY: backend-dev
backend-dev: ## Start backend development server
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Starting backend development server..."
else
	@echo "\033[0;32mStarting backend development server...\033[0m"
endif
ifeq ($(detected_OS),Windows)
	cd $(BACKEND_DIR) && npm run dev
else
	cd $(BACKEND_DIR) && npm run dev
endif

.PHONY: backend-start
backend-start: ## Start backend production server
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Starting backend production server..."
else
	@echo "\033[0;32mStarting backend production server...\033[0m"
endif
	cd $(BACKEND_DIR) && npm start

.PHONY: backend-install
backend-install: ## Install backend dependencies
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Installing backend dependencies..."
else
	@echo "\033[0;32mInstalling backend dependencies...\033[0m"
endif
	cd $(BACKEND_DIR) && npm install

.PHONY: backend-test
backend-test: ## Run backend tests
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Running backend tests..."
else
	@echo "\033[0;32mRunning backend tests...\033[0m"
endif
	cd $(BACKEND_DIR) && npm test

## Frontend Commands
.PHONY: frontend-dev
frontend-dev: ## Start frontend development server
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Starting frontend development server..."
else
	@echo "\033[0;32mStarting frontend development server...\033[0m"
endif
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: frontend-install
frontend-install: ## Install frontend dependencies
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Installing frontend dependencies..."
else
	@echo "\033[0;32mInstalling frontend dependencies...\033[0m"
endif
	cd $(FRONTEND_DIR) && npm install

## Combined Commands
.PHONY: install
install: backend-install frontend-install ## Install all dependencies
ifeq ($(detected_OS),Windows)
	@$(GREEN) "All dependencies installed!"
else
	@echo "\033[0;32mAll dependencies installed!\033[0m"
endif

.PHONY: dev
dev: backend-dev frontend-dev ## Start all development servers

.PHONY: clean
clean: ## Clean node_modules and package-lock files
ifeq ($(detected_OS),Windows)
	@$(YELLOW) "Cleaning project..."
	@if exist "$(BACKEND_DIR)$(SEP)node_modules" ( rmdir /S /Q "$(BACKEND_DIR)$(SEP)node_modules" )
	@if exist "$(BACKEND_DIR)$(SEP)package-lock.json" ( del "$(BACKEND_DIR)$(SEP)package-lock.json" )
	@if exist "$(FRONTEND_DIR)$(SEP)node_modules" ( rmdir /S /Q "$(FRONTEND_DIR)$(SEP)node_modules" )
	@if exist "$(FRONTEND_DIR)$(SEP)package-lock.json" ( del "$(FRONTEND_DIR)$(SEP)package-lock.json" )
	@$(GREEN) "Clean complete!"
else
	@echo "\033[0;33mCleaning project...\033[0m"
	$(RMDIR) $(BACKEND_DIR)/node_modules $(BACKEND_DIR)/package-lock.json
	$(RMDIR) $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/package-lock.json
	@echo "\033[0;32mClean complete!\033[0m"
endif

.PHONY: setup
setup: ## Setup development environment
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Setting up development environment..."
	@$(ECHO) "Detected OS: $(detected_OS)"
	@$(ECHO) "Make sure you have Node.js and npm installed"
	@$(ECHO) "Run 'make install' to install dependencies"
	@$(GREEN) "Setup instructions displayed!"
else
	@echo "\033[0;32mSetting up development environment...\033[0m"
	@echo "Detected OS: $(detected_OS)"
	@echo "Make sure you have Node.js and npm installed"
	@echo "Run 'make install' to install dependencies"
	@echo "\033[0;32mSetup instructions displayed!\033[0m"
endif

.PHONY: status
status: ## Show project status
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Project Status:"
	@$(ECHO) "OS: $(detected_OS)"
	@$(ECHO) "Backend Directory: $(BACKEND_DIR)"
	@$(ECHO) "Frontend Directory: $(FRONTEND_DIR)"
	@if exist "$(BACKEND_DIR)$(SEP)node_modules" ($(ECHO) "Backend dependencies: INSTALLED") else ($(ECHO) "Backend dependencies: NOT INSTALLED")
	@if exist "$(FRONTEND_DIR)$(SEP)node_modules" ($(ECHO) "Frontend dependencies: INSTALLED") else ($(ECHO) "Frontend dependencies: NOT INSTALLED")
else
	@echo "\033[0;32mProject Status:\033[0m"
	@echo "OS: $(detected_OS)"
	@echo "Backend Directory: $(BACKEND_DIR)"
	@echo "Frontend Directory: $(FRONTEND_DIR)"
	@if [ -d "$(BACKEND_DIR)/node_modules" ]; then echo "Backend dependencies: INSTALLED"; else echo "Backend dependencies: NOT INSTALLED"; fi
	@if [ -d "$(FRONTEND_DIR)/node_modules" ]; then echo "Frontend dependencies: INSTALLED"; else echo "Frontend dependencies: NOT INSTALLED"; fi
endif

.PHONY: help
help: ## Show this help message
ifeq ($(detected_OS),Windows)
	@$(GREEN) "Fashion Platform - Available Commands:"
	@$(ECHO) "Detected OS: $(detected_OS)"
	@$(ECHO) ""
	@powershell -Command "Get-Content $(MAKEFILE_LIST) | Select-String -Pattern '^[a-zA-Z_-]+:.*?##' | ForEach-Object { $$line = $$_; $$parts = $$line -split ':.*?##\\s*'; Write-Host ('  ' + $$parts[0].PadRight(20) + ' ' + $$parts[1]) -ForegroundColor Yellow }"
	@$(ECHO) ""
	@$(GREEN) "Usage:"
	@$(ECHO) "  make [command]"
	@$(ECHO) ""
	@$(GREEN) "Examples:"
	@$(ECHO) "  make backend-dev    # Start backend development server"
	@$(ECHO) "  make dev           # Same as backend-dev (shortcut)"
	@$(ECHO) "  make install       # Install all dependencies"
	@$(ECHO) "  make status        # Show project status"
	@$(ECHO) "  make help          # Show this help"
else
	@echo "\033[0;32mFashion Platform - Available Commands:\033[0m"
	@echo "Detected OS: $(detected_OS)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[0;33m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "\033[0;32mUsage:\033[0m"
	@echo "  make [command]"
	@echo ""
	@echo "\033[0;32mExamples:\033[0m"
	@echo "  make backend-dev    # Start backend development server"
	@echo "  make dev           # Same as backend-dev (shortcut)"
	@echo "  make install       # Install all dependencies"
	@echo "  make status        # Show project status"
	@echo "  make help          # Show this help"
endif