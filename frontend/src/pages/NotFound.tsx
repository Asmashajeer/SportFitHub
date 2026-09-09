import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { MoveLeft, Home, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1e1e1f] text-foreground p-4">
      {/* Visual Element */}
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-trainer-primary rounded-full"></div>
        <h1 className="relative text-9xl font-black tracking-tighter text-muted/20 select-none">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
          <Search className="w-12 h-12 mx-auto mb-2 text-trainer-primary animate-bounce" />
          <p className="text-xl font-semibold">Page not found</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md text-center space-y-6">
        <p className="text-muted-foreground">
          Oops! The page you are looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex gap-2 items-center"
          >
            <MoveLeft className="w-4 h-4" />
            Go Back
          </Button>

          <Button asChild className="w-full sm:w-auto flex gap-2 items-center">
            <Link to="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle Footer branding */}
      <p className="mt-12 text-xs text-muted-foreground/50 uppercase tracking-widest">
        SportfitHub
      </p>
    </div>
  );
};

export default NotFound;
