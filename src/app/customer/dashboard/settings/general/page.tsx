"use client";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { updateCustomer } from "@/features/auth/loginSlice";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SaveButton from "@/app/customer/components/SaveButton";
import toast from "react-hot-toast";
import DashboardProfileHeader from "@/app/customer/components/DashboardProfileHeader";

export default function GeneralSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    phone_number: "",
    country: "Ethiopia",
    currency: "ETB (Ethiopian Birr)",
    country_code: "",
  });
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        user_name: user.user_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        country: user.country || "Ethiopia",
        currency: user.currency || "ETB (Ethiopian Birr)",
        country_code: user.country_code || "",
      });
    }
  }, [user]);




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string, country: CountryData) => {
    const fullNumber = value.startsWith("+") ? value : "+" + value;
    setForm((prev) => ({ ...prev, phone_number: fullNumber }));
    setForm((prev) => ({ ...prev, country_code: "+" + (country.dialCode || "") }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving form data:", user?.user_id);
    setErrorMsg(null);
    try {
      const resultAction = await dispatch(updateCustomer({ ...form, id: user?.user_id }));
      if (updateCustomer.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully!");
      } else {
        setErrorMsg((resultAction as { payload?: string }).payload || "Failed to update profile.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message || "Failed to update profile.");
      } else {
        setErrorMsg("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
      <div className="">
        <DashboardProfileHeader />
        <div className="mb-6 flex flex-col items-start text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-1 text-blue-600">
            General Settings</h2>
          <p className="mt-1 max-sm:text-sm text-gray-500">
            General Settings</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative ">
        <div className="p-3 md:p-6 space-y-4 pt-3 md:pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black" htmlFor="first_name">First Name</label>
              <input
                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-600 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white text-black"
                id="first_name"
                value={form.first_name}
                name="first_name"
                type="text"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black" htmlFor="last_name">Last Name</label>
              <input
                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-600 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white text-black"
                id="last_name"
                value={form.last_name}
                name="last_name"
                type="text"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="user_name">
                User Name</label>
              <input
                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-600 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white text-black"
                id="user_name"
                value={form.user_name}
                name="user_name"
                type="text"
                placeholder="Enter your username"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black" htmlFor="email">Email</label>
              <input
                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-600 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white text-black"
                id="email"
                value={form.email}
                name="email"
                type="email"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black" htmlFor="country">Country</label>
              <input
                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-600 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white text-black"
                id="country"
                value={form.country}
                name="country"
                type="text"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black" htmlFor="phone_number">Phone Number</label>
              <PhoneInput
                country={'et'}
                value={form.phone_number}
                onChange={handlePhoneChange}
                inputClass="!w-full !text-black max-sm:text-sm !border-gray-200 !h-10"
                buttonClass="!bg-white !text-black"
                dropdownClass="!text-black"
                inputStyle={{ width: '100%' }}
                placeholder="Phone Number"
                specialLabel=""
                enableSearch
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black" htmlFor="currency">Currency</label>
              <input
                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-600 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white text-black"
                id="currency"
                value={form.currency}
                name="currency"
                type="text"
                onChange={handleInputChange}
              />
              <p className="text-xs text-black">Currency automatically set based on Ethiopia</p>
            </div>
          </div>

          {errorMsg && (
            <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
          )}
          <SaveButton onClick={handleSave} label={"Save Changes"} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}
