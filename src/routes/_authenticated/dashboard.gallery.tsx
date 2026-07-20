import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/gallery")({
  ssr: false,
  component: GalleryManager,
});

type Row = { id: string; title: string; description: string | null; storage_path: string; created_at: string; signedUrl: string | null };

function GalleryManager() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-gallery"],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("id, title, description, storage_path, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      const withUrls = await Promise.all(rows.map(async (r) => {
        const { data: signed } = await supabase.storage.from("gallery").createSignedUrl(r.storage_path, 3600);
        return { ...r, signedUrl: signed?.signedUrl ?? null };
      }));
      return withUrls;
    },
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose an image first");
      if (!title.trim()) throw new Error("Add a title");
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, {
        contentType: file.type, upsert: false,
      });
      if (upErr) throw upErr;
      const { data: userRes } = await supabase.auth.getUser();
      const { error: insErr } = await supabase.from("gallery_images").insert({
        title: title.trim(),
        description: description.trim() || null,
        storage_path: path,
        uploaded_by: userRes.user?.id ?? null,
      });
      if (insErr) throw insErr;
    },
    onSuccess: () => {
      toast.success("Image uploaded");
      setTitle(""); setDescription(""); setFile(null);
      qc.invalidateQueries({ queryKey: ["dashboard-gallery"] });
      qc.invalidateQueries({ queryKey: ["site-gallery"] });
      qc.invalidateQueries({ queryKey: ["count", "gallery_images"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Upload failed"),
  });

  const remove = useMutation({
    mutationFn: async (row: Row) => {
      await supabase.storage.from("gallery").remove([row.storage_path]);
      const { error } = await supabase.from("gallery_images").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["dashboard-gallery"] });
      qc.invalidateQueries({ queryKey: ["site-gallery"] });
      qc.invalidateQueries({ queryKey: ["count", "gallery_images"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-gold">Gallery Manager</h1>
        <p className="text-sm text-muted-foreground">Upload photos that appear on the public gallery.</p>
      </header>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-bold">Upload new image</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={3} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold" />
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-primary" />
            <button
              onClick={() => upload.mutate()}
              disabled={upload.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary disabled:opacity-60"
            >
              {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload
            </button>
          </div>
          <div className="rounded-xl border border-dashed border-border/60 bg-background/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Tips</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Use high-resolution JPG or WebP under 5MB.</li>
              <li>Images appear instantly on the public gallery.</li>
              <li>Descriptive titles improve accessibility &amp; SEO.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card">
        <header className="border-b border-border/60 px-5 py-4">
          <h2 className="font-display text-lg font-bold">Uploaded images ({data?.length ?? 0})</h2>
        </header>
        <div className="p-5">
          {isLoading && <div className="grid place-items-center py-10 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>}
          {!isLoading && data?.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No images yet.</div>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((row) => (
              <div key={row.id} className="overflow-hidden rounded-xl border border-border/60 bg-background">
                <div className="aspect-video overflow-hidden bg-muted">
                  {row.signedUrl && (
                    <img src={row.signedUrl} alt={row.title} className="h-full w-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="p-3">
                  <div className="font-medium">{row.title}</div>
                  {row.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{row.description}</p>}
                  <button
                    onClick={() => confirm("Delete this image?") && remove.mutate(row)}
                    className="mt-3 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}