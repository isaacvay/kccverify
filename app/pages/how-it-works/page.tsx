"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/footer/Footer';
import { FaQrcode, FaMobileAlt, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <FaQrcode className="w-8 h-8" />,
      title: "Obtenir le Bon",
      description: "Recevez votre bon de réapprovisionnement avec un QR code unique généré sécuritairement",
      image: "/bonv.png"
    },
    {
      icon: <FaMobileAlt className="w-8 h-8" />,
      title: "Scanner le Code",
      description: "Utilisez notre scanner intégré ou l'appareil photo de votre smartphone pour lire le QR code",
      image: "/scan.jpg"
    },
    {
      icon: <FaCheckCircle className="w-8 h-8" />,
      title: "Validation Instantanée",
      description: "Notre système vérifie en temps réel l'authenticité et la validité du bon",
      image: "/validation.png"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Réception Sécurisée",
      description: "Réceptionnez vos fournitures après confirmation du statut valide du bon",
      image: "/secu.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#01B4AC]/10">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Fonctionnement du Système
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre processus sécurisé de validation des bons en 4 étapes simples
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid gap-16 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute h-full w-0.5 bg-gray-200 left-1/2 -translate-x-1/2 hidden md:block" />
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Image Container */}
                  <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white text-left">
                      <span className="text-sm font-light">Étape {index + 1}</span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                  </div>

                  {/* Icon & Text */}
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#01B4AC] flex items-center justify-center mb-4 shadow-lg">
                    <div className="text-[#01B4AC]">
                      {step.icon}
                    </div>
                  </div>
                  <p className="text-gray-600 px-4">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src="/tech.jpeg"
                alt="Technologie QR Code"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900">Technologie Sécurisée</h2>
              <ul className="space-y-6">
                {[
                  "Cryptage AES-256 bits",
                  "Validation en temps réel",
                  "Base de données blockchain",
                  "Certification numérique"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#01B4AC] flex items-center justify-center">
                      <FaCheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
