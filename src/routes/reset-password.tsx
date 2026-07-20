import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, authButtonClass, authFieldClass } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery hash and fires PASSWORD_RECOVERY / SIGNED_IN
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Choose a new password for your ASTAD Survey account."
      footer={<Link to="/login" className="hover:text-gold">Back to sign in</Link>}
    >
      {!ready ? (
        <div className="rounded-2xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
          Waiting for a valid password recovery link… Open the link from your email on this device.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">New password</label>
            <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={authFieldClass} />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">Confirm new password</label>
            <input id="confirm" type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={authFieldClass} />
          </div>
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}