"use client";

import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface VerificationFormProps {
  code: string;
  setCode: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string;
  isLoading: boolean;
  matriculeParam: string | null;
}

export default function VerificationForm({
  code,
  setCode,
  handleSubmit,
  error,
  isLoading,
  matriculeParam,
}: VerificationFormProps) {
  return (
    <>
      {/* Affiche le formulaire uniquement s'il n'y a pas de matricule dans l'URL */}
      {!matriculeParam && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Matricule
            </label>
            <div className="relative">
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#01B4AC] focus:ring-2 focus:ring-[#01B4AC]/20 transition-all outline-none"
                placeholder="Ex: K26579"
                required
              />
              <div className="absolute right-3 top-3.5 flex items-center gap-1 text-sm text-[#01B4AC]">
                <Clock className="w-4 h-4" />
                <span>15:00</span>
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#01B4AC] to-[#018D86] hover:from-[#01B4AC]/90 hover:to-[#018D86]/90 text-white py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? "Vérification en cours..." : "Confirmer le matricule"}
          </motion.button>
        </form>
      )}
      {/* Si un matricule est fourni dans l'URL et la vérification est en cours */}
      {matriculeParam && isLoading && (
        <div className="text-center text-gray-500">
          Vérification automatique en cours...
        </div>
      )}
    </>
  );
}
