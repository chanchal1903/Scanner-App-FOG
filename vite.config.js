import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Yeh line add karni hai taaki GitHub Pages ko sahi path pata chale
  base: '/Scanner-App-FOG/', 
  plugins: [react()],
})