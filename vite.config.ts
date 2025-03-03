import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill'
import {NodeModulesPolyfillPlugin} from '@esbuild-plugins/node-modules-polyfill';
import {nodePolyfills} from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
          // Whether to polyfill specific globals.
          globals: {
            Buffer: true, // can also be 'build', 'dev', or false
            global: true,
            process: true,
          },
          // Whether to polyfill `node:` protocol imports.
          protocolImports: true,
        }),
    ],
    define: {
        'process.env': {},
        global: 'globalThis',
    },
    optimizeDeps: {
        exclude: ['lucide-react'],
        esbuildOptions: {
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true,
                }),
                NodeModulesPolyfillPlugin(),
            ]
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id
                            .toString()
                            .split('node_modules/')[1]
                            .split('/')[0]
                            .toString();
                    }
                },
            },
        },
        commonjsOptions: {
            include: [/node_modules/], // Ensure CommonJS modules are handled
        },
    },
    server: {
        host: true,
        port: 5173
    }
});
