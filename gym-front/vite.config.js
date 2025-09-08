import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr';

export default defineConfig({
 
    base: "/",
    plugins: [react(), svgr()],
    preview: 
    {
        port: 3000,
        strictPort: true,
    },
    server: 
    {
        port: 3000,
        strictPort: true,
        host: true,
        origin: "http://localhost:3000",
    },
});