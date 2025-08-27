"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminUserForm from "@/components/AdminUsers";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("Tümü");
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const router = useRouter();


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);


    const [toastMessage, setToastMessage] = useState<string | null>(null);


    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // 3 saniye sonra kaybolur
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

        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Kullanıcıları alırken hata oluştu");
                }

                const data = await res.json();
                setUsers(data.users);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "Tümü" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-600 mb-2 text-center">Hata</h2>
                    <p className="text-gray-700 text-center">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );

    return (
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
}
