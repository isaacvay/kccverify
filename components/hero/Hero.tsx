"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QrCode, Lock, BarChart2 } from "lucide-react";

const features = [
  { Icon: QrCode, title: "Scan Instantané", text: "Reconnaissance IA des QR Codes" },
  { Icon: Lock, title: "Sécurité Maximale", text: "Chiffrement AES-256" },
  { Icon: BarChart2, title: "Analytique", text: "Dashboard temps réel" },
];

export default function Hero() {
  const router = useRouter();

  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        {/* Illustration principale */}
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
          <Image 
            src="/unnamed.gif" 
            alt="Illustration de vérification" 
            width={700} 
            height={400} 
            className="object-cover" 
          />
        </div>

        {/* Zone textuelle et fonctionnalités */}
        <div className="md:w-1/2 space-y-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#01B4AC] animate-fade-in-up">
            Système Intelligent de Vérification
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in-up delay-100">
            Vérifiez rapidement et efficacement la validité des bons de travailleur pour accéder aux fournitures essentielles.
          </p>
          <button 
            onClick={() => router.push("/pages/verification")}
            className="bg-[#01B4AC] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#018D86] transition-all shadow-md animate-fade-in-up delay-200"
          >
            🚀 Démarrer la vérification
          </button>

          {/* Présentation des fonctionnalités */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in-up delay-300">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
              >
                <feature.Icon className="mb-4 text-[#01B4AC]" size={64} />
                <h3 className="text-xl font-semibold text-[#01B4AC] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-center">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
