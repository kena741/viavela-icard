
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import Link from "next/link";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error || !data.user) {
            setError(error?.message || "Invalid credentials");
            setLoading(false);
            return;
        }
        // Success: redirect to dashboard
        router.push("/customer/dashboard");
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setError("Google login not implemented");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2 text-gray-900">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow border border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">Sign In</h1>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2 text-left">
                        <label htmlFor="login-email" className="text-sm font-medium text-black">Email</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" /></svg>
                            </span>
                            <input
                                type="email"
                                autoComplete="off"
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-background placeholder:text-gray-400 placeholder:font-normal focus-visible:outline-none pl-10 text-black"
                                id="login-email"
                                name="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label htmlFor="login-password" className="text-sm font-medium text-black">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><rect x="6" y="11" width="12" height="7" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M12 16v-2" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="13" r="1" fill="currentColor" /></svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-background placeholder:text-gray-400 placeholder:font-normal focus-visible:outline-none pl-10 pr-10 text-black"
                                id="login-password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-black focus:outline-none" aria-label="Show password" onClick={() => setShowPassword((prev) => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-4 w-4"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <span className="cursor-pointer text-xs text-black hover:underline focus:outline-none invisible select-none" aria-hidden="true">Forgot Password?</span>
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none  bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 hover:opacity-90 h-10 px-4 py-2 w-full text-white"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in mr-1 h-4 w-4"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                        )}
                        Sign In with Email
                    </button>
                </form>
                {/* Divider */}
                <div className="flex items-center w-full my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-2 text-gray-400 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                {/* Google Login Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="cursor-pointer border border-gray-300 bg-white hover:bg-gray-200 h-10 w-full disabled:opacity-60 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ring-offset-background transition-colors focus-visible:outline-none">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M21.35 11.1h-9.2v2.8h5.3c-.23 1.3-1.05 2.4-2.24 3.1v2.5h3.62c2.12-1.96 3.34-4.82 3.34-8.4 0-.7-.07-1.37-.18-2.03z" fill="#4285F4" />
                        <path d="M12.15 22c2.97 0 5.46-1 7.28-2.74l-3.62-2.5c-1.01.68-2.3 1.07-3.66 1.07-2.82 0-5.21-1.9-6.06-4.46h-3.7v2.8C5.9 19.9 8.8 22 12.15 22z" fill="#34A853" />
                        <path d="M6.09 13.87a6.64 6.64 0 0 1 0-3.74V7.33H2.4a10.01 10.01 0 0 0 0 9.34l3.69-2.8z" fill="#FBBC05" />
                        <path d="M12.15 6.5c1.6 0 3.04.55 4.17 1.62l3.12-3.12C17.6 2.59 15.12 1.5 12.15 1.5 8.8 1.5 5.9 3.58 4.09 6.67l3.7 2.8c.85-2.56 3.24-4.46 6.36-4.46z" fill="#EA4335" />
                    </svg>
                    {loading ? "Loading..." : "Continue with Google"}
                </button>
                <div className="mt-6 text-center text-sm text-gray-800">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-sky-600 hover:underline font-semibold">Register</Link>
                </div>
            </div>
        </div>
    );
}
