# 🛠 Setting up ESLint and Prettier in a project

This project has **ESLint** and **Prettier** configured to automatically check code quality and enforce a consistent style.

---

## 📋 Technologies used

- **ESLint** — code analysis to identify errors and style inconsistencies.
- **Prettier** — auto-formatting of code.
- **eslint-plugin-react-x** — rules for React components.
- **eslint-plugin-react-dom** — rules for working with React DOM API.
- **eslint-plugin-unicorn** — advanced code quality rules.
- **eslint-plugin-prettier** — Prettier integration into ESLint.
- **typescript-eslint** — support for TypeScript rules.
- **Vite + React + TypeScript** — basis of the project.

---

## Check the code for errors

```bash
  npm run lint
```

---

## Automatically fix ESLint errors

```bash
  npm run lint:fix
```

---

## Format the entire project via Prettier

```bash
  npm run format
```

---
## 📦Installing dependencies

Make sure all required packages are installed:

```bash
npm install
npm install --save-dev eslint-plugin-unicorn
npm install --save-dev eslint-plugin-react-x eslint-plugin-react-dom
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier
