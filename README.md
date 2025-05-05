# eCommerce Application 🛍️🌐

---

## 📋 Project Description

Welcome to our eCommerce application!

This project simulates a real shopping experience in a digital environment 🏪.
The platform provides users with a full interaction cycle - from searching for products to placing an order 🚀.

---

## 📝 Project goal:

The project was created as part of teamwork at RS School to practice developing a full-fledged commercial application using modern technologies.

---

## 🛠️ Tech stack:

* Bundler: **Vite**

* Programming language: **TypeScript**

* Interface library: **React**

* Style Preprocessor: **Sass(SCSS)**

* Code analysis to identify errors and style inconsistencies: **ESLint**

* Auto-formatting of code: **Prettier**

* Pre- and post-commit hooks: **Husky + lint-staged**

* Commit style: **Commitlint**

* Testing: **Vitest**

---

## 📋 Plugins:

- **eslint-plugin-react-x** — rules for React components.
- **eslint-plugin-react-dom** — rules for working with React DOM API.
- **eslint-plugin-unicorn** — advanced code quality rules.
- **eslint-plugin-prettier** — Prettier integration into ESLint.
- **typescript-eslint** — support for TypeScript rules.

---

## ⚙️ Requirements:

* Node.js version >= 18

* npm version >= 9

---

## ⌨️ Available scripts

### The following commands are available in the project:

| Script | Description | Command |
| ------ | ----------- | ------- |
| **dev** | Launch a project in development mode | ```npm run dev```
| **build** | Build the project into production | ```npm run build```
| **preview** | Local preview of production build | ```npm run preview```
| **lint** | Check code for linting errors | ```npm run lint```
| **lint:fix** | Automatically fix linting errors | ```npm run lint:fix```
| **format** | Format an Entire Project with Prettier | ```npm run format```
| **test** | Run tests via Vitest | ```npm run test```
| **prepare** | Script to automatically activate Husky hooks after installing dependencies | ```npm run prepare```

---

## 🔌 Instructions for local installation and launch of the project

### 1. Clone a repository

```bash
git clone https://github.com/selestrel07/eCommerce-App.git
cd ecommerce-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Husky 

```bash
npm run prepare
```

### 4. Launch a project in development mode

```bash
npm run dev
```

### 5. Assemble a project for production

```bash
npm run build
```

### 6. Preview of the assembled project

```bash
npm run preview
```

---

## 📝 Rules for formatting commits
  ### The project uses the [Conventional Commits standard](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).

  * The commit type MUST BE in lowercase only (init, feat, fix, refactor, docs etc.)
  * Present tense ("add feature" not "added feature") should be used.
  * Imperative mood ("move cursor to ..." not "moves cursor to ..." should be used).

---

## 💡 Additional recommendations

* It is recommended to run the linter before each commit:

```bash
npm run lint
```

or immediately correct the errors found:

```bash
npm run lint:fix
```

* Prettier is used to format the code in the project:

```bash
npm run format
```

* To run tests use:

```bash
npm run test
```

## 👥 Authors
The project was developed in a team of three participants ([Dzmitry,](https://github.com/selestrel07)
[Egor,](https://github.com/heresyhawkins)
[Tatyana](https://github.com/isvaya))👨‍💻👩‍💻👨‍💻 as part of the [RS School course](https://rs.school/courses/javascript-ru).
