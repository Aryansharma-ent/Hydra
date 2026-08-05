<div align="center">
  <img src="https://ik.imagekit.io/itsaks/hydra.png" alt="Hydra Logo" width="240" />

  # Hydra

  ### Automated Visual Regression Detection & Code Remediation Platform

  [Documentation](https://github.com) • [CLI Specification](#cli-specification) • [Architecture](#system-architecture) • [License](#license)

  ---
</div>

## Overview

**Hydra** is an open-source visual regression testing platform designed to eliminate layout drift in continuous integration pipelines. By comparing high-resolution viewports between target staging environments and baseline production deployments, Hydra isolates visual shifts, maps differences directly to DOM element boundaries, and generates targeted code patches for developer review.

### Product Tiers

* **Open-Source Edition (Free)**: Core visual diffing engine, sub-pixel variance analysis, interactive dashboard inspector, and standard CI/CD CLI runner.
* **Hydra Pro**: Unlocks the **Automated Remediation Agent**—an autonomous workflow that analyzes visual diff heatmaps, locates target source components across your codebase, performs CSS/Tailwind class swaps, and submits candidate fix branches directly to your repository.

---

## Market Feature Comparison

| Capabilities | Percy | Chromatic | Playwright / Cypress | Hydra (Open Source) | Hydra Pro |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Primary Focus** | Screenshot Diffing | Component Snapshots | E2E Assertions | Visual Inspection | Automated Remediation |
| **Licensing** | Proprietary | Proprietary | Open Source | **Open Source (MIT)** | Managed SaaS |
| **Sub-Pixel Detection** | Supported | Supported | Manual Config | **Supported** | **Supported** |
| **DOM Element Isolation** | Unsupported | Unsupported | Unsupported | **Supported** | **Supported** |
| **Automated Root-Cause Analysis** | Unsupported | Unsupported | Unsupported | **Supported** | **Supported** |
| **Code-Level Patch Generation** | Unsupported | Unsupported | Unsupported | Unsupported | **Supported** |
| **Candidate Branch Pull Requests**| Unsupported | Unsupported | Unsupported | Unsupported | **Supported** |
| **Automated Localhost Tunneling** | Requires Proxy | Requires Proxy | Unsupported | **Native** | **Native** |

---

## Quick Start

### Docker One-Command Launch

Launch the complete containerized Hydra stack (Backend + Frontend) with 1 line:

```bash
docker compose up -d
```

#### Official Docker Hub Images
- **Backend**: `yesitzaks/hydra-backend` (`docker pull yesitzaks/hydra-backend:latest`)
- **Frontend**: `yesitzaks/hydra-frontend` (`docker pull yesitzaks/hydra-frontend:latest`)

---

### Executing via `npx`

Hydra CLI can be executed directly within any terminal or runner environment without prior global installation:

```bash
npx @itzaks/hydra-visual-cli --project <PROJECT_ID> --key <API_KEY> --stagingUrl http://localhost:5173 --productionUrl https://example.com
```

### Local Package Installation

Install `hydra-cli` as a development dependency:

```bash
npm install --save-dev hydra-cli
```

Configure your package script in `package.json`:

```json
{
  "scripts": {
    "test:visual": "hydra --project <PROJECT_ID> --key <API_KEY>"
  }
}
```

---

## CLI Specification

### Flag Reference

| Flag | Required | Description |
| :--- | :---: | :--- |
| `--project`, `--projectId` | **Yes** | Target project identifier generated in Developer Settings. |
| `--key`, `--apiKey` | **Yes** | Secure API key associated with the target project. |
| `--stagingUrl` | Optional | Override staging URL for dynamic PR preview deployments. |
| `--productionUrl` | Optional | Override production baseline URL for comparison. |
| `--tunnel` | Optional | Forces local tunnel creation for `localhost` endpoints. |

### Exit Codes

* `0`: Test suite completed successfully with 0 visual regressions detected.
* `1`: Test suite executed and detected visual regressions exceeding tolerance thresholds, or CLI encountered a runtime error.

---

## Continuous Integration Setup

### GitHub Actions Integration

Create `.github/workflows/hydra.yml` in your repository:

```yaml
name: Hydra Visual Inspection

on:
  pull_request:
    branches: [ main, dev ]

permissions:
  contents: write

jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Execute Hydra Visual Inspection
        run: npx hydra-cli --project ${{ secrets.HYDRA_PROJECT_ID }} --key ${{ secrets.HYDRA_API_KEY }} --stagingUrl ${{ steps.preview.outputs.url }} --productionUrl https://your-production-app.com
        env:
          HYDRA_API_KEY: ${{ secrets.HYDRA_API_KEY }}
```

---

## System Architecture

Hydra relies on a decoupled, multi-service inspection pipeline designed for high concurrency and sub-pixel accuracy.

```text
                                 HYDRA PIPELINE
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
   Staging Screenshot                                   Production Screenshot
  (Puppeteer Headless)                                  (Puppeteer Headless)
            │                                                     │
            └──────────────────────────┬──────────────────────────┘
                                       ▼
                           Pixelmatch Analysis Engine
                          (Sub-Pixel Variance & Heatmap)
                                       │
                                       ▼
                          DOM Boundary Mapping Engine
                         (Element Bounding Coordinates)
                                       │
                                       ▼
                         Root Cause Analysis Engine
                       (CSS Property Shift Isolation)
                                       │
                                       ▼ (Pro Plan)
                        Automated Remediation Agent
                    (Class Swapper & Git Branch Commit)
```

1. **Capture Layer**: Spawns dual headless browser contexts in parallel to execute layout scrolls, freeze CSS animations, wait for web font stabilization, and render PNG buffers.
2. **Difference Layer**: Executes a sub-pixel variance analysis across viewport buffers to construct a diff heatmap and record offset metrics.
3. **Localization Layer**: Computes bounding rects for visual diff regions and maps offset coordinates back to raw DOM element selectors.
4. **Remediation Layer (Pro)**: Launches an autonomous workspace agent that scans project components, performs exact CSS/Tailwind class swaps, and registers a candidate branch commit for developer review.

---

## Local Development & Setup

### Prerequisites

* Node.js v18.0.0 or higher
* MongoDB instance (local or MongoDB Atlas)
* npm or yarn package manager

### Environment Configuration

Create `.env` in `backend/`:

```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/hydra
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hydra.git
cd hydra

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Start development servers
cd ../backend && npm run dev
cd ../frontend && npm run dev
```

---

## License

Hydra Core is distributed under the **MIT License**.
