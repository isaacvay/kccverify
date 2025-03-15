"use client";
import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  BuildingStorefrontIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import MonthlyActivityChart from "@/components/MonthlyActivityChart/MonthlyActivityChart";

// Interface pour Agent (dossier dans "enregistrements")
interface Agent {
  id: string;
  nom: string;
  gsp: string;
  pointDistribution: string;
  createdAt: { seconds: number; nanoseconds: number };
  utilise?: boolean;
}

// Dans ce contexte, nous utilisons les mêmes documents pour les vérifications.
// Ainsi, l'interface Verification est identique à Agent (pour les bons utilisés).
interface Verification {
  id: string;
  nom: string;
  gsp: string;
  pointDistribution: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAgents: 0,
    recentVerifications: 0,
    activeGSP: 0,
    distributionPoints: 0,
    monthlyProgress: 0,
    verificationTrend: "up" as "up" | "down" | "stable",
  });
  const [gspRepartition, setGspRepartition] = useState<{ [key: string]: number }>({});
  const [latestVerifications, setLatestVerifications] = useState<Verification[]>([]);
  const [latestAgents, setLatestAgents] = useState<Agent[]>([]);

  // Fonction utilitaire pour formater la différence de temps
  const formatTimeDifference = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération de tous les agents depuis "enregistrements"
        const agentsSnapshot = await getDocs(collection(db, "enregistrements"));
        const agents = agentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Agent[];

        const totalAgents = agents.length;
        const uniqueGSP = new Set(agents.map((a) => a.gsp)).size;
        const uniquePoints = new Set(agents.map((a) => a.pointDistribution)).size;

        // Récupération des bons utilisés (verifications) depuis "enregistrements"
        const usedAgentsSnapshot = await getDocs(
          query(
            collection(db, "enregistrements"),
            where("utilise", "==", true)
          )
        );
        const recentVerifications = usedAgentsSnapshot.size;

        setStats((prev) => ({
          ...prev,
          totalAgents,
          activeGSP: uniqueGSP,
          distributionPoints: uniquePoints,
          recentVerifications,
        }));

        // Calcul de la répartition par GSP
        const gspCounts = agents.reduce((acc: { [key: string]: number }, agent: Agent) => {
          if (agent.gsp) {
            acc[agent.gsp] = (acc[agent.gsp] || 0) + 1;
          }
          return acc;
        }, {});
        setGspRepartition(gspCounts);

        // Récupération des 5 dernières vérifications (bons utilisés)
        const verificationsQuery = query(
          collection(db, "enregistrements"),
          where("utilise", "==", true),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const verificationsSnapshot = await getDocs(verificationsQuery);
        const verifications = verificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Verification[];
        setLatestVerifications(verifications);

        // Tri des agents par date d'enregistrement et sélection des 5 derniers
        const sortedAgents = agents.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        setLatestAgents(sortedAgents.slice(0, 5));
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8 ml-0 md:ml-64 transition-all">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Tableau de Bord</h1>
          <Link
            href="/dashboard/enregistrement"
            className="bg-[#01B4AC] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#018D86] transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Nouvel Enregistrement
          </Link>
        </div>

        {/* Cartes de Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<UserGroupIcon className="w-6 h-6" />}
            title="Agents Enregistrés"
            value={stats.totalAgents}
            color="bg-[#01B4AC]"
            trend="up"
          />
          <StatCard
            icon={<DocumentCheckIcon className="w-6 h-6" />}
            title="Vérifications Récentes"
            value={stats.recentVerifications}
            trend="up"
            color="bg-green-500"
          />
          <StatCard
            icon={<BuildingStorefrontIcon className="w-6 h-6" />}
            title="GSP Actifs"
            value={stats.activeGSP}
            trend="stable"
            color="bg-purple-500"
          />
          <StatCard
            icon={<ChartBarIcon className="w-6 h-6" />}
            title="Points de Distribution"
            value={stats.distributionPoints}
            trend="down"
            color="bg-orange-500"
          />
        </div>

        {/* Graphique Principal en temps réel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-[#01B4AC]/20">
          <MonthlyActivityChart />
        </div>
         <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        {/* Dernières Vérifications */}
        <div className="bg-white p-6 w-full md:w-1/2 rounded-2xl shadow-sm border border-[#01B4AC]/20 mb-8">
          <h2 className="text-lg font-semibold mb-4">Dernières Vérifications</h2>
          <div className="space-y-4">
            {latestVerifications.length > 0 ? (
              latestVerifications.map((verification) => {
                const verificationDate = new Date(verification.createdAt.seconds * 1000);
                return (
                  <div
                    key={verification.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#01B4AC]/10 flex items-center justify-center">
                        <DocumentCheckIcon className="w-4 h-4 text-[#01B4AC]" />
                      </div>
                      <div>
                        <p className="font-medium">{verification.nom}</p>
                        <p className="text-sm text-gray-500">{verification.pointDistribution}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTimeDifference(verificationDate)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p>Aucune vérification récente</p>
            )}
          </div>
        </div>

        {/* Répartition par GSP */}
        <div className="bg-white p-6 ml-4 w-full md:w-1/2  rounded-2xl shadow-sm border border-[#01B4AC]/20 mb-8">
          <h2 className="text-lg font-semibold mb-4">Répartition par GSP</h2>
          <div className="space-y-4">
            {Object.entries(gspRepartition).length > 0 ? (
              Object.entries(gspRepartition).map(([gsp, count], index) => (
                <div key={gsp} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-8 ${index % 2 === 0 ? "bg-[#01B4AC]" : "bg-[#018D86]"}`}
                    />
                    <span>{gsp}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))
            ) : (
              <p>Aucune donnée disponible</p>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  trend: "up" | "down" | "stable";
  color: string;
}

function StatCard({ icon, title, value, trend, color }: StatCardProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    stable: "text-gray-500",
  };

  const trendIcons = {
    up: "▲",
    down: "▼",
    stable: "➔",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#01B4AC]/20">
      <div className="flex justify-between items-start">
        <div className={`${color} p-3 rounded-xl`}>{icon}</div>
        <span className={`text-sm ${trendColors[trend]}`}>
          {trendIcons[trend]} 12%
        </span>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
}
