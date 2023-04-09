module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "prettier", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  // "@typescript-eslint/no-unused-vars" : "off",
  rules: {
    indent: "off",
    "@typescript-eslint/indent": [2, 2, { SwitchCase: 1 }],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "no-empty-function": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
