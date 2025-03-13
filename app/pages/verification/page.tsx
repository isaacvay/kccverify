"use client";

import React, { useState } from 'react';
import { QrCode, Clock, Package, CalendarDays, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function VerificationPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de vérification API
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl border border-[#01B4AC]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-[#01B4AC] to-[#018D86] w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              {isVerified ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <QrCode className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isVerified ? 'Vérification Réussie !' : 'Validation de Bon'}
            </h1>
            <p className="text-gray-500">
              {isVerified 
                ? 'Bon validé avec succès ✅' 
                : 'Authentifiez votre bon de réapprovisionnement'}
            </p>
          </div>

          {!isVerified ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#01B4AC] focus:ring-2 focus:ring-[#01B4AC]/20 transition-all outline-none"
                    placeholder="XXXXXX"
                    inputMode="numeric"
                    maxLength={6}
                    required
                  />
                  <div className="absolute right-3 top-3.5 flex items-center gap-1 text-sm text-[#01B4AC]">
                    <Clock className="w-4 h-4" />
                    <span>15:00</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#01B4AC] to-[#018D86] hover:from-[#01B4AC]/90 hover:to-[#018D86]/90 text-white py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Vérification en cours...' : 'Confirmer le code'}
              </motion.button>
            </form>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-6 h-6" />
                    <h3 className="font-semibold">Bon authentifié avec succès</h3>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <ShieldCheck className="w-5 h-5 text-[#01B4AC]" />
              <span>Validation sécurisée par cryptage AES-256</span>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-gradient-to-br from-[#01B4AC] to-[#018D86] p-8 rounded-2xl shadow-xl text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm">REF #12345</span>
                  <span>Bon de Réapprovisionnement</span>
                </h2>
                <Image
                  src="/qr-code.svg"
                  alt="QR Code"
                  width={80}
                  height={80}
                  className="rounded-lg border-2 border-white/20"
                />
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium">T-shirt Premium</h3>
                      <p className="text-sm opacity-80">Référence: TSH-PREM-2024</p>
                    </div>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">En cours</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <Package className="w-4 h-4" />
                      <span>Quantité</span>
                    </div>
                    <p className="font-medium text-lg">500 unités</p>
                  </div>
                  <div className="space-y-1 p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <CalendarDays className="w-4 h-4" />
                      <span>Livraison</span>
                    </div>
                    <p className="font-medium text-lg">25/03/2024</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="opacity-80">Fournisseur</span>
                    <span className="font-medium">Textiles Premium</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
        <Clock className="inline-block w-4 h-4 mr-1" />
        Ce code est valable pendant 15 minutes. En cas de problème, contactez le support.
      </p>
    </div>
  )
}