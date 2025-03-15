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
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// Interface décrivant la structure des données Firestore
interface Agent {
  id: string;
  gsp: string;
  pointDistribution: string;
  
  // Ajoutez d'autres champs si nécessaire
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des agents avec typage explicite
        const agentsSnapshot = await getDocs(collection(db, "enregistrements"));
        const agents = agentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Agent[];

        // Statistiques principales
        const totalAgents = agents.length;
        const uniqueGSP = new Set(agents.map((a) => a.gsp)).size;
        const uniquePoints = new Set(agents.map((a) => a.pointDistribution)).size;

        // Récupération des vérifications
        const verificationSnapshot = await getDocs(collection(db, "verifications"));
        const recentVerifications = verificationSnapshot.size;

        setStats((prev) => ({
          ...prev,
          totalAgents,
          activeGSP: uniqueGSP,
          distributionPoints: uniquePoints,
          recentVerifications,
        }));
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

        {/* Graphique Principal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-[#01B4AC]/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Activité Mensuelle</h2>
            <div className="flex items-center gap-2 text-[#01B4AC]">
              <ArrowTrendingUpIcon className="w-5 h-5" />
              <span>{stats.monthlyProgress}% d'augmentation</span>
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse">
            {/* Intégrer ici votre composant de graphique */}
          </div>
        </div>

        {/* Dernières Activités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#01B4AC]/20">
            <h2 className="text-lg font-semibold mb-4">Dernières Vérifications</h2>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#01B4AC]/10 flex items-center justify-center">
                      <DocumentCheckIcon className="w-4 h-4 text-[#01B4AC]" />
                    </div>
                    <div>
                      <p className="font-medium">Agent #{index + 1234}</p>
                      <p className="text-sm text-gray-500">Point de Distribution A</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques Rapides */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#01B4AC]/20">
            <h2 className="text-lg font-semibold mb-4">Répartition par GSP</h2>
            <div className="space-y-4">
              {["GSP Nord", "GSP Sud", "GSP Est", "GSP Ouest"].map((gsp, index) => (
                <div key={gsp} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 ${index % 2 === 0 ? "bg-[#01B4AC]" : "bg-[#018D86]"}`} />
                    <span>{gsp}</span>
                  </div>
                  <span className="font-medium">{Math.floor(Math.random() * 50) + 20}</span>
                </div>
              ))}
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
