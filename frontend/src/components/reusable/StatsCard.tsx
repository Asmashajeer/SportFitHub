function StatCard({
  label,
  value,
  cls,
}: {
  label: string;
  value: number;
  cls: string;
}) {
  return (
    <div
      key={label}
      className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-4"
    >
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${cls}`}>{value}</p>
    </div>
  );
}
export default StatCard;
