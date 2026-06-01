import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        You don't have permission to view this page. If you think this is a
        mistake, please contact support.
      </p>
      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    </div>
  );
};
