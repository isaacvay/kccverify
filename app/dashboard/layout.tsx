// app/dashboard/layout.tsx
"use client";

import LeftNav from '@/components/leftNav/LeftNav';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu latéral */}
      <LeftNav />

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
