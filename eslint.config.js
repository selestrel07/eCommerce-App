import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import unicorn from "eslint-plugin-unicorn";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      // Без js.configs.recommended
      ...tseslint.configs.recommendedTypeChecked,
      // Если захотим строже
      // ...tseslint.configs.strictTypeChecked,
      // Стилистические правила:
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-x": reactX,
      "react-dom": reactDom,
      unicorn,
    },
    rules: {
      ...reactX.configs["recommended-typescript"].rules,
      ...reactDom.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "unicorn/no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          enforceConst: true,
        }
      ],
      
      "max-lines-per-function": [
        "warn",
        {
          max: 40,
          skipBlankLines: true,
          skipComments: true,
        }
      ],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "eol-last": ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],

    },
  }
);
