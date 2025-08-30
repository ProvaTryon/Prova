# Architecture Documentation

## System Architecture

This document outlines the architecture of the Fashion Platform.

### Services Overview

1. **Frontend (React)**
   - User interface
   - State management with Redux
   - Responsive design with TailwindCSS

2. **Backend-Web (Node.js/Express)**
   - User authentication
   - Product management
   - Company management
   - Order processing

3. **Backend-AI (FastAPI)**
   - RAG Chatbot service
   - Recommendation engine
   - Virtual try-on service

### Data Flow

```
Frontend → Backend-Web → Database
Frontend → Backend-Web → Backend-AI
```

### Technology Stack

- **Frontend**: React, Redux, TailwindCSS
- **Backend-Web**: Node.js, Express, PostgreSQL/MongoDB
- **Backend-AI**: FastAPI, PyTorch, Transformers, ChromaDB
- **Infrastructure**: Docker, Docker Compose

### API Endpoints

#### Backend-Web
- `/api/auth` - Authentication
- `/api/products` - Product management
- `/api/companies` - Company management
- `/api/orders` - Order processing

#### Backend-AI
- `/chatbot` - RAG chatbot responses
- `/recommend` - Product recommendations
- `/tryon` - Virtual try-on generation
