"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
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

export default function BonsListPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "enregistrements"));
        const agentsList: Agent[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Agent, "id">),
        }));
        setAgents(agentsList);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des bons");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // Fonction pour récupérer les initiales si aucune photo n'est disponible
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (agents.length === 0) return <div>Aucun bon trouvé.</div>;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase text-center">
          Liste des Bons
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => {
            // Construire l'URL du QR code intégrant le matricule
            const qrCodeValue = `https://kccverify.vercel.app/pages/verification?matricule=${agent.matricule}`;
            return (
              <div
                key={agent.id}
                className="bg-white text-gray-900 p-4 rounded-lg shadow-lg border border-gray-400 uppercase"
              >
                {/* En-tête du bon */}
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
                  <div className="text-center">
                    {agent.photoUrl ? (
                      <img
                        src={agent.photoUrl}
                        alt="Photo de l'agent"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
                        <span className="text-sm text-gray-600">
                          {getInitials(agent.nom)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenu du bon */}
                <div className="border border-gray-500">
                  <div className="grid grid-cols-2 border-b border-gray-500">
                    <p className="border-r border-gray-500 p-1 font-bold text-base">
                      Noms
                    </p>
                    <p className="p-1 text-base font-semibold">{agent.nom}</p>
                  </div>

                  <div className="grid grid-cols-2 border-b border-gray-500">
                    <div>
                      <div className="grid grid-cols-2 border-b border-gray-500">
                        <p className="border-r border-gray-500 p-1 font-bold text-base">
                          Matricule
                        </p>
                        <p className="p-1 text-base font-semibold">
                          {agent.matricule}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 border-b border-gray-500">
                        <p className="border-r border-gray-500 p-1 font-bold text-base">
                          GSP
                        </p>
                        <p className="p-1 text-base font-semibold">{agent.gsp}</p>
                      </div>
                      <div className="grid grid-cols-2 border-b border-gray-500">
                        <p className="border-r border-gray-500 p-1 font-bold text-base">
                          Mois
                        </p>
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
                      <span className="font-semibold">
                        {agent.pointDistribution}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Pied de page avec QR Code */}
                <div className="flex justify-between items-center p-3 border-x border-b border-gray-500">
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
