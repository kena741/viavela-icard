"use client";
import React, { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getUserDetail } from "@/features/auth/loginSlice";

type Params = Promise<{ id: string }>;

export default function ServiceAboutPage(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const loadingUser = useAppSelector((s) => s.auth.isAuthenticated === false && s.auth.user === null);

  useEffect(() => {
    if (!id) return;
    dispatch(getUserDetail(id));
  }, [dispatch, id]);

  if (loadingUser || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        <header className="flex items-start gap-4">
          <Image
            src={user.profileImage || "/img/betegna_logo.svg"}
            alt={user.firstName || user.userName || "Profile"}
            width={72}
            height={72}
            className="rounded-full object-cover border border-slate-200 w-18 h-18"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-slate-900">{user.companyName || `${user.firstName} ${user.lastName ?? ''}`}</h1>
            <p className="text-sm text-slate-600 mt-1">{user.industry}{user.headquarters ? ` • ${user.headquarters}` : ''}</p>
            <div className="mt-3">
              <Link href={`/services/${id}`} className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50">View services</Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-3">
          {user.profileBio && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">About</h3>
              <p className="mt-2 text-slate-600 text-sm">{user.profileBio}</p>
            </div>
          )}
        
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Values</h3>
            <p className="mt-2 text-slate-600 text-sm">Trust, craftsmanship, and customer obsession.</p>
          </div>
          {user.founded && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Founded</h3>
              <p className="mt-2 text-slate-600 text-sm">{user.founded}</p>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">About us</h3>
          <p className="mt-2 text-slate-700 text-sm leading-relaxed">
            We are a team of professionals offering high-quality services tailored to your needs. Our commitment is to make booking and fulfillment effortless for you.
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Get in touch</h3>
          <div className="mt-2 text-sm text-slate-700">
            {user.phoneNumber && <div>Phone: {user.phoneNumber}</div>}
            {user.email && <div>Email: {user.email}</div>}
            {/* Website can be added when available in the user model */}
          </div>
        </section>
      </div>
    </div>
  );
}
