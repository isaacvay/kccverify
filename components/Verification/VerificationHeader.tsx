"use client";

import React from "react";
import { QrCode, CheckCircle } from "lucide-react";

interface VerificationHeaderProps {
  isVerified: boolean;
}

export default function VerificationHeader({ isVerified }: VerificationHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto bg-gradient-to-r from-[#01B4AC] to-[#018D86] w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
        {isVerified ? (
          <CheckCircle className="w-8 h-8 text-white" />
        ) : (
          <QrCode className="w-8 h-8 text-white" />
        )}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isVerified ? "Vérification Réussie !" : "Validation de Bon"}
      </h1>
      <p className="text-gray-500">
        {isVerified
          ? "Bon validé avec succès ✅"
          : "Authentifiez votre bon de réapprovisionnement via votre matricule"}
      </p>
    </div>
  );
}
