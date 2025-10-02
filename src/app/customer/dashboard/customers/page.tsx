"use client";

import React, { useEffect, useState } from "react";
import DashboardProfileHeader from "../../components/DashboardProfileHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCustomerWithFunction, fetchCustomersByProviderId, removeCustomerFromProvider } from "@/features/provider/customerSlice";
import { toast } from "sonner";
import type { Customer } from "@/features/provider/customerSlice";
import CustomerSidebar from "../../components/customer/CustomerSidebar";
import AppLoader from "@/app/components/AppLoader";
import AddButton from "@/app/components/AddButton";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CustomerCard from "@/app/provider/components/customer/CustomerCard";
import CustomerTable from "@/app/provider/components/customer/CustomerTable";
import AddCustomerModal from "@/app/provider/components/modals/AddCustomerModal";
import EditCustomerModal from "@/app/provider/components/modals/EditCustomerModal";

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  useAppSelector((state) => state.createCustomer);

  const customers = useAppSelector((state) => state.customer.customers);
  const customerLoading = useAppSelector((state) => state.customer.loading);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; customers?: Customer }>({ open: false });
  const [editDialog, setEditDialog] = useState<{ open: boolean; customers?: Customer }>({ open: false });

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCustomersByProviderId(user.id));
    }
  }, [user?.id, dispatch]);

  const handleSubmit = async () => {
    if (!firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    const phoneTrimmed = phone.trim();

    if (email.trim()) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!isValidEmail) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    if (!user?.id) {
      toast.error("User not authenticated.");
      return;
    }

    setLoading(true);

    try {
      await dispatch(
        addCustomerWithFunction({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim() || undefined,
          phone: phoneTrimmed,
          provider_id: user.id,
        })
      ).unwrap();

      await dispatch(fetchCustomersByProviderId(user.id));

      setShowModal(false);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      toast.success("Customer added successfully.");
    } catch (err: unknown) {
      const errorMessage = typeof err === "string"
        ? err
        : (err instanceof Error ? err.message : "Failed to add customer.");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const normalized = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  const digits = (s: string) => s.replace(/\D/g, '');
  const filteredCustomers = customers
    .filter((c) => {
      const q = normalized(search);
      const qDigits = digits(q);
      const fullName = normalized(`${c.first_name} ${c.last_name}`);
      const email = normalized(c.email ?? '');
      const phoneDigits = digits(c.phone ?? '');
      return fullName.includes(q) || email.includes(q) || (qDigits && phoneDigits.includes(qDigits));
    })
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
      <div className="">
        <DashboardProfileHeader />
        <div className="mb-6 flex flex-col items-start text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-1 text-orange-600">
            Customers
          </h2>
          <p className="mt-1 max-sm:text-sm text-gray-500">
            Manage your customer relationships
          </p>
        </div>

        <div className="sm:hidden max-sm:mx-5">
          <AddButton onClick={() => setShowModal(true)} label="Add Customer" />
        </div>
        <AddCustomerModal />
        <EditCustomerModal
          open={editDialog.open}
          customer={editDialog.customers || null}
          onClose={() => setEditDialog({ open: false })}
          providerId={user?.id ?? ""}
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative ">
        <div className="p-4 sm:hidden">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="search by name, phone, or email"
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
              className="w-full h-10 rounded-md border border-gray-400 bg-white px-3 py-2 text-sm pl-10 focus:outline-none focus:border-orange-600"
            />
          </div>
        </div>

        {/* Mobile card list */}
        <div className="grid gap-3 sm:hidden min-h-[120px]">
          {customerLoading ? (
            <div className="flex justify-center items-center p-4">
              <AppLoader />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No customers found.</div>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id}
                customer={customer}
                onSelect={(c) => setSelectedCustomer(c)}
                onDelete={(c) => setDeleteDialog({ open: true, customers: c })}
                onEdit={(c) => setEditDialog({ open: true, customers: c })}
              />
            ))
          )}
        </div>

        {/* Desktop CRM Table */}
        <div className="hidden sm:block">
          <CustomerTable
            customers={customers}
            onDelete={(c) => setDeleteDialog({ open: true, customers: c })}
            onEdit={(c) => setEditDialog({ open: true, customers: c })}
            onSelect={(c) => setSelectedCustomer(c)}
            onAddCustomer={() => setShowModal(true)}
          />
        </div>
      </div>

      {selectedCustomer && (
        <CustomerSidebar
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {showModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setShowModal(false)} />
          <div
            role="dialog"
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg max-h-[90vh] overflow-y-auto sm:max-w-[425px]"
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-normal leading-none tracking-tight">Add New Customer</h2>
            </div>

            <form className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label htmlFor="firstName" className="text-sm font-medium leading-none">First Name *</label>
                    <input
                      id="firstName"
                      required
                      autoComplete="off"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base mt-1 focus:outline-none focus:ring-0 focus:border-gray-200"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="lastName" className="text-sm font-medium leading-none">Last Name *</label>
                    <input
                      id="lastName"
                      autoComplete="off"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base mt-1 focus:outline-none focus:ring-0 focus:border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-medium leading-none">Phone Number *</label>
                  <PhoneInput
                    country={'et'}
                    value={(phone || '').replace(/^\+/, '')}
                    onChange={(v) => setPhone('+' + String(v).replace(/^\+/, ''))}
                    inputClass="!w-full !text-black !border-gray-200 !h-10"
                    buttonClass="!bg-white !text-black"
                    dropdownClass="!text-black"
                    inputStyle={{ width: '100%' }}
                    placeholder="Phone Number"
                    specialLabel=""
                    enableSearch
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-base mt-1 focus:outline-none focus:ring-0 focus:border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 cursor-pointer rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium bg-orange-600 text-white hover:opacity-90 h-10 px-4 py-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Add Customer"
                  )}
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4"
              aria-label="Close modal"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x mt-4 h-4 w-4 cursor-pointer"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
        </>
      )}
      {deleteDialog.open && (
        <>
          <div
            data-state="open"
            className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto cursor-pointer"
            aria-hidden="true"
            onClick={() => setDeleteDialog({ open: false })}
          ></div>
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-2xl max-h-screen translate-x-[-50%] translate-y-[-50%] border bg-white p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-1 w-full p-0 sm:p-10">
              <h2 className="text-lg font-bold text-red-700 mb-2">Delete Customer</h2>
              <p className="mb-4 text-gray-700">Are you sure you want to delete Customer <span className="font-semibold">{deleteDialog.customers?.first_name} {deleteDialog.customers?.last_name}</span>? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setDeleteDialog({ open: false })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    if (deleteDialog.customers) {
                      dispatch(removeCustomerFromProvider({
                        provider_id: user?.id as string,
                        customer_id: deleteDialog.customers.id as string
                      }));
                    }
                    setDeleteDialog({ open: false });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
