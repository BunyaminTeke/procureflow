"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                // 🔑 Token'ı cookie olarak kaydet
                document.cookie = `token=${data.token}; path=/;`;

                // 🔑 Role’e göre yönlendir
                if (data.role === "ADMIN") {
                    router.push("/admin");
                } else if (data.role === "MANAGER") {
                    router.push("/manager");
                } else if (data.role === "EMPLOYEE") {
                    router.push("/employee");
                } else if (data.role === "WAREHOUSE") {
                    router.push("/warehouse");
                }
            } else {
                const err = await res.json();
                setError(err.error);
            }
        } catch (err) {
            setError("Sunucu hatası");
        }
    };



    return (
        <>
            <Head>
                <title>ProcureFlow - Giriş</title>
                {/* Font Awesome */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
                {/* Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="bg-gradient-to-br from-[#1C6EA4] via-[#33A1E0] to-[#154D71] min-h-screen flex items-center justify-center p-4 font-[Inter]">
                <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-md overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1C6EA4] to-[#338ebf] p-4 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm border border-white/20 mb-4">
                            <i className="fa-solid fa-boxes-packing text-white text-2xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-white">ProcureFlow</h1>
                        <p className="text-indigo-100 text-sm mt-1">
                            Kurumsal Satın Alma Sistemi
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-posta Adresi
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-envelope text-gray-400"></i>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="johndoe@firma.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-lock text-gray-400"></i>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-blue-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <i
                                            className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"
                                                } text-gray-400 hover:text-indigo-600 transition`}
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        Beni hatırla
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-[#2B83B6] hover:text-[#1F72A7] transition"
                                    >
                                        Şifremi unuttum?
                                    </a>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#2478AA] to-[#319CD9] hover:from-[#1D6FA5] hover:to-[#2D90CA] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 cursor-pointer"
                            >
                                Giriş Yap
                            </button>
                        </form>

                        {/* Social Login */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        veya sosyal medya ile devam et
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div>
                                    <a
                                        href="#"
                                        className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <i className="fa-brands fa-google text-red-500 mr-2"></i>
                                        Google
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href="#"
                                        className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <i className="fa-brands fa-microsoft text-blue-500 mr-2"></i>
                                        Microsoft
                                    </a>
                                </div>
                            </div>
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm text-center mt-2">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div
                                className={`text-sm mb-4 p-2 rounded ${message.includes("başarılı")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {message}
                            </div>
                        )}


                        {/* Footer */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Hesabınız yok mu?{" "}
                            <a
                                href="/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition"
                            >
                                Kayıt Ol
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
