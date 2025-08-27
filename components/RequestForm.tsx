"use client";

import { useState } from "react";

interface RequestFormProps {
    employeeId: string; // Login olan kullanıcının id’si props ile gelecek
}

export default function RequestForm({ employeeId }: RequestFormProps) {
    const [form, setForm] = useState({
        itemName: "",
        category: "",
        brand: "",
        quantity: 1,
        priority: "Orta",
        urgency: "Normal",
        deliveryDate: "",
        description: "",
        department: "",
        estimatedCost: "",
        productLink: "",
        location: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            const res = await fetch("/api/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, employeeId }),
            });

            if (res.ok) {
                setMessage("✅ Talebiniz başarıyla oluşturuldu!");
                setForm({
                    itemName: "",
                    category: "",
                    brand: "",
                    quantity: 1,
                    priority: "Orta",
                    urgency: "Normal",
                    deliveryDate: "",
                    description: "",
                    department: "",
                    estimatedCost: "",
                    productLink: "",
                    location: "",
                });
            } else {
                const errorData = await res.json();
                setMessage(`❌ Hata: ${errorData.message || "Talep oluşturulamadı"}`);
            }
        } catch (err) {
            setMessage("❌ Sunucu hatası, lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-full mr-3">
                    <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </span>
                Yeni Talep Oluştur
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Eşya Adı */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Eşya Adı *
                    </label>
                    <input
                        type="text"
                        value={form.itemName}
                        onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                        placeholder="Örn: Laptop, Ofis Sandalyesi"
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Kategori */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">Kategori Seçin</option>
                        <option value="Teknoloji">Teknoloji</option>
                        <option value="Ofis Malzemeleri">Ofis Malzemeleri</option>
                        <option value="Mobilya">Mobilya</option>
                        <option value="Kırtasiye">Kırtasiye</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>

                {/* Departman */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        İsteyen Birim *
                    </label>
                    <select
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">Birim Seçin</option>
                        <option value="Bilgi İşlem">Bilgi İşlem</option>
                        <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                        <option value="Satın Alma">Satın Alma</option>
                        <option value="Finans">Finans</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>

                {/* Adet */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adet *
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={form.quantity}
                        onChange={(e) =>
                            setForm({ ...form, quantity: parseInt(e.target.value) })
                        }
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Marka */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marka
                    </label>
                    <input
                        type="text"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        placeholder="Örn: Apple, Samsung"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Öncelik */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Öncelik *
                    </label>
                    <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="Düşük">Düşük</option>
                        <option value="Orta">Orta</option>
                        <option value="Yüksek">Yüksek</option>
                    </select>
                </div>

                {/* Aciliyet */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aciliyet
                    </label>
                    <select
                        value={form.urgency}
                        onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="Normal">Normal</option>
                        <option value="Acil">Acil</option>
                        <option value="Çok Acil">Çok Acil</option>
                    </select>
                </div>

                {/* Teslim Tarihi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Talep Edilen Teslim Tarihi *
                    </label>
                    <input
                        type="date"
                        value={form.deliveryDate}
                        onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Tahmini Maliyet */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tahmini Maliyet (₺)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.estimatedCost}
                        onChange={(e) =>
                            setForm({ ...form, estimatedCost: e.target.value })
                        }
                        placeholder="Örn: 12500"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Ürün Linki */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ürün Linki
                    </label>
                    <input
                        type="url"
                        value={form.productLink}
                        onChange={(e) => setForm({ ...form, productLink: e.target.value })}
                        placeholder="https://example.com/urun"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Lokasyon */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kullanım Lokasyonu
                    </label>
                    <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="Örn: Ankara Ofisi - 3. Kat"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Açıklama */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama *
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Talep detaylarını, neden ihtiyaç duyulduğunu ve diğer önemli bilgileri açıklayın..."
                    required
                    rows={4}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center ${isSubmitting
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
            >
                {isSubmitting ? "İşleniyor..." : "Talep Oluştur"}
            </button>

            {message && (
                <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
            )}
        </form>
    );
}
