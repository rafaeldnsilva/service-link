const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
    ...expoConfig,
    {
        ignores: ["node_modules/", "dist/", ".expo/", "web-build/"],
    },
    {
        rules: {
            // Proibir any explícito
            "@typescript-eslint/no-explicit-any": "warn",
            // Proibir console.log (permitir warn/error)
            "no-console": ["warn", { allow: ["warn", "error"] }],
            // Imports não utilizados
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
]);
