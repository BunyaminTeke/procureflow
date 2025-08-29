"use client";

type SidebarProps = {
    activePage: string;
    setActivePage: (page: string) => void;
};

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
    const links = [
        { id: "dashboard", label: "Dashboard" },
        { id: "requests", label: "Talepler" },
        { id: "users", label: "Kullanıcılar" },
        { id: "settings", label: "Ayarlar" },
    ];

    return (
        <div className="h-screen w-64 bg-indigo-700 text-white flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-indigo-500">
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => setActivePage(link.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${activePage === link.id
                                ? "bg-indigo-900 font-semibold"
                                : "hover:bg-indigo-600"
                            }`}
                    >
                        {link.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
