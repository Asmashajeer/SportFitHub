import Sidebar from "../../../components/layout/Sidebar";


function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activePage="Dashboard" />
      {/* main Content */}
      <h1>Admin Dashboard</h1>
    </div>
  );
}

export default Dashboard;
