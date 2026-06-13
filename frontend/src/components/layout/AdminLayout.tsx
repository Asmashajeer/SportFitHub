// AdminMainLayout.tsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../features/admin/component/AdminSidebar';

function AdminMainLayout() {
  return (
    <div className="flex min-h-screen bg-background">      
     <aside className="fixed top-0 left-0 h-screen w-64 overflow-y-auto border-r border-zinc-800 px-10 py-6">
      <AdminSidebar activePage="dashboard" />
    </aside>  
      <main className=" flex-1 ml-64  overflow-y-auto">
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminMainLayout;