import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import navUpdatePlugin from './vite-plugin-nav-update';


export default defineConfig({
  plugins: [
    tailwindcss(),
    navUpdatePlugin()
  ],
});