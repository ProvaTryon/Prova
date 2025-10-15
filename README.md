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

The project uses a **3-service microservices architecture**:

1. **Frontend (Next.js + TypeScript)** – Customer-facing UI and admin dashboards
2. **Backend-Web (Node.js + Express)** – Core business logic, authentication, and APIs  
3. **AI Service (FastAPI)** – Virtual try-on proxy to Google Colab (GPU-powered)

```
clothing-store-app/
│
├── frontend/                  # Next.js application (TypeScript)
├── backend-web/               # Node.js Express backend
├── cloth-store-app-tryon/     # FastAPI AI service (Colab proxy)
├── docs/                      # Documentation
└── docker-compose.yml
```

**Important**: The AI service is a lightweight proxy that forwards virtual try-on requests to a Google Colab notebook running the OOTDiffusion model. See `cloth-store-app-tryon/README.md` for Colab setup instructions.

---

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui, next-intl (i18n)
- **State Management**: React Context API (Auth, Cart, Wishlist)
- **Backend-Web**: Node.js, Express, MongoDB (Mongoose models defined)
- **AI Service**: FastAPI, httpx (proxy to Google Colab OOTDiffusion)
- **Infrastructure**: Docker, docker-compose, Makefile (cross-platform)

---

## API Communication

- **Frontend → Backend-Web**
  - Authentication (currently mock - see `lib/auth-context.tsx`)
  - Product browsing (currently mock - see `lib/mock-data.ts`)
  - Order management (API routes defined but not implemented)
  - User profile management

- **Backend-Web → AI Service (FastAPI) → Google Colab**
  - `/api/tryon/process` → Virtual try-on (proxies to Colab via ngrok)
  - `/api/health/colab` → Check Colab connection status
  
**Note**: Backend API routes exist in `backend-web/routes/` but are currently commented out in `index.js`. Frontend uses mock data during development.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YousefAyman125/clothing-store-app.git
cd fashion-platform
```

### 2. Setup Frontend (Next.js)

**Important**: Frontend uses `pnpm` (not npm)

```bash
cd frontend
pnpm install
pnpm dev
```

Access at: http://localhost:3000

### 3. Setup Backend-Web (Node.js)

**Important**: Backend uses `npm` (not pnpm)

```bash
cd backend-web
npm install
npm run dev
```

API available at: http://localhost:5000
Swagger docs at: http://localhost:5000/api-docs

### 4. Setup AI Service (FastAPI)

**Important**: Requires Google Colab setup first!

```bash
cd cloth-store-app-tryon
pip install -r requirements.txt

# Create .env file and set COLAB_API_URL (see cloth-store-app-tryon/README.md)
# Then start the service:
uvicorn app.main:app --reload
```

See `cloth-store-app-tryon/README.md` for detailed Colab setup instructions.

### 5. Run with Docker (optional)

```bash
docker-compose up --build
```

---

## Prerequisites
- Node.js 18+ 
- pnpm (for frontend) - install with `npm install -g pnpm`
- Python 3.9+
- Docker & Docker Compose (optional)
- Google Colab account (for virtual try-on feature)

## Environment Variables

### Backend-Web (.env)
```bash
PORT=5000
AI_SERVICE_URL=http://localhost:8000
DATABASE_URL=mongodb://localhost:27017/fashion_db  # Or PostgreSQL
JWT_SECRET=your_jwt_secret
```

### AI Service (cloth-store-app-tryon/.env)
```bash
COLAB_API_URL=https://your-ngrok-url.ngrok-free.dev  # REQUIRED!
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

**Critical**: The `COLAB_API_URL` must be set to your ngrok tunnel URL from Google Colab. Without this, virtual try-on will not work. See `cloth-store-app-tryon/README.md` for setup.

## API Documentation
- Backend-Web: http://localhost:5000/api-docs (Swagger UI)
- AI Service: http://localhost:8000/docs (FastAPI automatic docs)
- Full API Contract: See `docs/api-contract.md`

## Development Features

- ✅ **Bilingual Support**: Full English/Arabic i18n with RTL layout
- ✅ **Dark Mode**: Light/dark theme with instant switching
- ✅ **Role-Based Access**: Admin, Store Owner, Customer Service dashboards
- ✅ **Mock Authentication**: Test with `admin@prova.com/admin123`, `store@prova.com/store123`, `cs@prova.com/cs123`
- ✅ **61 UI Components**: Pre-built shadcn/ui component library
- ✅ **Virtual Try-On**: AI-powered clothing visualization (requires Colab)

## Testing
```bash
make backend-test           # Backend tests (when implemented)
make frontend-test          # Frontend tests (when implemented)
```

**Note**: Test infrastructure not yet implemented. See `docs/roadmap.md` for planned testing strategy.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
MIT License - see [LICENSE](LICENSE) file.
