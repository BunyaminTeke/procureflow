// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import AdminUserForm from "@/components/AdminUsers";

// interface User {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     department?: string;
// }

// interface Request {
//     id: string;
//     itemName: string;
//     quantity: number;
//     status: string;
//     employee?: {
//         name: string;
//     };
//     createdAt: string;
// }

// // Türkçe rol isimleri
// const roleLabels: Record<string, string> = {
//     admin: "Yönetici",
//     manager: "Yönetici Yardımcısı",
//     employee: "Çalışan",
//     user: "Kullanıcı",
// };

// // Renk etiketleri
// const roleColors: Record<string, string> = {
//     admin: "bg-purple-100 text-purple-800",
//     manager: "bg-yellow-100 text-yellow-800",
//     employee: "bg-green-100 text-green-800",
//     user: "bg-blue-100 text-blue-800",
// };

// export default function AdminDashboard() {
//     const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "requests">("dashboard");
//     const [requests, setRequests] = useState<Request[]>([]);
//     const [users, setUsers] = useState<User[]>([]);
//     const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//     const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
//     const [user, setUser] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [searchTermUsers, setSearchTermUsers] = useState("");
//     const [roleFilter, setRoleFilter] = useState("Tümü");
//     const [searchTermRequests, setSearchTermRequests] = useState("");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [editingUser, setEditingUser] = useState<User | null>(null);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [userToDelete, setUserToDelete] = useState<User | null>(null);
//     const [toastMessage, setToastMessage] = useState<string | null>(null);

//     const router = useRouter();

//     const showToast = (message: string) => {
//         setToastMessage(message);
//         setTimeout(() => setToastMessage(null), 3000);
//     };

//     const startEditing = (user: User) => {
//         setEditingUser(user);
//     };

//     useEffect(() => {
//         const token = document.cookie.split("token=")[1];
//         if (!token) {
//             router.push("/login");
//             return;
//         }

//         const checkAdmin = async () => {
//             try {
//                 const res = await fetch("/api/auth/me", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 if (!res.ok) {
//                     throw new Error("Yetkilendirme hatası");
//                 }
//                 const userData = await res.json();
//                 setUser(userData);
//                 if (userData.role.toLowerCase() !== "admin") {
//                     router.push("/login");
//                     return;
//                 }

//                 // Dashboard için talepleri çek
//                 const reqRes = await fetch("/api/request", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 if (reqRes.ok) {
//                     const data = await reqRes.json();
//                     setRequests(data);
//                 }

//                 // Kullanıcıları çek
//                 const usersRes = await fetch("/api/admin/users", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 if (usersRes.ok) {
//                     const data = await usersRes.json();
//                     setUsers(data.users || data);
//                     setFilteredUsers(data.users || data);
//                 }

//             } catch (err: any) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkAdmin();
//     }, [router]);

//     // Kullanıcı filtreleme
//     useEffect(() => {
//         let result = users;

//         if (searchTermUsers) {
//             result = result.filter(
//                 user =>
//                     user.name.toLowerCase().includes(searchTermUsers.toLowerCase()) ||
//                     user.email.toLowerCase().includes(searchTermUsers.toLowerCase())
//             );
//         }

//         if (roleFilter !== "Tümü") {
//             result = result.filter(user => user.role === roleFilter);
//         }

//         setFilteredUsers(result);
//     }, [searchTermUsers, roleFilter, users]);

//     // Talep filtreleme
//     useEffect(() => {
//         let result = requests;

//         if (searchTermRequests) {
//             result = result.filter(
//                 req =>
//                     req.employee?.name?.toLowerCase().includes(searchTermRequests.toLowerCase()) ||
//                     req.itemName?.toLowerCase().includes(searchTermRequests.toLowerCase())
//             );
//         }

//         if (statusFilter !== "all") {
//             result = result.filter(req => req.status === statusFilter);
//         }

//         setFilteredRequests(result);
//     }, [searchTermRequests, statusFilter, requests]);

//     // Dashboard istatistikleri
//     const totalRequests = requests.length;
//     const pendingRequests = requests.filter((r) => r.status === "pending").length;
//     const approvedRequests = requests.filter((r) => r.status === "approved").length;
//     const rejectedRequests = requests.filter((r) => r.status === "rejected").length;

//     if (loading) return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//             <div className="flex flex-col items-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//                 <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//             <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
//                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl text-red-600">⚠️</span>
//                 </div>
//                 <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Hata Oluştu</h2>
//                 <p className="text-gray-700 mb-6 text-center">{error}</p>
//                 <button
//                     onClick={() => window.location.reload()}
//                     className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
//                 >
//                     Tekrar Dene
//                 </button>
//             </div>
//         </div>
//     );

//     // Yardımcı fonksiyonlar
//     const formatDate = (dateStr: string) => {
//         const date = new Date(dateStr);
//         return date.toLocaleDateString("tr-TR") + " " + date.toLocaleTimeString("tr-TR", {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const getStatusClass = (status: string) => {
//         switch (status) {
//             case "pending":
//                 return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//             case "approved":
//                 return "bg-green-100 text-green-800 border border-green-200";
//             case "rejected":
//                 return "bg-red-100 text-red-800 border border-red-200";
//             default:
//                 return "bg-gray-100 text-gray-800 border border-gray-200";
//         }
//     };

//     const getStatusText = (status: string) => {
//         switch (status) {
//             case "pending":
//                 return "Bekliyor";
//             case "approved":
//                 return "Onaylandı";
//             case "rejected":
//                 return "Reddedildi";
//             default:
//                 return status;
//         }
//     };

