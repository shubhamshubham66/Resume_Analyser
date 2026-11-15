import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("analyze-resume", "routes/analyze-resume.tsx"),
  route("search", "routes/search.tsx"),
] satisfies RouteConfig;
