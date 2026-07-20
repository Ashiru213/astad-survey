import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["portfolio_projects"]["Row"] & { coverUrl?: string | null };

export const Route = createFileRoute("/portfolio")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Portfolio | ASTAD Survey & Consultants" },
      { name: "description", content: "Featured surveying, GIS and geoinformatics projects delivered by ASTAD Survey across Nigeria." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("completion_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as Project[];
      // fetch one cover image per project
      await Promise.all(rows.map(async (p) => {
        const { data: imgs } = await supabase
          .from("portfolio_project_images")
          .select("storage_path")
          .eq("project_id", p.id)
          .order("sort_order", { ascending: true })
          .limit(1);
        if (imgs && imgs.length > 0) {
          const { data: signed } = await supabase.storage.from("portfolio").createSignedUrl(imgs[0].storage_path, 3600);
          p.coverUrl = signed?.signedUrl ?? null;
        }
      }));
      return rows;
    },
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="border-b border-border/60 bg-gradient-to-b from-gold/5 to-transparent">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <h1 className="mt-4 font-display text-4xl font-bold text-gold sm:text-5xl">Our Portfolio</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Selected surveying, mapping and geoinformatics projects delivered across Nigeria.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {isLoading && (
          <div className="grid place-items-center py-20 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
        )}
        {!isLoading && data?.length === 0 && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 py-20 text-center text-muted-foreground">
            <p>Projects will appear here soon. Check back shortly.</p>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {p.coverUrl ? (
                  <img src={p.coverUrl} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">No image</div>
                )}
              </div>
              <div className="p-5">
                {p.service && <span className="text-xs uppercase tracking-wider text-gold">{p.service}</span>}
                <h2 className="mt-1 font-display text-lg font-bold">{p.name}</h2>
                {p.description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>}
                <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
                  {p.client && <div><span className="font-medium text-foreground">Client:</span> {p.client}</div>}
                  {p.location && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</div>}
                  {p.completion_date && <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(p.completion_date).toLocaleDateString()}</div>}
                </dl>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}