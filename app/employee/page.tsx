'use client';
import { useEffect, useState } from 'react';

type Request = {
    id: number;
    itemName: string;
    quantity: number;
    priority: 'Düşük' | 'Orta' | 'Yüksek';
    status: 'Bekliyor' | 'Onaylandı' | 'Reddedildi' | 'Teslim Edildi';
    date: string;
    deliveryDate: string;
    description: string;
    category: string;
    brand: string;
    urgency: string;
    department: string;
};

type User = {
    id: string;
    name: string;
    department: string;
    role: string;
};

function getTokenFromCookie(): string | null {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match ? match[2] : null;
}

// RequestForm bileşeni
function RequestForm({ employeeId }: { employeeId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        itemName: '',
        quantity: 1,
        priority: 'Orta',
        deliveryDate: '',
        description: '',
        category: '',
        brand: '',
        urgency: 'Normal',
        department: '', // ✅ department eklendi
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newRequest = {
            ...form,
            employeeId
        };

        try {
            const token = getTokenFromCookie();
            const response = await fetch('/api/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newRequest),
            });

            if (response.ok) {
                setForm({
                    itemName: '',
                    quantity: 1,
                    priority: 'Orta',
                    deliveryDate: '',
                    description: '',
                    category: '',
                    brand: '',
                    urgency: 'Normal',
                    department: '',
                });
                setIsOpen(false);
                window.location.reload(); // İstersen state güncelleme ile değiştirilebilir
            } else {
                const data = await response.json();
                console.error('Hata:', data.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Yeni Talep Oluştur</h2>
                        <p className="text-gray-500 text-sm mt-1">İhtiyaç duyduğunuz ürünleri talep edin</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center shadow-md hover:shadow-lg"
                >
                    {isOpen ? 'Formu Kapat' : 'Yeni Talep'}
                    <svg className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Ürün Adı *</label>
                            <input
                                type="text"
                                required
                                value={form.itemName}
                                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Ürün adını giriniz"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Miktar *</label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Öncelik *</label>
                            <select
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="Düşük">Düşük</option>
                                <option value="Orta">Orta</option>
                                <option value="Yüksek">Yüksek</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Teslim Tarihi *</label>
                            <input
                                type="date"
                                required
                                value={form.deliveryDate}
                                onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <input
                                type="text"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Kategori giriniz"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Marka</label>
                            <input
                                type="text"
                                value={form.brand}
                                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Marka giriniz"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Aciliyet</label>
                            <select
                                value={form.urgency}
                                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="Normal">Normal</option>
                                <option value="Acil">Acil</option>
                                <option value="Çok Acil">Çok Acil</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Departman *</label>
                            <input
                                type="text"
                                required
                                value={form.department}
                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Departman giriniz"
                            />
                        </div>
                    </div>
                    <div className="mb-6 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Talep açıklamasını giriniz"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center shadow-md hover:shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Gönderiliyor...
                                </>
                            ) : (
                                <>
                                    Talebi Gönder
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function EmployeePage() {
    const [user, setUser] = useState<User | null>(null);
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getTokenFromCookie();
        if (!token) {
            window.location.href = '/login';
            return;
        }

        // Kullanıcı bilgilerini çek
        fetch('/api/user/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Talepleri çek
        fetch('/api/request', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setRequests(data)) // ✅ data.requests değil
            .catch(err => console.error(err));
    }, []);

    const statusColor = {
        Bekliyor: 'bg-amber-100 text-amber-800 border-amber-200',
        Onaylandı: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        Reddedildi: 'bg-rose-100 text-rose-800 border-rose-200',
        'Teslim Edildi': 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const priorityColor = {
        Düşük: 'bg-gray-100 text-gray-800 border-gray-200',
        Orta: 'bg-amber-100 text-amber-800 border-amber-200',
        Yüksek: 'bg-rose-100 text-rose-800 border-rose-200',
    };

    const urgencyColor = {
        Normal: 'bg-blue-100 text-blue-800 border-blue-200',
        Acil: 'bg-rose-100 text-rose-800 border-rose-200',
        'Çok Acil': 'bg-purple-100 text-purple-800 border-purple-200',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Başlık */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Çalışan Paneli</h1>
                    <p className="text-gray-600">Taleplerinizi yönetin ve yeni talep oluşturun</p>
                </div>

                {/* Profil Bilgisi */}
                {user && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4 shadow-md">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">Profil Bilgileri</h2>
                                <p className="text-gray-600">{user.department} Departmanı</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-sm text-gray-500 font-medium">Ad Soyad</p>
                                <p className="font-semibold text-gray-800 mt-1">{user.name}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-sm text-gray-500 font-medium">Departman</p>
                                <p className="font-semibold text-gray-800 mt-1">{user.department}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-sm text-gray-500 font-medium">Çalışan ID</p>
                                <p className="font-semibold text-gray-800 mt-1">{user.id}</p>
                            </div>
                        </div>
                    </div>
                )}

                {user && <RequestForm employeeId={user.id} />}

                {/* Talepler Listesi */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full mr-4 shadow-md">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">Mevcut Talepler</h2>
                                <p className="text-gray-500 text-sm">Tüm talep geçmişiniz</p>
                            </div>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                            {requests.length} talep
                        </span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz talep bulunmuyor</h3>
                            <p className="text-gray-500">Yeni bir talep oluşturarak başlayın.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {requests.map((req) => (
                                <div key={req.id} className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition-all bg-white">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-800">{req.itemName}</h3>
                                                <div className="flex gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${urgencyColor[req.urgency as keyof typeof urgencyColor] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                        {req.urgency}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColor[req.priority]}`}>
                                                        {req.priority} Öncelik
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                {req.category && (
                                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                        {req.category}
                                                    </span>
                                                )}
                                                {req.brand && (
                                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                        {req.brand}
                                                    </span>
                                                )}
                                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                    {req.quantity} adet
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                                                <div>
                                                    <p className="font-medium">Departman:</p>
                                                    <p>{req.department}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Teslim Tarihi:</p>
                                                    <p>{req.deliveryDate}</p>
                                                </div>
                                            </div>
                                            {req.description && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-700">{req.description}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-start md:items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor[req.status]}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}