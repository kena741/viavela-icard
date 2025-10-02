"use client";
import { toast } from "react-hot-toast";
import DashboardProfileHeader from "@/app/customer/components/DashboardProfileHeader";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategoriesWithSubs } from "@/features/service/categoryWithSubSlice";
import { useAppSelector as useAuthSelector } from "@/store/hooks";
import { updateProvider } from "@/features/auth/loginSlice";
import { uploadFilesToSupabase, deleteImageFromSupabase } from "@/features/supabaseImageUtils";
import dynamic from "next/dynamic";
import SaveButton from "@/app/customer/components/SaveButton";
// import { useGenerateBusinessNameMutation } from "@/features/aiApi/aiApi";
const ImageCropper = dynamic(() => import("@/app/components/ImageCropper"), { ssr: false });

import Select from "react-select";

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center group cursor-help">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-info text-sky-600"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
      <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 shadow z-10">
        {text}
      </span>
    </span>
  );
}

export default function BusinessSettingsPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categoryWithSub) as {
    categories: { id: string; categoryName: string }[];
    loading: boolean;
  };
  const { user } = useAuthSelector((state) => state.auth);

  const [selectedProfession, setSelectedProfession] = useState<string>("");
  const [selectedProfessionName, setSelectedProfessionName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [headquarters, setHeadquarters] = useState<string>("");
  const [founded, setFounded] = useState<string>("");
  const [profileBio, setProfileBio] = useState<string>("");
  const [saving, setSaving] = useState(false);


  // Image upload state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Cropper modal state
  const [cropperOpen, setCropperOpen] = useState<null | 'profile' | 'banner'>(null);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const cropperObjectUrlRef = useRef<string | null>(null);

  function openCropper(kind: 'profile' | 'banner', file: File) {
    if (cropperObjectUrlRef.current) {
      URL.revokeObjectURL(cropperObjectUrlRef.current);
      cropperObjectUrlRef.current = null;
    }
    const url = URL.createObjectURL(file);
    cropperObjectUrlRef.current = url;
    setCropperImage(url);
    setCropperOpen(kind);
  }
  // const [generateBusinessName, { isLoading: generating }] = useGenerateBusinessNameMutation();

  // const handleGenerateBusinessName = async () => {
  //   if (!selectedProfessionName) {
  //     toast.error("Please select a profession first.");
  //     return;
  //   }

  //   try {
  //     const name = await generateBusinessName({ category: selectedProfessionName }).unwrap();
  //     setCompanyName(name);
  //     toast.success("Business name generated!");
  //   } catch {
  //     toast.error("Failed to generate business name.");
  //   }
  // };


  // Upload a single file to Supabase using the reusable utility
  async function uploadImageToSupabase(file: File, folder: string): Promise<string> {
    const urls = await uploadFilesToSupabase([file], folder);
    return urls[0];
  }


  const handleDeleteImage = async (imageUrl: string | null, type: 'profile' | 'banner') => {
    if (!user) return;

    try {
      if (imageUrl) await deleteImageFromSupabase(imageUrl);

      const updatedPayload: { id: string | undefined; profileImage?: string | undefined; banner?: string | undefined } = { id: user.user_id };
      if (type === 'profile') {
        setProfileImage(null);
        setProfileImageFile(null);
        updatedPayload.profileImage = undefined;
      } else {
        setBannerImage(null);
        setBannerImageFile(null);
        updatedPayload.banner = undefined;
      }

      const result = await dispatch(updateProvider(updatedPayload));

      if (updateProvider.rejected.match(result)) {
        toast.error("Failed to update backend after image deletion");
      } else {
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image deletion failed");
    }
  };


  // Handle profile image selection (open cropper)
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (profileInputRef.current) profileInputRef.current.value = "";
    if (file) {
      openCropper('profile', file);
    }
  };

  // Handle banner image selection (open cropper)
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (bannerInputRef.current) bannerInputRef.current.value = "";
    if (file) {
      openCropper('banner', file);
    }
  };

  // Handle crop complete
  const handleCropComplete = (croppedBlob: Blob, croppedUrl: string) => {
    if (cropperOpen === 'profile') {
      setProfileImage(croppedUrl);
      setProfileImageFile(new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' }));
    } else if (cropperOpen === 'banner') {
      setBannerImage(croppedUrl);
      setBannerImageFile(new File([croppedBlob], 'banner.jpg', { type: 'image/jpeg' }));
    }
    setCropperOpen(null);
    setCropperImage(null);
    if (cropperObjectUrlRef.current) {
      URL.revokeObjectURL(cropperObjectUrlRef.current);
      cropperObjectUrlRef.current = null;
    }
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setCropperOpen(null);
    setCropperImage(null);
    if (cropperObjectUrlRef.current) {
      URL.revokeObjectURL(cropperObjectUrlRef.current);
      cropperObjectUrlRef.current = null;
    }
  };
  useEffect(() => {
    return () => {
      if (cropperObjectUrlRef.current) {
        URL.revokeObjectURL(cropperObjectUrlRef.current);
        cropperObjectUrlRef.current = null;
      }
    };
  }, []);


  // Upload images and get URLs before saving
  const handleUploadImages = async () => {
    let uploadedProfileUrl = profileImage;
    let uploadedBannerUrl = bannerImage;
    if (user?.id && profileImageFile) {
      uploadedProfileUrl = await uploadImageToSupabase(profileImageFile, `profileImages/${user.id}`);
    }
    if (user?.id && bannerImageFile) {
      uploadedBannerUrl = await uploadImageToSupabase(bannerImageFile, `bannerImages/${user.id}`);
    }
    return { uploadedProfileUrl, uploadedBannerUrl };
  };


  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesWithSubs());
    }
    if (user) {
      setCompanyName(user.companyName || "");
      setProfileBio(user.profileBio || "");
      setSelectedProfession(user.professionId || user.categoryId || "");
      setProfileImage(user.profileImage || null);
      setBannerImage(user.banner || null);
      setCompanySize(user.companySize || "");
      setHeadquarters(user.headquarters || "");
      setFounded(user.founded || "");
      setSelectedProfessionName(user.industry || user.categoryId || "");
    }
  }, [dispatch, user, categories.length]);



  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Upload images if new ones are selected
      const { uploadedProfileUrl, uploadedBannerUrl } = await handleUploadImages();

      const result = await dispatch(
        updateProvider({
          companyName,
          profileBio,
          companySize,
          headquarters,
          founded,
          categoryId: selectedProfession,
          professionId: selectedProfession,
          industry: selectedProfessionName, // Assuming industry is same as profession
          profileImage: uploadedProfileUrl ?? undefined,
          banner: uploadedBannerUrl ?? undefined,
          id: user?.user_id,
        })
      );

      // Check for error in result using RTK matcher
      if (updateProvider.rejected.match(result)) {
        interface ErrorPayload {
          message?: string;
        }
        toast.error(
          (result.payload as ErrorPayload)?.message ||
          "Failed to update profile"
        );
      } else {
        toast.success("Profile updated successfully!");

        // 🔥 Notify other open tabs that provider profile was updated
        const bc = new BroadcastChannel("provider_updates");
        bc.postMessage({ type: "PROVIDER_UPDATED", id: user.user_id });
        bc.close();
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        toast.error(
          (err as { message?: string }).message || "Failed to update profile"
        );
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
      <div className="">
        <DashboardProfileHeader />
        <div className="mb-6 flex flex-col items-start text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-1 text-sky-600">
            Business Settings
          </h2>
          <p className="mt-1 max-sm:text-sm text-gray-500">
            Business Settings
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative ">
        <div className="p-3 space-y-6 pt-3">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Profile Picture</label>
                  <InfoTooltip text="Recommended size: 300x300px (1:1 square)" />
                </div>
                <div className="flex flex-col items-center space-y-3 p-4 border border-gray-200 rounded-md">
                  <div className="relative">
                    <span className="relative flex shrink-0 overflow-hidden rounded-full w-24 h-24 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => profileInputRef.current?.click()}>
                      {profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="aspect-square h-full w-full" alt="Profile" src={profileImage} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/96x96"; }} />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </span>
                    {profileImage && (
                      <button className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors" title="Delete image" type="button" onClick={() => handleDeleteImage(profileImage, 'profile')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="flex flex-col gap-1 px-3 py-2 text-sm h-auto mt-2 w-full
             sm:flex-row sm:gap-2 sm:px-4 sm:py-2 sm:text-sm sm:h-10 sm:w-auto
             cursor-pointer items-start sm:items-center justify-start sm:justify-center
             whitespace-normal sm:whitespace-nowrap rounded-md font-medium ring-offset-white
             transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
             focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
             [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
             border border-input bg-white hover:bg-accent hover:text-accent-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-upload w-4 h-4 mr-0 sm:mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" x2="12" y1="3" y2="15"></line>
                    </svg>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm">
                      <span>Upload Picture</span>
                    </div>
                  </button>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    title="Upload profile picture"
                    placeholder="Upload profile picture"
                    ref={profileInputRef}
                    onChange={handleProfileImageChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Banner Image</label>
                  <InfoTooltip text="Recommended size: 5760x1383px (4.166:1 ratio)" />
                </div>
                <div className="p-4 border border-gray-200 rounded-md space-y-3">
                  <div className="relative">
                    <div className="aspect-[3/1] bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={() => bannerInputRef.current?.click()}>
                      {bannerImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bannerImage} alt="Banner" className="w-full h-full object-cover rounded-lg" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/1200x400"; }} />
                      ) : (
                        <div className="w-full h-[80px] flex items-center justify-center text-gray-400 bg-gray-200 rounded-lg">No Banner</div>
                      )}
                    </div>
                    {bannerImage && (
                      <button className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors" title="Delete banner" type="button" onClick={() => handleDeleteImage(bannerImage, 'banner')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                      </button>
                    )}
                  </div>
                  <button className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-white hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2" type="button" onClick={() => bannerInputRef.current?.click()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload w-4 h-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                    Upload Banner
                  </button>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    title="Upload banner image"
                    placeholder="Upload banner image"
                    ref={bannerInputRef}
                    onChange={handleBannerImageChange}
                  />
                </div>
              </div>
            </div>
            {/* ImageCropper modal */}
            {cropperOpen && cropperImage && (
              <ImageCropper
                image={cropperImage}
                aspect={cropperOpen === 'profile' ? 1 : 4.166}
                cropShape={cropperOpen === 'profile' ? 'rect' : 'rect'} // LinkedIn company profile uses square, not round
                onCancel={handleCropCancel}
                onCropComplete={handleCropComplete}
              />
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="company_name">Business Name</label>
                <input
                  className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="company_name"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Business Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="profession">Profession</label>

                <Select
                  classNamePrefix="react-select"
                  className="max-sm:text-sm"
                  options={categories.map((cat: { id: string; categoryName: string }) => ({ value: cat.id, label: cat.categoryName }))}
                  value={selectedProfession ? { value: selectedProfession, label: categories.find((cat: { id: string; categoryName: string }) => cat.id === selectedProfession)?.categoryName || "" } : null}
                  onChange={(option: { value: string; label: string } | null) => {
                    const val = option?.value ?? "";
                    setSelectedProfession(val);
                    setSelectedProfessionName(categories.find((cat: { id: string; categoryName: string }) => cat.id === val)?.categoryName || "");
                  }}
                  isClearable
                  isSearchable
                  isDisabled={loading}
                  placeholder="Select Category"
                  styles={{
                    menu: (base) => ({ ...base, maxHeight: 200 }),
                    menuList: (base) => ({ ...base, maxHeight: 200, overflowY: 'auto' }),
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="company_size">Company Size</label>
                <select
                  id="company_size"
                  className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={companySize}
                  onChange={e => setCompanySize(e.target.value)}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1001-5000">1001-5000 employees</option>
                  <option value="5001-10000">5001-10,000 employees</option>
                  <option value=">10000">10,001+ employees</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="headquarters">Headquarters</label>
                <input
                  className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="headquarters"
                  value={headquarters}
                  onChange={e => setHeadquarters(e.target.value)}
                  placeholder="e.g. Addis Ababa, Ethiopia"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="founded">Founded</label>
                <input
                  className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="founded"
                  value={founded}
                  onChange={e => setFounded(e.target.value)}
                  placeholder="e.g. 2024"
                />
              </div>
              <div className="space-y-2">
                {/* <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="profile_bio">Profile Bio</label>
                    <button className="justify-center whitespace-nowrap font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-white hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 flex items-center gap-1.5 text-xs bg-gradient-to-r from-sky-600/10 to-[#00695C]/10 border-sky-600/20 hover:bg-gradient-to-r hover:from-sky-600/20 hover:to-[#00695C]/20" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-3.5 w-3.5 text-sky-600"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
                      <span className="text-sky-600">Generate with AI</span>
                    </button>
                  </div> */}

                <textarea
                  id="profile_bio"
                  className="max-sm:text-xs form-textarea w-full min-h-[120px] p-2 border border-gray-200 rounded-md focus:outline-none focus:border-sky-600 bg-white text-black"
                  placeholder="Write a short bio about your business (max 1500 characters). This will be displayed on your service page."
                  maxLength={1500}
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This bio will be displayed on your customer-facing service page.</p>
              </div>
            </div>
          </div>
          <SaveButton onClick={handleSave} label={"Save Changes"} loading={saving} />

        </div>
      </div>
    </div>
  );
}