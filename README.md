# Angular Nx Micro-Frontend Monorepo (Shell & UsersManagement)

## Overview: Project Purpose & Architecture
This repository is an **Angular Nx monorepo** that demonstrates a micro-frontend architecture using **Webpack Module Federation**. The project consists of a **shell** (host) Angular application and one or more **remote** micro-frontend apps (e.g. a `UsersManagement` app). The shell is the main container application that hosts common layout (header, footer, etc.) and authentication, while the remote apps provide specific feature modules (like user management) that are loaded into the shell at runtime. The...

---

## Prerequisites
- **Node.js** – You need **Node.js v20.19.0 or higher** (Angular 20 requires Node 20.19.0+).  
- **Nx CLI** – Install globally with `npm install -g nx` (or use `npx nx`).  
- **Package Manager** – npm (package-lock.json is present).  

---

## Installation
1. Clone the repository.  
2. Run `npm install` in the root.  
3. Verify setup (`node_modules` present, no errors).  

---

## Running the Application (Development)
### Run the Shell with Remotes
```bash
nx serve shell
```
- Shell runs at [http://localhost:4200](http://localhost:4200).  
- UsersManagement remote auto-serves at [http://localhost:4301](http://localhost:4301).  

### Run a Remote Individually
```bash
nx serve UsersManagement
```
- Runs on [http://localhost:4301](http://localhost:4301).  

### Proxy Configuration
`shell/proxy.conf.json`:
```json
{
  "/api-auth": {
    "target": "http://localhost:9090",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/api-auth": "" }
  }
}
```
Used only in dev to forward API calls (avoids CORS).  

---

## Project Structure
```
apps/
  UsersManagement/   # Remote micro-frontend
shell/               # Host app (main container)
libs/
  auth/              # Authentication (guards, services)
  components/        # Shared UI (header, footer, layouts)
  styles/            # Global SCSS theme/styles
  assets/            # Shared static assets (favicon, logo)
```

- Apps and shell: Angular standalone apps with Module Federation configs.  
- Libs: reusable Angular libraries shared across apps.  

---

## Testing (Vitest)
- Run `nx test auth` (or `nx test components`, etc.).  
- Run `nx test` for all projects.  
- Configured via `vite.config.mts` + AnalogJS plugins.  
- Coverage reports go to `coverage/`.  

---

## Building for Production (Rsbuild)
- Faster builds with **Rspack (Rsbuild)**.  
- Commands:
  ```bash
  nx build shell
  nx build UsersManagement
  ```
- Outputs:
  - `dist/shell/` → shell build  
  - `dist/apps/usersmanagement/` → remote build (`remoteEntry.js`)  
- Use `nx serve-static shell` to serve production build locally.  

---