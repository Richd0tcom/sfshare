import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: true, // Allows access from outside the container
    port: 5173, // Default Vite port, or your chosen port
    watch: {
      usePolling: true // Important for file changes in Docker volumes
    }
  }
})
