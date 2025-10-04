"use client";

export default function AdminMenuPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-2 md:px-8 flex flex-col items-center font-sans">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col gap-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2 text-center tracking-tight">Admin Menu</h1>
                <p className="text-blue-500 text-lg md:text-xl font-medium text-center">This is the admin menu page. Add your menu items here.</p>
            </div>
        </div>
    );
}
