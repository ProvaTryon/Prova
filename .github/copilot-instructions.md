# AI Agent Instructions for the Clothing Store App

This document provides essential guidance for AI agents working on this codebase. Understanding these concepts is critical for making effective contributions.

## 0. Professional Workflow Principles

When working on any task in this project, follow this systematic approach:

### Phase 1: Analysis & Planning
1. **Understand the Request**: Clarify the user's goal and identify all affected areas
2. **Analyze Scope**: Use semantic search and grep to understand the current state
3. **Identify Dependencies**: Find related files, components, and patterns already in use
4. **Create Design Plan**: Present a clear, structured plan with:
   - All files that need changes
   - Estimated complexity and time
   - Multiple approach options when applicable
   - Potential conflicts or issues

### Phase 2: Verification & Alignment
1. **Present Options**: Offer choices (e.g., Option A: comprehensive, Option B: minimal, Option C: custom)
2. **Get User Confirmation**: Wait for user to select approach before proceeding
3. **Set Expectations**: Be clear about what will be done and what won't

### Phase 3: Systematic Implementation
1. **Break Down Work**: Divide large tasks into logical, trackable phases
2. **Incremental Progress**: Complete one section at a time, test, then move forward
3. **Use Todo Lists**: Maintain visible progress tracking with `manage_todo_list`
4. **Commit Frequently**: Make atomic commits with descriptive messages after each completed unit
5. **Quality Checks**: Run error checks and validation after each change

### Phase 4: Quality Assurance
1. **Test for Errors**: Use `get_errors` to verify no compilation/lint issues
2. **Cross-Reference**: Ensure consistency with existing patterns and conventions
3. **Document Changes**: Update relevant docs if architecture or patterns change
4. **Final Verification**: Check that all original requirements are met

### Phase 5: Completion & Documentation
1. **Comprehensive Report**: Summarize what was done, files changed, metrics
2. **Handoff Information**: Provide clear next steps or testing instructions
3. **Update Project Context**: Note any new patterns or conventions established

### Key Principles
- **Don't Assume**: Always gather context first, never guess at implementations
- **Think Systematically**: Large changes need planning, small changes need context
- **Be Transparent**: Show your reasoning, present trade-offs, explain decisions
- **Track Progress**: Make work visible through todos, commits, and status updates
- **Maintain Quality**: Follow existing patterns, add improvements where logical
- **Verify Everything**: Check for errors, conflicts, and regressions after changes

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

### Internationalization (i18n)

-   **Translation System:** The app uses `next-intl` for full English/Arabic bilingual support
-   **File Structure:** Translation files are in `frontend/messages/en.json` and `frontend/messages/ar.json` with hierarchical namespaces
-   **Usage Pattern:** Components use `const t = useTranslations('namespace')` then call `t('key')` for translations
-   **Namespaces:** Organized by feature/page (e.g., `nav`, `footer`, `admin`, `shop`, `virtualTryOn`, etc.)
-   **RTL Support:** Arabic uses RTL layout automatically; use `no-flip` class for elements that shouldn't reverse (brand names, numbers, prices)
-   **Adding Translations:**
    1. Add keys to both `en.json` and `ar.json` in the same namespace
    2. Import `useTranslations` in your component
    3. Replace hardcoded strings with `t('key')` calls
    4. Test in both `/en` and `/ar` routes
-   **Translation Coverage:** Currently at 820 keys (410 per language) with 100% page coverage
