import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
  manifest: {
    name: "Event App",
    short_name: "EventApp",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  workbox: {
    navigateFallback: "/index.html",

    // 👇 THIS is what you were missing
    globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
  },
})


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
     }},
     
})
