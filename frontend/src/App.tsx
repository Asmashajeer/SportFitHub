import { Toaster } from 'react-hot-toast';
import './App.css';
import AppRouter from './routes/AppRouter';
import { useAuth } from './features/auth/hook/useAuth';
import { LoadingScreen } from './components/reusable/LoadingScreen';
import { useSocketConnection } from './hooks/useSocketConnection';
import { useInitSocketListeners } from './hooks/useInitSocketListeners ';

function App() {
  const { isLoading } = useAuth(); // Initialize here
  useSocketConnection();
  useInitSocketListeners();
  if (isLoading) {
    return (
      <div>
        Loading Session...
        <LoadingScreen />
      </div>
    );
  }

  return (
    <>
     <Toaster
        position="bottom-center"
        toastOptions={{
           style: {
            zIndex: 99999,             
          },
          duration: 3000,
          success: {
            icon: '✅',
            style: {
              background: '#baf2a7',
              color: '#227008',
              boxShadow: '0 0 0 0.5px #166534',  // ← acts as border, always visible
              borderRadius: '8px',
               zIndex: 99999,
            },
          },
          error: {
            icon: '❌',
            style: {
              background: '#f5aec2',
              color: '#99062f',
              boxShadow: '0 0 0 0.5px #991b1b',
              borderRadius: '8px',
               zIndex: 99999,
            },
            duration: 6000,
          },
          custom: {           
            style: {
              background: '#f5aec2',
              color: '#227008',
              boxShadow: '0 0 0 0.5px #991b1b',
              borderRadius: '8px',
               zIndex: 99999,
            },
          },
          
        }}
      />
      {isLoading ? <LoadingScreen /> : <AppRouter />}
    </>
  );
}

export default App;
