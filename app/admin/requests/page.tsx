
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminRequests() {
//     const [requests, setRequests] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const router = useRouter();

//     useEffect(() => {
//         const token = document.cookie.split("token=")[1];
//         if (!token) return router.push("/login");

//         const fetchRequests = async () => {
//             try {
//                 const res = await fetch("/api/request", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 if (!res.ok) throw new Error("Talepler alınamadı");
//                 const data = await res.json();
//                 setRequests(data);
//             } catch (err: any) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRequests();
//     }, [router]);

//     if (loading) return <div className="p-6 text-gray-700">Yükleniyor...</div>;
//     if (error) return <div className="p-6 text-red-500">Hata: {error}</div>;

//     const formatDate = (dateStr: string) => {
//         const date = new Date(dateStr);
//         return date.toLocaleDateString() + " " + date.toLocaleTimeString();
//     };

//     const getStatusClass = (status: string) => {
//         switch (status) {
//             case "pending":
//                 return "bg-yellow-100 text-yellow-800";
//             case "approved":
//                 return "bg-green-100 text-green-800";
//             case "rejected":
//                 return "bg-red-100 text-red-800";
//             default:
//                 return "bg-gray-100 text-gray-800";
//         }
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Talepler</h1>

//             <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Çalışan</th>
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ürün</th>
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Miktar</th>
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Durum</th>
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Oluşturulma Tarihi</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                         {requests.map((req) => (
//                             <tr key={req.id} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 text-sm font-medium text-gray-700">{req.id}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-700">{req.employee?.name || "—"}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-700">{req.itemName}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-700">{req.quantity}</td>
//                                 <td className="px-6 py-4">
//                                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(req.status)}`}>
//                                         {req.status === "pending" ? "Bekliyor" :
//                                             req.status === "approved" ? "Onaylandı" :
//                                                 req.status === "rejected" ? "Reddedildi" : req.status}
//                                     </span>
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-gray-500">{formatDate(req.createdAt)}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split("token=")[1];
        if (!token) return router.push("/login");

        const fetchRequests = async () => {
            try {
                const res = await fetch("/api/request", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Talepler alınamadı");
                const data = await res.json();
                setRequests(data);
                setFilteredRequests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [router]);

    useEffect(() => {
        let result = requests;

        // Arama filtresi
        if (searchTerm) {
            result = result.filter(
                (req) =>
                    req.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    req.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Durum filtresi
        if (statusFilter !== "all") {
            result = result.filter((req) => req.status === statusFilter);
        }

        setFilteredRequests(result);
    }, [searchTerm, statusFilter, requests]);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Talepler yükleniyor...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
                <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Bir Hata Oluştu</h2>
                <p className="text-gray-600 mb-4">Hata: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("tr-TR") + " " + date.toLocaleTimeString("tr-TR", {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            case "approved":
                return "bg-green-100 text-green-800 border border-green-200";
            case "rejected":
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case "approved":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case "rejected":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "Bekliyor";
            case "approved":
                return "Onaylandı";
            case "rejected":
                return "Reddedildi";
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Talep Yönetimi</h1>
                    <p className="text-gray-600">Sistemdeki tüm talepleri görüntüleyebilir ve yönetebilirsiniz.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Çalışan veya ürün adı ile ara..."
                                    className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">Durum:</span>
                                <select
                                    className="border border-gray-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tümü</option>
                                    <option value="pending">Bekleyen</option>
                                    <option value="approved">Onaylanan</option>
                                    <option value="rejected">Reddedilen</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturulma Tarihi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">#{req.id}</span>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{req.employee?.name || "—"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{req.itemName}</div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {req.quantity}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                    {getStatusText(req.status)}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(req.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-gray-500 font-medium">Hiç talep bulunamadı</p>
                                                <p className="text-gray-400 text-sm mt-1">Arama kriterlerinize uygun talep bulunamadı.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Toplam <span className="font-medium">{filteredRequests.length}</span> talep
                            </p>
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                    Önceki
                                </button>
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                    Sonraki
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}