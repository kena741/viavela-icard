'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import WeeklyBookingPicker from '@/app/components/WeeklyBookingPicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCustomersByProviderId } from '@/features/provider/customerSlice';
import type { Customer } from '@/features/provider/customerSlice';
import { createOrderAsync } from '@/features/bookService/orderSlice';

interface RequestServiceModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    id: string;
    serviceName: string;
    price?: number;
    discountedPrice?: number;
    serviceImage?: string[];
  } | null;
  providerId: string;
}

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const toLocal09 = (raw: string) => {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('251')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  d = d.slice(0, 9);
  return d ? '0' + d : '';
};

export default function RequestServiceModal({
  open,
  onClose,
  service,
  providerId,
}: RequestServiceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state) => state.customer);
  const { loading } = useAppSelector((state) => state.order);

  const [visible, setVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [preferredDate, setPreferredDate] = useState(toYMD(new Date()));
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [, setSelectedCustomerId] = useState<string | null>(null);

  const isFormValid =
    clientName.trim() !== '' &&
    clientPhone.toString().trim().length === 10 &&
    preferredDate.trim() !== '' &&
    preferredTime.trim() !== '';

  useEffect(() => {
    if (providerId) dispatch(fetchCustomersByProviderId(providerId));
  }, [dispatch, providerId]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      setTimeout(() => setVisible(false), 200);
    }
  }, [open]);

  const triggerClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) triggerClose();
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setDropdownOpen(false);
    };
    if (visible) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, triggerClose]);

  const filteredCustomers = customers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.phone} ${c.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCustomer = (c: Customer) => {
    const fullName = `${c.first_name} ${c.last_name}`;
    setClientName(fullName);
    setClientEmail(c.email ?? '');
    setClientPhone(toLocal09(String(c.phone ?? '')));
    setPhoneNumber(String(c.phone ?? ''));
    setSelectedCustomerId(c.id ?? null);
    setDropdownOpen(false);
  };

  const handlePhoneChange = (value: string, country: CountryData) => {
    const full = value.startsWith('+') ? value : '+' + value;
    console.log(country);
    setPhoneNumber(full);
    // Keep local 09 format for validation and submission consistency
    setClientPhone(toLocal09(full));
  };

  // WeeklyBookingPicker handles availability fetching and time validity.

  const handleSubmit = async () => {
    if (!service) return;
    const time = preferredTime;
    if (!(clientName.trim() && clientPhone.toString().trim().length === 10 && preferredDate && time)) return;
    const [firstName, ...lastParts] = clientName.split(' ');
    const lastName = lastParts.join(' ') || '-';
    await dispatch(
      createOrderAsync({
        firstName,
        lastName,
        email: clientEmail,
        phoneNumber: clientPhone,
        provider_id: providerId,
        bookingDate: new Date(`${preferredDate}T${time}`),
        description: notes,
        serviceDetails: {
          id: service.id,
          serviceName: service.serviceName,
          price: String(service.discountedPrice ?? service.price ?? '0'),
          discount: '0',
          serviceImage: service.serviceImage ?? [],
          discountedPrice: function (): number | undefined {
            throw new Error('Function not implemented.');
          }
        },
      })
    );
    triggerClose();
  };

  if (!visible || !service) return null;

  return (
    <div className="fixed inset-0 z-[100]  flex items-center justify-center bg-black/60">
      <div
        ref={modalRef}
        className={classNames(
          'relative bg-white w-full max-w-lg h-[98vh] rounded-md shadow-lg flex flex-col overflow-y-auto transition-all',
          isClosing ? 'zoom-out' : 'zoom-in'
        )}
      >
        <div className="flex items-center justify-between mx-6 py-2 pt-4 border-b border-b-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Request Service</h2>
          <button onClick={triggerClose} className="text-gray-600 hover:text-gray-900 text-2xl cursor-pointer font-semibold">
            ×
          </button>
        </div>

        <div className="px-6 py-4 flex-1">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">{service.serviceName}</h3>
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="text-sm font-medium block mb-1">Client Name*</label>
            <input
              value={clientName || searchTerm}
              onClick={() => setDropdownOpen((prev) => !prev)}
              onChange={(e) => {
                setClientName(e.target.value);
                setSearchTerm(e.target.value);
                setSelectedCustomerId(null);
              }}
              placeholder="Select or enter client name"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            {dropdownOpen && (
              <div className="absolute top-full mt-1 w-full max-h-60 bg-white shadow-md shadow-gray-200 border-2 border-gray-200 rounded-md overflow-y-auto z-50">
                <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">Existing Clients</div>
                {filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    role="option"
                    aria-selected={clientName === `${c.first_name} ${c.last_name}`}
                    className="cursor-pointer px-3 ml-2 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleSelectCustomer(c)}
                  >
                    <p className="font-medium">
                      {c.first_name} {c.last_name}
                    </p>
                    <div className="flex flex-col text-xs text-gray-500">
                      <span>{toLocal09(String(c.phone ?? ''))}</span>
                      <span className="truncate">{c.email}</span>
                    </div>
                  </div>
                ))}
                {filteredCustomers.length === 0 && <p className="text-center p-2 text-sm text-gray-400">No clients found</p>}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium block mb-1">Client Email</label>
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium block mb-1">Client Phone*</label>
            <PhoneInput
              country={'et'}
              value={phoneNumber}
              onChange={handlePhoneChange}
              inputClass="!w-full !text-black"
              buttonClass="!bg-white !text-black"
              dropdownClass="!text-black"
              inputStyle={{ width: '100%', color: 'black' }}
              placeholder="Phone Number"
              specialLabel=""
              enableSearch
            />
          </div>

          <div className="mt-4">
            <WeeklyBookingPicker
              date={preferredDate}
              time={preferredTime}
              onDateChange={setPreferredDate}
              onTimeChange={setPreferredTime}
              labelPrefix="Preferred"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium block mb-1">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requests or information"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm min-h-[100px]"
            />
          </div>
        </div>

        <div className="mx-6 py-4 border-t border-t-gray-200 bg-white sticky bottom-0 z-10">
          <div className="flex flex-col gap-3">
            <button
              disabled={!isFormValid || loading}
              onClick={handleSubmit}
              className="cursor-pointer bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button onClick={triggerClose} className="border border-gray-500 text-gray-700 px-4 py-2 rounded-md text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
