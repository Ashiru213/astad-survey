import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2, Mail, Reply, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Submission = Database["public"]["Tables"]["contact_submissions"]["Row"];

export const Route = createFileRoute("/_authenticated/dashboard/messages")({
  ssr: false,
  component: MessagesPage,
});

const PAGE_SIZE = 10;

function MessagesPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "new" | "replied">("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [reply, setReply] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Submission[];
    },
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((m) => {
      if (status !== "all" && (m.status ?? "new") !== status) return false;
      if (!q.trim()) return true;
      const t = q.toLowerCase();
      return [m.name, m.email, m.phone, m.service, m.message]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(t));
    });
  }, [data, q, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message deleted");
      qc.invalidateQueries({ queryKey: ["dashboard-messages"] });
      qc.invalidateQueries({ queryKey: ["count", "contact_submissions"] });
      setSelected(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ ai_reply: message, status: "replied" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reply saved");
      qc.invalidateQueries({ queryKey: ["dashboard-messages"] });
      qc.invalidateQueries({ queryKey: ["count", "contact_submissions"] });
      setSelected(null);
      setReply("");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  function confirmDelete(id: string) {
    if (confirm("Delete this message? This cannot be undone.")) deleteMutation.mutate(id);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-gold">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">Search, reply and manage submissions from your website.</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Search name, email, service…"
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-gold"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as typeof status); setPage(0); }}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-gold"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden md:table-cell">Service</th>
              <th className="px-4 py-3 hidden lg:table-cell">Received</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
            )}
            {!isLoading && paged.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No messages found.</td></tr>
            )}
            {paged.map((m) => (
              <tr key={m.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{m.service ?? "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    (m.status ?? "new") === "replied" ? "bg-gold/15 text-gold" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {m.status ?? "new"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => { setSelected(m); setReply(m.ai_reply ?? ""); }}
                    className="mr-2 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:border-gold hover:text-gold"
                  >
                    <Reply className="h-3 w-3" /> View
                  </button>
                  <button
                    onClick={() => confirmDelete(m.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">Page {page + 1} of {pageCount}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full border border-border px-4 py-1 disabled:opacity-40"
            >Prev</button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="rounded-full border border-border px-4 py-1 disabled:opacity-40"
            >Next</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-3xl border border-border/60 bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-gold">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selected.email}{selected.phone ? ` · ${selected.phone}` : ""}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Service</dt><dd>{selected.service ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Received</dt><dd>{new Date(selected.created_at).toLocaleString()}</dd></div>
            </dl>
            <div className="mt-4 rounded-xl border border-border/60 bg-background p-4 text-sm whitespace-pre-wrap">
              {selected.message}
            </div>
            <div className="mt-5">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Reply / notes</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-gold"
                placeholder="Write a reply or add notes…"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: Your ASTAD Survey enquiry")}&body=${encodeURIComponent(reply || "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-gold hover:text-gold"
              >
                <Mail className="h-4 w-4" /> Reply by email
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => confirmDelete(selected.id)}
                  className="rounded-full border border-border px-4 py-2 text-sm text-destructive hover:border-destructive"
                >Delete</button>
                <button
                  onClick={() => replyMutation.mutate({ id: selected.id, message: reply })}
                  disabled={replyMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-primary disabled:opacity-60"
                >
                  {replyMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save & mark replied
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}