//     // Dashboard içeriği
//     const renderDashboard = () => (
//         <div className="space-y-8">
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//                     <p className="text-gray-500 mt-2">Sistem istatistiklerini ve talepleri görüntüleyin</p>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
//                             </svg>
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Ara..."
//                             className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2479AE] focus:border-purple-500 outline-none transition-all w-64"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Kartlar */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
//                     <div className="flex justify-between items-center">
//                         <h3 className="font-semibold text-gray-600">Toplam Talepler</h3>
//                         <div className="p-3 bg-purple-100 rounded-xl">
//                             <div className="h-5 w-5 text-gray-400">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2h6a1 1 0 011 1v1h1a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>
//                     <p className="text-3xl font-bold mt-4 text-gray-800">{totalRequests}</p>
//                     <div className="mt-4 h-2 bg-gray-200 rounded-full">
//                         <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: "100%" }}></div>
//                     </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
//                     <div className="flex justify-between items-center">
//                         <h3 className="font-semibold text-gray-600">Bekleyen</h3>
//                         <div className="p-3 bg-amber-100 rounded-xl">
//                             <div className="h-5 w-5 text-gray-400">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12M6 20h12M8 4v4a4 4 0 004 4 4 4 0 004-4V4M8 20v-4a4 4 0 014-4 4 4 0 014 4v4" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>
//                     <p className="text-3xl font-bold mt-4 text-amber-600">{pendingRequests}</p>
//                     <div className="mt-4 h-2 bg-gray-200 rounded-full">
//                         <div
//                             className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
//                             style={{ width: totalRequests > 0 ? `${(pendingRequests / totalRequests) * 100}%` : "0%" }}
//                         ></div>
//                     </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
//                     <div className="flex justify-between items-center">
//                         <h3 className="font-semibold text-gray-600">Onaylanan</h3>
//                         <div className="p-3 bg-green-100 rounded-xl">
//                             <div className="h-5 w-5 text-green-500">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>
//                     <p className="text-3xl font-bold mt-4 text-green-600">{approvedRequests}</p>
//                     <div className="mt-4 h-2 bg-gray-200 rounded-full">
//                         <div
//                             className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
//                             style={{ width: totalRequests > 0 ? `${(approvedRequests / totalRequests) * 100}%` : "0%" }}
//                         ></div>
//                     </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
//                     <div className="flex justify-between items-center">
//                         <h3 className="font-semibold text-gray-600">Reddedilen</h3>
//                         <div className="p-3 bg-red-100 rounded-xl">
//                             <div className="h-5 w-5 text-red-500">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>
//                     <p className="text-3xl font-bold mt-4 text-red-600">{rejectedRequests}</p>
//                     <div className="mt-4 h-2 bg-gray-200 rounded-full">
//                         <div
//                             className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
//                             style={{ width: totalRequests > 0 ? `${(rejectedRequests / totalRequests) * 100}%` : "0%" }}
//                         ></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Tablo */}
//             <div className="bg-white rounded-2xl shadow-md overflow-hidden">
//                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
//                     <h3 className="font-semibold text-gray-800 text-xl">Talepler Listesi</h3>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="bg-gray-50 text-left text-gray-600 font-medium text-sm">
//                                 <th className="p-4 font-semibold">ID</th>
//                                 <th className="p-4 font-semibold">Çalışan</th>
//                                 <th className="p-4 font-semibold">Ürün</th>
//                                 <th className="p-4 font-semibold">Miktar</th>
//                                 <th className="p-4 font-semibold">Durum</th>
//                                 <th className="p-4 font-semibold text-right">İşlemler</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {requests.slice(0, 5).map((req) => (
//                                 <tr key={req.id} className="hover:bg-gray-50 transition-colors">
//                                     <td className="p-4 font-medium text-gray-700">#{req.id}</td>
//                                     <td className="p-4">
//                                         <div className="flex items-center">
//                                             <div className="h-10 w-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
//                                                 <span className="text-purple-600 text-sm">👤</span>
//                                             </div>
//                                             <span className="font-medium">{req.employee?.name || "—"}</span>
//                                         </div>
//                                     </td>
//                                     <td className="p-4 font-medium">{req.itemName}</td>
//                                     <td className="p-4">
//                                         <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
//                                             {req.quantity} adet
//                                         </span>
//                                     </td>
//                                     <td className="p-4">
//                                         {req.status === "pending" && (
//                                             <span className="px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center w-28">
//                                                 <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
//                                                 Bekliyor
//                                             </span>
//                                         )}
//                                         {req.status === "approved" && (
//                                             <span className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-xl flex items-center justify-center w-28">
//                                                 <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                                                 Onaylandı
//                                             </span>
//                                         )}
//                                         {req.status === "rejected" && (
//                                             <span className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-xl flex items-center justify-center w-28">
//                                                 <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
//                                                 Reddedildi
//                                             </span>
//                                         )}
//                                     </td>
//                                     <td className="p-4">
//                                         <div className="flex justify-end space-x-2">
//                                             <button className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300">
//                                                 Onayla
//                                             </button>
//                                             <button className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300">
//                                                 Reddet
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="p-6 border-t border-gray-200 flex items-center justify-between">
//                     <div className="text-sm text-gray-600">
//                         Toplam {requests.length} kayıt
//                     </div>
//                     <div className="flex space-x-2">
//                         <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center">
//                             <div className="h-5 w-5 text-gray-500">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                 </svg>
//                             </div>
//                             Önceki
//                         </button>
//                         <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl bg-gradient-to-r from-[#2479AE] to-indigo-600 text-white font-medium shadow-md">
//                             1
//                         </button>
//                         <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center">
//                             Sonraki
//                             <div className="h-5 w-5 text-gray-500">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </div>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     // Kullanıcılar içeriği
//     const renderUsers = () => (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Başlık ve Yeni Kullanıcı Butonu */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
//                         <p className="text-gray-600 mt-2">
//                             Sistemde kayıtlı tüm kullanıcıları görüntüleyin ve yönetin
//                         </p>
//                     </div>
//                     <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
//                         <svg
//                             className="w-5 h-5 mr-2"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             />
//                         </svg>
//                         Yeni Kullanıcı
//                     </button>
//                 </div>

