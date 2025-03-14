"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  ChevronUpDownIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface Agent {
  id: string;
  nom: string;
  matricule: string;
  gsp: string;
  mois: string;
  pointDistribution: string;
  photoUrl?: string;
}

type SortKey = "nom" | "matricule" | "gsp" | "mois";

export default function AgentsListPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; asc: boolean }>({ 
    key: "nom", 
    asc: true 
  });
  const [selectedGSP, setSelectedGSP] = useState("all");

  const fetchAgents = async () => {
    try {
      const q = query(collection(db, "enregistrements"), orderBy(sortConfig.key));
      const querySnapshot = await getDocs(q);
      const agentsList: Agent[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Agent, "id">),
      }));
      setAgents(agentsList);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      asc: prev.key === key ? !prev.asc : true
    }));
  };

  const filteredAgents = agents
    .filter(agent => 
      agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agent => 
      selectedGSP === "all" || agent.gsp === selectedGSP
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.asc ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.asc ? 1 : -1;
      return 0;
    });

  const gspOptions = Array.from(new Set(agents.map(agent => agent.gsp)));
  const agentStats: {
    total: number;
    byGSP: { [key: string]: number };
  } = {
    total: agents.length,
    byGSP: gspOptions.reduce((acc, gsp) => ({
      ...acc,
      [gsp]: agents.filter(agent => agent.gsp === gsp).length
    }), {} as { [key: string]: number })
  };

  const getInitials = (name: string) => 
    name.split(' ').map(part => part[0]).join('').toUpperCase();

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen ml-0 md:ml-56">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#01B4AC]/20">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="w-6 h-6 text-[#01B4AC]" />
              <div>
                <div className="text-sm text-gray-500">Agents enregistrés</div>
                <div className="text-2xl font-bold">{agentStats.total}</div>
              </div>
            </div>
          </div>
          {/* Bouton vers la page des bons */}
        <div className="flex justify-end">
          <Link href="/dashboard/bons">
            <button className="px-4 py-2 bg-[#01B4AC] text-white rounded-lg shadow-md hover:bg-[#018D86] transition-all">
              Voir tous les bons
            </button>
          </Link>
        </div>
        </div>

        

        {/* Contrôles de filtrage */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedGSP}
                onChange={(e) => setSelectedGSP(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white appearance-none"
              >
                <option value="all">Tous les GSP</option>
                {gspOptions.map(gsp => (
                  <option key={gsp} value={gsp}>{gsp}</option>
                ))}
              </select>
              <ChevronUpDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-48 md:w-64"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchAgents}
              className="p-2 hover:bg-[#01B4AC]/10 rounded-lg transition-colors"
              title="Actualiser"
            >
              <ArrowPathIcon className="w-5 h-5 text-[#01B4AC]" />
            </button>
          </div>
        </div>

        {/* En-tête du tableau */}
        <div className="grid grid-cols-12 gap-4 px-4 text-sm font-medium text-gray-500">
          <div className="col-span-2"></div>
          <button 
            onClick={() => handleSort('nom')}
            className="col-span-3 flex items-center gap-1 hover:text-[#01B4AC]"
          >
            Nom {sortConfig.key === 'nom' && (sortConfig.asc ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('matricule')}
            className="col-span-2 flex items-center gap-1 hover:text-[#01B4AC]"
          >
            Matricule {sortConfig.key === 'matricule' && (sortConfig.asc ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('gsp')}
            className="col-span-3 flex items-center gap-1 hover:text-[#01B4AC]"
          >
            GSP {sortConfig.key === 'gsp' && (sortConfig.asc ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('mois')}
            className="col-span-2 flex items-center gap-1 hover:text-[#01B4AC]"
          >
            Mois {sortConfig.key === 'mois' && (sortConfig.asc ? '↑' : '↓')}
          </button>
        </div>

        {/* Liste des agents */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-4 rounded-xl shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center gap-4 text-center">
            <div className="text-red-600">{error}</div>
            <button
              onClick={fetchAgents}
              className="bg-[#01B4AC] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/dashboard/liste/${agent.id}`}
                    className="group grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-[#01B4AC]/20"
                  >
                    <div className="col-span-2">
                      {agent.photoUrl ? (
                        <img
                          src={agent.photoUrl}
                          alt={`${agent.nom}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#01B4AC]/50"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#01B4AC]/10 flex items-center justify-center border-2 border-[#01B4AC]/20">
                          <span className="font-medium text-[#01B4AC]">
                            {getInitials(agent.nom)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-3 font-medium uppercase group-hover:text-[#01B4AC]">
                      {agent.nom}
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-600">
                      {agent.matricule}
                    </div>
                    
                    <div className="col-span-3">
                      <span className="px-2 py-1 bg-[#01B4AC]/10 text-[#01B4AC] text-xs rounded-full">
                        {agent.gsp}
                      </span>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-600">
                      {new Date(agent.mois).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredAgents.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Aucun agent trouvé
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
