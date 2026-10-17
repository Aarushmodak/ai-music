import type { ComponentType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; className?: string }>;

export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: IconType;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="clay-accent flex h-10 w-10 items-center justify-center rounded-2xl">
              <Icon size={20} />
            </span>
          )}
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        </div>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
