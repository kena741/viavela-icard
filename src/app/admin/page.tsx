import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-2 md:px-8 flex flex-col items-center font-sans">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8 md:p-14 flex flex-col gap-12">
                <section className="flex flex-col items-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-2 tracking-tight">Admin Dashboard</h1>
                    <p className="text-blue-500 text-lg md:text-xl font-medium">Manage your hotel, menu, and QR codes</p>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Hotel Management Card */}
                    <div className="bg-white rounded-2xl shadow p-7 flex flex-col items-center gap-3">
                        <h2 className="text-lg font-semibold text-blue-800 mb-1">Hotel Management</h2>
                        <p className="text-gray-500 text-sm mb-2 text-center">Add, edit, or remove your hotels</p>
                        <Link href="/hotels" className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm text-center">
                            Manage Hotels
                        </Link>
                    </div>
                    {/* Menu Management Card */}
                    <div className="bg-white rounded-2xl shadow p-7 flex flex-col items-center gap-3">
                        <h2 className="text-lg font-semibold text-blue-800 mb-1">Menu Management</h2>
                        <p className="text-gray-500 text-sm mb-2 text-center">Update your restaurant menus</p>
                        <Link href="/menu" className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm text-center">
                            Manage Menus
                        </Link>
                    </div>
                    {/* QR Codes Card */}
                    <div className="bg-white rounded-2xl shadow p-7 flex flex-col items-center gap-3">
                        <h2 className="text-lg font-semibold text-blue-800 mb-1">QR Codes</h2>
                        <p className="text-gray-500 text-sm mb-2 text-center">Download QR codes for your menus</p>
                        <Link href="/hotels" className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm text-center">
                            View QR Codes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
