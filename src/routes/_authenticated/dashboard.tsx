import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Mail,
  Image as ImageIcon,
  FolderKanban,
  Users,
  MessageSquareQuote,
  BookOpen,
  FileSpreadsheet,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  Search as SearchIcon,
  Sun,
  Moon,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/messages", label: "Contact Messages", icon: Mail },
  { to: "/dashboard/gallery", label: "Gallery Manager", icon: ImageIcon },
  { to: "/dashboard/projects", label: "Project Manager", icon: FolderKanban },
  { to: "/dashboard/team", label: "Team Members", icon: Users, soon: true },
  { to: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote, soon: true },
  { to: "/dashboard/blog", label: "Blog Manager", icon: BookOpen, soon: true },
  { to: "/dashboard/quotes", label: "Quote Requests", icon: FileSpreadsheet, soon: true },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon, soon: true },
] as const;

function DashboardLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading } = useSession();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin(user?.id);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login", replace: true });
  }

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try { localStorage.setItem("astad-theme", next); } catch {}
  }

  if (loading || adminLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div className="max-w-md rounded-3xl border border-border/60 bg-card p-8">
          <ShieldAlert className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-3 font-display text-xl font-bold text-gold">Admin access required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user?.email}) is signed in but does not have admin privileges. Contact
            ASTAD Survey to request access.
          </p>
          <button
            onClick={handleSignOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:border-gold hover:text-gold"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/60 bg-card/80 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <Link to="/" className="font-display text-lg font-bold tracking-wide text-gold">
            ASTAD <span className="text-muted-foreground">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, "exact" in item ? item.exact : false);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-gold/15 text-gold"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                    {"soon" in item && item.soon && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border/60 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
          <button
            className="rounded-lg border border-border p-2 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="relative flex-1 max-w-lg">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search dashboard…"
              className="w-full rounded-full border border-border bg-card/60 py-2 pl-9 pr-4 text-sm outline-none focus:border-gold"
            />
          </div>
          <button
            onClick={toggleTheme}
            className="hidden rounded-full border border-border p-2 hover:border-gold hover:text-gold sm:inline-flex"
            aria-label="Toggle dark mode"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </button>
          <div className="hidden text-right text-xs text-muted-foreground sm:block">
            <div className="font-medium text-foreground">{user?.email}</div>
            <div>Administrator</div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}