import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    dts({ include: ["src/register-all.ts", "src/platform.d.ts"] }),
  ],
  resolve: {
    alias:
      command === "serve"
        ? [
            {
              find: "@core/actions",
              replacement: fileURLToPath(
                new URL("./src/mock/actions.ts", import.meta.url),
              ),
            },
          ]
        : [],
    tsconfigPaths: true,
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        "register-all": fileURLToPath(
          new URL("./src/register-all.ts", import.meta.url),
        ),
      },
      formats: ['es', 'cjs'],
      cssFileName: "style",
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rolldownOptions: {
      external: (id) =>
        ["react", "react-dom", "react/jsx-runtime"].includes(id) ||
        id.startsWith("@core/"),
    },
    sourcemap: true,
  },
}))