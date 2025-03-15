"use client";

import React, { Suspense } from "react";
import VerificationContent from "@/components/Verification/VerificationContent";

export default function VerificationPageWrapper() {
  return (
    <Suspense fallback={<div>Chargement de la vérification...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
