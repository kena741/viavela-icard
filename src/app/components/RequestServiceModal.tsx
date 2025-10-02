import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createOrderAsync, resetOrder } from "@/features/bookService/orderSlice";
import toast, { Toaster } from "react-hot-toast";
import { ServiceModel } from "@/features/service/serviceSlice";
import WeeklyBookingPicker from "@/app/components/WeeklyBookingPicker";

interface RequestServiceModalProps {
  open: boolean;
  provider_id: string;
  serviceDetails: ServiceModel;
  onClose: () => void;
  // optional customer info to prefill the form (e.g. logged-in user)
  customer?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
}

const RequestServiceModal: React.FC<RequestServiceModalProps> = ({ open, provider_id, serviceDetails, onClose, customer }) => {
  const dispatch = useAppDispatch();
  const { loading, error, orderId } = useAppSelector((state) => state.order);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    description: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [touched, setTouched] = useState(false);
  const toYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const [bookingDatePart, setBookingDatePart] = useState<string>(toYMD(new Date()));
  const [bookingTimePart, setBookingTimePart] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setForm((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!form.firstName || !form.lastName || !form.email || !form.phoneNumber || !bookingDatePart || !bookingTimePart) return;
    await dispatch(createOrderAsync({
      ...form,
      bookingDate: new Date(`${bookingDatePart}T${bookingTimePart}`),
      serviceDetails,
      provider_id,
    }));
  };

  React.useEffect(() => {
    if (orderId && open) {
      setForm({ firstName: "", lastName: "", email: "", phoneNumber: "", description: "" });
      setPhoneNumber("");
      setTouched(false);
      setBookingDatePart(toYMD(new Date()));
      setBookingTimePart("");
      toast.success("Booking successful!");
      onClose();
      dispatch(resetOrder());
    }
  }, [orderId, open, onClose, dispatch]);

  // Prefill form with passed customer info when modal opens
  React.useEffect(() => {
    if (open && customer) {
      setForm((prev) => ({
        ...prev,
        firstName: customer.firstName ?? prev.firstName,
        lastName: customer.lastName ?? prev.lastName,
        email: customer.email ?? prev.email,
        phoneNumber: customer.phoneNumber ?? prev.phoneNumber,
      }));
      if (customer.phoneNumber) setPhoneNumber(customer.phoneNumber);
    }
  }, [open, customer]);

  if (!open) return null;

  return (
    <>
      <Toaster position="top-right" />
      <div
        data-state="open"
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto"
        data-aria-hidden="true"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-left max-h-[98vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-sky-600">Book This Service</h2>
          {/* Service Detail Display */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-black">
              {serviceDetails?.serviceName || 'Service'}
            </h3>
            <p className="text-sm text-black">
              <span>
                ETB&nbsp;{serviceDetails?.price ? Number(serviceDetails.price).toLocaleString() : 'N/A'}
              </span>
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-black mb-1">First Name</label>
                <input id="firstName" name="firstName" type="text" value={form.firstName} onChange={handleChange} required className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600 placeholder-black text-black" placeholder="First name" />
                {touched && !form.firstName && <span className="text-xs text-red-600">Required</span>}
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-black mb-1">Last Name</label>
                <input id="lastName" name="lastName" type="text" value={form.lastName} onChange={handleChange} required className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600 placeholder-black text-black" placeholder="Last name" />
                {touched && !form.lastName && <span className="text-xs text-red-600">Required</span>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600 placeholder-black text-black" placeholder="Enter your email" />
              {touched && !form.email && <span className="text-xs text-red-600">Required</span>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-black mb-1">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600 placeholder-black text-black"
              />
              {touched && !form.phoneNumber && <span className="text-xs text-red-600">Required</span>}
            </div>
            <div>
              <WeeklyBookingPicker
                date={bookingDatePart}
                time={bookingTimePart}
                onDateChange={setBookingDatePart}
                onTimeChange={setBookingTimePart}
                labelPrefix="Preferred Booking"
              />
              {touched && (!bookingDatePart || !bookingTimePart) && <span className="text-xs text-red-600">Date and time are required</span>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black mb-1">Additional Notes</label>
              <textarea id="description" name="description" rows={2} value={form.description} onChange={handleChange} required className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600 placeholder-black text-black textarea-black" placeholder="Any special requests?"></textarea>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-10 px-4 py-2 w-full"
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 border border-gray-200 bg-white hover:bg-gray-100 text-black h-10 px-4 py-2 w-full"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RequestServiceModal;
