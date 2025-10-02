"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeAddLeadModal } from "@/features/salesFunnel/addLeadModalSlice";
import { addNewCompany, addNewLead } from "@/features/salesFunnel/leadSlice";
import { fetchCustomersByProviderId, addCustomerWithFunction } from "@/features/provider/customerSlice";
import CancelButton from "./CancelButton";


import { fetchCompanies } from "@/features/salesFunnel/leadSlice";


const funnelStages = [
    "Lead",
    "Contacted",
    "Qualified",
    "Proposal",
    "Negotiation",
];

export default function AddLead() {
    // Local loading states for modals
    const [companyModalLoading, setCompanyModalLoading] = useState(false);
    const [customerModalLoading, setCustomerModalLoading] = useState(false);
    const dispatch = useAppDispatch();
    const open = useAppSelector((state) => state.addLeadModal.open);
    const { loading, error, success } = useAppSelector((state) => state.addLead);

    // Form state
    const [customerName, setCustomerName] = useState("");
    const [serviceTitle, setServiceTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("ETB");
    const [stage, setStage] = useState(funnelStages[0]);
    const [probability, setProbability] = useState("");
    const [expectedCloseDate, setExpectedCloseDate] = useState("");
    const [note, setNote] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [companySearch, setCompanySearch] = useState("");
    const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
    const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState("");
    const [newCompanyWebsite, setNewCompanyWebsite] = useState("");

    // Customer dropdown state
    const [customerId, setCustomerId] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");
    const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
    const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
    const [newCustomerFirstName, setNewCustomerFirstName] = useState("");
    const [newCustomerLastName, setNewCustomerLastName] = useState("");
    const [newCustomerPhone, setNewCustomerPhone] = useState("");
    const [newCustomerEmail, setNewCustomerEmail] = useState("");
    const [newCustomerAddress, setNewCustomerAddress] = useState("");

    // Companies from Redux
    const companies = useAppSelector((state) => state.addLead.companies);
    const companiesLoading = useAppSelector((state) => state.addLead.fetchCompaniesLoading);
    const companiesError = useAppSelector((state) => state.addLead.fetchCompaniesError);

    // Customers from Redux
    const providerId = useAppSelector((state) => state.auth.user?.id); // Adjust selector as needed
    const customers = useAppSelector((state) => state.customer.customers);
    const customerLoading = useAppSelector((state) => state.customer.loading);
    const customerError = useAppSelector((state) => state.customer.error);

    useEffect(() => {
        if (open && providerId) {
            dispatch(fetchCustomersByProviderId(providerId));
            dispatch(fetchCompanies());
        }
    }, [open, providerId, dispatch]);

    // Reset form on modal close
    useEffect(() => {
        if (!open) {
            setCustomerName("");
            setServiceTitle("");
            setAmount("");
            setCurrency("ETB");
            setStage(funnelStages[0]);
            setProbability("");
            setExpectedCloseDate("");
            setNote("");
            setCompanyId("");
            setCompanySearch("");
            setShowCreateCompanyModal(false);
            setNewCompanyName("");
            setCustomerId("");
            setCustomerSearch("");
            setShowCreateCustomerModal(false);
            setCustomerDropdownOpen(false);
            setNewCustomerFirstName("");
            setNewCustomerLastName("");
            setNewCustomerPhone("");
            setNewCustomerEmail("");
        }
    }, [open]);

    // Show toast and close modal on success
    const prevLoadingRef = useRef(false);
    useEffect(() => {
        if (prevLoadingRef.current && !loading && success && open) {
            toast.success("Lead added successfully!");
            dispatch(closeAddLeadModal());
        }
        prevLoadingRef.current = loading;
    }, [loading, success, open, dispatch]);

    if (!open) return null;

    // Filter companies by search
    const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));

    // Filter customers by search (combine first and last name)
    const filteredCustomers = customers.filter(c =>
        (`${c.first_name} ${c.last_name}`.toLowerCase().includes(customerSearch.toLowerCase()))
    );

    // Handle company creation
    const handleCreateCompany = async () => {
        if (!newCompanyName.trim()) return;
        setCompanyModalLoading(true);
        const resultAction = await dispatch(
            addNewCompany({
                name: newCompanyName.trim(),
                website: newCompanyWebsite.trim(),
                provider_id: providerId
            })
        );
        setCompanyModalLoading(false);
        if (addNewCompany.fulfilled.match(resultAction)) {
            toast.success("Company created!");
            setShowCreateCompanyModal(false);
            setNewCompanyName("");
            setNewCompanyWebsite("");
            setCompanyDropdownOpen(false);
            // Optionally, refetch companies here if needed
            dispatch(fetchCompanies());
        } else {
            toast.error(
                typeof resultAction.payload === "string" && resultAction.payload.trim()
                    ? resultAction.payload
                    : "Failed to create company"
            );
        }
    };

    // Handle customer creation
    const handleCreateCustomer = async () => {
        if (!newCustomerFirstName.trim() || !newCustomerLastName.trim() || !newCustomerPhone.trim() || !newCustomerEmail.trim() || !newCustomerAddress.trim() || !providerId) {
            toast.error("All fields are required.");
            return;
        }
        setCustomerModalLoading(true);
        const resultAction = await dispatch(
            addCustomerWithFunction({
                first_name: newCustomerFirstName.trim(),
                last_name: newCustomerLastName.trim(),
                phone: newCustomerPhone.trim(),
                email: newCustomerEmail.trim(),
                address: newCustomerAddress.trim(),
                provider_id: providerId,
            })
        );
        if (addCustomerWithFunction.fulfilled.match(resultAction)) {
            toast.success("Customer created!");
            setShowCreateCustomerModal(false);
            setNewCustomerFirstName("");
            setNewCustomerLastName("");
            setNewCustomerPhone("");
            setNewCustomerEmail("");
            setNewCustomerAddress("");
            setCustomerDropdownOpen(false);
            // Refetch customers and select the newly created one
            const fetchResult = await dispatch(fetchCustomersByProviderId(providerId));
            if (fetchResult.payload && Array.isArray(fetchResult.payload)) {
                // Find the customer by matching all fields
                const created = fetchResult.payload.find(c =>
                    c.first_name === newCustomerFirstName.trim() &&
                    c.last_name === newCustomerLastName.trim() &&
                    c.phone === newCustomerPhone.trim() &&
                    c.email === newCustomerEmail.trim() &&
                    c.address === newCustomerAddress.trim()
                );
                if (created) {
                    setCustomerId(created.id ?? "");
                    setCustomerSearch(`${created.first_name} ${created.last_name}`);
                }
            }
        } else {
            toast.error(
                typeof resultAction.payload === "string" && resultAction.payload.trim()
                    ? resultAction.payload
                    : "Failed to create customer"
            );
        }
        setCustomerModalLoading(false);
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(
            addNewLead({
                customerName: customers.find(c => c.id === customerId)
                    ? `${customers.find(c => c.id === customerId)?.first_name} ${customers.find(c => c.id === customerId)?.last_name}`
                    : customerName,
                service: serviceTitle,
                value: amount,
                stage,
                probability,
                expectedCloseDate,
                note,
                companyId,
                companyName: companies.find(c => c.id === companyId)?.name || "",
                customerId,
                provider_id: providerId,
                currency
            })
        );
    };

    return (
        <>
            <div
                data-state="open"
                className="fixed inset-0 z-50 bg-black/80 pointer-events-auto cursor-pointer"
                aria-hidden="true"
                onClick={() => dispatch(closeAddLeadModal())}
            ></div>
            <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 z-50 flex w-full max-w-3xl h-[100dvh] sm:h-auto max-h-screen sm:translate-x-[-50%] sm:translate-y-[-50%] border bg-white p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
                tabIndex={-1}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-1 w-full p-0 sm:p-0">
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                        onClick={() => dispatch(closeAddLeadModal())}
                        aria-label="Close"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                    {/* Top actions (non-sticky, like AddServiceModal) */}
                    <div className="bg-white flex justify-end gap-3 p-4 md:-mr-6 max-sm:-mt-5">
                        <CancelButton onClick={() => dispatch(closeAddLeadModal())} label="Cancel" />
                        <button
                            type="submit"
                            form="add-lead-form"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                            )}
                            {loading ? "Saving..." : "Add Lead"}
                        </button>
                    </div>
                    <div className="px-4 sm:px-10 py-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white font-semibold text-sm">1</div>
                            <h2 className="text-lg md:text-xl font-semibold text-black">Lead Details</h2>
                        </div>
                        <form id="add-lead-form" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-black">Customer</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white placeholder:text-gray-400"
                                            value={customerSearch}
                                            onChange={e => {
                                                setCustomerSearch(e.target.value);
                                                setCustomerDropdownOpen(true);
                                            }}
                                            onFocus={() => setCustomerDropdownOpen(true)}
                                            onBlur={() => setTimeout(() => setCustomerDropdownOpen(false), 150)}
                                            placeholder="Search or select customer"
                                        />
                                        {customerDropdownOpen && (
                                            <div className="absolute left-0 right-0 bg-white border rounded shadow mt-1 z-10 max-h-60 sm:max-h-40 overflow-y-auto">
                                                {customerLoading ? (
                                                    <div className="px-3 py-2 text-gray-500">Loading customers...</div>
                                                ) : customerError ? (
                                                    <div className="px-3 py-2 text-red-500">{customerError}</div>
                                                ) : filteredCustomers.length > 0 ? (
                                                    filteredCustomers.map(c => (
                                                        <div
                                                            key={c.id}
                                                            className={`px-3 py-3 sm:py-2 cursor-pointer hover:bg-gray-100 ${customerId === c.id ? "bg-gray-200" : ""}`}
                                                            onMouseDown={() => {
                                                                setCustomerId(c.id ?? "");
                                                                setCustomerSearch(c.first_name + " " + c.last_name);
                                                                setCustomerDropdownOpen(false);
                                                            }}
                                                        >
                                                            {c.first_name} {c.last_name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No customer found</div>
                                                )}
                                                <div className="px-3 py-2 border-t">
                                                    <button
                                                        type="button"
                                                        className="text-blue-600 hover:underline text-sm"
                                                        onMouseDown={() => {
                                                            setShowCreateCustomerModal(true);
                                                            setCustomerDropdownOpen(false);
                                                        }}
                                                    >
                                                        + Create new customer
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-black">Company</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white placeholder:text-gray-400"
                                            value={companySearch}
                                            onChange={e => {
                                                setCompanySearch(e.target.value);
                                                setCompanyDropdownOpen(true);
                                            }}
                                            onFocus={() => setCompanyDropdownOpen(true)}
                                            onBlur={() => setTimeout(() => setCompanyDropdownOpen(false), 150)}
                                            placeholder="Search or select company"
                                        />
                                        {companyDropdownOpen && (
                                            <div className="absolute left-0 right-0 bg-white border rounded shadow mt-1 z-10 max-h-60 sm:max-h-40 overflow-y-auto">
                                                {companiesLoading ? (
                                                    <div className="px-3 py-2 text-gray-500">Loading companies...</div>
                                                ) : companiesError ? (
                                                    <div className="px-3 py-2 text-red-500">{companiesError}</div>
                                                ) : filteredCompanies.length > 0 ? (
                                                    filteredCompanies.map(c => (
                                                        <div
                                                            key={c.id}
                                                            className={`px-3 py-3 sm:py-2 cursor-pointer hover:bg-gray-100 ${companyId === c.id ? "bg-gray-200" : ""}`}
                                                            onMouseDown={() => {
                                                                setCompanyId(c.id);
                                                                setCompanySearch(c.name);
                                                                setCompanyDropdownOpen(false);
                                                            }}
                                                        >
                                                            {c.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No company found</div>
                                                )}
                                                <div className="px-3 py-2 border-t">
                                                    <button
                                                        type="button"
                                                        className="text-blue-600 hover:underline text-sm"
                                                        onMouseDown={() => {
                                                            setShowCreateCompanyModal(true);
                                                            setCompanyDropdownOpen(false);
                                                        }}
                                                    >
                                                        + Create new company
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Service Title</label>
                                    <input type="text" className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white placeholder:text-gray-400" value={serviceTitle} onChange={e => setServiceTitle(e.target.value)} placeholder="Service Title" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Amount</label>
                                    <input type="number" className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white placeholder:text-gray-400" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Currency</label>
                                    <select className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white" value={currency} onChange={e => setCurrency(e.target.value)} title="Currency">
                                        <option value="ETB">ETB</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Funnel Stage</label>
                                    <select className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white" value={stage} onChange={e => setStage(e.target.value)} title="Funnel Stage">
                                        {funnelStages.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Probability (%)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white placeholder:text-gray-400" value={probability} onChange={e => setProbability(e.target.value)} placeholder="Probability" min={0} max={100} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Expected Close Date</label>
                                    <input type="date" className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white" value={expectedCloseDate} onChange={e => setExpectedCloseDate(e.target.value)} title="Expected Close Date" placeholder="Expected Close Date" />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white font-semibold text-sm">2</div>
                                    <h3 className="text-lg font-semibold text-black">Notes</h3>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-black">Notes</label>
                                    <textarea className="w-full border border-gray-200 rounded px-3 py-2 mt-1 text-black bg-white placeholder:text-gray-400" value={note} onChange={e => setNote(e.target.value)} placeholder="Notes" rows={2} />
                                </div>

                                {showCreateCompanyModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                            <h3 className="text-lg font-bold mb-4">Create New Company</h3>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 rounded px-3 py-2 mb-4 text-black bg-white placeholder:text-gray-400"
                                                value={newCompanyName}
                                                onChange={e => setNewCompanyName(e.target.value)}
                                                placeholder="New company name"
                                            />
                                            <input
                                                type="url"
                                                className="w-full border border-gray-200 rounded px-3 py-2 mb-4 text-black bg-white placeholder:text-gray-400"
                                                value={newCompanyWebsite}
                                                onChange={e => setNewCompanyWebsite(e.target.value)}
                                                placeholder="Company website (optional)"
                                            />
                                            <div className="flex justify-end gap-3 mt-6">
                                                <CancelButton onClick={() => setShowCreateCompanyModal(false)} label="Cancel" />
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                                                    onClick={handleCreateCompany}
                                                    disabled={!newCompanyName.trim() || companyModalLoading}
                                                >
                                                    {companyModalLoading ? (
                                                        <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                                                    )}
                                                    {companyModalLoading ? "Saving..." : "Add"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showCreateCustomerModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                            <h3 className="text-lg font-bold mb-4">Create New Customer</h3>
                                            <div className="mb-4 grid grid-cols-1 gap-3">
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-black bg-white placeholder:text-gray-400"
                                                    value={newCustomerFirstName}
                                                    onChange={e => setNewCustomerFirstName(e.target.value)}
                                                    placeholder="First Name"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-black bg-white placeholder:text-gray-400"
                                                    value={newCustomerLastName}
                                                    onChange={e => setNewCustomerLastName(e.target.value)}
                                                    placeholder="Last Name"
                                                    required
                                                />
                                                <input
                                                    type="tel"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-black bg-white placeholder:text-gray-400"
                                                    value={newCustomerPhone}
                                                    onChange={e => setNewCustomerPhone(e.target.value)}
                                                    placeholder="Phone Number"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-black bg-white placeholder:text-gray-400"
                                                    value={newCustomerEmail}
                                                    onChange={e => setNewCustomerEmail(e.target.value)}
                                                    placeholder="Email"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-black bg-white placeholder:text-gray-400"
                                                    value={newCustomerAddress}
                                                    onChange={e => setNewCustomerAddress(e.target.value)}
                                                    placeholder="Address"
                                                    required
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3 mt-6">
                                                <CancelButton onClick={() => setShowCreateCustomerModal(false)} label="Cancel" />
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                                                    onClick={handleCreateCustomer}
                                                    disabled={!(newCustomerFirstName.trim() && newCustomerLastName.trim() && newCustomerPhone.trim() && newCustomerEmail.trim() && newCustomerAddress.trim()) || customerModalLoading}
                                                >
                                                    {customerModalLoading ? (
                                                        <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                                                    )}
                                                    {customerModalLoading ? "Saving..." : "Add"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-white flex justify-end max-md:mb-16 gap-3 p-4 border-t border-gray-200 mb-5">
                                <CancelButton onClick={() => dispatch(closeAddLeadModal())} label="Cancel" />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                                    )}
                                    {loading ? "Saving..." : "Add Lead"}
                                </button>
                            </div>
                            {error && (
                                <div className="md:col-span-2 text-red-600 text-sm mt-2">{error}</div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
