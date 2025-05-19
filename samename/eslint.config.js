import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "*.config.js",
      ".next",
      ".cache",
      "coverage",
    ],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // TS-only 프로젝트라면
    },
    settings: { react: { version: "detect" } },
  },
  tseslint.configs.recommended,      // 단순 확장만 배열로 추가
  ...pluginReact.configs.flat.recommended, // ★★★ 배열로 풀어서 넣어야 함!
]);
