import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FolderKanban, Image as ImageIcon, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  ssr: false,
  component: OverviewPage,
});

function useCount(table: "contact_submissions" | "gallery_images" | "portfolio_projects", filter?: { column: string; value: string }) {
  return useQuery({
    queryKey: ["count", table, filter],
    queryFn: async () => {
      let q = supabase.from(table).select("id", { count: "exact", head: true });
      if (filter) q = q.eq(filter.column, filter.value);
      const { count, error } = await q;
      if (error) throw error;
      return count ?? 0;
    },
  });
}

function useRecentMessages() {
  return useQuery({
    queryKey: ["recent-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("id, name, email, service, created_at, status")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });
}

function OverviewPage() {
  const totalMessages = useCount("contact_submissions");
  const newMessages = useCount("contact_submissions", { column: "status", value: "new" });
  const totalGallery = useCount("gallery_images");
  const totalProjects = useCount("portfolio_projects");
  const recent = useRecentMessages();

  const cards = [
    { label: "Total Messages", icon: Mail, value: totalMessages.data ?? "—", tone: "text-gold" },
    { label: "New / Unread", icon: MessageCircle, value: newMessages.data ?? "—", tone: "text-emerald-400" },
    { label: "Gallery Images", icon: ImageIcon, value: totalGallery.data ?? "—", tone: "text-sky-400" },
    { label: "Portfolio Projects", icon: FolderKanban, value: totalProjects.data ?? "—", tone: "text-fuchsia-400" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold text-gold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">A quick pulse of your ASTAD Survey operations.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
                <Icon className={`h-5 w-5 ${c.tone}`} />
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{c.value}</div>
            </motion.div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-border/60 bg-card">
        <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-display text-lg font-bold">Recent Messages</h2>
          <Link to="/dashboard/messages" className="text-xs text-gold hover:underline">View all →</Link>
        </header>
        <div className="divide-y divide-border/60">
          {recent.isLoading && (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          )}
          {recent.data?.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">No messages yet.</div>
          )}
          {recent.data?.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.email} · {m.service ?? "General"}</div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{new Date(m.created_at).toLocaleDateString()}</div>
                {m.status === "new" && <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">New</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}