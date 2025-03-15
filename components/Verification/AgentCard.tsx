"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface Agent {
  id: string;
  nom: string;
  matricule: string;
  gsp: string;
  mois: string;
  pointDistribution: string;
  photoUrl?: string;
  utilise?: boolean; // true si le bon a été utilisé
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  // On stocke localement l'agent pour refléter les mises à jour de Firestore.
  const [localAgent, setLocalAgent] = useState<Agent>(agent);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Lorsqu'une nouvelle prop agent est reçue, on met à jour le state local.
  useEffect(() => {
    setLocalAgent(agent);
  }, [agent]);

  const handleMarkAsUsed = async () => {
    setIsUpdating(true);
    setUpdateError("");
    try {
      // Met à jour Firestore pour marquer le bon comme utilisé.
      await updateDoc(doc(db, "enregistrements", agent.id), { utilise: true });
      
      // Option 1 : lecture optimiste (mise à jour locale immédiate)
      setLocalAgent(prev => ({ ...prev, utilise: true }));

      // Option 2 : relecture depuis Firestore pour être sûr de la mise à jour (décommenter si besoin)
      // const docRef = doc(db, "enregistrements", agent.id);
      // const docSnap = await getDoc(docRef);
      // if (docSnap.exists()) {
      //   setLocalAgent({ id: docSnap.id, ...docSnap.data() } as Agent);
      // }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setUpdateError("Erreur lors de la mise à jour du bon.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Le fond change uniquement si le champ 'utilise' est vrai dans Firestore.
  const cardBgClass = localAgent.utilise
    ? "bg-gradient-to-br from-gray-300 to-gray-400"
    : "bg-gradient-to-br from-[#01B4AC] to-[#018D86]";

  const qrCodeValue = `https://kccverify.vercel.app/pages/verification?matricule=${localAgent.matricule}`;

  return (
    <AnimatePresence>
      <motion.div
        className={`relative mt-8 h-60 md:h-auto w-auto ${cardBgClass} px-4 pb-4 pt-2 md:px-8 md:pb-8 rounded-2xl shadow-xl text-white`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* Badge affiché si le bon a été utilisé */}
            {localAgent.utilise && (
            <div 
                className="absolute top-0 right-0 m-2 bg-red-600 text-white px-3 py-1 rounded-full 
                        text-sm font-semibold z-20 shadow-md" 
                style={{ transform: "scale(1)", transformOrigin: "top right" }}
            >
                UTILISÉ
            </div>
            )}
         {/* Bouton d'action (affiché uniquement si le bon n'est pas encore marqué comme utilisé) */}
         <div className="mt-4 flex flex-col items-center">
          {!localAgent.utilise && (
            <button
              onClick={handleMarkAsUsed}
              disabled={isUpdating}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isUpdating ? "Mise à jour..." : `Marquer comme utilisé pour ${localAgent.mois}`}
            </button>
          )}
          {updateError && <p className="mt-2 text-red-500">{updateError}</p>}
        </div>

        {/* Vue mobile */}
        <div className="block sm:hidden overflow-hidden" style={{ width: "400px", height: "600px" }}>
          <div className="transform origin-top-left" style={{ width: "1200px", transform: "scale(0.40)" }}>
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
                <div className="text-center">
                  {localAgent.photoUrl ? (
                    <img
                      src={localAgent.photoUrl}
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
              {/* Contenu */}
              <div className="border border-gray-500">
                <div className="grid grid-cols-2 border-b border-gray-500">
                  <p className="border-r border-gray-500 p-1 font-bold text-base">Noms</p>
                  <p className="p-1 text-base font-semibold">{localAgent.nom}</p>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-500">
                  <div>
                    <div className="grid grid-cols-2 border-b border-gray-500">
                      <p className="border-r border-gray-500 p-1 font-bold text-base">Matricule</p>
                      <p className="p-1 text-base font-semibold">{localAgent.matricule}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-500">
                      <p className="border-r border-gray-500 p-1 font-bold text-base">GSP</p>
                      <p className="p-1 text-base font-semibold">{localAgent.gsp}</p>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-500">
                      <p className="border-r border-gray-500 p-1 font-bold text-base">Mois</p>
                      <p className="p-1 text-base font-semibold">{localAgent.mois}</p>
                    </div>
                  </div>
                  <div className="border border-gray-500 text-xl text-center">
                    <p className="border-r border-gray-500 p-1 font-bold">N°</p>
                    <p className="p-1 font-bold">237</p>
                  </div>
                </div>
                <div className="border-b border-gray-500">
                  <p className="p-1 font-bold text-base">
                    Point de distribution : <span className="font-semibold">{localAgent.pointDistribution}</span>
                  </p>
                </div>
              </div>
              {/* Pied de page avec QR Code */}
              <div className="flex justify-between items-center p-3 border-x border-b border-gray-500 text-gray-700">
                <img
                  src="/KCCLogo.svg"
                  alt="Logo KCC"
                  className="h-10 w-32 transition-transform hover:scale-105"
                  width={128}
                  height={40}
                />
                <div className="flex justify-center items-center">
                  <div className="bg-white p-2 rounded shadow">
                    <QRCode value={qrCodeValue} size={50} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vue desktop */}
        <div className="bg-white hidden sm:block text-gray-900 p-4 rounded-lg shadow-lg h-[400px] w-[600px] border uppercase border-gray-400">
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
            <div className="text-center">
              {localAgent.photoUrl ? (
                <img
                  src={localAgent.photoUrl}
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
          {/* Contenu */}
          <div className="border border-gray-500">
            <div className="grid grid-cols-2 border-b border-gray-500">
              <p className="border-r border-gray-500 p-1 font-bold text-base">Noms</p>
              <p className="p-1 text-base font-semibold">{localAgent.nom}</p>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-500">
              <div>
                <div className="grid grid-cols-2 border-b border-gray-500">
                  <p className="border-r border-gray-500 p-1 font-bold text-base">Matricule</p>
                  <p className="p-1 text-base font-semibold">{localAgent.matricule}</p>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-500">
                  <p className="border-r border-gray-500 p-1 font-bold text-base">GSP</p>
                  <p className="p-1 text-base font-semibold">{localAgent.gsp}</p>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-500">
                  <p className="border-r border-gray-500 p-1 font-bold text-base">Mois</p>
                  <p className="p-1 text-base font-semibold">{localAgent.mois}</p>
                </div>
              </div>
              <div className="border border-gray-500 text-xl text-center">
                <p className="border-r border-gray-500 p-1 font-bold">N°</p>
                <p className="p-1 font-bold">237</p>
              </div>
            </div>
            <div className="border-b border-gray-500">
              <p className="p-1 font-bold text-base">
                Point de distribution : <span className="font-semibold">{localAgent.pointDistribution}</span>
              </p>
            </div>
          </div>
          {/* Pied de page avec QR Code */}
          <div className="flex justify-between items-center p-3 border-x border-b border-gray-500 text-gray-700">
            <img
              src="/KCCLogo.svg"
              alt="Logo KCC"
              className="h-10 w-32 transition-transform hover:scale-105"
              width={128}
              height={40}
            />
            <div className="flex justify-center items-center">
              <div className="bg-white p-2 rounded shadow">
                <QRCode value={qrCodeValue} size={50} />
              </div>
            </div>
          </div>
        </div>

       
      </motion.div>
    </AnimatePresence>
  );
}
