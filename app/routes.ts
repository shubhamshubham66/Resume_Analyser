import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("analyze-resume", "routes/analyze-resume.tsx"),
  route("roadmap", "routes/roadmap.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
] satisfies RouteConfig;
