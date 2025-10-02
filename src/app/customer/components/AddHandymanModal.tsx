"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategoriesWithSubs } from "@/features/service/categoryWithSubSlice";
import { addHandyman, closeAddHandymanModal } from "@/features/handyman/addDeleteHandymanSlice";
import CancelButton from "./CancelButton";
import Select from "react-select";

type CountryData = {
  name: string;
  dialCode: string;
  format?: string;
  countryCode: string;
  iso2: string;
};

export default function AddHandymanModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.addHandymanModal.open);
  const { categories, loading: catLoading } = useAppSelector((state) => state.categoryWithSubs);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchCategoriesWithSubs());
    }
  }, [open, dispatch]);

  useEffect(() => {
    setSubCategoryId("");
  }, [categoryId]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const subcategories = categories.find((cat) => cat.id === categoryId)?.subcategories || [];
  const { loading, error } = useAppSelector((state) => state.addHandymanModal);
  const { user } = useAppSelector((state) => state.auth);

  const prevLoadingRef = useRef(false);
  useEffect(() => {
    if (prevLoadingRef.current && !loading && !error && open) {
      toast.success("Handyman added successfully!");
      dispatch(closeAddHandymanModal());
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setCountryCode("");
      setCategoryId("");
      setSubCategoryId("");
      setPassword("");
    }
    prevLoadingRef.current = loading;
  }, [loading, error, open, dispatch]);

  if (!open) return null;

  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const selectedSubcategory = selectedCategory?.subcategories?.find((sub) => sub.id === subCategoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addHandyman({
        firstName,
        lastName,
        email,
        phoneNumber,
        countryCode,
        password,
        category: selectedCategory?.categoryName || "",
        subCategory: selectedSubcategory?.subCategoryName || "",
        provider_id: user?.id || "",
        categoryId: selectedCategory?.id || "",
        subCategoryId: selectedSubcategory?.id || "",
      })
    );
  };

  return (
    <>
      <div
        data-state="open"
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto cursor-pointer"
        aria-hidden="true"
        onClick={() => dispatch(closeAddHandymanModal())}
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-2xl max-h-screen translate-x-[-50%] translate-y-[-50%] border bg-white p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
        tabIndex={-1}
        onClick={stopPropagation}
      >
        <div className="flex-1 w-full p-4 sm:p-10">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={() => dispatch(closeAddHandymanModal())}
            aria-label="Close"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-sky-600">Add Handyman</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded px-3 py-2 mt-1 placeholder-black text-black text-xs sm:text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  title="First Name"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded px-3 py-2 mt-1 placeholder-black text-black text-xs sm:text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  title="Last Name"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded px-3 py-2 mt-1 placeholder-black text-black text-xs sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  title="Email"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1">
                  <PhoneInput
                    country={"et"}
                    value={phoneNumber}
                    onChange={(value, country: CountryData) => {
                      setPhoneNumber("+" + value);
                      setCountryCode("+" + country.dialCode || "");
                    }}
                    inputClass="!w-full !text-black !text-xs sm:!text-base"
                    buttonClass="!bg-white !text-black !border !border-gray-200 rounded !py-2 !text-xs sm:!text-base"
                    dropdownClass="!text-black"
                    inputStyle={{ width: "100%" }}
                    placeholder="Phone Number"
                    specialLabel=""
                    enableSearch
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-200 rounded px-3 py-2 mt-1 placeholder-black text-black pr-10 text-xs sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    title="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 3l18 18M10.73 6.21A9.77 9.77 0 0 1 12 6c7 0 10.5 6 10.5 6a17.6 17.6 0 0 1-2.09 2.88M6.53 6.53C4.06 8.36 1.5 12 1.5 12s3.5 6.5 10.5 6.5c1.13 0 2.21-.13 3.24-.37M17.47 17.47A9.77 9.77 0 0 1 12 17.5c-7 0-10.5-6-10.5-6a17.6 17.6 0 0 1 2.09-2.88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.5 9.5a3.5 3.5 0 0 1 5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="text-xs sm:text-sm">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                <Select
                  classNamePrefix="react-select"
                  className="text-xs sm:text-sm"
                  options={categories.map((cat) => ({ value: cat.id, label: cat.categoryName }))}
                  value={
                    categories.find((cat) => cat.id === categoryId)
                      ? { value: categoryId, label: categories.find((cat) => cat.id === categoryId)?.categoryName || "" }
                      : null
                  }
                  onChange={(option: { value: string; label: string } | null) => setCategoryId(option ? option.value : "")}
                  isClearable
                  isSearchable
                  isDisabled={catLoading}
                  placeholder="Select Category"
                  styles={{
                    control: (p) => ({ ...p, minHeight: 36 }),
                    menu: (p) => ({ ...p, maxHeight: 200 }),
                    menuList: (p) => ({ ...p, maxHeight: 200, overflowY: "auto" }),
                  }}
                />
              </div>
              <div className="text-xs sm:text-sm">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Subcategory</label>
                <Select
                  classNamePrefix="react-select"
                  className="text-xs sm:text-sm"
                  options={subcategories.map((sub) => ({ value: sub.id, label: sub.subCategoryName }))}
                  value={
                    subcategories.find((sub) => sub.id === subCategoryId)
                      ? {
                        value: subCategoryId,
                        label: subcategories.find((sub) => sub.id === subCategoryId)?.subCategoryName || "",
                      }
                      : null
                  }
                  onChange={(option: { value: string; label: string } | null) => setSubCategoryId(option ? option.value : "")}
                  isClearable
                  isSearchable
                  isDisabled={!categoryId || subcategories.length === 0}
                  placeholder={categoryId ? (subcategories.length ? "Select Subcategory" : "No subcategories") : "Select Category First"}
                  styles={{
                    control: (p) => ({ ...p, minHeight: 36 }),
                    menu: (p) => ({ ...p, maxHeight: 200 }),
                    menuList: (p) => ({ ...p, maxHeight: 200, overflowY: "auto" }),
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 sm:gap-3 mt-6 sm:mt-10 pb-8 sm:pb-10 pt-3 sm:pt-4 border-t border-gray-200">
              <CancelButton onClick={() => dispatch(closeAddHandymanModal())} label="Cancel" />
              <button
                type="submit"
                className="inline-flex max-md:mb-12 items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4">
                    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                    <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
                  </svg>
                )}
                {loading ? "Saving..." : "Add"}
              </button>
            </div>
            {error && <div className="md:col-span-2 text-red-600 text-xs sm:text-sm mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
