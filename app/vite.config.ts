import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  base: '/',
=======
  base: './',
>>>>>>> d334e3191f94f53626b7827bb51bfd354f847ef0
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
