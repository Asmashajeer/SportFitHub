import { Loader2 } from 'lucide-react';
export const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* Loader2 is the standard 'spoked' spinner icon */}
      <Loader2 className="w-10 h-10 text-green-600 animate-spin" />

      <p className="mt-4 text-sm font-medium text-gray-500 tracking-wide uppercase">
        Loading ...
      </p>
    </div>
  );
};
