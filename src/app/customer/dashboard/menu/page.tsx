"use client";


import { MenuItemCard } from "../../components/MenuItemCard";
import { updateMenuItem } from '@/features/menu/updateMenuItemSlice';
import React, { useEffect } from "react";
import AddButton from "@/app/components/AddButton";
import DashboardProfileHeader from "../../components/DashboardProfileHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AddMenuItemModal from "../../components/AddMenuItemModal";
import { openAddMenuItemModal } from '@/features/menu/addMenuItemSlice';
import { fetchMenuItems } from '@/features/menu/fetchmenuItemsSlice';
import type { RootState } from '@/store/store';
import type { MenuItem } from '@/features/menu/fetchmenuItemsSlice';
import { UpdateMenuItemModel } from '@/features/menu/updateMenuItemSlice';


const MenuPage = () => {
    const dispatch = useAppDispatch();
    const menuItems = useAppSelector((state: RootState) => state.menuItems?.items || []);
    const loading = useAppSelector((state: RootState) => state.menuItems?.loading || false);
    const error = useAppSelector((state: RootState) => state.menuItems?.error || null);
    const user = useAppSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchMenuItems(user.id));
        }
    }, [dispatch, user?.id]);

    // Toggle is_available for a menu item
    const handleView = async (item: MenuItem) => {
        if (!user?.id || !item.id) return;
        const update: UpdateMenuItemModel = {
            ...item,
            id: String(item.id),
            customer_id: user.id,
            is_available: !item.is_available,
        };
        await dispatch(updateMenuItem({ item: update }));
        // Refetch menu items to update UI
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
                        />
                    </div>
                )))}
            </div>
            <AddMenuItemModal />

        </div>
    );
};

export default MenuPage;
