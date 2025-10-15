# AI Agent Instructions for the Clothing Store App

This document provides essential guidance for AI agents working on this codebase. Understanding these concepts is critical for making effective contributions.

## ⚠️ CRITICAL: Agent Mode Rules

**These rules are MANDATORY when operating in autonomous agent mode. Violations will result in wasted time, broken code, or security issues.**

### Rule 1: NEVER Assume - Always Verify
- ❌ **NEVER** guess at file contents, API signatures, or implementation details
- ✅ **ALWAYS** use `read_file`, `semantic_search`, or `grep_search` to verify before making changes
- ✅ **ALWAYS** check if a file/component/function exists before referencing it
- ✅ **ALWAYS** read the full function/component before modifying it

**Example:**
```
❌ BAD: "I'll update the login function" → proceeds without reading it
✅ GOOD: Uses read_file to check auth-context.tsx → sees mock auth → updates accordingly
```

### Rule 2: Test Before Declaring Success
- ❌ **NEVER** say "done" or "complete" without verification
- ✅ **ALWAYS** run `get_errors` after file modifications
- ✅ **ALWAYS** check both `/en` and `/ar` routes for i18n changes
- ✅ **ALWAYS** test in light AND dark mode for UI changes
- ✅ **ALWAYS** verify mobile responsiveness for layout changes

**Verification Checklist:**
```typescript
✅ TypeScript compilation errors checked
✅ Both locales tested (if i18n affected)
✅ Dark mode verified (if UI affected)
✅ Mobile view tested (if layout affected)
✅ Console errors checked in browser
```

### Rule 3: Maintain Consistency - Follow Existing Patterns
- ❌ **NEVER** introduce new patterns when existing ones work
- ❌ **NEVER** mix styling approaches (e.g., inline styles + Tailwind)
- ✅ **ALWAYS** use existing components from `components/ui/` before creating new ones
- ✅ **ALWAYS** follow the translation namespace structure
- ✅ **ALWAYS** use the same state management approach (React Context, not Redux)
- ✅ **ALWAYS** match the existing authentication pattern (mock for now)

**Pattern Enforcement:**
```tsx
❌ BAD: Creating custom modal when Dialog component exists
❌ BAD: Adding a new state library when Context API is standard
✅ GOOD: Using shadcn/ui Dialog component
✅ GOOD: Following existing auth-context pattern
```

### Rule 4: Document As You Go
- ❌ **NEVER** make architectural changes without updating docs
- ✅ **ALWAYS** update `docs/features/` when completing features
- ✅ **ALWAYS** update this file when introducing new patterns
- ✅ **ALWAYS** add JSDoc comments for complex functions
- ✅ **ALWAYS** update API documentation when adding endpoints

### Rule 5: Safe File Operations
- ❌ **NEVER** delete files without explicit user confirmation
- ❌ **NEVER** overwrite files without reading them first
- ❌ **NEVER** modify configuration files without understanding impact
- ✅ **ALWAYS** create backups for risky operations (suggest git commit first)
- ✅ **ALWAYS** use `replace_string_in_file` with sufficient context (3-5 lines)

### Rule 6: Security First
- ❌ **NEVER** commit API keys, tokens, or secrets
- ❌ **NEVER** disable security features without explicit approval
- ❌ **NEVER** expose sensitive user data in logs or error messages
- ✅ **ALWAYS** validate user inputs
- ✅ **ALWAYS** use parameterized queries (when DB is connected)
- ✅ **ALWAYS** follow principle of least privilege

### Rule 7: Error Handling is Mandatory
- ❌ **NEVER** leave try-catch blocks empty
- ❌ **NEVER** suppress errors without logging
- ✅ **ALWAYS** provide meaningful error messages
- ✅ **ALWAYS** handle edge cases (null, undefined, empty arrays)
- ✅ **ALWAYS** fail gracefully with user-friendly messages

**Error Handling Pattern:**
```tsx
❌ BAD:
try { await api.call() } catch {}

✅ GOOD:
try {
  await api.call()
} catch (error) {
  console.error('API call failed:', error)
  toast.error(t('errors.apiCallFailed'))
  return null
}
```

### Rule 8: Performance Awareness
- ❌ **NEVER** create infinite loops or recursive calls without bounds
- ❌ **NEVER** load all data at once without pagination
- ✅ **ALWAYS** use proper React keys in lists
- ✅ **ALWAYS** memoize expensive computations
- ✅ **ALWAYS** lazy load heavy components

### Rule 9: Accessibility is Non-Negotiable
- ❌ **NEVER** create UI without keyboard navigation
- ❌ **NEVER** use color as the only indicator
- ✅ **ALWAYS** add ARIA labels to interactive elements
- ✅ **ALWAYS** ensure proper heading hierarchy
- ✅ **ALWAYS** test with screen readers in mind
- ✅ **ALWAYS** maintain focus management in modals

### Rule 10: Communication & Transparency
- ❌ **NEVER** make silent changes without explanation
- ❌ **NEVER** skip steps in the workflow phases
- ✅ **ALWAYS** explain your reasoning for technical decisions
- ✅ **ALWAYS** present trade-offs when multiple approaches exist
- ✅ **ALWAYS** ask for clarification when requirements are ambiguous
- ✅ **ALWAYS** provide a summary of changes with file counts and metrics

