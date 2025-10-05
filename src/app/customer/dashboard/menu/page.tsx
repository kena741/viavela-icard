"use client";


import { updateMenuItem, openUpdateMenuItemModal } from '@/features/menu/updateMenuItemSlice';
import React, { useEffect, useState } from "react";
import { deleteMenuItem } from '@/features/menu/deleteMenuItemSlice';
import AddButton from "@/app/components/AddButton";
import DashboardProfileHeader from "../../components/DashboardProfileHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AddMenuItemModal from "../../components/AddMenuItemModal";
import EditMenuModal from "../../components/EditMenuModal";
import { openAddMenuItemModal } from '@/features/menu/addMenuItemSlice';
import { fetchMenuItems } from '@/features/menu/fetchmenuItemsSlice';
import type { RootState } from '@/store/store';
import type { MenuItem } from '@/features/menu/fetchmenuItemsSlice';
import { UpdateMenuItemModel } from '@/features/menu/updateMenuItemSlice';
import { MenuItemCard } from '../../components/MenuItemCard';


const MenuPage = () => {
    const dispatch = useAppDispatch();
    const menuItems = useAppSelector((state: RootState) => state.menuItems?.items || []);
    const loading = useAppSelector((state: RootState) => state.menuItems?.loading || false);
    const error = useAppSelector((state: RootState) => state.menuItems?.error || null);
    const user = useAppSelector((state: RootState) => state.auth.user);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item?: MenuItem | null }>({ open: false, item: null });



    useEffect(() => {
        if (user?.id) {
            dispatch(fetchMenuItems(user.id));
        }
    }, [dispatch, user?.id]);

    const handleDelete = (item: MenuItem) => {
        setDeleteDialog({ open: true, item });
    };

    const handleConfirmDelete = async () => {
        if (deleteDialog.item && deleteDialog.item.id) {
            await dispatch(deleteMenuItem(deleteDialog.item.id));
            setDeleteDialog({ open: false, item: null });
            if (user?.id) {
                dispatch(fetchMenuItems(user.id));
            }
        }
    };


    const handleEdit = (item: MenuItem) => {
        dispatch(openUpdateMenuItemModal(item));
    };

    const handleView = async (item: MenuItem) => {
        if (!user?.id || !item.id) return;
        const update: UpdateMenuItemModel = {
            ...item,
            id: String(item.id),
            customer_id: user.id,
            is_available: !item.is_available,
        };
        await dispatch(updateMenuItem({ item: update }));
        dispatch(fetchMenuItems(user.id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full font-sans">
            <div>
                <DashboardProfileHeader />
                <div className="mb-8 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-1 text-center">Menu</h2>
                    <p className="text-blue-500 mt-1 max-sm:text-sm text-center">Manage your menu items</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-7 relative">
                <AddButton onClick={() => dispatch(openAddMenuItemModal())} label="Add Menu Item" />

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                ) : menuItems.length === 0 ? (
                    <div className="text-center py-8 text-blue-400">No menu items found.</div>
                ) : (menuItems.map((item: MenuItem) => (
                    <div key={item.id} className="py-2 flex justify-center">
                        <MenuItemCard
                            thumbnailSrc={item.image_url || "/img/placeholder.jpg"}
                            title={item.name}
                            description={item.description || item.category || ""}
                            price={`ETB ${item.price}`}
                            discountPercent={item.discount_percent}
                            isActive={item.is_available}
                            onView={() => handleView(item)}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item)}
                        />
                    </div>
                )))}
            </div>
            <AddMenuItemModal />
            <EditMenuModal />

            {/* Delete Dialog */}
            {deleteDialog.open && (
                <>
                    <div
                        data-state="open"
                        className="fixed inset-0 z-50 bg-black/80 pointer-events-auto cursor-pointer"
                        aria-hidden="true"
                        onClick={() => setDeleteDialog({ open: false, item: null })}
                    ></div>
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="fixed left-1/2 top-1/2 z-50 flex w-[98%] max-md:rounded-sm max-w-2xl max-h-screen translate-x-[-50%] translate-y-[-50%] bg-white px-2 py-0 sm:p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
                        tabIndex={-1}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex-1 w-full p-4 sm:p-10">
                            <h2 className="text-base sm:text-lg font-bold text-red-700 mb-2">Delete Menu Item</h2>
                            <p className="mb-4 text-sm sm:text-base text-gray-700">
                                Are you sure you want to delete menu item <span className="font-semibold">{deleteDialog.item?.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm sm:text-base"
                                    onClick={() => setDeleteDialog({ open: false, item: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base"
                                    onClick={handleConfirmDelete}
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

export default MenuPage;
