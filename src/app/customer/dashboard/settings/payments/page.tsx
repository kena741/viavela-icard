import DashboardProfileHeader from "../../../components/DashboardProfileHeader";

export default function PaymentsSettingsPage() {
  return (
    <div className="p-8">
      <DashboardProfileHeader />
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-[#F72585]">Payments Settings</h2>
        <p className="text-gray-500 mt-1">General Settings</p>
      </div>

    </div>
  );
}
