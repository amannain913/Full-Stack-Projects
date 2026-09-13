# Experiment 1.3.1 + 1.3.2 — JWT Authentication & RBAC

## Aim
Implement JWT-based authentication and role-based route authorization.

## Demo Accounts
- `admin / admin123` → Admin
- `editor / editor123` → Editor
- `viewer / viewer123` → Viewer

## Features
- Login form and credential validation
- JWT-like signed-claim simulation for frontend demonstration
- Token persistence in localStorage
- Protected routes
- Admin / Editor / Viewer roles
- Unauthorized users redirected to a 403 page
- UI adapts to authenticated role

> Academic/demo note: this project simulates JWT creation in the browser. Production applications should issue and verify JWTs on a trusted backend and prefer secure HttpOnly cookies where appropriate.

## Run
```bash
npm install
npm run dev
```
