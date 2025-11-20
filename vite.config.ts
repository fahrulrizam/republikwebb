import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // SOLUSI UTAMA UNTUK VERSEL / SUBDIRECTORY DEPLOYMENT
  // Memberi tahu Vite bahwa path dasar (base) untuk semua aset statis adalah root '/'
  base: '/', 
  
  build: {
    // Memastikan output folder adalah 'dist' (standar Vite)
    outDir: 'dist', 
    // Mengizinkan aset yang lebih besar dari batas standar
    chunkSizeWarningLimit: 1500,
  },
  
  // Jika Anda memiliki variabel lingkungan kustom yang tidak dimulai dengan VITE_
  // define: {
  //   'process.env': {}
  // }
})