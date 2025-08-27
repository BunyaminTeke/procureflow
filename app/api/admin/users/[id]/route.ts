// // app/api/admin/users/[id]/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//     const { id } = params;

//     try {
//         // Kullanıcıyı sil
//         await prisma.user.delete({
//             where: { id },
//         });

//         return NextResponse.json({ message: "Kullanıcı başarıyla silindi" });
//     } catch (err: any) {
//         console.error("Kullanıcı silme hatası:", err);
//         return NextResponse.json({ error: err.message || "Silme sırasında hata oluştu" }, { status: 500 });
//     }
// }


// app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Kullanıcıyı pasif yap
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        return NextResponse.json({ message: "Kullanıcı artık aktif değil", user: updatedUser });
    } catch (err: any) {
        console.error("Kullanıcı güncelleme hatası:", err);
        return NextResponse.json({ error: err.message || "Güncelleme sırasında hata oluştu" }, { status: 500 });
    }
}
