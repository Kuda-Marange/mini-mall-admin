
interface StatItemProps {
  label: string;
  value: string | number;
}

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex-1 min-w-[110px] px-6 py-4 text-center sm:text-left">
      <p className="text-sm text-muted-foreground whitespace-nowrap">{label}</p>
      <p className="text-xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}




