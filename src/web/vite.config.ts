import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    sourcemap: false,
    target: 'es2019',
    rollupOptions: {
      output: {
        // Use a function to group modules into chunks by pattern
        manualChunks(id) {
          const m = id.replace(/\\/g, '/')

          // 1) MSAL isolated (auth loads at startup)
          if (
            m.includes('/node_modules/@azure/msal-browser/') ||
            m.includes('/node_modules/@azure/msal-common/') ||
            m.includes('/node_modules/@azure/msal-react/')
          ) {
            return 'msal'
          }

          // 2) React + charts + UI in one stable vendor bucket
          if (
            // React core
            m.includes('/node_modules/react/') ||
            m.includes('/node_modules/react-dom/') ||

            // Charts & d3 ecosystem
            m.includes('/node_modules/recharts/') ||
            m.includes('/node_modules/d3-') ||
            m.includes('/node_modules/internmap/') ||
            m.includes('/node_modules/victory-vendor/') ||

            // UI foundations
            m.includes('/node_modules/@radix-ui/') ||
            m.includes('/node_modules/@floating-ui/')
          ) {
            return 'vendor-core'
          }

          // 3) Forms & date handling (kept separate so vendor-core doesn’t explode)
          if (
            m.includes('/node_modules/react-hook-form/') ||
            m.includes('/node_modules/react-datepicker/') ||
            m.includes('/node_modules/date-fns/')
          ) {
            return 'vendor-forms'
          }

          // 4) Data fetching / caching
          if (m.includes('/node_modules/@tanstack/react-query/')) {
            return 'vendor-query'
          }

          // 5) Icons
          if (
            m.includes('/node_modules/lucide-react/') ||
            m.includes('/node_modules/react-icons/')
          ) {
            return 'vendor-icons'
          }

          // App code stays in index/app chunks
          return undefined
        },
      },
    },
    // Optional: hush warnings if you prefer
    chunkSizeWarningLimit: 800,
  },
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
