import { Trophy, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1a1a1a]/50 border-2 border-dashed border-white/5 rounded-3xl text-center">
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
        <Trophy size={20} className="text-emerald-500/50" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Ready for your session?
      </h2>
      <p className="text-gray-400 max-w-sm mb-8">
        Start your  journey or book a session today!
      </p>

      <button
        onClick={() => navigate('/sports')}
        className="group flex items-center gap-3 bg-primary hover:bg-emerald-600 text-black font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
      >
        <Plus
          size={20}
          className="group-hover:rotate-90 transition-transform"
        />
        Explore Sessions
      </button>
    </div>
  );
};
export default EmptyState;