### Rule 11: Code Quality Standards
- ❌ **NEVER** commit code with console.log statements (except intentional logging)
- ❌ **NEVER** leave commented-out code blocks
- ❌ **NEVER** use magic numbers without constants
- ✅ **ALWAYS** use TypeScript types/interfaces properly
- ✅ **ALWAYS** follow DRY principle (Don't Repeat Yourself)
- ✅ **ALWAYS** write self-documenting code with clear variable names

**Code Quality Example:**
```tsx
❌ BAD:
const x = products.filter(p => p.price < 100)
console.log(x)

✅ GOOD:
const PRICE_THRESHOLD = 100
const affordableProducts = products.filter(
  product => product.price < PRICE_THRESHOLD
)
```

### Rule 12: Respect Project Constraints
- ❌ **NEVER** use `npm` in frontend (use `pnpm` only)
- ❌ **NEVER** use `pnpm` in backend (use `npm` only)
- ❌ **NEVER** bypass the i18n system with hardcoded strings
- ❌ **NEVER** ignore the RTL requirement for Arabic
- ✅ **ALWAYS** check package manager before running install commands
- ✅ **ALWAYS** add translations to BOTH `en.json` and `ar.json`

### Agent Mode Workflow Summary

```
1. 📋 READ & UNDERSTAND
   → Use semantic_search, grep_search, read_file
   → Verify current implementation
   → Check for existing patterns

2. 🎯 PLAN & PRESENT
   → Create detailed plan with file list
   → Present options with trade-offs
   → Get user confirmation

3. 🔨 IMPLEMENT INCREMENTALLY
   → Make small, testable changes
   → Use manage_todo_list for tracking
   → Commit at logical milestones

4. ✅ VERIFY & VALIDATE
   → Run get_errors after each change
   → Test in multiple scenarios
   → Check accessibility and i18n

5. 📝 DOCUMENT & REPORT
   → Update feature docs
   → Update this file if patterns changed
   → Provide comprehensive summary
```

### Failure Recovery Protocol

**If something breaks:**
1. ✅ Immediately stop and assess the damage
2. ✅ Use `get_errors` to identify the issue
3. ✅ Read the affected files completely
4. ✅ Explain what went wrong and why
5. ✅ Present fix options before proceeding
6. ✅ Suggest git revert if fix is complex

**If requirements are unclear:**
1. ✅ List what you understand
2. ✅ List what's ambiguous
3. ✅ Ask specific questions
4. ✅ Suggest alternatives
5. ✅ Wait for clarification (don't guess)

---

## Table of Contents
1. [Professional Workflow Principles](#0-professional-workflow-principles)
2. [Feature Documentation Management](#01-feature-documentation-management)
3. [Project Structure](#02-project-structure)
4. [Architecture Overview](#1-high-level-architecture-3-service-microservices)
5. [Developer Workflows](#2-critical-developer-workflows)
6. [Code Conventions & Patterns](#3-code-conventions--patterns)
7. [Environment & Configuration](#4-environment--configuration)

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
4. **Smart Commits**: Follow strategic commit timing (see commit strategy below)
5. **Quality Checks**: Run error checks and validation after each change

### Commit Strategy

**Goal**: Balance progress visibility with avoiding excessive commits

**When to Commit:**

1. **After Completing a Logical Unit**:
   - Completed a full feature module (not individual functions)
   - Finished a complete page or component with all its translations
   - Completed configuration setup that makes a feature functional
   
2. **At Natural Breakpoints**:
   - For work with **many phases** (5+ phases): Commit after each phase completion
   - For work with **12+ small parts**: Commit at 50% completion, then at 100%
   - For work with **3-4 medium phases**: Commit at 50% and 100%
   
3. **After Significant Milestones**:
   - All tests passing after major changes
   - Feature fully functional and tested
   - Documentation consolidated and updated
   - Breaking points where code is stable and revertable

**When NOT to Commit:**
- After every small file edit (unless it's the only change for that task)
- In the middle of a multi-file refactor before testing
- After adding individual translation keys (wait for batch completion)
- During exploratory changes that might be reverted

**Examples:**
- ✅ **Good**: "feat: Complete virtual-tryon page translation (34 keys, 12 sections)"
- ✅ **Good**: "feat: Add admin dashboard with 5 sub-pages (Part 1/2)"
- ❌ **Too Early**: "feat: Add title translation to virtual-tryon page"
- ❌ **Too Late**: "feat: Complete entire i18n implementation" (if work took 20+ hours)

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
- **Update Instructions**: When completing major features or changing project structure, update this copilot-instructions.md file to reflect new patterns, conventions, or architectural decisions

## 0.1. Feature Documentation Management

### When a Feature is Complete

After completing any significant feature or major functionality:

1. **Create Feature Summary Document**
   - Location: `docs/features/[feature-name].md`
   - Structure:
     ```markdown
     # Feature: [Feature Name]
     
     ## Overview
     Brief description of what the feature does
     
     ## Implementation Details
     - Files modified/created
     - Key components and their responsibilities
     - Integration points with other features
     
     ## Configuration
     - Environment variables
     - Configuration files
     - Setup requirements
     
     ## Usage
     - How to use the feature
     - API endpoints (if applicable)
     - UI components (if applicable)
     
     ## Technical Decisions
     - Architecture choices
     - Libraries/frameworks used
     - Trade-offs made
     
     ## Testing
     - How to test
     - Test coverage
     
     ## Future Enhancements
     - Planned improvements
     - Known limitations
     ```

2. **Consolidate Documentation**
   - Move all scattered notes, TODOs, and temporary docs into the feature summary
   - **DELETE all temporary/phase documentation files** (plans, progress reports, completion reports)
   - Keep only: `api-contract.md`, `architecture.md`, `roadmap.md`, and `features/` directory
   - Update this copilot-instructions.md if the feature introduces new patterns

3. **Update Feature Registry**
   - Add entry to `docs/features/README.md` with:
     - Feature name
     - Completion date
     - Key files affected
     - Related features

4. **Update copilot-instructions.md**
   - Add new patterns or conventions to Section 3 (Code Conventions)
   - Update project structure (Section 0.2) if routes/components added
   - Document architectural changes in relevant sections

### When Editing Existing Features

- **Always check** `docs/features/` for existing feature documentation
- **Update the feature summary** when making changes, don't create new docs
- **Keep the summary as single source of truth** for that feature
- If the feature pattern changes significantly, update this copilot-instructions.md

### Documentation Hygiene

- **Delete temporary docs** after consolidation
- **Avoid duplicate documentation** across multiple files
- **Use feature summaries** as the primary reference for completed work
- **Link to feature docs** from code comments when explaining complex logic

## 0.2. Project Structure

### Frontend Architecture (`frontend/`)

```
frontend/
├── app/[locale]/              # Next.js App Router with i18n
│   ├── page.tsx               # Homepage
│   ├── layout.tsx             # Root layout with locale
│   ├── admin/                 # Admin dashboard (role: admin)
│   │   ├── page.tsx           # Admin overview
│   │   ├── layout.tsx         # Admin layout with sidebar
│   │   ├── orders/            # Order management
│   │   ├── products/          # Product management
│   │   ├── settings/          # Admin settings
│   │   ├── stores/            # Store management
│   │   └── users/             # User management
│   ├── cart/                  # Shopping cart
│   ├── customer-service/      # CS dashboard (role: customer-service)
│   │   ├── page.tsx           # CS overview
│   │   ├── layout.tsx         # CS layout with sidebar
│   │   ├── analytics/         # CS analytics
│   │   ├── conversations/     # Customer conversations
│   │   └── settings/          # CS settings
│   ├── dashboard/             # User dashboard
│   ├── login/                 # Authentication
│   ├── signup/                # Registration
│   ├── product/[id]/          # Product detail page
│   ├── profile/               # User profile
│   ├── recommendations/       # Personalized recommendations
│   ├── shop/                  # Product catalog
│   ├── store-owner/           # Store owner dashboard (role: store-owner)
│   │   ├── page.tsx           # Store overview
│   │   ├── layout.tsx         # Store layout with sidebar
│   │   ├── analytics/         # Store analytics
│   │   ├── products/          # Store product management
│   │   └── settings/          # Store settings
│   ├── virtual-tryon/         # AI virtual try-on feature
│   └── wishlist/              # User wishlist
├── components/                # React components
│   ├── ui/                    # shadcn/ui base components
│   ├── layout/                # Layout components (Navbar, Footer)
│   ├── admin/                 # Admin-specific components
│   ├── customer-service/      # CS-specific components
│   ├── store-owner/           # Store owner components
│   ├── product/               # Product components
│   ├── shop/                  # Shop components
│   └── chatbot/               # Chatbot components
├── lib/                       # Utilities and contexts
│   ├── auth-context.tsx       # Authentication context
│   ├── cart-context.tsx       # Shopping cart context
│   ├── wishlist-context.tsx   # Wishlist context
│   ├── mock-data.ts           # Mock data for development
│   └── utils.ts               # Utility functions
├── messages/                  # i18n translations
│   ├── en.json                # English translations (410 keys)
│   └── ar.json                # Arabic translations (410 keys)
├── public/                    # Static assets
└── styles/                    # Global styles

Key Routes:
- `/[locale]` - Homepage (public)
- `/[locale]/shop` - Product catalog (public)
- `/[locale]/product/[id]` - Product details (public)
- `/[locale]/virtual-tryon` - AI try-on (public)
- `/[locale]/recommendations` - Personalized recommendations (public)
- `/[locale]/cart` - Shopping cart (public)
- `/[locale]/wishlist` - Wishlist (authenticated)
- `/[locale]/profile` - User profile (authenticated)
- `/[locale]/admin/*` - Admin dashboard (admin role)
- `/[locale]/store-owner/*` - Store owner dashboard (store-owner role)
- `/[locale]/customer-service/*` - CS dashboard (customer-service role)
```

### Backend Architecture (`backend-web/`)

```
backend-web/
├── index.js                   # Express server entry point
├── models/                    # MongoDB schemas
│   ├── User.js                # User model (with roles)
│   ├── Product.js             # Product model
│   ├── Order.js               # Order model
│   ├── Review.js              # Review model
│   ├── Admin.js               # Admin-specific data
│   ├── Merchant.js            # Store owner/merchant
│   ├── Branch.js              # Physical store branches
│   ├── BodyMeasurements.js    # User measurements for sizing
│   └── CustomerService.js     # CS tickets and conversations
├── routes/                    # API route definitions
├── controllers/               # Business logic
├── middleware/                # Express middleware (auth, validation)
├── utils/                     # Backend utilities
└── uploads/                   # File upload directory

API Structure:
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product CRUD
- `/api/orders/*` - Order management
- `/api/users/*` - User management
- `/api/reviews/*` - Product reviews
- `/api/tryon/*` - Proxy to AI service
```

### AI Service Architecture (`cloth-store-app-tryon/`)

```
cloth-store-app-tryon/
├── main.py                    # FastAPI entry point (deprecated, use app/)
├── app/
│   ├── __init__.py
│   ├── main.py                # FastAPI application
│   ├── core/                  # Core configurations
│   │   ├── config.py          # Pydantic settings
│   │   └── logging_config.py  # Logging setup
│   ├── routers/               # API endpoints
│   │   ├── health.py          # Health check
│   │   └── tryon.py           # Try-on endpoints
│   └── services/              # Business logic
│       └── colab_client.py    # Proxy to Google Colab
├── examples/                  # Example images for testing
└── images/                    # Test images

API Endpoints:
- `/health` - Health check
- `/tryon` - Virtual try-on (proxies to Colab)
```

### Documentation Structure (`docs/`)

```
docs/
├── features/                  # Feature documentation (consolidated)
│   ├── README.md              # Feature registry/index
│   └── [feature-name].md      # Individual feature docs
├── api-contract.md            # API documentation
├── architecture.md            # System architecture
└── roadmap.md                 # Future plans
```

### Configuration Files (Root)

```
├── docker-compose.yml         # Docker orchestration
├── Makefile                   # Build scripts
├── requirements.txt           # Python dependencies (AI service)
└── README.md                  # Project overview
```

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

#### UI Component Library (shadcn/ui)

**Available Components:** 61 pre-built components in `components/ui/` including:
- Layout: `card`, `sheet`, `dialog`, `drawer`, `tabs`, `accordion`, `sidebar`
- Forms: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `form`
- Feedback: `alert`, `toast`, `spinner`, `skeleton`, `progress`
- Navigation: `navigation-menu`, `menubar`, `breadcrumb`, `pagination`
- Data Display: `table`, `badge`, `avatar`, `tooltip`, `hover-card`
- Advanced: `command`, `calendar`, `chart`, `carousel`, `resizable`

**Usage Pattern:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>{t('title')}</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">Click Me</Button>
  </CardContent>
</Card>
```

**Component Composition:** Always compose from existing UI components rather than creating custom styled divs. Example from `ProductCard`:
```tsx
// ✅ Good - Uses shadcn components
<Card className="group">
  <CardContent className="p-0">
    <Image src={product.image} alt={product.name} />
  </CardContent>
</Card>

// ❌ Avoid - Custom styled divs
<div className="border rounded-lg p-4 shadow">
  <img src={product.image} alt={product.name} />
</div>
```

#### Authentication & Authorization

**Authentication Context Pattern:**
```tsx
// In any component
import { useAuth } from "@/lib/auth-context"

const { user, isAuthenticated, isAdmin, isStoreOwner, login, logout } = useAuth()

// Role-based rendering
{isAdmin && <AdminControls />}
{isStoreOwner && <StoreManagement />}
```

**Route Protection:** Use `RoleRouteGuard` wrapper in layouts:
```tsx
// Example: frontend/app/[locale]/admin/layout.tsx
import { RoleRouteGuard } from "@/components/admin/role-route-guard"

export default function AdminLayout({ children }) {
  return (
    <RoleRouteGuard allowedRoles={["admin"]}>
      {children}
    </RoleRouteGuard>
  )
}
```

**Mock Authentication (Development):**
- All authentication is currently mocked in `auth-context.tsx`
- No real API calls - simulated 1s delay with `setTimeout`
- Test credentials are checked in the `login` function
- Real implementation TODO: Replace with backend API calls

#### Styling Conventions

**TailwindCSS Patterns:**
```tsx
// Semantic colors (theme-aware)
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"
className="bg-destructive text-destructive-foreground"

// Transitions (100ms standard)
className="transition-colors duration-100"
className="hover:bg-muted transition-colors"

// RTL-safe (use no-flip for brand names, prices)
className="no-flip"  // Prevents RTL reversal

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

**Global Styles:** Defined in `frontend/app/globals.css`
- CSS variables for theming (e.g., `--background`, `--primary`)
- Base resets and typography
- Dark mode handled automatically via CSS variables

### Backend (Node.js/Express)

#### API Structure & Current State

**Current Implementation:** Minimal skeleton with Swagger docs
- `backend-web/index.js` - Express server with CORS, Helmet, Morgan
- Only endpoint: `GET /health` (health check)
- **All API routes are commented out** - not yet implemented
- Swagger UI available at `http://localhost:5000/api-docs`

**Planned API Structure (from comments in index.js):**
```javascript
// TODO: Implement these routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/companies', require('./routes/companies'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/ai', require('./routes/ai'))
```

**API Documentation:** See `docs/api-contract.md` for full endpoint specifications

#### Database Models (MongoDB/Mongoose)

**All models defined but not yet connected:**

1. **User.js** - Basic user with name, email, password, phone, address
2. **Product.js** - Product with name, description, price, stock, merchant ref, category, images
3. **Order.js** - Order with user ref, products array, total, status, address, payment method
4. **Review.js** - Product reviews (file exists, check schema)
5. **Merchant.js** - Store owner/merchant data
6. **Branch.js** - Physical store branches
7. **Admin.js** - Admin-specific data
8. **CustomerService.js** - CS tickets and conversations
9. **BodyMeasurements.js** - User measurements for AI try-on sizing

**Schema Pattern Example:**
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
  images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
```

#### Cross-Service Communication

**Backend-Web → AI Service:**
```javascript
// Pattern for calling AI service
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// Example: Virtual try-on request
const response = await fetch(`${AI_SERVICE_URL}/api/tryon/process`, {
  method: 'POST',
  body: formData
})
```

**Middleware Stack:**
- `helmet()` - Security headers
- `cors()` - CORS handling (currently allows all origins)
- `morgan('combined')` - HTTP request logging
- `express.json()` - JSON body parser
- `express.urlencoded({ extended: true })` - URL-encoded body parser

**Error Handling:**
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

### AI Service (FastAPI)

#### Architecture & Purpose

**Key Concept:** This service is a **proxy**, not the AI model itself.
- Does NOT run OOTDiffusion locally
- Forwards requests to Google Colab via ngrok tunnel
- Lightweight: only 8 Python dependencies
- Handles image upload/download between backend and Colab

**Service Flow:**
```
Frontend → Backend-Web → FastAPI (Local) → ngrok → Google Colab (GPU) → Results back
```

#### API Endpoints (app/routers/)

**Health Check (health.py):**
```python
GET /api/health/live     # Local FastAPI status
GET /api/health/colab    # Colab connection status
```

**Virtual Try-On (tryon.py):**
```python
POST /api/tryon/process
  - person_image: UploadFile
  - garment_image: UploadFile
  - model_type: str = "dc"  # 'dc' (full body) or 'hd' (half body)
  - category: int = 2        # 0=upperbody, 1=lowerbody, 2=dress
  - scale: float = 2.0       # Guidance scale
  - sample: int = 4          # Number of samples

GET /api/tryon/status       # Check Colab service availability
```

#### Proxy Logic (app/services/colab_client.py)

**Core Pattern:**
```python
class ColabClient:
    def __init__(self, colab_url: str):
        self.colab_url = colab_url
        self.client = httpx.AsyncClient(timeout=300.0)
    
    async def process_tryon(self, person_img, garment_img, ...):
        # 1. Forward files to Colab
        # 2. Wait for processing (can take 30-60 seconds)
        # 3. Return result image
```

**Critical:** Without `COLAB_API_URL` in `.env`, all requests fail immediately

#### Configuration (app/core/config.py)

**Settings Pattern (Pydantic):**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    COLAB_API_URL: str  # REQUIRED!
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    ALLOWED_ORIGINS: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
```

**Logging (app/core/logging_config.py):**
- Structured logging with timestamps
- Color-coded console output
- File logging to `logs/` directory

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

### Theme System (Dark Mode)

-   **Provider:** `ThemeProvider` wraps the app in `frontend/app/layout.tsx` using `next-themes`
-   **Component:** `ThemeToggle` button in navbar provides light/dark/system theme switching
-   **Storage:** Theme preference persists in `localStorage` as `theme` key
-   **Performance:** Fast transitions (100ms) with `transition-colors` utility class
-   **Accessibility:** Proper ARIA labels, keyboard navigation, screen reader support
-   **Adding Theme Support:** Use semantic color variables from `globals.css` (e.g., `bg-background`, `text-foreground`)

### Role-Based Access Control

-   **Authentication Context:** `lib/auth-context.tsx` provides user state and role checks
-   **Available Roles:** `customer`, `admin`, `store_owner`, `customer_service`
-   **Route Guards:** Use `RoleRouteGuard` component to protect role-specific routes
-   **Mock Credentials (dev):**
    - Admin: `admin@prova.com` / `admin123`
    - Store Owner: `store@prova.com` / `store123`
    - Customer Service: `cs@prova.com` / `cs123`
-   **Role Checks:** `isAdmin`, `isStoreOwner`, `isCustomerService`, `isCustomer` helpers
-   **Dashboard Routes:** Each role has dedicated dashboard under `/admin/*`, `/store-owner/*`, `/customer-service/*`

### State Management

-   **Pattern:** React Context API (no Redux or Zustand)
-   **Global Contexts:**
    - `AuthContext` (`lib/auth-context.tsx`) - user authentication and roles
    - `CartContext` (`lib/cart-context.tsx`) - shopping cart state
    - `WishlistContext` (`lib/wishlist-context.tsx`) - user wishlist
-   **Usage:** Import hooks: `useAuth()`, `useCart()`, `useWishlist()`
-   **Persistence:** Cart and wishlist use `localStorage` for client-side persistence

## 4. Environment & Configuration

### Frontend Configuration

**Package Manager:** Use `pnpm` exclusively (not npm/yarn)
```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server (port 3000)
pnpm build      # Production build
```

**Environment Variables:**
- No `.env` file required for basic development (using mock data)
- Backend API URL defaults to `http://localhost:5000`
- AI service URL configured via backend

**Next.js Configuration:**
- `next.config.mjs` uses `next-intl` plugin wrapper
- Build errors ignored (`ignoreBuildErrors: true`) for rapid development
- Images unoptimized for simplicity

### Backend Configuration

**Package Manager:** Use `npm` (not pnpm/yarn)
```bash
npm install     # Install dependencies
npm run dev     # Start dev server (port 5000)
npm start       # Production server
```

**Environment Variables (backend-web/.env):**
```env
PORT=5000
AI_SERVICE_URL=http://localhost:8000
DATABASE_URL=postgresql://user:password@localhost:5432/fashion_db
JWT_SECRET=your_jwt_secret
```

### AI Service Configuration

**Critical Setup:** The AI service requires external Colab setup (see Section 2)

**Environment Variables (cloth-store-app-tryon/.env):**
```env
COLAB_API_URL="https://your-ngrok-url.ngrok-free.dev"  # REQUIRED!
HOST="0.0.0.0"
PORT=8000
DEBUG=True
```

**Dependencies:** Only 8 Python packages (lightweight by design)
```bash
pip install -r requirements.txt
python main.py  # or uvicorn app.main:app --reload
```

### Docker Setup

**Full Stack (easiest for development):**
```bash
docker-compose up --build
```

**Services:**
- Frontend: `http://localhost:3000`
- Backend-Web: `http://localhost:5000`
- AI Service: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

**Note:** AI service in Docker won't work without Colab ngrok URL configured

### Make Commands (Cross-Platform)

The `Makefile` provides OS-agnostic commands:
```bash
make install          # Install all dependencies
make backend-dev      # Start backend dev server
make frontend-dev     # Start frontend dev server
make backend-test     # Run backend tests
```

**Windows Note:** Uses PowerShell for colored output; works without `make` installed

## 5. Data Patterns & Mock Data

### Mock Data Structure (frontend/lib/mock-data.ts)

**Purpose:** All frontend components use mock data for development. No backend API calls yet.

**Data Models:**
```typescript
interface Product {
  id: string
  name: string
  brand: string
  price: number
  salePrice?: number
  category: string  // "women" | "men" | "accessories"
  sizes: string[]   // ["XS", "S", "M", "L", "XL"]
  colors: string[]
  image: string
  images: string[]
  description: string
  inStock: boolean
}

interface Store {
  id: string
  name: string
  logo: string
  description: string
  status: "active" | "pending" | "suspended"
  productsCount: number
  joinDate: string
}

interface CSConversation {
  id: string
  customerName: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  lastMessage: string
  lastUpdate: string
  messages: Message[]
}
```

**Available Mock Data:**
- `mockProducts` - 24 product items across all categories
- `mockStores` - 5 sample stores with different statuses
- `mockUsers` - User data for testing
- `mockOrders` - Order history with multiple statuses
- `mockConversations` - Customer service tickets with message threads

**Usage Pattern:**
```tsx
import { mockProducts, mockStores } from "@/lib/mock-data"

// Filter by category
const womenProducts = mockProducts.filter(p => p.category === "women")

// Find by ID
const product = mockProducts.find(p => p.id === id)

// Search/filter
const results = mockProducts.filter(p => 
  p.name.toLowerCase().includes(query.toLowerCase())
)
```

### State Persistence Patterns

**localStorage Keys:**
- `theme` - User's theme preference (light/dark/system)
- `cart` - Shopping cart items (JSON array)
- `wishlist` - Wishlist product IDs (JSON array)
- Future: `auth-token`, `user-preferences`

**Context Persistence Example (cart-context.tsx):**
```tsx
// Load from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem('cart')
  if (saved) setItems(JSON.parse(saved))
}, [])

// Save to localStorage on change
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(items))
}, [items])
```

## 6. Component Patterns & Best Practices

### Page Structure Pattern

**Standard Page Layout:**
```tsx
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useTranslations } from "next-intl"

export default function MyPage() {
  const t = useTranslations('namespace')
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page content */}
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

### Client vs Server Components

**Client Components ("use client"):**
- Any component using hooks (`useState`, `useEffect`, `useContext`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)
- All pages with interactivity

**Server Components (default):**
- Static content rendering
- Data fetching (when backend is ready)
- Metadata generation
- Currently: mostly product detail pages

### Image Handling

**Next.js Image Component:**
```tsx
import Image from "next/image"

// Responsive images
<Image 
  src={product.image} 
  alt={product.name}
  fill  // For aspect-ratio containers
  className="object-cover"
/>

// Fixed size
<Image 
  src="/logo.png" 
  width={200} 
  height={50}
  alt="Logo"
/>
```

**Current Config:** Images are unoptimized (`unoptimized: true` in `next.config.mjs`)

### Form Patterns

**Standard Form with shadcn/ui:**
```tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const [formData, setFormData] = useState({ name: "", email: "" })

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // Handle form submission
}

<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <Label htmlFor="name">{t('name')}</Label>
    <Input 
      id="name"
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
    />
  </div>
  <Button type="submit">{t('submit')}</Button>
</form>
```

### Modal Patterns

**Dialog Component:**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const [isOpen, setIsOpen] = useState(false)

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{t('title')}</DialogTitle>
    </DialogHeader>
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

**Sheet Component (Side Panel):**
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>{t('title')}</SheetTitle>
    </SheetHeader>
    {/* Panel content */}
  </SheetContent>
</Sheet>
```

## 7. Routing & Navigation

### Next.js App Router with i18n

**Route Structure:**
```
app/[locale]/           # Locale parameter (en|ar)
  page.tsx              # Route: /en or /ar
  layout.tsx            # Shared layout
  shop/
    page.tsx            # Route: /en/shop
  product/[id]/
    page.tsx            # Route: /en/product/123
```

**Link Component (i18n-aware):**
```tsx
import { Link } from "@/i18n/routing"

// Automatically preserves current locale
<Link href="/shop">Shop</Link>       // Goes to /en/shop or /ar/shop
<Link href="/product/123">Product</Link>
```

**Programmatic Navigation:**
```tsx
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

const router = useRouter()
const params = useParams()
const locale = params.locale as string

// Navigate with locale
router.push(`/${locale}/shop`)
```

### Route Guards & Protection

**Layout-Based Protection:**
```tsx
// app/[locale]/admin/layout.tsx
import { RoleRouteGuard } from "@/components/admin/role-route-guard"

export default function AdminLayout({ children }) {
  return (
    <RoleRouteGuard allowedRoles={["admin"]}>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </RoleRouteGuard>
  )
}
```

**Component-Level Protection:**
```tsx
const { isAuthenticated, isAdmin } = useAuth()

if (!isAuthenticated) {
  return <LoginPrompt />
}

if (!isAdmin) {
  return <AccessDenied />
}

return <AdminContent />
```

## 8. Common Tasks & Workflows

### Adding a New Page

1. **Create page file:** `frontend/app/[locale]/my-page/page.tsx`
2. **Add translations:** Add keys to `messages/en.json` and `messages/ar.json`
3. **Import translations:** `const t = useTranslations('myPage')`
4. **Add navigation link:** Update navbar or sidebar
5. **Test both locales:** Visit `/en/my-page` and `/ar/my-page`

### Adding a New Component

1. **Check shadcn/ui first:** See if component exists in `components/ui/`
2. **Create component:** `components/feature/my-component.tsx`
3. **Use TypeScript:** Define props interface
4. **Add i18n:** Use `useTranslations` if displaying text
5. **Follow styling:** Use Tailwind + semantic color variables

### Adding a New Translation Namespace

1. **Define structure in en.json:**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description",
    "actions": {
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}
```

2. **Mirror in ar.json:**
```json
{
  "myFeature": {
    "title": "ميزتي",
    "description": "وصف الميزة",
    "actions": {
      "save": "حفظ",
      "cancel": "إلغاء"
    }
  }
}
```

3. **Use in component:**
```tsx
const t = useTranslations('myFeature')
<h1>{t('title')}</h1>
<p>{t('description')}</p>
<button>{t('actions.save')}</button>
```

### Implementing Backend API Endpoint

**When backend routes are implemented:**

1. **Create route file:** `backend-web/routes/myroute.js`
```javascript
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // Handle GET request
});

module.exports = router;
```

2. **Create controller:** `backend-web/controllers/myController.js`
3. **Uncomment in index.js:** `app.use('/api/myroute', require('./routes/myroute'))`
4. **Update Swagger docs:** Add JSDoc comments for API documentation
5. **Update frontend:** Replace mock data with API calls

### Working with Virtual Try-On

**Prerequisites:**
1. Colab notebook running (see Section 2)
2. ngrok URL in `cloth-store-app-tryon/.env`
3. AI service running on port 8000

**Testing Flow:**
```bash
# 1. Start AI service
cd cloth-store-app-tryon
python main.py

# 2. Test health endpoint
curl http://localhost:8000/api/health/colab

# 3. Test try-on (from frontend or backend)
POST http://localhost:8000/api/tryon/process
  - person_image: file
  - garment_image: file
```

## 9. Troubleshooting Common Issues

### Frontend Issues

**Translation missing:**
- Check both `en.json` and `ar.json` have the key
- Verify namespace name matches `useTranslations('namespace')`
- Check for typos in nested keys (`t('section.subsection.key')`)

**Component not rendering:**
- Check if it needs `"use client"` directive
- Verify all imports are correct
- Check console for React errors

**Styling not working:**
- Ensure Tailwind class names are correct
- Check for dark mode color variables
- Verify `no-flip` class for RTL elements

**Route not accessible:**
- Check route guard permissions
- Verify user role in `useAuth()`
- Check file naming (must be `page.tsx` for routes)

### Backend Issues

**Server won't start:**
- Check port 5000 is not in use
- Verify `npm install` completed successfully
- Check environment variables in `.env`

**API endpoint not found:**
- Check if route is uncommented in `index.js`
- Verify route file exports router correctly
- Check Swagger docs at `/api-docs`

### AI Service Issues

**Colab connection failed:**
- Verify `COLAB_API_URL` is set in `.env`
- Check ngrok tunnel is active in Colab
- Test Colab endpoint directly: `curl https://your-ngrok-url.ngrok-free.dev/health`

**Try-on request timeout:**
- First request takes 30-60 seconds (model loading)
- Subsequent requests faster (~10-15 seconds)
- Check Colab hasn't timed out (12-hour limit)

### Docker Issues

**Services won't start:**
- Run `docker-compose down` then `docker-compose up --build`
- Check port conflicts (3000, 5000, 8000, 5432)
- Verify environment variables are set

**AI service not working in Docker:**
- Remember: Colab ngrok URL still required even in Docker
- Docker networking: Use service names (`backend-web`, not `localhost`)

## 10. Git Workflow & Version Control

### Commit Message Convention

**Format:**
```
<type>: <description>

[optional body]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: Add dark mode toggle component
fix: Resolve RTL layout issues in navbar
docs: Update API contract with new endpoints
refactor: Optimize product card rendering
```

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- `develop` - Integration branch (when implemented)

**Feature Branches:**
- `feature/[feature-name]` - New features
- `fix/[issue-name]` - Bug fixes
- `docs/[doc-name]` - Documentation updates

### Before Committing

**Checklist:**
1. ✅ Run `get_errors` to check for TypeScript/lint errors
2. ✅ Test in both English and Arabic (if UI changes)
3. ✅ Verify dark mode still works (if styling changes)
4. ✅ Check mobile responsiveness (if layout changes)
5. ✅ Update relevant feature documentation
6. ✅ Add/update translations if needed

## 11. Performance & Optimization

### Current Optimizations

**Disabled for Development:**
- Next.js image optimization (`unoptimized: true`)
- TypeScript strict checking (`ignoreBuildErrors: true`)
- ESLint during builds (`ignoreDuringBuilds: true`)

**Active Optimizations:**
- Fast transitions (100ms) for theme switching
- localStorage caching for cart/wishlist
- Lazy loading with Next.js dynamic imports
- Component memoization where appropriate

### Future Optimization Opportunities

**When moving to production:**
1. Enable Next.js image optimization
2. Enable TypeScript strict mode
3. Add build-time ESLint checks
4. Implement API response caching
5. Add CDN for static assets
6. Optimize bundle size with tree shaking

## 12. Security Considerations

### Current Security Setup

**Backend (Express):**
- `helmet()` - Security headers
- `cors()` - CORS policy (currently permissive)
- Input validation (TODO: add validation middleware)
- JWT authentication (TODO: implement)

**Frontend:**
- XSS protection via React's built-in escaping
- CSRF protection (TODO: add tokens)
- Secure localStorage usage
- No sensitive data in client state

### When Implementing Authentication

**Required Steps:**
1. Replace mock auth with real JWT tokens
2. Add HTTP-only cookies for refresh tokens
3. Implement rate limiting on auth endpoints
4. Add password hashing (bcrypt)
5. Validate all user inputs
6. Implement CSRF protection
7. Add security logging

**Security Headers to Add:**
```javascript
// In backend-web/index.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}))
```

## 13. Testing Guidelines

### Current Testing State

**Status:** No test files currently in the project
**TODO:** Add testing infrastructure

### Recommended Testing Setup

**Frontend Testing:**
```bash
# Install dependencies
pnpm add -D @testing-library/react @testing-library/jest-dom jest
```

**Backend Testing:**
```bash
# Install dependencies
npm install --save-dev jest supertest
```

### Testing Patterns to Implement

**Component Tests:**
```tsx
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/product/product-card'

test('renders product name and price', () => {
  const product = mockProducts[0]
  render(<ProductCard product={product} />)
  expect(screen.getByText(product.name)).toBeInTheDocument()
})
```

**API Tests:**
```javascript
// __tests__/api/products.test.js
const request = require('supertest')
const app = require('../index')

test('GET /api/products returns products', async () => {
  const response = await request(app).get('/api/products')
  expect(response.status).toBe(200)
  expect(Array.isArray(response.body)).toBe(true)
})
```

## 14. Deployment Considerations

### Environment-Specific Configurations

**Development:**
- Mock authentication
- Unoptimized images
- Verbose logging
- Hot reload enabled

**Production (Future):**
- Real authentication with JWT
- Optimized images and bundles
- Error logging to external service
- Environment-specific API URLs

### Deployment Checklist

**Frontend (Vercel/Netlify):**
- [ ] Set environment variables
- [ ] Configure build command: `pnpm build`
- [ ] Set output directory: `.next`
- [ ] Configure redirects for i18n

**Backend (Heroku/Railway):**
- [ ] Set environment variables (DATABASE_URL, JWT_SECRET)
- [ ] Configure MongoDB connection
- [ ] Set up CI/CD pipeline
- [ ] Configure logging service

**AI Service (Cloud Run/Lambda):**
- [ ] Note: Colab setup still required (or replace with dedicated GPU)
- [ ] Set COLAB_API_URL in production environment
- [ ] Configure timeout settings (5+ minutes)
- [ ] Set up monitoring for Colab connection

**Database:**
- [ ] Set up MongoDB Atlas or PostgreSQL
- [ ] Configure connection pooling
- [ ] Set up backup strategy
- [ ] Add database indexes

**Windows Note:** Uses PowerShell for colored output; works without `make` installed

---

## 15. Agent Mode Quality Gates & Enforcement

### Mandatory Pre-Commit Checks

**Before ANY code changes, agents MUST verify:**

```typescript
interface PreCommitChecklist {
  // Code Quality
  typescriptErrors: boolean      // ✅ Must be ZERO
  eslintWarnings: boolean        // ✅ Must be addressed or justified
  unusedImports: boolean         // ✅ Must be removed
  consoleStatements: boolean     // ✅ Must be intentional logging only
  
  // Functionality
  bothLocalesTested: boolean     // ✅ /en AND /ar routes work
  darkModeWorks: boolean         // ✅ Light and dark themes functional
  mobileResponsive: boolean      // ✅ Layout works on mobile
  errorHandling: boolean         // ✅ All try-catch blocks handle errors
  
  // Documentation
  translationsAdded: boolean     // ✅ Both en.json and ar.json updated
  featureDocUpdated: boolean     // ✅ docs/features/ updated if needed
  commentedComplexCode: boolean  // ✅ Non-obvious logic explained
  
  // Security
  noSecretsCommitted: boolean    // ✅ No API keys or tokens
  inputsValidated: boolean       // ✅ User inputs sanitized
  authorizationChecked: boolean  // ✅ Role guards in place
}
```

### Automated Verification Commands

**Agents must run these before claiming completion:**

```bash
# 1. Check TypeScript errors (MANDATORY)
get_errors

# 2. Verify no console.log left behind
grep_search query="console\\.log" isRegexp=true

# 3. Check for TODO comments added
grep_search query="TODO|FIXME" isRegexp=true

# 4. Verify translation coverage
# Check both en.json and ar.json have matching keys

# 5. Test both locales (visit both routes)
# http://localhost:3000/en/[your-page]
# http://localhost:3000/ar/[your-page]
```

### Quality Metrics for Completion

**A task is NOT complete until:**

| Metric | Requirement | How to Verify |
|--------|-------------|---------------|
| TypeScript Errors | 0 errors | `get_errors` returns empty |
| Translation Coverage | 100% (en = ar) | Both files have same keys |
| Code Comments | Complex logic documented | JSDoc for non-obvious functions |
| Error Handling | All paths covered | No empty catch blocks |
| Accessibility | ARIA labels present | Interactive elements labeled |
| Mobile Responsive | Works < 640px | Test mobile view |
| Dark Mode | Both themes work | Toggle theme, verify colors |
| RTL Support | Arabic layout correct | Test `/ar` route |
| Git History | Clean commits | Logical commit messages |
| Documentation | Features documented | `docs/features/` updated |

### Code Review Self-Checklist

**Before declaring "task complete", answer YES to all:**

- [ ] Did I read the existing code before modifying it?
- [ ] Did I follow existing patterns rather than creating new ones?
- [ ] Did I test in both English and Arabic?
- [ ] Did I verify dark mode still works?
- [ ] Did I check mobile responsiveness?
- [ ] Did I run `get_errors` and fix all issues?
- [ ] Did I add translations to BOTH language files?
- [ ] Did I update documentation if I changed architecture?
- [ ] Did I handle all error cases with meaningful messages?
- [ ] Did I remove all debug console.log statements?
- [ ] Did I use TypeScript types properly (no `any`)?
- [ ] Did I add ARIA labels to new interactive elements?
- [ ] Did I test keyboard navigation?
- [ ] Did I verify no secrets were committed?
- [ ] Did I follow the project's package manager rules (pnpm/npm)?
- [ ] Did I provide a comprehensive summary with metrics?

### Prohibited Actions (Will Cause Immediate Failure)

| ❌ NEVER Do This | Why | Alternative |
|------------------|-----|-------------|
| Assume file contents | Leads to incorrect changes | Use `read_file` first |
| Skip error checking | Breaks the build | Always run `get_errors` |
| Hardcode strings | Breaks i18n | Use translation keys |
| Use `any` type | Loses type safety | Define proper interfaces |
| Empty catch blocks | Hides errors | Log and handle gracefully |
| Delete without asking | Data loss risk | Ask user first |
| Mix package managers | Breaks dependencies | Check project rules |
| Ignore RTL | Breaks Arabic UI | Test `/ar` route |
| Skip dark mode test | Visual bugs | Toggle and verify |
| Commit secrets | Security breach | Use environment variables |
| Create custom components | Code duplication | Use shadcn/ui first |
| Bypass auth checks | Security hole | Use `RoleRouteGuard` |

### Escalation Protocol

**When to stop and ask for help:**

1. 🚨 **TypeScript errors you can't resolve** after 2 attempts
2. 🚨 **Breaking changes** that affect multiple features
3. 🚨 **Security concerns** or potential vulnerabilities
4. 🚨 **Performance issues** (slow rendering, infinite loops)
5. 🚨 **Unclear requirements** that could lead to wrong implementation
6. 🚨 **Need to modify** core configuration files (tsconfig, next.config, etc.)
7. 🚨 **Database schema changes** that affect existing data
8. 🚨 **API contract changes** that break existing clients

**Escalation format:**
```
🚨 ESCALATION NEEDED

Issue: [Brief description]
Attempted: [What you tried]
Impact: [What's affected]
Risk: [Potential consequences]
Options: [Possible approaches]
Recommendation: [Your suggested path]

Waiting for user decision before proceeding.
```

### Success Criteria for Agent Mode Tasks

**Minimum requirements for "task complete":**

✅ **Functional**: Feature works as requested in all scenarios  
✅ **Tested**: Verified in en/ar, light/dark, desktop/mobile  
✅ **Clean**: Zero TypeScript errors, no console.logs  
✅ **Accessible**: ARIA labels, keyboard navigation works  
✅ **Documented**: Feature docs updated, code commented  
✅ **Secure**: No vulnerabilities, inputs validated  
✅ **Consistent**: Follows existing patterns and conventions  
✅ **Complete**: All edge cases handled with proper errors  
✅ **Verified**: All quality gates passed  
✅ **Summarized**: Comprehensive report with metrics provided  

### Performance SLAs for Agent Mode

**Expected completion times (for reference):**

| Task Type | Expected Time | Max Acceptable Time |
|-----------|---------------|---------------------|
| Simple component | 5-10 minutes | 20 minutes |
| New page with i18n | 15-30 minutes | 45 minutes |
| Feature with multiple files | 30-60 minutes | 90 minutes |
| API endpoint + frontend | 45-75 minutes | 2 hours |
| Complex feature (5+ files) | 1-2 hours | 3 hours |

**If exceeding max time:**
- ✅ Reassess approach
- ✅ Break into smaller tasks
- ✅ Ask for clarification
- ✅ Identify blockers

### Final Agent Mode Reminder

```
═══════════════════════════════════════════════════════════
  REMEMBER: Quality > Speed
  
  A working, tested, documented feature delivered in 2 hours
  is better than a broken, untested feature in 30 minutes.
  
  When in doubt:
  1. Stop and read the code
  2. Ask for clarification
  3. Follow existing patterns
  4. Test thoroughly
  5. Document your work
  
  Your reputation as an agent depends on reliability,
  not speed.
═══════════════════════════════════════════════════════════
```
