import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
     server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://www.fist-o.com/eco_energy',
        changeOrigin: true,
        secure: false,
        // Don't follow redirects
        followRedirects: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Set the host header
            proxyReq.setHeader('Host', 'www.fist-o.com');
            console.log('Proxying:', req.method, req.url, '→', options.target + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
     }}
})
