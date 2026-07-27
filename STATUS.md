# 🕵️‍♂️ Spectre AI — Visual Regression Debugger

This file tracks the current state of development, architectural decisions, and next steps.

---

## 📍 Current Phase: Milestone 2 — The Photographer & The Spotter (Visual Engine)
We are building the core visual engine of **Spectre AI (The Visual Regression Debugger)**. Unlike traditional testers that only report *if* a layout is broken, Spectre AI acts as a **debugger**: it captures visual states, maps layout differences directly to HTML elements, and integrates Gemini AI to provide actionable CSS bug-fixes.

---

## ✅ Completed Tasks

### Milestone 1: Server Initialization & Architecture Setup
* **Project Folder Rename**: Renamed workspace to `Spectre AI Saas`.
* **Database Setup**: Configured connection to MongoDB Atlas cloud cluster (`/PixelMatch` database) inside `src/config/db.ts` using the async/await pattern.
* **Env Config**: Created `.env` with variables `MONGO_URL` and `PORT` for security.
* **Mongoose Models**:
  * `src/models/Project.ts`: Schema for storing website testing endpoints (`stagingUrl` and `productionUrl`) using camelCase fields.
  * `src/models/TestRun.ts`: Schema for storing detailed visual comparison results, screenshot paths, and visual bug coordinate maps.
* **Modular Router**:
  * `src/Controllers/TestRunControllers.ts`: Controller containing the request logic, wrapped in `express-async-handler` for async safety.
  * `src/Routes/TestRunRoutes.ts`: Router mapping `/test-capture` to the controller.
* **Error Handling**:
  * `src/Middlewares/ErrorHandler.ts`: Global Express error-handling middleware that catches thrown exceptions and returns them as clean JSON responses.
  * `src/server.ts`: Mounted routes under `/api/tests` and registered the global error handler.

### Milestone 2: The Photographer & The Spotter (Visual Engine)
* **Local Storage & Static Serving**: Created the `Public/screenshots` folder and registered static file serving on `/screenshots` in `server.ts`.
* **The Photographer service**: Built `src/services/photographer.ts` to spawn headless browser instances and capture full-page screenshots as in-memory binary Buffers.
* **The Spotter service**: Built `src/services/spotter.ts` using `pixelmatch` and `pngjs` to decode screenshot Buffers, run pixel-level comparisons, and write the diff image to disk.
* **Database Integration**: Updated `TestRunControllers.ts` to save live visual comparisons, mismatch percentages, and screenshots to the MongoDB Atlas cluster under a default project template.

### Milestone 3: The Consultant (Gemini AI Debugger Overlay)
* **API Integration**: Integrated the `@google/generative-ai` SDK and resolved ESM import-hoisting issues by lazy-loading environment variables.
* **Layout Capture**: Upgraded `photographer.ts` to extract DOM layout coordinates of elements on page load.
* **Coordinate Mapping**: Implemented pixel-to-element coordinate boundary calculations in `spotter.ts` to map visual mismatches directly to HTML elements.
* **Consultant Service**: Built `consultant.ts` to query Gemini AI with layout metadata and return clean JSON CSS overrides.
* **Controller Hookup**: Fully wired the visual engine in `TestRunControllers.ts` to run automated browser capturing, comparison mapping, and AI style debugging in one single endpoint request.

### Milestone 4: The File Cabinet (History Queries & Ask Spectre Chat Assistant)
* **Project Controllers**: Built `src/Controllers/ProjectControllers.ts` exposing endpoints to get all projects, project run histories, single test run details, and the conversational Gemini chat assistant.
* **Project Creation Route**: Added `createProject` controller to save new projects to MongoDB and registered the `POST /api/projects` endpoint in `src/Routes/ProjectRoutes.ts`.
* **Optional Project ID Support**: Updated `runTestCapture` in `src/Controllers/TestRunControllers.ts` to support an optional `projectId` parameter.
* **Route Configuration**: Created `src/Routes/ProjectRoutes.ts` and updated `src/Routes/TestRunRoutes.ts` to hook up the routes.
* **Server Mounting**: Registered all project and history routes in `server.ts` and verified successful typescript builds.

### Milestone 5: The Client UI Dashboard (Initial Integration)
* **API Endpoint Hookup**: Connected the React frontend pages to retrieve projects and test run details dynamically from the database.
* **Asynchronous Queue Integration**: Configured test run creations to instantly insert `RUNNING` status cards to the dashboard, delegate captures to the background thread, and poll for completed results.

---

## 📝 Pending Tasks (Milestone 5 — The Client UI Dashboard)

* [x] **Step 1**: Initialize the frontend React environment (Vite + TS + TailwindCSS).
* [x] **Step 2**: Build the Dashboard layouts (Header, Project Selector, Run History Sidebar).
* [x] **Step 3**: Design the Interactive Comparison Screen (Before/After side-by-side or image slider overlay).
* [x] **Step 4**: Connect frontend components to API endpoints (`GET /api/projects`, `GET /api/projects/:projectId/runs`).
* [x] **Step 5**: Build the Database-Backed Asynchronous Test Run Queue (Backend creates RUNNING state instantly, spins off Puppeteer task in background, frontend polls for status updates).
* [x] **Step 6**: Rerun Scan Button refinement (Confirming URL contexts and resolving disk file overwrites).
* [x] **Step 7**: Build and connect the "Ask Spectre" Chat Sidebar (Gemini multi-turn history mapping, dynamic CSS markdown parser rendering).

