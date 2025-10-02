import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="bg-gray-100 min-h-screen py-8 px-2 sm:px-4">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hotel Management Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Hotel Management</h2>
                        <p className="text-gray-600 mb-4">Add, edit, or remove your hotels</p>
                        <Link href="/hotels" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition block text-center">
                            Manage Hotels
                        </Link>
                    </div>
                    {/* Menu Management Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
                        <p className="text-gray-600 mb-4">Update your restaurant menus</p>
                        <Link href="/menu" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition block text-center">
                            Manage Menus
                        </Link>
                    </div>
                    {/* QR Codes Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">QR Codes</h2>
                        <p className="text-gray-600 mb-4">Download QR codes for your menus</p>
                        <Link href="/hotels" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition block text-center">
                            View QR Codes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
