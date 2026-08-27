
import PaymentStats from "../component/payment-management/PaymentStats";
import PaymentsTable from "../component/payment-management/paymentTable";



const AdminPayments = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-1">
                Payments
          </h1>
          <p className="text-sm text-zinc-500">
            Manage and approve user payments
          </p>
        </div>

        {/* Stats */}
        <PaymentStats />

        <PaymentsTable/>
      </div>
    </div>
  );
};

export default AdminPayments;
