import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["portfolio_projects"]["Row"];
type ProjectImage = Database["public"]["Tables"]["portfolio_project_images"]["Row"];

export const Route = createFileRoute("/_authenticated/dashboard/projects")({
  ssr: false,
  component: ProjectsManager,
});

function ProjectsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["dashboard-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project deleted");
      qc.invalidateQueries({ queryKey: ["dashboard-projects"] });
      qc.invalidateQueries({ queryKey: ["public-projects"] });
      qc.invalidateQueries({ queryKey: ["count", "portfolio_projects"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gold">Project Manager</h1>
          <p className="text-sm text-muted-foreground">Add, edit and organise ASTAD Survey portfolio projects.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3 hidden md:table-cell">Client</th>
              <th className="px-4 py-3 hidden lg:table-cell">Service</th>
              <th className="px-4 py-3 hidden lg:table-cell">Location</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && <tr><td colSpan={5} className="px-4 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>}
            {!isLoading && projects?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No projects yet — click <em>New project</em> to add your first.</td></tr>
            )}
            {projects?.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.name}</div>
                  {p.completion_date && <div className="text-xs text-muted-foreground">Completed {new Date(p.completion_date).toLocaleDateString()}</div>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.client ?? "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{p.service ?? "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{p.location ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => { setEditing(p); setShowForm(true); }}
                    className="mr-2 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:border-gold hover:text-gold"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => confirm(`Delete project "${p.name}"?`) && remove.mutate(p.id)}
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

      {showForm && (
        <ProjectForm
          project={editing}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ProjectForm({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState(project?.name ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [service, setService] = useState(project?.service ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [completionDate, setCompletionDate] = useState(project?.completion_date ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [files, setFiles] = useState<FileList | null>(null);

  const images = useQuery({
    queryKey: ["project-images", project?.id],
    enabled: !!project?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_project_images")
        .select("*")
        .eq("project_id", project!.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const withUrls = await Promise.all((data as ProjectImage[]).map(async (r) => {
        const { data: signed } = await supabase.storage.from("portfolio").createSignedUrl(r.storage_path, 3600);
        return { ...r, signedUrl: signed?.signedUrl ?? null };
      }));
      return withUrls;
    },
  });

  async function uploadImages(projectId: string) {
    if (!files || files.length === 0) return;
    const uploads = Array.from(files).map(async (f, idx) => {
      const ext = f.name.split(".").pop() ?? "jpg";
      const path = `${projectId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("portfolio").upload(path, f, { contentType: f.type });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("portfolio_project_images").insert({
        project_id: projectId, storage_path: path, sort_order: idx,
      });
      if (insErr) throw insErr;
    });
    await Promise.all(uploads);
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Project name is required");
      const payload = {
        name: name.trim(),
        client: client.trim() || null,
        service: service.trim() || null,
        location: location.trim() || null,
        completion_date: completionDate || null,
        description: description.trim() || null,
      };
      let projectId = project?.id;
      if (project) {
        const { error } = await supabase.from("portfolio_projects").update(payload).eq("id", project.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("portfolio_projects").insert(payload).select("id").single();
        if (error) throw error;
        projectId = data.id;
      }
      if (projectId) await uploadImages(projectId);
    },
    onSuccess: () => {
      toast.success(project ? "Project updated" : "Project created");
      qc.invalidateQueries({ queryKey: ["dashboard-projects"] });
      qc.invalidateQueries({ queryKey: ["public-projects"] });
      qc.invalidateQueries({ queryKey: ["count", "portfolio_projects"] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const removeImage = useMutation({
    mutationFn: async (img: ProjectImage) => {
      await supabase.storage.from("portfolio").remove([img.storage_path]);
      const { error } = await supabase.from("portfolio_project_images").delete().eq("id", img.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project-images", project?.id] });
      qc.invalidateQueries({ queryKey: ["public-projects"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-border/60 bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-gold">{project ? "Edit project" : "New project"}</h3>
            <p className="text-xs text-muted-foreground">Fields marked * are required.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Project name *"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
          <Field label="Client"><input value={client} onChange={(e) => setClient(e.target.value)} className={inputCls} /></Field>
          <Field label="Service"><input value={service} onChange={(e) => setService(e.target.value)} className={inputCls} /></Field>
          <Field label="Location"><input value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} /></Field>
          <Field label="Completion date"><input type="date" value={completionDate ?? ""} onChange={(e) => setCompletionDate(e.target.value)} className={inputCls} /></Field>
          <Field label="Upload images" className="md:col-span-2">
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-primary" />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputCls} />
          </Field>
        </div>

        {project && images.data && images.data.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Existing images</div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {images.data.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border/60">
                  {img.signedUrl && <img src={img.signedUrl} alt="" className="aspect-square h-full w-full object-cover" />}
                  <button
                    onClick={() => removeImage.mutate(img)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm">Cancel</button>
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-primary disabled:opacity-60"
          >
            {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {project ? "Save changes" : "Create project"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}