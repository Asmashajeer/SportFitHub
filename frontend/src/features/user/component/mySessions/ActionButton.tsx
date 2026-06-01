function ActionButton({
  type,
  onAction,
}: {
  type: string;
  onAction: (type: string) => void;
}) {
  const config: Record<string, { label: string; cls: string }> = {
    cancel: {
      label: 'Cancel',
      cls: 'border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer',
    },
    reschedule: {
      label: 'Reschedule',
      cls: 'border-emerald-700/30 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer',
    },
    directions: {
      label: 'Directions',
      cls: 'border-zinc-600 text-zinc-400 hover:bg-zinc-700/50 cursor-pointer',
    },
    rebook: {
      label: 'Rebook',
      cls: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10 cursor-pointer',
    },
    bookagain: {
      label: 'Book again',
      cls: 'border-zinc-600 text-zinc-400 hover:bg-zinc-700/50 cursor-pointer',
    },

    viewDetails: {
      label: 'View',
      cls: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-700/50 cursor-pointer',
    },
  };
  const c = config[type];
  return (  
    <button
      onClick={() => onAction(type)}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150 ${c.cls}`}
    >
      {c.label}
    </button>
  );
}

export default ActionButton;
