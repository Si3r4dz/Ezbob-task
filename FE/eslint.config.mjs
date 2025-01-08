import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import ParserTypescriptEslint from '@typescript-eslint/parser';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      semi: ["error", "always"],
      "prefer-const": "error",
      "jest/no-deprecated-functions": "off"
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2021,
      parser: ParserTypescriptEslint,
    },
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];