import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Upload, Trash2, Mail, ShieldAlert, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? "");
    });
  }, []);

  const roleQ = useQuery({
    queryKey: ["is-admin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  const submissionsQ = useQuery({
    queryKey: ["submissions"],
    enabled: roleQ.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const galleryQ = useQuery({
    queryKey: ["gallery-admin"],
    enabled: roleQ.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const withUrls = await Promise.all(
        (data ?? []).map(async (row) => {
          const { data: signed } = await supabase.storage
            .from("gallery")
            .createSignedUrl(row.storage_path, 60 * 60);
          return { ...row, url: signed?.signedUrl ?? "" };
        }),
      );
      return withUrls;
    },
  });

  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim() || !userId) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { error: dbErr } = await supabase.from("gallery_images").insert({
        title: title.trim(),
        description: description.trim() || null,
        storage_path: path,
        uploaded_by: userId,
      });
      if (dbErr) throw dbErr;
      toast.success("Image uploaded");
      setTitle(""); setDescription(""); setFile(null);
      qc.invalidateQueries({ queryKey: ["gallery-admin"] });
      qc.invalidateQueries({ queryKey: ["gallery-public"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const deleteImg = useMutation({
    mutationFn: async (row: { id: string; storage_path: string }) => {
      await supabase.storage.from("gallery").remove([row.storage_path]);
      const { error } = await supabase.from("gallery_images").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Image removed");
      qc.invalidateQueries({ queryKey: ["gallery-admin"] });
      qc.invalidateQueries({ queryKey: ["gallery-public"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const deleteSub = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Submission removed");
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (roleQ.isLoading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  if (roleQ.data === false) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24">
        <div className="rounded-3xl border border-border/60 bg-card p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-display text-2xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{userEmail}</span>. Your account does not yet have admin
            privileges. Contact the site owner and share your user ID:
          </p>
          <code className="mt-3 inline-block break-all rounded-lg bg-muted px-3 py-2 text-xs">{userId}</code>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/" className="rounded-full border border-border px-5 py-2 text-sm">Home</Link>
            <button onClick={signOut} className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-primary">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Signed in as {userEmail}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="rounded-full border border-border px-4 py-2 text-sm">View site</Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold"><Upload className="h-5 w-5 text-gold" /> Upload gallery image</h2>
        <form onSubmit={handleUpload} className="mt-4 grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required maxLength={100}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" maxLength={200}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-3 file:py-1 file:text-primary md:col-span-2" />
          <button type="submit" disabled={uploading || !file || !title.trim()}
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary disabled:opacity-60 md:col-span-2">
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </form>

        <h3 className="mt-8 flex items-center gap-2 font-display text-lg font-semibold"><ImageIcon className="h-4 w-4 text-gold" /> Uploaded images ({galleryQ.data?.length ?? 0})</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryQ.data?.map((row) => (
            <div key={row.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              {row.url && <img src={row.url} alt={row.title} className="h-48 w-full object-cover" />}
              <div className="p-4">
                <p className="font-semibold">{row.title}</p>
                {row.description && <p className="mt-1 text-xs text-muted-foreground">{row.description}</p>}
                <button onClick={() => deleteImg.mutate({ id: row.id, storage_path: row.storage_path })}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
          {galleryQ.data?.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No uploads yet.</p>}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold"><Mail className="h-5 w-5 text-gold" /> Contact submissions ({submissionsQ.data?.length ?? 0})</h2>
        <div className="mt-4 space-y-3">
          {submissionsQ.data?.map((s) => (
            <details key={s.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{s.name} <span className="text-xs text-muted-foreground">— {s.service ?? "—"}</span></p>
                  <p className="text-xs text-muted-foreground">{s.email} · {new Date(s.created_at).toLocaleString()}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); deleteSub.mutate(s.id); }}
                  className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </summary>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Message</p>
                  <p className="mt-1 whitespace-pre-wrap">{s.message}</p>
                  {s.phone && <p className="mt-2 text-xs">Phone: {s.phone}</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">AI auto-reply sent</p>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{s.ai_reply ?? "—"}</p>
                </div>
              </div>
            </details>
          ))}
          {submissionsQ.data?.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
        </div>
      </section>
    </div>
  );
}