// "use client";

// import { useEffect, useState } from "react";

// interface User {
//     id: string;
//     email: string;
//     role: string;
// }

// export default function AdminUsers() {
//     const [users, setUsers] = useState<User[]>([]);
//     const [editingUser, setEditingUser] = useState<User | null>(null);
//     const [formData, setFormData] = useState({ email: "", role: "" });

//     // Kullanıcıları çek
//     useEffect(() => {
//         async function fetchUsers() {
//             const res = await fetch("/api/users");
//             const data = await res.json();
//             setUsers(data);
//         }
//         fetchUsers();
//     }, []);

//     // Düzenleme başlat
//     const startEditing = (user: User) => {
//         setEditingUser(user);
//         setFormData({ email: user.email, role: user.role });
//     };

//     // Düzenleme kaydet
//     const saveEdit = async () => {
//         if (!editingUser) return;

//         const res = await fetch(`/api/users/${editingUser.id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData),
//         });

//         if (res.ok) {
//             const updated = await res.json();
//             setUsers((prev) =>
//                 prev.map((u) => (u.id === updated.id ? updated : u))
//             );
//             setEditingUser(null);
//         }
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-xl font-bold mb-4">Kullanıcı Yönetimi</h1>

//             <table className="w-full border">
//                 <thead>
//                     <tr className="bg-gray-200">
//                         <th className="p-2">Email</th>
//                         <th className="p-2">Rol</th>
//                         <th className="p-2">İşlem</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((u) => (
//                         <tr key={u.id} className="border-t">
//                             <td className="p-2">{u.email}</td>
//                             <td className="p-2">{u.role}</td>
//                             <td className="p-2">
//                                 <button
//                                     onClick={() => startEditing(u)}
//                                     className="px-3 py-1 bg-blue-500 text-white rounded"
//                                 >
//                                     Düzenle
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Düzenleme Formu */}
//             {editingUser && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                         <h2 className="text-lg font-semibold mb-4">Kullanıcı Düzenle</h2>
//                         <input
//                             type="email"
//                             className="w-full p-2 mb-3 border rounded"
//                             value={formData.email}
//                             onChange={(e) =>
//                                 setFormData((prev) => ({ ...prev, email: e.target.value }))
//                             }
//                         />
//                         <select
//                             className="w-full p-2 mb-3 border rounded"
//                             value={formData.role}
//                             onChange={(e) =>
//                                 setFormData((prev) => ({ ...prev, role: e.target.value }))
//                             }
//                         >
//                             <option value="USER">USER</option>
//                             <option value="ADMIN">ADMIN</option>
//                         </select>
//                         <div className="flex justify-end gap-2">
//                             <button
//                                 onClick={() => setEditingUser(null)}
//                                 className="px-3 py-1 bg-gray-400 text-white rounded"
//                             >
//                                 İptal
//                             </button>
//                             <button
//                                 onClick={saveEdit}
//                                 className="px-3 py-1 bg-green-500 text-white rounded"
//                             >
//                                 Kaydet
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import { useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    department?: string;
}

interface AdminUserFormProps {
    user: User;
    onClose: () => void;
}

export default function AdminUserForm({ user, onClose }: AdminUserFormProps) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role || "");
    const [department, setDepartment] = useState(user.department || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Burada API çağrısı eklenebilir
        console.log({ name, email, role, department });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-30"></div>

                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Kullanıcıyı Düzenle</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Ad Soyad"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Email adresi"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Departman</label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Departman"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="">Rol seçin</option>
                                <option value="admin">Yönetici</option>
                                <option value="manager">Yönetici Yardımcısı</option>
                                <option value="employee">Çalışan</option>
                                <option value="user">Kullanıcı</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}