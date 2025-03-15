"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import QRCode from "react-qr-code";
import QRCode1 from "qrcode";

interface Agent {
  id: string;
  nom: string;
  matricule: string;
  gsp: string;
  mois: string;
  pointDistribution: string;
  photoUrl?: string;
}

// Définissez d'abord des styles avec des dimensions réduites
const styles = StyleSheet.create({
  page: {
    padding: 5,
    fontSize: 8, // taille de police réduite
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  container: {
    border: "1 solid #000",
    marginBottom: 5,
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1 solid #000",
    padding: 4,
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    marginHorizontal: 10,
  },
  content: {
    marginTop: 2,
  },
  gridRow: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
  },
  gridCol: {
    padding: 2,
    borderRight: "1 solid #000",
    flex: 1,
  },
  gridColLast: {
    padding: 2,
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 1,
  },
  value: {
    fontWeight: "normal",
  },
  numberBox: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "1 solid #000",
    padding: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    borderTop: "1 solid #000",
    alignItems: "center",
  },
  logo: {
    width: 64,  // image réduite
    height: 20, // image réduite
  },
  agentPhoto: {
    width: 48,  // photo agent réduite
    height: 48, // photo agent réduite
    borderRadius: 4,
    border: "1 solid #fff",
  },
  qrContainer: {
    width: 32,  // conteneur QR réduit
    height: 32,
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 2,
    border: "1 solid #000",
  },
  qrImage: {
    width: "100%",
    height: "100%",
  },
});

// Le composant BonPDF reste identique (il utilisera les nouveaux styles)
const BonPDF = ({ agent, index }: { agent: Agent; index: number }) => {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const qrCodeValue = `https://kccverify.vercel.app/pages/verification?matricule=${agent.matricule}`;

  useEffect(() => {
    QRCode1.toDataURL(qrCodeValue, { width: 100, margin: 1 }) // largeur réduite du QR
      .then((url: React.SetStateAction<string>) => setQrDataUrl(url))
      .catch(console.error);
  }, [qrCodeValue]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/KCCLogo.png" />
        <View style={styles.headerText}>
          <Text style={{ color: "#d32f2f", fontSize: 10, marginBottom: 2 }}>
            BON DE FARINE
          </Text>
          <Text style={{ fontSize: 8 }}>25 KG</Text>
        </View>
        {agent.photoUrl ? (
          <Image style={styles.agentPhoto} src={agent.photoUrl} />
        ) : (
          <View
            style={[
              styles.agentPhoto,
              {
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ fontSize: 8 }}>
              {agent.nom.split(" ").map((n) => n[0]).join("")}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.gridRow}>
          <View style={{ flex: 2, flexDirection: "row" }}>
            <Text style={styles.label}>Noms : </Text>
            <Text style={styles.value}>{agent.nom}</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={[styles.gridCol, { flex: 2 }]}>
              <Text style={styles.label}>Matricule :</Text>
              <Text style={styles.value}>{agent.matricule}</Text>
            </View>
            <View style={[styles.gridCol, { flex: 1 }]}>
              <Text style={styles.label}>GSP :</Text>
              <Text style={styles.value}>{agent.gsp}</Text>
            </View>
            <View style={[styles.gridColLast, { flex: 1 }]}>
              <Text style={styles.label}>Mois :</Text>
              <Text style={styles.value}>{agent.mois}</Text>
            </View>
          </View>
          <View style={styles.numberBox}>
            <Text style={{ fontSize: 8 }}>N°</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              {index + 1}
            </Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={{ flex: 2, flexDirection: "row" }}>
            <Text style={styles.label}>Point de distribution : </Text>
            <Text style={styles.value}>{agent.pointDistribution}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Image style={styles.logo} src="/KCCLogo.png" />
        <View style={styles.qrContainer}>
          {qrDataUrl && <Image style={styles.qrImage} src={qrDataUrl} />}
        </View>
      </View>
    </View>
  );
};

// Composant BonsPDFDocument qui organise 6 bons par page dans une grille de 2 colonnes et 3 lignes
const BonsPDFDocument = ({ agents }: { agents: Agent[] }) => {
  // Découpe la liste en groupes de 6 agents (1 groupe = 1 page)
  const groups = [];
  for (let i = 0; i < agents.length; i += 6) {
    groups.push(agents.slice(i, i + 6));
  }
  // Hauteur de chaque case (à ajuster si besoin)
  const cellHeight = 200;

  return (
    <Document>
      {groups.map((group, groupIndex) => (
        <Page
          key={groupIndex}
          size="A4"
          style={{ ...styles.page, padding: 5, flexDirection: "column" }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {group.map((agent, index) => (
              <View
                key={agent.id}
                style={{
                  width: "50%", // 2 colonnes par ligne
                  height: cellHeight,
                  padding: 3,
                }}
              >
                <BonPDF agent={agent} index={groupIndex * 6 + index} />
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};



export default function BonsListPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (agents.length === 0) return <div>Aucun bon trouvé.</div>;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase text-center">
          Liste des Bons
        </h1>
        <div className="flex justify-end mb-4">
          <PDFDownloadLink
            document={<BonsPDFDocument agents={agents} />}
            fileName="bons.pdf"
            className="px-4 py-2 bg-[#01B4AC] text-white rounded-lg shadow-md hover:bg-[#018D86] transition-all"
          >
            {({ loading }) =>
              loading ? "Génération du PDF..." : "Exporter en PDF"
            }
          </PDFDownloadLink>
        </div>
        <div className="flex flex-col w-6/12 mx-auto gap-4">
          {agents.map((agent , index) => {
            const qrCodeValue = `https://kccverify.vercel.app/pages/verification?matricule=${agent.matricule}`;
            return (
              <div
                key={agent.id}
                className="bg-white text-gray-900 p-4 rounded-lg shadow-lg border border-gray-400 uppercase"
              >
                <div className="flex justify-between items-center p-2 border border-gray-500">
                  <div className="text-base text-gray-600 font-semibold">
                    <img
                      crossOrigin="anonymous"
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
                        crossOrigin="anonymous"
                        src={agent.photoUrl}
                        alt="Photo de l'agent"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
                        <span className="text-sm text-gray-600">
                          {agent.nom.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
                      <p className="p-1 font-bold">{index + 1}</p>
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
                <div className="flex justify-between items-center p-3 border-x border-b border-gray-500">
                  <img
                    crossOrigin="anonymous"
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
