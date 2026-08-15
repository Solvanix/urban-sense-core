import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["4173-iq4ewmll2w3a4ojqet5tc-9e32b7d4.us4.manus.computer"]
  }
});
