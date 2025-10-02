import "./sidebar-vars.css";
import BottomNavBar from "../components/bottomNavBar";
import Navbar from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="root" >
      <div className="bg-white text-black">
        <div
          className="group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar"
        >
          <div className="min-h-screen bg-white flex w-full overflow-hidden">
            <main className="relative flex min-h-svh flex-1 flex-col bg-white md:ml-[var(--sidebar-width)] peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow w-full pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0">
              <Sidebar />
              <Toaster position="bottom-right" richColors />
              <div className="bg-gray-50 font-sans text-gray-900">
                {children}
              </div>
            </main>
            <Navbar />
          </div>
          <BottomNavBar />
        </div>
      </div>
    </div>
  );
}
