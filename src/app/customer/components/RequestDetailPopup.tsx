"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRequestById, changeRequestStatus, resetRequest } from "@/features/requests/requestsSlice";
import { supabase } from '@/supabaseClient';
import { openModal } from "@/features/requests/assignHandymanModalSlice";


export default function RequestDetailPopup(props: {
    id: string;
    onClose: () => void;
}) {
    const dispatch = useAppDispatch();
    const id = props.id;
    // const router = useRouter(); // Not used
    const { singleRequest, loading, error } = useAppSelector((state) => state.requests);
    type Worker = {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        email?: string;
        [key: string]: unknown;
    };
    const [assignedWorker, setAssignedWorker] = useState<Worker | null>(null);
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    useEffect(() => {
        if (id) {
            dispatch(fetchRequestById(id));
        }
        // Cleanup on unmount: clear the singleRequest from store
        return () => {
            dispatch(resetRequest());
        };
    }, [dispatch, id]);

    useEffect(() => {
        // Reset assigned worker when request changes
        setAssignedWorker(null);
        const fetchAssignedWorker = async () => {
            if (!singleRequest) return;
            if (singleRequest.providerMySelf) {
                if (singleRequest.provider_id) {
                    const { data, error } = await supabase
                        .from('provider')
                        .select('*')
                        .eq('id', singleRequest.provider_id)
                        .single();
                    if (!error) setAssignedWorker(data);
                }
            } else {
                if (singleRequest.handyman_id) {
                    const { data, error } = await supabase
                        .from('handyman')
                        .select('*')
                        .eq('id', singleRequest.handyman_id)
                        .single();
                    if (!error) setAssignedWorker(data);
                }
            }
        };
        fetchAssignedWorker();
    }, [singleRequest]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto cursor-pointer"
            aria-hidden="true"
            onClick={() => props.onClose()}
        >
            <div
                className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative flex flex-col items-center justify-center max-h-[90vh] overflow-y-auto py-8"
                onClick={stopPropagation}

            >
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={props.onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <svg className="animate-spin h-6 w-6 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                ) : (
                    <div className={`bg-card ${assignedWorker ? 'mt-100' : 'mt-6'} text-card-foreground w-full shadow-none rounded-none md:rounded-lg`}>
                        <div className="p-0 md:pt-6 md:mt-36 md:px-6">
                            <div className="p-2 md:p-0">
                                <div className="bg-sky-500/10 rounded-lg outline-1 outline-offset-[-1px] outline-sky-600/40 px-5 py-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold text-black">{singleRequest?.serviceName}</h2>
                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-sky-900 text-white">
                                            {singleRequest?.status}
                                        </div>
                                    </div>
                                    <p className="text-sm text-black">
                                        Requested on {
                                            singleRequest?.createdAt
                                                ? (
                                                    typeof singleRequest.createdAt === "object" &&
                                                    singleRequest.createdAt !== null &&
                                                    "toDate" in singleRequest.createdAt &&
                                                    typeof (singleRequest.createdAt as { toDate?: () => Date }).toDate === "function"
                                                        ? new Date((singleRequest.createdAt as { toDate: () => Date }).toDate()).toLocaleDateString()
                                                        : new Date(singleRequest.createdAt as string | number | Date).toLocaleDateString()
                                                )
                                                : "-"
                                        }
                                    </p>
                                    <p className="text-sm font-medium text-gray-600 mt-1">
                                        Service on {
                                            singleRequest?.bookingDate
                                                ? (
                                                    typeof singleRequest.bookingDate === "object" &&
                                                    singleRequest.bookingDate !== null &&
                                                    "toDate" in singleRequest.bookingDate &&
                                                    typeof (singleRequest.bookingDate as { toDate?: () => Date }).toDate === "function"
                                                        ? new Date((singleRequest.bookingDate as { toDate: () => Date }).toDate()).toLocaleString()
                                                        : new Date(singleRequest.bookingDate as string | number | Date).toLocaleString()
                                                )
                                                : "-"
                                        }
                                    </p>
                                </div>
                                <div className="p-5 space-y-5">
                                    {(singleRequest?.status != 'pending') && (
                                        <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                                            <h3 className="text-base font-semibold mb-3 text-gray-700">Update Status</h3>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Change status</label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white text-black focus:outline-none mt-1"
                                                    defaultValue=""
                                                    onChange={async (e) => {
                                                        const next = e.target.value as 'ongoing' | 'completed' | 'cancelled' | '';
                                                        if (!next || !singleRequest) return;
                                                        await dispatch(changeRequestStatus({ id: singleRequest.id, status: next }));
                                                    }}
                                                    title="Change request status"
                                                >
                                                    <option value="" disabled>Select new status</option>
                                                    <option value="ongoing">Ongoing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                                        <h3 className="text-base font-semibold mb-3 text-gray-700">Customer Information</h3>
                                        <div className="grid gap-2">
                                            <div className="flex">
                                                <span className="text-sm w-20 text-gray-500">Name:</span>
                                                <span className="text-sm font-medium text-black">
                                                    {singleRequest?.firstName ? `${singleRequest?.firstName} ${singleRequest?.lastName}` : '-'}
                                                </span>
                                            </div>
                                            {singleRequest?.phoneNumber && (
                                                <div className="flex">
                                                    <span className="text-sm w-20 text-gray-500">Phone:</span>
                                                    <span className="text-sm font-medium text-black">{singleRequest?.phoneNumber}</span>
                                                </div>
                                            )}
                                            {singleRequest?.email && (
                                                <div className="flex">
                                                    <span className="text-sm w-20 text-gray-500">Email:</span>
                                                    <span className="text-sm font-medium text-black">{singleRequest?.email}</span>
                                                </div>
                                            )}
                                            {singleRequest?.bookingAddress?.locality && (
                                                <div className="flex">
                                                    <span className="text-sm w-20 text-gray-500">Address:</span>
                                                    <span className="text-sm font-medium text-black">{singleRequest.bookingAddress.locality}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                                        <h3 className="text-base font-semibold mb-3 text-gray-700">Service Details</h3>
                                        <div className="grid gap-2">
                                            <div className="flex"><span className="text-sm w-20 text-gray-500">Service:</span>
                                                <span className="text-sm font-medium text-black">
                                                    {singleRequest?.serviceName}
                                                </span>
                                            </div>
                                            <div className="flex"><span className="text-sm w-20 text-gray-500">Price:</span>
                                                <span className="text-sm font-medium text-black">
                                                    ETB&nbsp;{singleRequest?.price}
                                                </span>
                                            </div>
                                            <div className="flex"><span className="text-sm w-20 text-gray-500">Total:</span>
                                                <span className="text-sm font-medium text-black">
                                                    ETB&nbsp;{singleRequest?.totalAmount}
                                                </span>
                                            </div>
                                            <div className="flex"><span className="text-sm w-20 text-gray-500">Sub Total:</span>
                                                <span className="text-sm font-medium text-black">
                                                    ETB&nbsp;{singleRequest?.subTotal}
                                                </span>
                                            </div>
                                            <div className="flex"><span className="text-sm w-20 text-gray-500">Payment:</span>
                                                <span className={`text-sm font-medium ${singleRequest?.paymentCompleted ? "text-green-600" : "text-red-600"}`}>
                                                    {singleRequest?.paymentCompleted ? "Paid" : "Unpaid"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {assignedWorker && (
                                        <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm mt-4">
                                            <h3 className="text-base font-semibold mb-3 text-gray-700">Assigned {singleRequest?.providerMySelf ? 'Provider' : 'Handyman'}</h3>
                                            <div className="grid gap-2">
                                                <div className="flex">
                                                    <span className="text-sm w-24 text-gray-500">Name:</span>
                                                    <span className="text-sm font-medium text-black">{assignedWorker.firstName} {assignedWorker.lastName}</span>
                                                </div>
                                                {assignedWorker.phoneNumber && (
                                                    <div className="flex">
                                                        <span className="text-sm w-24 text-gray-500">Phone:</span>
                                                        <span className="text-sm font-medium text-black">{assignedWorker.phoneNumber}</span>
                                                    </div>
                                                )}
                                                {assignedWorker.email && (
                                                    <div className="flex">
                                                        <span className="text-sm w-24 text-gray-500">Email:</span>
                                                        <span className="text-sm font-medium text-black">{assignedWorker.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="grid gap-3">
                                        <button
                                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-black ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-black bg-transparent hover:bg-gray-100 hover:text-accent-foreground h-10 px-4 py-2 w-full justify-center"
                                            onClick={props.onClose}
                                        >
                                            Close
                                        </button>
                                        <div className="grid grid-cols-1 gap-3 mt-2">
                                            {singleRequest?.status?.toLocaleLowerCase() === 'pending' && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white justify-center"
                                                        onClick={async () => {
                                                            if (singleRequest) {
                                                                dispatch(changeRequestStatus({ id: singleRequest.id, status: 'rejected' }));
                                                            }
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4 mr-2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                                        Reject
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white justify-center"
                                                        onClick={() => {
                                                            if (singleRequest) {
                                                                dispatch(openModal({ requestId: singleRequest.id }));
                                                            }
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-4 w-4 mr-2"><path d="M20 6 9 17l-5-5"></path></svg>
                                                        Accept
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