//                 {/* Filtreleme ve Arama */}
//                 <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
//                     <div className="flex flex-col md:flex-row gap-4">
//                         <div className="flex-1">
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg
//                                         className="h-5 w-5 text-gray-400"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type="text"
//                                     placeholder="Kullanıcı adı veya email ara..."
//                                     value={searchTermUsers}
//                                     onChange={(e) => setSearchTermUsers(e.target.value)}
//                                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                                 />
//                             </div>
//                         </div>
//                         <div className="w-full md:w-48">
//                             <select
//                                 value={roleFilter}
//                                 onChange={(e) => setRoleFilter(e.target.value)}
//                                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                             >
//                                 <option value="Tümü">Tüm Roller</option>
//                                 <option value="admin">Yönetici</option>
//                                 <option value="manager">Yönetici Yardımcısı</option>
//                                 <option value="employee">Çalışan</option>
//                                 <option value="user">Kullanıcı</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Kullanıcı Listesi */}
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departman</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {filteredUsers.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={5} className="px-6 py-8 text-center">
//                                             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                             <p className="mt-4 text-gray-500">Kriterlere uygun kullanıcı bulunamadı.</p>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filteredUsers.map((user) => (
//                                         <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                                                         <span className="font-medium text-indigo-800">
//                                                             {user.name.charAt(0).toUpperCase()}
//                                                         </span>
//                                                     </div>
//                                                     <div className="ml-4">
//                                                         <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                                         <div className="text-sm text-gray-500">ID: {user.id}</div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 {user.email}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] || "bg-gray-100 text-gray-800"}`}>
//                                                     {roleLabels[user.role] || user.role}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {user.department || "—"}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                 <div className="flex space-x-3">
//                                                     <button
//                                                         onClick={() => startEditing(user)}
//                                                         className="text-indigo-600 px-1 rounded hover:bg-indigo-200 hover:text-indigo-900 transition-colors"
//                                                     >
//                                                         Düzenle
//                                                     </button>
//                                                     <button
//                                                         onClick={() => {
//                                                             setUserToDelete(user);
//                                                             setShowDeleteModal(true);
//                                                         }}
//                                                         className="text-red-600 px-2 rounded hover:bg-red-200 hover:text-red-900 transition-colors">Sil</button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Sayfalama */}
//                     <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                         <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                             <p className="text-sm text-gray-700">
//                                 Toplam <span className="font-medium">{users.length}</span> kullanıcı • Gösterilen: <span className="font-medium">{filteredUsers.length}</span>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {showDeleteModal && userToDelete && (
//                 <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
//                     <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
//                         <h2 className="text-xl font-bold mb-4 text-gray-900">Kullanıcıyı Sil</h2>
//                         <p className="text-gray-700 mb-6">
//                             "{userToDelete.name}" adlı kullanıcıyı silmek istediğinizden emin misiniz?
//                         </p>
//                         <div className="flex justify-end space-x-4">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
//                             >
//                                 İptal
//                             </button>
//                             <button
//                                 onClick={async () => {
//                                     try {
//                                         const token = document.cookie.split("token=")[1];
//                                         const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
//                                             method: "PATCH",
//                                             headers: { Authorization: `Bearer ${token}` },
//                                         });
//                                         const data = await res.json();
//                                         if (!res.ok) throw new Error(data.error || "Silme başarısız");

//                                         setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
//                                         setShowDeleteModal(false);
//                                         setUserToDelete(null);
//                                         alert("Kullanıcı silindi");
//                                     } catch (err: any) {
//                                         alert(err.message);
//                                     }
//                                 }}
//                                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                             >
//                                 Sil
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Düzenle Modal */}
//             {editingUser && (
//                 <AdminUserForm user={editingUser} onClose={() => setEditingUser(null)} />
//             )}
//         </div>
//     );

//     // Talepler içeriği
//     const renderRequests = () => (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-1 md:p-6">
//             <div className="max-w-7xl mx-auto">
//                 <div className="mb-6 md:mb-8">
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Talep Yönetimi</h1>
//                     <p className="text-gray-600">Sistemdeki tüm talepleri görüntüleyebilir ve yönetebilirsiniz.</p>
//                 </div>

