import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src/'),
            },
        },
        plugins: [react()],
        server: {
            port: 3000,
        },
        css: {
            modules: {
                localsConvention: 'camelCase' as const,
            },
        },
    };
});
