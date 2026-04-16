/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/test/setup.ts",
    },
});
