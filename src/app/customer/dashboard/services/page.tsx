"use client";

import React, { useEffect, useState } from "react";
import EditServiceModal from "../../components/EditServiceModal";
import AddServiceModal from '../../components/AddServiceModal';
import { useDispatch } from "react-redux";
import { openEditModal, updateService } from "@/features/service/editServiceSlice";
import { openAddServiceModal } from '@/features/service/addServiceSlice';
import AddButton from "@/app/components/AddButton";
import DashboardProfileHeader from "../../components/DashboardProfileHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCustomerServices } from "@/features/service/serviceSlice";
import { deleteService, resetDeleteServiceState } from '@/features/service/deleteServiceSlice';
import { ServiceCard } from "@/app/customer/components/NewDesignServiceCard";



const ServicesPage = () => {
  const dispatch = useAppDispatch();
  const { services, loading, error } = useAppSelector((state) => state.service);
  const user = useAppSelector((state) => state.auth.user);
  const dispatchRedux = useDispatch();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; service?: typeof services[0] }>({ open: false });

  useEffect(() => {
    console.log('User ID:', user?.id);
    if (user?.id && services.length === 0) {
      dispatch(getCustomerServices(user.id));
    }
  }, [dispatch, user?.id, services.length]);

  const handleToggleStatus = (service: typeof services[0]) => {
    dispatch(updateService({
      ...service,
      status: !service.status,
    }));
  };



  const handleDeleteService = async (serviceId: string) => {
    await dispatch(deleteService(serviceId));
    if (user?.id) {
      dispatch(getCustomerServices(user.id));
    }
    dispatch(resetDeleteServiceState());
    setDeleteDialog({ open: false });
  };



  return (
    <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
      <div className="">
        <DashboardProfileHeader />
        <div className="mb-6 flex flex-col items-start text-center">
          <h2 className="text-xl md:text-2xl font-bold text-orange-500 text-center">
            Services
          </h2>
          <p className="text-gray-700 mt-1 max-sm:text-sm text-center">
            Manage your service offerings
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 relative ">
        <AddButton onClick={() => dispatch(openAddServiceModal())} label="Add Service" />

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 text-orange-400">
            No services found.
          </div>
        ) : (services.map((service) => (
          <div key={service.id} className="py-2 flex justify-center">
            <ServiceCard
              thumbnailSrc={
                service.service_image && service.service_image.length > 0
                  ? service.service_image[0]
                  : "/img/placeholder.jpg"
              }
              title={service.service_name || "Unnamed Service"}
              description={service.description || ""}
              price={`ETB ${service.price || "-"}`}
              duration={service.duration || "-"}
              isActive={!!service.status}
              onView={() => handleToggleStatus(service)}
              onEdit={() => dispatchRedux(openEditModal(service))}
              onDelete={() => setDeleteDialog({ open: true, service })}
            />
          </div>
        )))

        }


      </div>
      <EditServiceModal />
      <AddServiceModal />

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
            className="fixed left-1/2 top-1/2 z-50 flex w-[98%] max-md:rounded-sm max-w-2xl max-h-screen translate-x-[-50%] translate-y-[-50%] border bg-white px-2 py-0 sm:p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-1 w-full p-4 sm:p-10">
              <h2 className="text-base sm:text-lg font-bold text-red-700 mb-2">Delete Service</h2>
              <p className="mb-4 text-sm sm:text-base text-gray-700">
                Are you sure you want to delete service <span className="font-semibold">{deleteDialog.service?.service_name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm sm:text-base"
                  onClick={() => setDeleteDialog({ open: false })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base"
                  onClick={() => {
                    if (deleteDialog.service) {
                      handleDeleteService(deleteDialog.service.id);
                    }
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
};

export default ServicesPage;
