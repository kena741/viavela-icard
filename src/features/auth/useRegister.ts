"use client";

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { useCallback } from "react";
import { createUserAsync } from "./signupSlice";
import type { RootState, AppDispatch } from "@/store/store";


export function useRegister() {
    const dispatch: AppDispatch = useDispatch();
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const registerState = useTypedSelector((state) => state.createuser);

    const register = useCallback((userData: Parameters<typeof createUserAsync>[0]) => {
        dispatch(createUserAsync(userData));
    }, [dispatch]);

    return { ...registerState, register };
}
