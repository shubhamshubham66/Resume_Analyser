import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode - static deployment, API handled by Vercel serverless function
  ssr: false,
} satisfies Config;
