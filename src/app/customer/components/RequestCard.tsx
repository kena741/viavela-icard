import React, { useState } from "react";
import Link from "next/link";
import { RequestsState, updateRequestStatusIfPaid } from "@/features/requests/requestsSlice";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

interface RequestCardProps {
  req: RequestsState;
}

const RequestCard: React.FC<RequestCardProps> = ({ req }) => {
  const dispatch: AppDispatch = useDispatch();
  const [status, setStatus] = useState(req.status);

  const handleComplete = async () => {
    const resultAction = await dispatch(updateRequestStatusIfPaid({ id: req.id, newStatus: 'completed' }));
    if (updateRequestStatusIfPaid.fulfilled.match(resultAction)) {
      setStatus('completed');
    }
  };

  return (
    <div className="rounded-lg bg-white  shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-gray-200">
      <div className="absolute inset-0 cursor-pointer"></div>
      <div className="p-4 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="max-w-[70%]">
            <h2 className="text-lg font-bold text-gray-900 text-left">{req?.serviceName || "-"}</h2>
          </div>
          <div className="text-right ml-4">
            <p className="text-base font-semibold text-black">ETB {req?.price || "-"}</p>
            <p className={req?.paymentCompleted === false ? "text-red-600 text-xs" : "text-green-600 text-xs"}>{req?.paymentCompleted === false ? "Unpaid" : "Paid"}</p>
          </div>
        </div>
        <div className="mb-3">
          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 ${status === "completed" ? "bg-blue-100 text-blue-800" : status === "rejected" ? "bg-red-100 text-red-800" : status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{status?.toUpperCase()}</div>
        </div>
        <div className="mb-3">
          <div className="flex flex-col space-y-1">
            <div className="text-sm text-gray-600 text-left">
              <div className="inline-block">
                <span className="text-black">Created on:</span> {req.createdAt ? (
                  (() => {
                    type WithToDate = { toDate: () => Date };
                    const dateObj =
                      typeof req.createdAt === 'object' &&
                        req.createdAt !== null &&
                        typeof ((req.createdAt as unknown) as WithToDate).toDate === 'function'
                        ? ((req.createdAt as unknown) as WithToDate).toDate()
                        : req.createdAt;
                    return new Date(dateObj).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });
                  })()
                ) : "-"}
              </div>
            </div>
            <div className="text-sm text-gray-600 text-left">
              <div className="inline-block">
                <span className="text-black">Service on:</span> {req.bookingDate ? (
                  (() => {
                    type WithToDate = { toDate: () => Date };
                    const dateObj = typeof req.bookingDate === 'object' && req.bookingDate !== null && typeof ((req.bookingDate as unknown) as WithToDate).toDate === 'function'
                      ? ((req.bookingDate as unknown) as WithToDate).toDate()
                      : req.bookingDate;
                    return new Date(dateObj).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });
                  })()
                ) : "-"}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 my-3"></div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1 text-left text-black">Location</h3>
          <p className="text-sm text-gray-900 text-left">{req.bookingAddress?.locality || "not provided"}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1 text-black text-left">Notes</h3>
          <p className="text-sm text-black bg-gray-50 p-2 rounded text-left">{req.description || "-"}</p>
        </div>
        <div className="flex flex-row gap-2 mt-4 w-full">
          {status && status.toLowerCase() === "pending_approval" ? (
            <>
              <Link
                href={`/provider/dashboard/requests/${req.id}`}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-10 px-4 py-2 flex-1 min-w-0 justify-center border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link h-4 w-4 mr-2"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                View
              </Link>
              <button
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100 h-10 px-4 py-2 flex-1 min-w-0 justify-center"
                onClick={handleComplete}
                disabled={!req.paymentCompleted}
                title={!req.paymentCompleted ? 'Payment must be completed to mark as complete' : 'Mark as complete'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-4 w-4 mr-2"><path d="M20 6 9 17l-5-5"></path></svg>
                Complete
              </button>

            </>
          ) : (
            <Link
              href={`/provider/dashboard/requests/${req.id}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-10 px-4 py-2 flex-1 min-w-0 justify-center border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link h-4 w-4 mr-2"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
              View
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
