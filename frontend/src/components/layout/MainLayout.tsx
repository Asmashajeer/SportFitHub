import Sidebar from '../reusable/Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

function MainLayout() {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex flex-col  gap-0 left-0 min-h-screen">
      <Header />
      <div className="flex flex-1 left-0 p-0 m-0 ">
        {user?.hasProfile && <Sidebar />}
        <main className=" flex flex-1  flex-col overflow-y-auto p-8 ">
          {/* <div className="flex-1 py-8 bg-zinc-800/70 "> */}
            <Outlet />
          {/* </div> */}
          {/* <Footer /> */}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
