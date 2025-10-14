# AI Agent Instructions for the Clothing Store App

This document provides essential guidance for AI agents working on this codebase. Understanding these concepts is critical for making effective contributions.

## 1. High-Level Architecture: 3-Service Microservices

The application consists of three separate services. Changes in one service often require corresponding changes in another.

1.  **`frontend/` (Next.js, TypeScript, TailwindCSS)**: The customer-facing and admin UI. It's a modern web app using the Next.js App Router.
    -   **Key Dir:** `frontend/app/` for routes, `frontend/components/` for UI components.
    -   **State Management:** Global state is managed via React Context (`lib/auth-context.tsx`, `lib/cart-context.tsx`).

2.  **`backend-web/` (Node.js, Express)**: The main backend handling business logic, user authentication, product management, and orders.
    -   **Key Dir:** `backend-web/models/` for database schemas, `backend-web/routes/` for API endpoints, and `backend-web/controllers/` for business logic.

3.  **`cloth-store-app-tryon/` (Python, FastAPI)**: An AI microservice dedicated to the virtual try-on feature.
    -   **Important:** This service **does not** run the AI model directly. It acts as a proxy, forwarding requests to a Google Colab notebook where the `OOTDiffusion` model runs. This is a critical architectural pattern to understand.

**Communication Flow:**
`frontend` <--> `backend-web` <--> `cloth-store-app-tryon` --> `Google Colab (via ngrok)`

## 2. Critical Developer Workflows

### Running the Full Application

The easiest way to run the entire stack is with Docker:
```bash
docker-compose up --build
```

### Running Services Individually

Each service can be run independently from its directory:
-   **Frontend:** `cd frontend && pnpm install && pnpm dev`
-   **Backend-Web:** `cd backend-web && npm install && npm run dev`
-   **AI Try-On Service:** `cd cloth-store-app-tryon && pip install -r requirements.txt && uvicorn app.main:app --reload`

### The Virtual Try-On Workflow (Crucial & Non-Obvious)

To work on the virtual try-on feature, you **must** set up the external Colab environment. The local FastAPI service will not work without it.

1.  **Open and Run the Colab Notebook:** The setup is detailed in `cloth-store-app-tryon/README.md`. You need to run the notebook to start the AI model and expose it via an `ngrok` tunnel.
2.  **Get the `ngrok` URL:** The Colab notebook will output a public `ngrok` URL.
3.  **Configure the AI Service:** Create a `.env` file in `cloth-store-app-tryon/` and set the `COLAB_API_URL` to the `ngrok` URL from the previous step.

```env
# In cloth-store-app-tryon/.env
COLAB_API_URL="https://your-ngrok-url.ngrok-free.dev"
```

Without this, the `colab_client.py` service will fail to connect.

## 3. Code Conventions & Patterns

### Frontend (Next.js)

-   **UI Components:** The project uses `shadcn/ui`. When adding new UI, prefer composing existing components from `frontend/components/ui/`.
-   **Authentication & Authorization:** Client-side route guards are used to protect routes. See `components/admin/admin-route-guard.tsx` for an example of role-based protection. The core logic is in `lib/auth-context.tsx`.
-   **Styling:** Use TailwindCSS utility classes directly in your components. Global styles are in `frontend/app/globals.css`.

### Backend (Node.js)

-   **API Structure:** The API follows a standard MVC-like pattern: `routes` define the endpoints, `controllers` handle the request/response logic, and `models` define the data structures.
-   **Cross-Service Communication:** When `backend-web` needs an AI function, it makes an HTTP request to the `cloth-store-app-tryon` service. The base URL for this is configured via the `AI_SERVICE_URL` environment variable.

### AI Service (FastAPI)

-   **Proxy Logic:** The main purpose of this service is to receive file uploads from `backend-web` and forward them to the Colab API. The core logic is in `app/services/colab_client.py`.
-   **Configuration:** Settings are managed via `pydantic-settings` in `app/core/config.py` and loaded from a `.env` file.
