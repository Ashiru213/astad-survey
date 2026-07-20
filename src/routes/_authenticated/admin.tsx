import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy route — the admin experience now lives at /dashboard.
export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/dashboard", replace: true });
  },
});
