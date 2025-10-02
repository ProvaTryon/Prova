# Fashion Platform

A multi-brand clothing website where companies can showcase their products and customers can explore, interact, and shop with enhanced AI-powered features.  
The platform integrates a recommendation system, a chatbot for customer support, and a virtual try-on model for a more personalized shopping experience.

---

## Features

- **Multi-brand support** – Companies can list and manage their stocks.
- **Recommendation system** – Personalized suggestions based on user behavior.
- **Chatbot** – AI-powered assistant for customer queries.
- **Virtual try-on** – Try clothes online using a virtual try-on model (HR-VITON).
- **User management** – Accounts, authentication, and profiles.
- **E-commerce flow** – Browsing, product details, and order management.

---

## Architecture

The project uses a microservices architecture:

1. **Frontend (React)** – User interface
2. **Backend-Web (Node.js)** – Core business logic and APIs  
3. **AI-Backend (FastAPI)** – Virtual try-on and AI services (separate repository)

```
fashion-platform/
│
├── frontend/           # React application
├── backend-web/        # Node.js backend
├── ai-backend/         # Git submodule → cloth-store-app-tryone
├── docs/              # Documentation
└── docker-compose.yml
```

### Setup with Submodule

```bash
git clone --recursive https://github.com/YousefAyman125/clothing-store-app.git
cd fashion-platform

# If already cloned, initialize submodules
git submodule update --init --recursive
```

---

## Tech Stack

- **Frontend**: React, Redux, TailwindCSS
- **Backend-Web**: Node.js, Express, PostgreSQL (or MongoDB)
- **Backend-AI**: FastAPI, PyTorch, Scikit-learn, NLP libraries
- **Infrastructure**: Docker, docker-compose

---

## API Communication

- **Frontend → Backend-Web (Node.js)**

  - Authentication
  - Product browsing & orders
  - Company management

- **Backend-Web → Backend-AI (FastAPI)**
  - `/chatbot` → AI chatbot response
  - `/recommend` → Get product recommendations
  - `/tryon` → Generate virtual try-on output

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YousefAyman125/clothing-store-app.git
cd fashion-platform
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Setup Backend-Web (Node.js)

```bash
cd backend-web
npm install
npm run dev
```

### 4. Setup Backend-AI (FastAPI)

```bash
cd backend-ai
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 5. Run with Docker (optional)

```bash
docker-compose up --build
```

---

## Prerequisites
- Node.js 18+ 
- Python 3.9+
- Docker & Docker Compose

## Environment Variables
```bash
# Backend-Web
DATABASE_URL=postgresql://user:password@localhost:5432/fashion_db
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000

# Backend-AI  
MODEL_PATH=/app/models
HUGGINGFACE_TOKEN=your_token
```

## API Documentation
- Backend-Web: http://localhost:5000/api-docs
- Backend-AI: http://localhost:8000/docs

## Testing
```bash
make test                    # Run all tests
make backend-test           # Backend tests only
make frontend-test          # Frontend tests only
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
MIT License - see [LICENSE](LICENSE) file.
