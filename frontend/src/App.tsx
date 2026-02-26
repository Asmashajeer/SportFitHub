

import {Toaster} from 'react-hot-toast'
import './App.css'
import AppRouter from "./routes/AppRouter"
import { useAuth } from './features/auth/hook/useAuth';
import { LoadingScreen } from './components/reusable/LoadingScreen';

function App() {
 
   const { isLoading } = useAuth(); // Initialize here

    if (isLoading) {
      return (
      <div>Loading Session...
        <LoadingScreen/>
      </div>
    )}
      
  return (
    <>
     <Toaster 
        position="bottom-center"       
        
        toastOptions={{
          // Define default options
          className: '',
          duration: 3000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            style: {
            background: '#000',
            color: '#22c55e',
            },
            icon: '✅',
            iconTheme: {
            primary: '#000',   
            secondary: '#22c55e', 
      },
          },
          error: {
             duration: 3000,
             style: {
              background: '#ef4444',
              color: '#fff',
            },
             icon: '❌',
            iconTheme: {
              primary: '#fff',    // White circle
              secondary: '#ef4444',
            }
          },
          custom: {
              duration: 3000,
              style: {
              background: '#3b82f6',
              color: '#fff',
             },
               icon: 'ℹ️',
            iconTheme: {
              primary: '#fff',
              secondary: '#3b82f6',
            }
          }
        }} 
      /> 
      {isLoading?( <LoadingScreen />):  (<AppRouter/>)}
      
    </>
  )
}

export default App
