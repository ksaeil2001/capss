import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // ✅ JSX 오류 방지 (전역 설정)
    },
    settings: {
      react: {
        version: "detect", // ✅ 자동 감지
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended, // ✅ 기본 권장 설정
  {
    // ✅ override 방식으로 JSX 및 prop-types 규칙 비활성화
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    ignores: ["node_modules", "dist"], // ✅ .eslintignore 대체
  },
]);