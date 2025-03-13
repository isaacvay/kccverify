import React from 'react'
 

  
  // Presentation.tsx
  export default function Presentation() {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          {/* Partie Scanner */}
          <div className="group relative cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-[#01B4AC] to-[#018D86] opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity" />
            
            <div className="relative space-y-6 p-8 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
              <div className="inline-flex items-center gap-3 text-2xl font-semibold text-gray-800">
                <svg className="w-12 h-12 text-[#01B4AC]" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4 4h4V2H2v6h2V4zm16 0h4V2h-6v2h2v4zm0 16h-4v2h6v-6h-2v4zM4 20H2v6h6v-2H4v-4zm9-12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <h2>Scan QR Code</h2>
              </div>
              <p className="text-gray-600 text-lg">Validation instantanée par reconnaissance visuelle</p>
              <div className="aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#01B4AC] transition-colors flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400 group-hover:text-[#01B4AC] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
          </div>
  
          {/* Partie Saisie Manuelle */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#01B4AC] to-[#018D86] opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity" />
            
            <div className="relative space-y-6 p-8 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
              <div className="inline-flex items-center gap-3 text-2xl font-semibold text-gray-800">
                <svg className="w-12 h-12 text-[#01B4AC]" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                </svg>
                <h2>Saisie Manuelle</h2>
              </div>
              <p className="text-gray-600 text-lg">Entrez directement le code matricule</p>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Code matricule..." 
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-[#01B4AC] outline-none transition-colors text-lg"
                />
                <button className="w-full bg-[#01B4AC] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#018D86] transition-colors">
                  Vérifier Maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
