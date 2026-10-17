import type { ComponentType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; className?: string }>;

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: IconType;
  children?: ReactNode;
}) {
  return (
    <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-6 sm:p-9">
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {eyebrow && (
            <span className="text-[10px] font-bold tracking-[0.2em] text-violet-300">{eyebrow}</span>
          )}
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight sm:text-4xl">
            {Icon && (
              <span className="clay-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                <Icon size={22} />
              </span>
            )}
            {title}
          </h1>
          {subtitle && <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
