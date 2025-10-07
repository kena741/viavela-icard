"use client";
import DashboardProfileHeader from "@/app/customer/components/DashboardProfileHeader";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCustomer } from "@/features/auth/loginSlice";

export default function PaymentSettingsPage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [showModal, setShowModal] = useState(false);
    const [paymentName, setPaymentName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [payments, setPayments] = useState(user?.payments || []);

    const openModal = () => {
        setShowModal(true);
        setPaymentName("");
        setAccountNumber("");
    };
    const closeModal = () => setShowModal(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPayment = { name: paymentName, account: accountNumber };
        const updatedPayments = [...payments, newPayment];
        setPayments(updatedPayments);
        if (user?.user_id || user?.id) {
            await dispatch(updateCustomer({
                ...user,
                id: user?.user_id || user?.id,
                payments: updatedPayments,
            }));
        }
        closeModal();
    };

    const handleDelete = async (idx: number) => {
        const updatedPayments = payments.filter((_, i) => i !== idx);
        setPayments(updatedPayments);
        if (user?.user_id || user?.id) {
            await dispatch(updateCustomer({
                ...user,
                id: user?.user_id || user?.id,
                payments: updatedPayments,
            }));
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
            <div className="">
                <DashboardProfileHeader />
                <div className="mb-6 flex flex-col items-start text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-1 text-blue-600">Payment Settings</h2>
                    <p className="mt-1 max-sm:text-sm text-gray-500">Manage your payment methods and view your payment history.</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative ">
                <div className="p-3 md:p-6 space-y-8 pt-3 md:pt-6">
                    <section>
                        <div className="mb-4">
                            <button className="mt-2 py-2 px-6 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition" onClick={openModal}>Add Payment Method</button>
                        </div>
                        <h3 className="text-lg font-semibold  mb-2">Added Payments</h3>
                        <div className="bg-neutral-100 rounded-xl p-4">
                            {user?.payments?.length === 0 ? (
                                <p className="text-gray-700">No payments have been added yet.</p>
                            ) : (
                                <ul className="mb-2">
                                    {user?.payments?.map((p, idx) => (
                                        <li key={idx} className="flex items-center justify-between py-2 group">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-blue-700">{p.name}</span>
                                                <span className="ml-2 text-gray-700">{p.account}</span>
                                            </div>
                                            <button
                                                type="button"
                                                title="Delete payment method"
                                                className="ml-2 text-red-500 hover:text-red-700 p-1 rounded transition"
                                                onClick={() => handleDelete(idx)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>
                {/* Modal Popup */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto relative">
                            <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-xl font-bold" onClick={closeModal}>&times;</button>
                            <h3 className="text-xl font-bold text-blue-600 mb-4">Add Payment Method</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="paymentName" className="block text-sm font-medium text-gray-700 mb-1">Payment Name</label>
                                    <input
                                        id="paymentName"
                                        name="paymentName"
                                        type="text"
                                        required
                                        value={paymentName}
                                        onChange={e => setPaymentName(e.target.value)}
                                        placeholder="e.g. CBE, Telebirr"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                    <input
                                        id="accountNumber"
                                        name="accountNumber"
                                        type="text"
                                        required
                                        value={accountNumber}
                                        onChange={e => setAccountNumber(e.target.value)}
                                        placeholder="Enter account number"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button type="button" className="py-2 px-6 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={closeModal}>Cancel</button>
                                    <button type="submit" className="py-2 px-6 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
