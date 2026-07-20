import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, authButtonClass, authFieldClass } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Reset link sent — check your inbox");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a secure reset link."
      footer={<div>Remembered it? <Link to="/login" className="font-semibold text-gold hover:underline">Back to sign in</Link></div>}
    >
      {sent ? (
        <div className="rounded-2xl border border-gold/40 bg-gold/5 p-5 text-center">
          <MailCheck className="mx-auto h-8 w-8 text-gold" />
          <p className="mt-3 text-sm">
            If an account exists for <span className="font-semibold text-foreground">{email}</span>, a password reset link has been sent.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={authFieldClass} />
          </div>
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}