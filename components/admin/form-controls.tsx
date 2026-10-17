"use client";

import { useActionState, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import type { ActionResult } from "@/app/admin/actions";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-300/50 focus:bg-white/[0.09]";

export const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function SubmitButton({
  children,
  className = "btn-clay",
  pendingLabel = "Saving…",
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-60`}>
      {pending ? (
        <>
          <Loader2 size={15} className="mr-2 animate-spin" /> {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ActionForm({
  action,
  children,
  className = "",
  resetOnSuccess = true,
}: {
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form
      action={formAction}
      key={resetOnSuccess && state?.ok ? "reset" : "form"}
      className={className}
    >
      {children}
      {state?.error && <p className="mt-3 text-xs font-semibold text-pink-400">{state.error}</p>}
      {state?.ok && !state.error && <p className="mt-3 text-xs font-semibold text-emerald-400">Saved.</p>}
    </form>
  );
}

export function DangerButton({
  action,
  children,
  confirm,
  className = "btn-glass text-pink-300",
}: {
  action: () => Promise<ActionResult>;
  children: ReactNode;
  confirm?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        startTransition(async () => {
          await action();
        });
      }}
      className={`${className} inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-bold transition disabled:opacity-60`}
    >
      {pending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : null}
      {children}
    </button>
  );
}
