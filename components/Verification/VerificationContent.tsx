"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShieldCheck, Clock } from "lucide-react";

import VerificationHeader from "./VerificationHeader";
import VerificationForm from "./VerificationForm";
import AgentCard from "./AgentCard";

export interface Agent {
  id: string;
  nom: string;
  matricule: string;
  gsp: string;
  mois: string;
  pointDistribution: string;
  photoUrl?: string;
}

export default function VerificationContent() {
  const searchParams = useSearchParams();
  const matriculeParam = searchParams.get("matricule");

  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState("");

  // Fonction de vérification du matricule avec limite à 1 résultat
  const verifyMatricule = async (matricule: string) => {
    setIsLoading(true);
    setError("");
    try {
      const q = query(
        collection(db, "enregistrements"),
        where("matricule", "==", matricule),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("Aucun agent trouvé avec ce matricule.");
      } else {
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

  // Vérification automatique si un matricule est fourni dans l'URL
  useEffect(() => {
    if (matriculeParam) {
      setCode(matriculeParam);
      verifyMatricule(matriculeParam);
    }
  }, [matriculeParam]);

  // Soumission manuelle si aucun matricule dans l'URL
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
          <VerificationHeader isVerified={isVerified} />
          <VerificationForm
            code={code}
            setCode={setCode}
            handleSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
            matriculeParam={matriculeParam}
          />
          {isVerified && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
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

        {isVerified && agent && <AgentCard agent={agent} />}
      </div>

      <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
        <Clock className="inline-block w-4 h-4 mr-1" />
        Ce matricule est valable pendant 15 minutes. En cas de problème, contactez le support.
      </p>
    </div>
  );
}
