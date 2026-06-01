import BookingsStats from "../component/booking-management/BookingStats";
import BookingsTable from "../component/booking-management/BookingsTable";
import Approvals from "../component/trainer-management/Approvals";
import TrainersTable from "../component/trainer-management/TrainersTable";


const AdminTrainers = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-1">
           Trainers
          </h1>
          <p className="text-sm text-zinc-500">
            Manage and approve Trainers
          </p>
        </div>

        {/* Stats */}
        <Approvals />

        <TrainersTable />
      </div>
    </div>
  );
};

export default AdminTrainers;
