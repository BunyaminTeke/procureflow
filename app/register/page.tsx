"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ yönlendirme için

export default function RegisterPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptedTerms) {
            setMessage("Kayıt olabilmek için kullanım koşullarını kabul etmelisiniz!");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Şifreler uyuşmuyor!");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    department,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
                setTimeout(() => {
                    router.push("/login"); // ✅ login sayfasına yönlendir
                }, 1500);
            } else {
                setMessage(data.error || "Bir hata oluştu");
            }
        } catch (err) {
            setMessage("Sunucu hatası: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#1C6EA4] via-[#33A1E0] to-[#154D71] min-h-screen flex items-center justify-center p-4 font-[Inter]">
            <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-md overflow-hidden border border-white/20">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#1C6EA4] via-[#338ebf] to-[#1C6EA4] p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm border border-white/20 mb-4">
                        <i className="fa-solid fa-user-plus text-white text-2xl"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-white">ProcureFlow</h1>
                    <p className="text-indigo-100 text-sm mt-1">
                        Kurumsal Satın Alma Sistemi
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Ad Soyad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ad Soyad
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-user text-gray-400"></i>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Adınız Soyadınız"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* E-posta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-posta Adresi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-envelope text-gray-400"></i>
                                </div>
                                <input
                                    type="email"
                                    placeholder="ornek@firma.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Departman */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Departman
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-building text-gray-400"></i>
                                </div>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm appearance-none"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Departmanınızı seçin
                                    </option>
                                    <option value="satinalma">Satın Alma</option>
                                    <option value="finans">Finans</option>
                                    <option value="uretim">Üretim</option>
                                    <option value="lojistik">Lojistik</option>
                                    <option value="insankaynaklari">İnsan Kaynakları</option>
                                    <option value="teknoloji">Teknoloji</option>
                                    <option value="diger">Diğer</option>
                                </select>
                            </div>
                        </div>


                        {/* Şifre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-lock text-gray-400"></i>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
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

                        {/* Şifre Tekrar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre Tekrar
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-lock text-gray-400"></i>
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <i
                                        className={`fa-solid ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                                            } text-gray-400 hover:text-indigo-600 transition`}
                                    ></i>
                                </button>
                            </div>
                        </div>


                        {/* Hata / Bilgilendirme Mesajı */}
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


                        {/* KVKK Onayı */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor="terms"
                                    className="font-medium text-gray-700"
                                >
                                    Kullanım koşullarını kabul ediyorum
                                </label>
                                <p className="text-gray-500">
                                    Kişisel verilerimin{" "}
                                    <a
                                        href="#"
                                        className="text-indigo-600 hover:text-indigo-500"
                                    >
                                        İşlenme Şartları
                                    </a>
                                    na uygun şekilde işlenmesini kabul ediyorum.
                                </p>
                            </div>
                        </div>

                        {/* Kayıt Butonu */}
                        <button
                            type="submit"
                            className="w-full bg-[#1C6EA4] hover:from-[#1C6EA4] hover:to-[#154D71] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Zaten hesabınız var mı?{" "}
                        <a
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition"
                        >
                            Giriş Yap
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