//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
//                     <div className="px-5 py-4 border-b border-gray-100">
//                         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                             <div className="relative flex-1">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type="text"
//                                     placeholder="Çalışan veya ürün adı ile ara..."
//                                     className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                     value={searchTermRequests}
//                                     onChange={(e) => setSearchTermRequests(e.target.value)}
//                                 />
//                             </div>

//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm font-medium text-gray-700">Durum:</span>
//                                 <select
//                                     className="border border-gray-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                                     value={statusFilter}
//                                     onChange={(e) => setStatusFilter(e.target.value)}
//                                 >
//                                     <option value="all">Tümü</option>
//                                     <option value="pending">Bekleyen</option>
//                                     <option value="approved">Onaylanan</option>
//                                     <option value="rejected">Reddedilen</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                                     <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan</th>
//                                     <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
//                                     <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
//                                     <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
//                                     <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturulma Tarihi</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                                 {filteredRequests.length > 0 ? (
//                                     filteredRequests.map((req) => (
//                                         <tr key={req.id} className="hover:bg-gray-50 transition duration-150">
//                                             <td className="px-5 py-4 whitespace-nowrap">
//                                                 <span className="text-sm font-medium text-gray-900">#{req.id}</span>
//                                             </td>
//                                             <td className="px-5 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                                         </svg>
//                                                     </div>
//                                                     <div className="ml-4">
//                                                         <div className="text-sm font-medium text-gray-900">{req.employee?.name || "—"}</div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-5 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900">{req.itemName}</div>
//                                             </td>
//                                             <td className="px-5 py-4 whitespace-nowrap">
//                                                 <span className="px-2.5 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
//                                                     {req.quantity}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-4 whitespace-nowrap">
//                                                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(req.status)}`}>
//                                                     {getStatusText(req.status)}
//                                                 </div>
//                                             </td>
//                                             <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {formatDate(req.createdAt)}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={6} className="px-5 py-8 text-center">
//                                             <div className="flex flex-col items-center justify-center">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 <p className="text-gray-500 font-medium">Hiç talep bulunamadı</p>
//                                                 <p className="text-gray-400 text-sm mt-1">Arama kriterlerinize uygun talep bulunamadı.</p>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
//                         <div className="flex items-center justify-between">
//                             <p className="text-sm text-gray-700">
//                                 Toplam <span className="font-medium">{filteredRequests.length}</span> talep
//                             </p>
//                             <div className="flex space-x-2">
//                                 <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
//                                     Önceki
//                                 </button>
//                                 <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
//                                     Sonraki
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     // Ana render fonksiyonu
//     return (
//         <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             {/* Sidebar */}
//             <aside className="w-64 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl">
//                 <div className="p-6 border-b border-gray-800">
//                     <h2 className="text-xl font-bold">Admin Panel</h2>
//                     <p className="text-sm text-gray-400 mt-1">Yönetici Kontrol Merkezi</p>
//                 </div>
//                 <nav className="p-4 space-y-1">
//                     <button
//                         className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-[#2479AE] to-[#309AD6] shadow-md' : 'hover:bg-gray-800 transition-all'}`}
//                         onClick={() => setActiveTab('dashboard')}
//                     >
//                         <span>📊</span>
//                         <span>Dashboard</span>
//                     </button>
//                     <button
//                         className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === 'requests' ? 'bg-gradient-to-r from-[#2479AE] to-[#309AD6] shadow-md' : 'hover:bg-gray-800 transition-all'}`}
//                         onClick={() => setActiveTab('requests')}
//                     >
//                         <span>📦</span>
//                         <span>Talepler</span>
//                     </button>
//                     <button
//                         className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === 'users' ? 'bg-gradient-to-r from-[#2479AE] to-[#309AD6] shadow-md' : 'hover:bg-gray-800 transition-all'}`}
//                         onClick={() => setActiveTab('users')}
//                     >
//                         <span>👥</span>
//                         <span>Kullanıcılar</span>
//                     </button>
//                     <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-3">
//                         <span>📑</span>
//                         <span>Raporlar</span>
//                     </button>
//                     <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-3">
//                         <span>⚙️</span>
//                         <span>Ayarlar</span>
//                     </button>
//                 </nav>

