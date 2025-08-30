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

The project is structured into three main services:

1. **Frontend (React)** – User interface for browsing, shopping, and interacting with AI features.
2. **Backend-Web (Node.js)** – Handles user accounts, products, companies, and general API services.
3. **Backend-AI (FastAPI)** – Hosts AI services including chatbot, recommendation, and try-on models.

```
fashion-platform/
│
├── frontend/ # React application
├── backend-web/ # Node.js backend (website logic)
├── backend-ai/ # FastAPI backend (AI services)
├── models/ # Machine learning models
├── data/ # Datasets and uploaded assets
├── docs/ # Documentation
├── docker-compose.yml
└── README.md
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
