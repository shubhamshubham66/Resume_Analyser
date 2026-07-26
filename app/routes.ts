import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("analyze-resume", "routes/analyze-resume.tsx"),
  route("api/analyze-resume", "routes/api.analyze-resume.ts"),
] satisfies RouteConfig;