//                 <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
//                     <div className="flex items-center space-x-3">
//                         <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
//                             <span className="text-white font-bold">{user?.name ? user.name.charAt(0).toUpperCase() : "?"}</span>
//                         </div>
//                         <div>
//                             <p className="text-sm font-medium">{user?.name || "Admin Kullanıcı"}</p>
//                             <p className="text-xs text-gray-400">{user?.role || "Yönetici"}</p>
//                         </div>
//                     </div>
//                 </div>
//             </aside>

//             {/* İçerik */}
//             <main className="flex-1 p-8 overflow-x-hidden">
//                 {activeTab === 'dashboard' && renderDashboard()}
//                 {activeTab === 'users' && renderUsers()}
//                 {activeTab === 'requests' && renderRequests()}
//             </main>

//             {/* Toast Mesajı */}
//             {toastMessage && (
//                 <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
//                     {toastMessage}
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
}

interface Request {
    id: string;
    itemName: string;
    quantity: number;
    status: string;
    employee?: {
        name: string;
    };
    createdAt: string;
}

// Türkçe rol isimleri
const roleLabels: Record<string, string> = {
    admin: "Yönetici",
    manager: "Yönetici Yardımcısı",
    employee: "Çalışan",
    user: "Kullanıcı",
};

// Renk etiketleri
const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-yellow-100 text-yellow-800",
    employee: "bg-green-100 text-green-800",
    user: "bg-blue-100 text-blue-800",
};

