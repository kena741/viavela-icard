"use client";
import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { getUserDetail, logout } from '@/features/auth/loginSlice';
import { supabase } from '@/supabaseClient';

export function ReduxProvider({ children }: { children: ReactNode }) {
  // Custom inner component to use hooks
  function AuthSync({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    // Prevent infinite loop by tracking last userId
    const lastUserId = useRef<string | null>(null);
    // On mount, check for existing session
    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          lastUserId.current = session.user.id;
          dispatch(getUserDetail(session.user.id));
        }
      };
      checkSession();
    }, [dispatch]);

    useEffect(() => {
      const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
        if (session?.user) {
          if (lastUserId.current !== session.user.id) {
            lastUserId.current = session.user.id;
            dispatch(getUserDetail(session.user.id));
          }
        } else {
          if (lastUserId.current !== null) {
            lastUserId.current = null;
            dispatch(logout());
          }
        }
      });
      return () => {
        listener?.subscription.unsubscribe();
      };
    }, [dispatch]);
    return <>{children}</>;
  }
  return (
    <Provider store={store}>
      <AuthSync>{children}</AuthSync>
    </Provider>
  );
}
