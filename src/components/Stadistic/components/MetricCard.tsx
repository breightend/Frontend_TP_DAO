import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  helper?: string;
  variant?: number;
}

const gradientVariants = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-purple-500 to-purple-600",
];

export default function MetricCard({
  icon: Icon,
  title,
  value,
  helper,
  variant = 0,
}: MetricCardProps) {
  const gradient = gradientVariants[variant % gradientVariants.length];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-base-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl">
      <div
        className={`absolute right-0 top-0 size-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${gradient} opacity-10 transition-transform group-hover:scale-110`}
      />
      <div className="relative flex items-start gap-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-base-content/70">{title}</p>
          <p className="mt-1 text-2xl font-bold text-base-content">{value}</p>
          {helper && (
            <p className="mt-1 text-xs text-base-content/50">{helper}</p>
          )}
        </div>
      </div>
    </div>
  );
}