// AdminUserForm bileşeni (basit versiyon)
function AdminUserForm({ user, onClose }: { user: User; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Kullanıcı Düzenle</h2>
                <p className="mb-4">Kullanıcı düzenleme formu buraya gelecek: {user.name}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                        İptal
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}

// Raporlar bileşeni
function AdminReports() {
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [reportType, setReportType] = useState<string>("monthly");

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Başlık */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Raporlar</h1>
                    <p className="text-gray-600">Sistemdeki çeşitli istatistikleri ve metrikleri görüntüleyin</p>
                </div>

                {/* Filtreler */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rapor Türü</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="monthly">Aylık</option>
                                <option value="weekly">Haftalık</option>
                                <option value="daily">Günlük</option>
                                <option value="custom">Özel</option>
                            </select>
                        </div>

                        <div>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                Raporu Oluştur
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rapor İçeriği - Boş Durum */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                    <div className="max-w-md mx-auto">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz rapor oluşturulmadı</h3>
                        <p className="text-gray-500 mb-4">
                            Yukarıdaki filtreleri kullanarak istediğiniz tarih aralığı için rapor oluşturabilirsiniz.
                        </p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Rapor Oluştur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ana AdminDashboard bileşeni
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "requests" | "reports">("dashboard");
    const [requests, setRequests] = useState<Request[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTermUsers, setSearchTermUsers] = useState("");
    const [roleFilter, setRoleFilter] = useState("Tümü");
    const [searchTermRequests, setSearchTermRequests] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const router = useRouter();

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const startEditing = (user: User) => {
        setEditingUser(user);
    };

    useEffect(() => {
        const token = document.cookie.split("token=")[1];
        if (!token) {
            router.push("/login");
            return;
        }

        const checkAdmin = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error("Yetkilendirme hatası");
                }
                const userData = await res.json();
                setUser(userData);
                if (userData.role.toLowerCase() !== "admin") {
                    router.push("/login");
                    return;
                }

                // Dashboard için talepleri çek
                const reqRes = await fetch("/api/request", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (reqRes.ok) {
                    const data = await reqRes.json();
                    setRequests(data);
                }

                // Kullanıcıları çek
                const usersRes = await fetch("/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (usersRes.ok) {
                    const data = await usersRes.json();
                    setUsers(data.users || data);
                    setFilteredUsers(data.users || data);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    // Kullanıcı filtreleme
    useEffect(() => {
        let result = users;

        if (searchTermUsers) {
            result = result.filter(
                user =>
                    user.name.toLowerCase().includes(searchTermUsers.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTermUsers.toLowerCase())
            );
        }

        if (roleFilter !== "Tümü") {
            result = result.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(result);
    }, [searchTermUsers, roleFilter, users]);

    // Talep filtreleme
    useEffect(() => {
        let result = requests;

        if (searchTermRequests) {
            result = result.filter(
                req =>
                    req.employee?.name?.toLowerCase().includes(searchTermRequests.toLowerCase()) ||
                    req.itemName?.toLowerCase().includes(searchTermRequests.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(req => req.status === statusFilter);
        }

        setFilteredRequests(result);
    }, [searchTermRequests, statusFilter, requests]);

    // Dashboard istatistikleri
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === "pending").length;
    const approvedRequests = requests.filter((r) => r.status === "approved").length;
    const rejectedRequests = requests.filter((r) => r.status === "rejected").length;

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-red-600">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Hata Oluştu</h2>
                <p className="text-gray-700 mb-6 text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );

    // Yardımcı fonksiyonlar
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

    // Dashboard içeriği
    const renderDashboard = () => (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-2">Sistem istatistiklerini ve talepleri görüntüleyin</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Ara..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2479AE] focus:border-purple-500 outline-none transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Kartlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-600">Toplam Talepler</h3>
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <div className="h-5 w-5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2h6a1 1 0 011 1v1h1a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-4 text-gray-800">{totalRequests}</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-600">Bekleyen</h3>
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <div className="h-5 w-5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12M6 20h12M8 4v4a4 4 0 004 4 4 4 0 004-4V4M8 20v-4a4 4 0 014-4 4 4 0 014 4v4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-4 text-amber-600">{pendingRequests}</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                            style={{ width: totalRequests > 0 ? `${(pendingRequests / totalRequests) * 100}%` : "0%" }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-600">Onaylanan</h3>
                        <div className="p-3 bg-green-100 rounded-xl">
                            <div className="h-5 w-5 text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-4 text-green-600">{approvedRequests}</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                            style={{ width: totalRequests > 0 ? `${(approvedRequests / totalRequests) * 100}%` : "0%" }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-600">Reddedilen</h3>
                        <div className="p-3 bg-red-100 rounded-xl">
                            <div className="h-5 w-5 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-4 text-red-600">{rejectedRequests}</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                            style={{ width: totalRequests > 0 ? `${(rejectedRequests / totalRequests) * 100}%` : "0%" }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Tablo */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-xl">Talepler Listesi</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-600 font-medium text-sm">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Çalışan</th>
                                <th className="p-4 font-semibold">Ürün</th>
                                <th className="p-4 font-semibold">Miktar</th>
                                <th className="p-4 font-semibold">Durum</th>
                                <th className="p-4 font-semibold text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests.slice(0, 5).map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-700">#{req.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-purple-600 text-sm">👤</span>
                                            </div>
                                            <span className="font-medium">{req.employee?.name || "—"}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{req.itemName}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                                            {req.quantity} adet
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {req.status === "pending" && (
                                            <span className="px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center w-28">
                                                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                                                Bekliyor
                                            </span>
                                        )}
                                        {req.status === "approved" && (
                                            <span className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-xl flex items-center justify-center w-28">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                Onaylandı
                                            </span>
                                        )}
                                        {req.status === "rejected" && (
                                            <span className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-xl flex items-center justify-center w-28">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                Reddedildı
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end space-x-2">
                                            <button className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300">
                                                Onayla
                                            </button>
                                            <button className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300">
                                                Reddet
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Toplam {requests.length} kayıt
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center">
                            <div className="h-5 w-5 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            Önceki
                        </button>
                        <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl bg-gradient-to-r from-[#2479AE] to-indigo-600 text-white font-medium shadow-md">
                            1
                        </button>
                        <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center">
                            Sonraki
                            <div className="h-5 w-5 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Kullanıcılar içeriği
    const renderUsers = () => (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Başlık ve Yeni Kullanıcı Butonu */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
                        <p className="text-gray-600 mt-2">
                            Sistemde kayıtlı tüm kullanıcıları görüntüleyin ve yönetin
                        </p>
                    </div>
                    <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                        <svg
                            className="w-5 h-5 mr-2"
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
                        Yeni Kullanıcı
                    </button>
                </div>

                {/* Filtreleme ve Arama */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Kullanıcı adı veya email ara..."
                                    value={searchTermUsers}
                                    onChange={(e) => setSearchTermUsers(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Tümü">Tüm Roller</option>
                                <option value="admin">Yönetici</option>
                                <option value="manager">Yönetici Yardımcısı</option>
                                <option value="employee">Çalışan</option>
                                <option value="user">Kullanıcı</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kullanıcı Listesi */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departman</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="mt-4 text-gray-500">Kriterlere uygun kullanıcı bulunamadı.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span className="font-medium text-indigo-800">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] || "bg-gray-100 text-gray-800"}`}>
                                                    {roleLabels[user.role] || user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.department || "—"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => startEditing(user)}
                                                        className="text-indigo-600 px-1 rounded hover:bg-indigo-200 hover:text-indigo-900 transition-colors"
                                                    >
                                                        Düzenle
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete(user);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-600 px-2 rounded hover:bg-red-200 hover:text-red-900 transition-colors">Sil</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Sayfalama */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-700">
                                Toplam <span className="font-medium">{users.length}</span> kullanıcı • Gösterilen: <span className="font-medium">{filteredUsers.length}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Kullanıcıyı Sil</h2>
                        <p className="text-gray-700 mb-6">
                            "{userToDelete.name}" adlı kullanıcıyı silmek istediğinizden emin misiniz?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = document.cookie.split("token=")[1];
                                        const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
                                            method: "PATCH",
                                            headers: { Authorization: `Bearer ${token}` },
                                        });
                                        const data = await res.json();
                                        if (!res.ok) throw new Error(data.error || "Silme başarısız");

                                        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
                                        setShowDeleteModal(false);
                                        setUserToDelete(null);
                                        alert("Kullanıcı silindi");
                                    } catch (err: any) {
                                        alert(err.message);
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Düzenle Modal */}
            {editingUser && (
                <AdminUserForm user={editingUser} onClose={() => setEditingUser(null)} />
            )}
        </div>
    );

    // Talepler içeriği
    const renderRequests = () => (
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
                                    value={searchTermRequests}
                                    onChange={(e) => setSearchTermRequests(e.target.value)}
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

    // Raporlar içeriği
    const renderReports = () => <AdminReports />;

    // Ana render fonksiyonu
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                    <p className="text-sm text-gray-400 mt-1">Yönetici Kontrol Merkezi</p>
                </div>
                <nav className="p-4 space-y-1">
                    <button
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-[#2479AE] to-[#309AD6] shadow-md' : 'hover:bg-gray-800 transition-all'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <span>📊</span>
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === 'requests' ? 'bg-gradient-to-r from-[#2479AE] to-[#309AD6] shadow-md' : 'hover:bg-gray-800 transition-all'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <span>📦</span>
                        <span>Talepler</span>
                    </button>
                    <button
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === 'users' ? 'bg-gradient-to-r from-[#2479AE] to-[#309AD6] shadow-md' : 'hover:bg-gray-800 transition-all'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <span>👥</span>
                        <span>Kullanıcılar</span>
                    </button>
                    <button
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === 'reports' ? 'bg-gradient-to-r from-[#2479AE] to-[#309AD6] shadow-md' : 'hover:bg-gray-800 transition-all'}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <span>📑</span>
                        <span>Raporlar</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-3">
                        <span>⚙️</span>
                        <span>Ayarlar</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{user?.name ? user.name.charAt(0).toUpperCase() : "?"}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.name || "Admin Kullanıcı"}</p>
                            <p className="text-xs text-gray-400">{user?.role || "Yönetici"}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* İçerik */}
            <main className="flex-1 p-8 overflow-x-hidden">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'requests' && renderRequests()}
                {activeTab === 'reports' && renderReports()}
            </main>

            {/* Toast Mesajı */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}