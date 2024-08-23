import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    base: "/",
    plugins: [react()],
    server: {
      port: 3000,
    },
  });
};
