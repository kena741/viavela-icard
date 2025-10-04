import DashboardProfileHeader from "../../../components/DashboardProfileHeader";

export default function PaymentsSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-3 md:px-8 pb-20 md:pb-8 mx-auto w-full font-sans">
      <DashboardProfileHeader />
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-1 text-center">Payments Settings</h2>
        <p className="text-blue-500 mt-1 max-sm:text-sm text-center">General Settings</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-7 flex flex-col items-center justify-center min-h-[200px]">
        {/* Add payment settings form or content here */}
        <span className="text-blue-400">No payment settings available yet.</span>
      </div>
    </div>
  );
}
