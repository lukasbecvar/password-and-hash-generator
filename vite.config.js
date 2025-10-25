import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: './',
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000
    },
    test: {
        globals: true,
        reporters: 'verbose',
        environment: 'jsdom',
        setupFiles: './tests/setupTests.js',
        include: ['tests/**/*.test.jsx']
    }
})
