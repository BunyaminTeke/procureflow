"use client";

import { useState, useEffect } from "react";

export default function RequestPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Ürünleri yükle
    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch("/api/products"); // ürün listesi için backend route
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts();
    }, []);

    // Talep gönder
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "1234567890", // burada normalde oturum açan kullanıcının ID’si gelir
                    productId: selectedProduct,
                    quantity,
                }),
            });

            if (res.ok) {
                setMessage("Talep başarıyla oluşturuldu ✅");
                setSelectedProduct("");
                setQuantity(1);
            } else {
                const err = await res.json();
                setMessage(`Hata: ${err.error}`);
            }
        } catch (error) {
            setMessage("Bir hata oluştu ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Ürün Talebi Oluştur</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ürün seçimi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ürün Seç
                    </label>
                    <select
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                    >
                        <option value="">Bir ürün seçin</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} (Stok: {p.stock})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Miktar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miktar
                    </label>
                    <input
                        type="number"
                        min="1"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                    />
                </div>

                {/* Submit butonu */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Gönderiliyor..." : "Talep Oluştur"}
                </button>
            </form>

            {/* Mesaj */}
            {message && (
                <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
            )}
        </div>
    );
}
