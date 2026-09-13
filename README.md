# Full-Stack Projects — Experiments

This repository contains four upload-ready React/Vite projects matching the requested GitHub layout.

## Folder mapping

| Folder | Experiment |
|---|---|
| `Exp-1` | Experiment 1.1.1 — Dynamic Multi-Platform Post Composer |
| `Exp-2` | Experiment 1.2.1 — Redux Toolkit State Management |
| `Exp-3` | Experiment 1.3.1 + 1.3.2 — JWT Authentication & RBAC |
| `Exp-4` | Experiment 1.4.1 + 1.4.2 — Calendar, Performance & Testing |

Each folder is an independent Vite project with its own `package.json` and `README.md`.

## VS Code

Open the `Full-Stack-Projects` folder in VS Code. To run a project, open a terminal inside its folder:

```bash
cd Exp-1
npm install
npm run dev
```

Repeat for `Exp-2`, `Exp-3`, or `Exp-4`.

## GitHub

From the repository root:

```bash
git init
git add .
git commit -m "Add experiments 1-4"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

If the GitHub repository already exists and is already connected:

```bash
git add .
git commit -m "Add experiments 1-4"
git push
```
