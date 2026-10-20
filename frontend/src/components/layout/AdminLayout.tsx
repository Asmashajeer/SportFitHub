import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import AdminSidebar from '@/features/admin/component/AdminSidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const close = () => setSidebarOpen(false);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-zinc-100">
          <Menu size={22} />
        </button>
        <div className={`flex items-center w-full justify-center md:justify-start md:w-auto  bg-black cursor-pointer group`} onClick={() => navigate('/')}>
          <img src="/sportfithub_logo.png" alt="SportFitHub" className="h-8 w-auto  md:h-10 px-4 object-contain transition-transform group-hover:scale-105" />
        </div>
        <div className="w-6" />
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={close} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-64 z-40
        border-r border-zinc-800 px-4 py-6
        overflow-y-auto bg-zinc-900
        transition-transform duration-300
        md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <AdminSidebar activePage="dashboard" onClose={close} />
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 mt-13 md:mt-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
