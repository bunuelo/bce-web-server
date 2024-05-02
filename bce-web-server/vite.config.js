import fs from 'fs';
import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '/home/bce-web-server/privkey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '/home/bce-web-server/fullchain.pem')),
    },
    // Make sure the server is accessible over the local network
    host: '0.0.0.0',
  },
  plugins: [sveltekit()]
});
