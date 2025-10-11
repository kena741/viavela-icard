'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { formatDistanceToNow } from "date-fns";
import { getUserDetail, updateCustomer } from "@/features/auth/loginSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { supabase } from "@/supabaseClient";
import ImageCropper from "@/app/components/ImageCropper";
import MobileSidebar from "./MobileSidebar";
import { resetStore } from "@/store/resetActions";

type Notification = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
  request_id: string;
};

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const isFetchingUser = useRef(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [, setCroppedFile] = useState<File | null>(null);
  const [imageTimestamp, setImageTimestamp] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileImage = user?.profile_image;
  const [logoVersion, setLogoVersion] = useState<number>(0);

  useEffect(() => {
    if (profileImage) setLogoVersion(Date.now());
  }, [profileImage]);


  const onShare = () => {
    if (user && user.id) {
      const siteUrl = `${window.location.origin}/services/${user.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(siteUrl).then(() => {
          toast.success('Site link copied!', { position: 'bottom-center', duration: 2000 });
        });
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = siteUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.success('Site link copied!', { position: 'bottom-center', duration: 2000 });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async (userId: string) => {
      isFetchingUser.current = true;
      await dispatch(getUserDetail(userId));
      isFetchingUser.current = false;
    };
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id) fetchUser(user.id);
      else router.push("/auth/login");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) fetchUser(session.user.id);
      if (event === "SIGNED_OUT") {
        dispatch(resetStore());
        router.push("/auth/login");
      }

    });
    return () => listener?.subscription.unsubscribe();
  }, [dispatch, router]);

  useEffect(() => {
    if (!user?.user_id) return;
    let mounted = true;
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, body, created_at, is_read, user_id, request_id")
        .eq("user_id", user.user_id)
        .order("created_at", { ascending: false });
      if (!error && data && mounted) setNotifications(data as Notification[]);
    };
    fetchNotifications();
    const channel = supabase
      .channel(`notification-feed-${user.user_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.user_id}` },
        (payload) => setNotifications((prev) => [payload.new as Notification, ...prev])
      )
      .subscribe();
    return () => {
      mounted = false;
      void channel.unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, [user?.user_id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name ?? ""}`.trim() : user?.email || "";
  const firstLetter = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setCropperImage(imageUrl);
    setCropperOpen(true);
    setMobileOpen(false); // close sidebar
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
    setCroppedFile(file);
    uploadCroppedImage(file);
    setCropperOpen(false);
    setCropperImage(null);
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setCropperImage(null);
  };

  const uploadCroppedImage = async (file: File) => {
    if (!user?.id) return;
    const filePath = `${user.id}/profile_${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("betegnabucket").upload(filePath, file, { upsert: true });
    if (error) {
      toast.error("Upload failed");
      return;
    }
    const { data } = supabase.storage.from("betegnabucket").getPublicUrl(filePath);
    const url = data?.publicUrl;
    if (!url) {
      toast.error("Could not get public URL");
      return;
    }
    await dispatch(updateCustomer({ id: user.user_id, profile_image: url }));
    setImageTimestamp(Date.now());
    toast.success("Profile picture updated!");
  };

  const handleLogout = async () => {
    dispatch(resetStore());
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 bg-white z-40
          h-14 sm:h-16
          flex items-center justify-between
          px-4 sm:px-6
          border-b border-b-blue-200
          ml-0 lg:ml-64
        "
      >
        <div className="flex items-center gap-2 lg:hidden">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={100}
            height={60}
            className="h-24 w-24 object-contain"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative lg:hidden" ref={dropdownRef}>
            <button
              className="relative h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="Notifications"
            >
              <Image height={16} width={16} src={"/img/notification-icon.svg"} alt="" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <div
              className={`absolute -right-[50px] mt-2 w-72 bg-white border border-gray-200 shadow-xl rounded-md z-50 transform transition-all duration-200 origin-top ${dropdownOpen ? "scale-100 opacity-100" : "scale-80 opacity-0 pointer-events-none"
                }`}
            >
              <div className="px-3 py-2 border-b border-gray-200 text-gray-900 flex justify-between items-center mx-1">
                <span className="font-semibold">Notifications</span>
                <button
                  className="text-gray-700 text-xs font-semibold"
                  onClick={async () => {
                    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user?.user_id);
                    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                  }}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={async () => {
                      if (!n.is_read) {
                        await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
                        setNotifications((prev) =>
                          prev.map((notif) => (notif.id === n.id ? { ...notif, is_read: true } : notif))
                        );
                      }
                      router.push(`/provider/dashboard/requests/${n.request_id}`);
                      setDropdownOpen(false);
                    }}
                    className="relative px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-200 cursor-pointer"
                  >
                    {!n.is_read && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-gray-900">{n.title}</p>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{n.body}</p>
                  </div>
                ))}
              </div>
              <div className="text-center text-sm px-3 py-5 border-t-0.5 border-gray-200">
                <button
                  onClick={() => {
                    router.push("/provider/dashboard/requests/all");
                    setDropdownOpen(false);
                  }}
                  className="text-gray-700 font-semibold text-xs"
                >
                  View all requests
                </button>
              </div>
            </div>
          </div>

          <button
            aria-label="Open menu"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
            onClick={() => setMobileOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:flex absolute right-0 items-center gap-3 sm:gap-4">

            <div className="flex gap-2 sm:gap-4">
              {user?.subscription_plan === "business_card" && (
                <button
                  className="cursor-pointer justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 outline-1 outline-offset-[-1px] outline-blue-600/40 disabled:pointer-events-none disabled:opacity-50  bg-white hover:bg-gray-100 text-black h-9 rounded-md px-3 flex items-center gap-1 tour-view-site"
                  onClick={() => {
                    if (user && user.id) window.open(`/services/${user.id}`, "_blank");
                  }}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye text-neutral-600 h-4 w-4">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="text-neutral-600 text-sm font-normal font-['Segoe_UI'] leading-tight">
                    View My Site
                  </span>
                </button>
              )}
              {user?.subscription_plan === "menu" && (
                <button
                  className="cursor-pointer justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 outline-1 outline-offset-[-1px] outline-blue-600/40 disabled:pointer-events-none disabled:opacity-50  bg-white hover:bg-gray-100 text-black h-9 rounded-md px-3 flex items-center gap-1 tour-view-menu"
                  onClick={() => {
                    if (user && user.id) window.open(`/menu/${user.id}`, "_blank");
                  }}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu text-neutral-600 h-4 w-4"><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                  <span className="text-neutral-600 text-sm font-normal font-['Segoe_UI'] leading-tight">
                    View My Menu
                  </span>
                </button>
              )}
              <button
                className="cursor-pointer h-9 px-3 py-[0.70px] bg-blue-600 rounded-md outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-1"
                onClick={onShare}
                type="button"
              >
                <Image height={16} width={16} src={"/img/telegram-outline.svg"} alt={""} />
                <span className="text-white text-sm font-normal font-['Segoe_UI'] leading-tight">Share</span>
              </button>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                className="relative cursor-pointer h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <Image height={16} width={16} src={"/img/notification-icon.svg"} alt={""} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <div
                className={`absolute -right-[50px] mt-2 w-72 bg-white border border-gray-200 shadow-xl rounded-md z-40 transform transition-all duration-200 origin-top ${dropdownOpen ? "scale-100 opacity-100" : "scale-80 opacity-0 pointer-events-none"}`}
              >
                <div className="px-3 py-2  border-b border-gray-200 text-gray-900 flex justify-between items-center mx-1">
                  <span className="font-semibold">Notifications</span>
                  <button
                    className="text-gray-700 text-xs font-semibold cursor-pointer"
                    onClick={async () => {
                      await supabase.from("notifications").update({ is_read: true }).eq("user_id", user?.id);
                      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={async () => {
                        if (!n.is_read) {
                          await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
                          setNotifications((prev) => prev.map((notif) => (notif.id === n.id ? { ...notif, is_read: true } : notif)));
                        }
                        router.push(`/provider/dashboard/requests/${n.request_id}`);
                      }}
                      className="relative px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-200 cursor-pointer"
                    >
                      {!n.is_read && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm text-gray-900">{n.title}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{n.body}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm px-3 py-5 border-t-0.5 border-gray-200">
                  <button
                    onClick={() => {
                      router.push("/provider/dashboard/requests/all");
                      setDropdownOpen(false);
                    }}
                    className="text-gray-700 font-semibold text-xs cursor-pointer"
                  >
                    View all requests
                  </button>
                </div>
              </div>
            </div>

            <input type="file" accept="image/*" className="hidden" id="profile-upload" onChange={handleImageUpload} title="Upload profile image" />
            <div className="relative mr-4 mt-1" ref={profileDropdownRef}>
              <button className="h-9 w-9 rounded-full overflow-hidden cursor-pointer" onClick={() => setShowProfileDropdown((prev) => !prev)}>
                {profileImage ? (
                  <div className="h-9 w-9 rounded-full p-[2px] bg--blue-600 ">
                    <Image
                      src={imageTimestamp ? `${profileImage}?t=${imageTimestamp}` : profileImage}
                      alt="Profile"
                      width={36}
                      height={36}
                      onError={(e) => { (e.target as HTMLImageElement).src = "/img/logo.png"; }}
                      className="h-full w-full rounded-full object-cover bg-white"
                    />
                  </div>
                ) : (
                  <div className="h-9 w-9 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
                    {firstLetter}
                  </div>
                )}
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 -mr-2 mt-1 w-56 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden animate-fade-in-up">
                  <button
                    className="flex text-black cursor-pointer items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      document.getElementById("profile-upload")?.click();
                    }}
                  >
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 5v14m7-7H5" />
                    </svg>
                    Upload Profile Picture
                  </button>
                  <button
                    className="flex cursor-pointer items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    onClick={handleLogout}
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1.5A2.25 2.25 0 0110.75 20.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h5.5A2.25 2.25 0 0113 6.75V8" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {cropperOpen && cropperImage && (
          <ImageCropper image={cropperImage} aspect={1} cropShape="round" onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
        )}
      </header>

      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        userId={user?.id}
        onShare={onShare}
        onLogout={handleLogout}
        handleImageUpload={handleImageUpload}
        profileImage={profileImage}
        logoVersion={logoVersion}
      />

    </>
  );
}
