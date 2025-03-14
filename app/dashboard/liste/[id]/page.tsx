"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Ajustez le chemin selon votre projet
import QRCode from "react-qr-code";

interface Agent {
  nom: string;
  matricule: string;
  gsp: string;
  mois: string;
  pointDistribution: string;
  photoUrl?: string; // URL de la photo stockée sur Cloudinary
}

export default function AgentDetailPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const docRef = doc(db, "enregistrements", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAgent(docSnap.data() as Agent);
        } else {
          setError("Agent non trouvé");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgent();
    }
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!agent) return <div>Aucun agent trouvé</div>;

  // L'URL intégrant le matricule, qui sera encodée dans le QR code
  const qrCodeValue = `https://kccverify.vercel.app/pages/verification?matricule=${agent.matricule}`;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 uppercase">
      <div className="bg-white text-gray-900 p-4 rounded-lg shadow-lg h-[400px] w-[650px] border border-gray-400">
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
            <h2 className="text-red-700 font-bold text-base uppercase">
              BON DE FARINE
            </h2>
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
                <p className="border-r border-gray-500 p-1 font-bold text-base">
                  Matricule
                </p>
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
              <p className="p-1 font-bold">-</p>
            </div>
          </div>

          <div className="border-b border-gray-500">
            <p className="p-1 font-bold text-base">
              Point de distribution :{" "}
              <span className="font-semibold">{agent.pointDistribution}</span>
            </p>
          </div>
        </div>

        {/* Pied de page */}
        <div className="flex justify-between  items-center p-3 border-x border-b border-gray-500 text-gray-700">
          <img
            src="/KCCLogo.svg"
            alt="Logo KCC"
            className="h-10 w-32 transition-transform hover:scale-105"
            width={128}
            height={40}
          />
          {/* QR Code */}
        <div className="flex justify-center items-center">
          <div className="bg-white p-2 rounded shadow">
            <QRCode value={qrCodeValue} size={50} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
