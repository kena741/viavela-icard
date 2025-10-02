import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAppDispatch } from "@/store/hooks";
import { updateCustomer, type Customer } from "@/features/provider/customerSlice";
import toast from "react-hot-toast";
import CancelButton from "../CancelButton";

interface EditCustomerModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  providerId: string;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ open, customer, onClose, providerId }) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    address: customer?.address || "",
    country_code: customer?.country_code || "",
  });

  const [phoneNumber, setPhoneNumber] = useState(form.phone || "");
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    if (customer) {
      setForm({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        country_code: customer.country_code || "",
      });
      setPhoneNumber(customer.phone || "");
    }
  }, [customer]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, phone: phoneNumber }));
  }, [phoneNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!customer) return;
    setLoading(true);
    setEditError(null);

    try {
      await dispatch(updateCustomer({
        provider_id: providerId,
        customer: { ...customer, ...form }
      })).unwrap();
      onClose();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setEditError((err as { message?: string }).message || "Failed to update customer");
      } else {
        setEditError("Failed to update customer");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prevLoadingRef.current && !loading && !editError && !open) {
      toast.success("Customer updated successfully!");
    }
    prevLoadingRef.current = loading;
  }, [loading, editError, open]);

  if (!open) return null;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <div
        data-state="open"
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out pointer-events-auto cursor-pointer"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-2xl max-h-screen translate-x-[-50%] translate-y-[-50%] border bg-white p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
        tabIndex={-1}
        onClick={stopPropagation}
      >
        <div className="flex-1 w-full p-4 sm:p-10 relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <h2 className="text-base sm:text-xl font-bold mb-4 text-orange-600">Edit Customer</h2>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black text-xs sm:text-sm"
                placeholder="First Name"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black text-xs sm:text-sm"
                placeholder="Last Name"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black text-xs sm:text-sm"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1">
                <PhoneInput
                  country={"et"}
                  value={(phoneNumber || '').replace(/^\+/, '')}
                  onChange={(v) => setPhoneNumber('+' + String(v).replace(/^\+/, ''))}
                  inputClass="!w-full !text-black !text-xs sm:!text-xs"
                  buttonClass="!bg-white !text-black !border !border-gray-200 rounded !py-2 !text-xs sm:!text-base"
                  dropdownClass="!text-black"
                  placeholder="Phone Number"
                  specialLabel=""
                  enableSearch
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black text-xs sm:text-sm"
                placeholder="Address"
              />
            </div>
          </form>

          <div className="flex justify-end gap-2 sm:gap-3 mt-6 sm:mt-10 pb-8 sm:pb-10 pt-3 sm:pt-4 border-t border-gray-200 w-full">
            <CancelButton onClick={onClose} label="Cancel" />
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium bg-orange-600 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : null}
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>

          {editError && <div className="md:col-span-2 text-red-600 text-xs sm:text-sm mt-2">{editError}</div>}
        </div>
      </div>
    </>
  );
};

export default EditCustomerModal;
