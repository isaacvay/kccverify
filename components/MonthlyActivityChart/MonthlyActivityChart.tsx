"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// Enregistrement des composants requis pour Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MonthlyActivityChart() {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as any[],
  });

  useEffect(() => {
    // Abonnement en temps réel à la collection "enregistrements"
    // On compte ici toutes les vérifications (bons utilisés)
    const unsubscribe = onSnapshot(
      collection(db, "enregistrements"),
      (snapshot) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // Initialisation des compteurs pour chaque mois
        const counts: { [key: string]: number } = {};
        months.forEach((month) => {
          counts[month] = 0;
        });

        snapshot.forEach((doc) => {
          const data = doc.data();
          // Comptabiliser uniquement les bons utilisés
          if (data.utilise === true && data.createdAt && data.createdAt.seconds) {
            const date = new Date(data.createdAt.seconds * 1000);
            const monthLabel = months[date.getMonth()];
            counts[monthLabel] = (counts[monthLabel] || 0) + 1;
          }
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Vérifications",
              data: months.map((month) => counts[month]),
              fill: false,
              backgroundColor: "#01B4AC",
              borderColor: "#01B4AC",
              tension: 0.3,
            },
          ],
        });
      }
    );

    return () => unsubscribe();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Activité Mensuelle" },
    },
  };

  return <Line data={chartData} options={options} />;
}