---

## 📝 Pending Tasks (Milestone 6 — CI/CD Pipeline & CLI Automation)

* [x] **Step 1 (Backend)**: Add `apiKey` schema field to `Project` model and create an API Key generation endpoint.
* [x] **Step 2 (Backend)**: Build authentication middleware to restrict test run triggers via CLI to valid API keys.
* [x] **Step 3 (CLI)**: Write the lightweight Node.js CLI script `spectre-cli.js` to trigger scans from terminal/CI environments.
* [x] **Step 4 (Frontend)**: Design the Developer Settings page displaying the API key generator and copy-pasteable GitHub Actions YAML scripts.
* [x] **Step 5 (Automation)**: Set up a sample GitHub Action workflow configuration in our project repository.

### ⚡ Milestone 7: SaaS Pages, UI Polish & Live Metrics Integration
* [x] **Step 1 (UI Polish)**: Redesign the detected regressions list inside `ChatSidebar.tsx` to render beautiful bug cards with class selectors and badge labels.
* [x] **Step 2 (Data Integration)**: Connect the dashboard stats row component to calculate real metrics (total runs, average drifts, passed vs failed count).
* [x] **Step 3 (Header/Footer)**: Polish `TopBar.tsx` and `FooterBar.tsx` layout and headers to match a premium developer dashboard.
* [x] **Step 4 (SaaS Pages)**: Create the SaaS landing page (`LandingPage.tsx`) along with Vercel-style custom Login/Signup layouts.
* [ ] **Step 5 (Docs Guide)**: Create a developer documentation and integration guide page (`Docs.tsx`).

### 🚀 Milestone 8: Authentication, Pro Billing & Auto-Healing Subagents
* [x] **Step 1 (Auth Backend)**: Implement User schema with bcrypt password hashing, JWT authorization middleware, and auth endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/google`, `/api/auth/me`).
* [x] **Step 2 (Project Scoping)**: Update Project model to include `owner` and `tier`, scoping queries so developers only access their own projects.
* [x] **Step 3 (Auth Frontend)**: Connect Vercel-style Login and Signup pages with inline error handling, local storage session persistence, and `AuthContext` header configuration.
* [x] **Step 4 (Route Security)**: Protect `/api/projects`, `/api/tests/run/:runId/rerun`, and `/api/tests/run/:runId/chat` with JWT `protect` middleware.
* [x] **Step 5 (Pro Tier Flag)**: Include `isPro: project.tier === 'PRO'` in test capture responses and update `spectre-cli.js` to log Pro subagent banners.
* [x] **Step 6 (Billing - Razorpay Engine)**: Built Razorpay Order creation (`POST /api/billing/create-order`), HMAC SHA256 signature verification (`POST /api/billing/verify-payment`), account-wide `User.tier` updates in MongoDB Atlas, and Vercel-style Pro comparison modal with native Razorpay checkout in `SideBar.tsx`. (Pending `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` in `.env`).
* [x] **Step 7 (UX - Tunneling)**: Integrated programmatic local tunneling (`localtunnel`) inside `spectre-cli.js` so developers can scan `localhost` targets automatically.
* [x] **Step 8 (AI - Healing Subagent)**: Built recursive component file search, Option B Tailwind class swapping, candidate Git branch protection (`hydra-fix/layout-regressions`), and candidate commits in `spectre-cli.js`.
* [x] **Step 9 (Route Security & UX)**: Created `<ProtectedRoute>` React Router guard to block unauthenticated access, fixed navigation links, and added query string URL cleanup on logout.
* [x] **Step 10 (Q&A Reference)**: Created `my_questions_reference.txt` containing 12 system design, security, and architectural questions with interview-ready answers.
* [ ] **Step 11 (Optimization)**: Add RAM caching (`node-cache`) on high-frequency backend requests to scale under CLI polling.
* [ ] **Step 12 (Packaging)**: Publish CLI to the NPM registry as a public package (`@hydra-ai/cli`).
* [ ] **Step 13 (Storage - Cloudflare R2)**: Stream PNG screenshot buffers directly to Cloudflare R2 Object Storage and save public CDN URLs in MongoDB to prevent database bloat.

---

## 🛠️ Key Architectural Decisions & Tech Stack
* **Project Name**: Hydra AI (Visual Regression Debugger)
* **Server Port**: `8000` (Defined in `.env`)
* **Routing Prefix**: `/api/tests`, `/api/projects`, and `/api/auth`
* **Errors**: Managed globally via `express-async-handler` throwing straight to `ErrorHandler.ts` middleware.
* **Database**: MongoDB Atlas.
* **Visual Matchers**: Puppeteer (Headless Chrome) & Pixelmatch (Byte-level comparison).
* **AI Consultant**: Google Gen AI SDK (`gemini-2.5-flash` model).
* **Cache Layer**: Node-Cache (In-memory RAM cache).
