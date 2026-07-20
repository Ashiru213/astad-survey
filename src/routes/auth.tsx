import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy route — redirects to the new /login page.
export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/login", replace: true });
  },
});