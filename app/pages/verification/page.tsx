"use client";

import React, { useEffect, useState } from "react";
import { QrCode, Clock, Package, CalendarDays, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

interface Agent {
  id: string;
  nom: string;
  matricule: string;
  gsp: string;
  mois: string;
  pointDistribution: string;
  photoUrl?: string;
}

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const matriculeParam = searchParams.get("matricule");

  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string>("");

  // Fonction qui vérifie un matricule donné
  const verifyMatricule = async (matricule: string) => {
    setIsLoading(true);
    setError("");
    try {
      const q = query(
        collection(db, "enregistrements"),
        where("matricule", "==", matricule)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("Aucun agent trouvé avec ce matricule.");
      } else {
        // On suppose qu'un matricule correspond à un seul agent
        const docData = querySnapshot.docs[0].data() as Omit<Agent, "id">;
        const agentFound: Agent = {
          id: querySnapshot.docs[0].id,
          ...docData,
        };
        setAgent(agentFound);
        setIsVerified(true);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la vérification.");
    } finally {
      setIsLoading(false);
    }
  };

  // Si un matricule est fourni dans l'URL, on lance la vérification automatique
  useEffect(() => {
    if (matriculeParam) {
      setCode(matriculeParam);
      verifyMatricule(matriculeParam);
    }
  }, [matriculeParam]);

  // Soumission manuelle (si aucun matricule n'est présent dans l'URL)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyMatricule(code);
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
                : 'Authentifiez votre bon de réapprovisionnement via votre matricule'}
            </p>
          </div>

          {/* Affichage du formulaire seulement si aucun matricule n'est fourni en URL */}
          {!isVerified && !matriculeParam && (
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
                {isLoading ? 'Vérification en cours...' : 'Confirmer le matricule'}
              </motion.button>
            </form>
          )}

          {!isVerified && matriculeParam && isLoading && (
            <div className="text-center text-gray-500">Vérification automatique en cours...</div>
          )}

          {isVerified && (
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
          {isVerified && agent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-gradient-to-br from-[#01B4AC] to-[#018D86] p-8 rounded-2xl shadow-xl text-white"
            >
              <div className="bg-white text-gray-900 p-4 rounded-lg shadow-lg h-[400px] w-[600px] border uppercase border-gray-400">
                {/* En-tête */}
                <div className="flex justify-between items-center p-2 border border-gray-500">
                  <div className="text-base text-gray-600 font-semibold">
                    <img
                      src="/KCCLogo.svg"
                      alt="Logo KCC"
                      className="h-10 w-32 transition-transform hover:scale-105"
                      width={128}
                      height={40}
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-red-700 font-bold text-base uppercase">BON DE FARINE</h2>
                    <p className="text-base font-semibold">25 KG</p>
                  </div>
                  {/* Affichage de la photo depuis Cloudinary */}
                  <div className="text-center">
                    {agent.photoUrl ? (
                      <img
                        src={agent.photoUrl}
                        alt="Photo de l'agent"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
                        Pas de photo
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenu du bon */}
                <div className="border border-gray-500">
                  <div className="grid grid-cols-2 border-b border-gray-500">
                    <p className="border-r border-gray-500 p-1 font-bold text-base">Noms</p>
                    <p className="p-1 text-base font-semibold">{agent.nom}</p>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-500">
                    <div>
                      <div className="grid grid-cols-2 border-b border-gray-500">
                        <p className="border-r border-gray-500 p-1 font-bold text-base">Matricule</p>
                        <p className="p-1 text-base font-semibold">{agent.matricule}</p>
                      </div>
                      <div className="grid grid-cols-2 border-b border-gray-500">
                        <p className="border-r border-gray-500 p-1 font-bold text-base">GSP</p>
                        <p className="p-1 text-base font-semibold">{agent.gsp}</p>
                      </div>
                      <div className="grid grid-cols-2 border-b border-gray-500">
                        <p className="border-r border-gray-500 p-1 font-bold text-base">Mois</p>
                        <p className="p-1 text-base font-semibold">{agent.mois}</p>
                      </div>
                    </div>
                    <div className="border border-gray-500 text-xl text-center">
                      <p className="border-r border-gray-500 p-1 font-bold">N°</p>
                      <p className="p-1 font-bold">237</p>
                    </div>
                  </div>

                  <div className="border-b border-gray-500">
                    <p className="p-1 font-bold text-base">
                      Point de distribution :{" "}
                      <span className="font-semibold">{agent.pointDistribution}</span>
                    </p>
                  </div>
                </div>

                {/* QR Code contenant le matricule */}
                <div className="flex justify-center items-center mt-4">
                  <div className="bg-white p-2 rounded shadow">
                    <QRCode
                      value={`https://kccverify.vercel.app/pages/verification?matricule=${agent.matricule}`}
                      size={120}
                    />
                  </div>
                </div>

                {/* Pied de page */}
                <div className="flex justify-center items-center p-6 border-x border-b border-gray-500 text-gray-700">
                  <img
                    src="/KCCLogo.svg"
                    alt="Logo KCC"
                    className="h-10 w-32 transition-transform hover:scale-105"
                    width={128}
                    height={40}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
        <Clock className="inline-block w-4 h-4 mr-1" />
        Ce matricule est valable pendant 15 minutes. En cas de problème, contactez le support.
      </p>
    </div>
  );
}
