// src/components/NotificationListener.tsx
"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "@supabase/auth-helpers-react"; // or your auth hook
import { supabase } from "@/supabaseClient";

export default function NotificationListener() {
  const session = useSession(); // or get the user ID however you manage auth
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("notification-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          toast(payload.new.title || "🔔 New notification");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return null;
}
