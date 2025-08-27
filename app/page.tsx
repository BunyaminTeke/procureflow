// import React from 'react'

// function Home() {
//   return (
//     <>
//       <div className='bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 shadow-lg flex flex-col items-center justify-center min-h-screen'>
//         <h1 className='text-4xl font-bold'>Welcome to My Next.js App!</h1>
//         <p className='mt-2'>This is a simple page styled with Tailwind CSS.</p>
//       </div>
//     </>
//   )
// }

// export default Home

"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-4xl text-center px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Kurumunuz İçin Modern <span className="text-blue-600">Tedarik Çözümü</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Kolay, hızlı ve güvenli tedarik yönetimi. İhtiyaçlarınızı tek platformdan yönetin.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Başla
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Kolay Kullanım</h3>
            <p className="text-gray-600">Basit arayüz sayesinde işlemlerinizi hızlıca tamamlayın.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Güvenli Sistem</h3>
            <p className="text-gray-600">Verileriniz güvenle saklanır ve korunur.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Verimli Süreç</h3>
            <p className="text-gray-600">Tedarik sürecinizi otomatikleştirerek zaman kazanın.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
