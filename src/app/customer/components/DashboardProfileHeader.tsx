"use client";

import { UserModel } from "@/features/auth/loginSlice";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface DashboardProfileHeaderProps {
  businessName?: string;
  profilePercent?: number;
  showProfileStatusBox?: boolean;
}

export default function DashboardProfileHeader({
  showProfileStatusBox = true,
}: DashboardProfileHeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  function calculateProfilePercent(userObj?: UserModel): number {
    if (!userObj) return 0;

    const fields: (keyof UserModel)[] = [
      "address", "banner", "companyName", "companySize", "country", "currency",
      "email", "firstName", "founded", "headquarters", "industry", "lastName",
      "phoneNumber", "profileBio", "profileImage", "userName"
    ];

    let filled = fields.filter((field) => {
      const value = userObj[field];
      return typeof value === "string" && value.trim().length > 0;
    }).length;

    if (Array.isArray(userObj.socialLinks) && userObj.socialLinks.length > 0) filled++;
    return Math.round((filled / (fields.length + 1)) * 100);
  }

  const profilePercent = calculateProfilePercent(user ?? undefined);

  return (
    <>
      <div className="flex flex-col items-center mb-3 md:mb-6 px-2 md:px-4 mt-16 md:mt-24">
      </div>

      {showProfileStatusBox && profilePercent < 100 && (
        <div className="flex items-center justify-between px-4 py-1.5 md:py-2 mb-4 bg-sky-500/10 rounded-lg outline-1 outline-offset-[-1px] outline-sky-600/40 ">
          <div className="min-w-36 inline-flex flex-col justify-start items-start">
            <div className="justify-center text-zinc-800 text-base font-normal max-sm:text-sm font-['Segoe_UI'] leading-0.5 md:leading-normal">
              Profile {profilePercent}% complete
            </div>
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              href="/provider/dashboard/settings/general"
              className="justify-center text-sky-600 text-sm font-normal font-['Segoe_UI'] leading-tight">
              Expand
            </Link>
          </div>
        </div>
      )}

    </>
  );
}