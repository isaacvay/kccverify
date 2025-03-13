import React from 'react'

   
  // HowItWorks.tsx
  export default function HowItWorks() {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fonctionnement en 3 étapes</h2>
            <p className="text-xl text-gray-600">Un processus simplifié pour une efficacité maximale</p>
          </div>
  
          <div className="relative">
            {/* Ligne de timeline */}
            <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-[#01B4AC] to-[#018D86] hidden lg:block" />
  
            <div className="grid lg:grid-cols-3 gap-12">
              {[
                { 
                  title: "1. Génération du Bon",
                  content: "Émission sécurisée du bon avec identifiant unique",
                  icon: "📄"
                },
                { 
                  title: "2. Validation Numérique",
                  content: "Scan QR code ou saisie manuelle du code matricule",
                  icon: "✅"
                },
                { 
                  title: "3. Distribution Sécurisée",
                  content: "Remise des fournitures après vérification",
                  icon: "🚚"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#01B4AC] text-white text-3xl flex items-center justify-center mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 text-lg">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }