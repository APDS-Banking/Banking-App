import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('keys/privatekey.pem'),
      cert: fs.readFileSync('keys/certificate.pem'),
    },
    host: 'localhost',
    port: 5173,
  },
});
