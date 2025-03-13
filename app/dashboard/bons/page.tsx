"use client";

import React from "react";

export default function BonsPage() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
      <div className="bg-white text-gray-900 p-4 rounded-lg shadow-lg h-[350px] w-[650px] border border-gray-400">
        {/* En-tête */}
        <div className="flex justify-between items-center p-2 border border-gray-500 ">
          <div className="text-base text-gray-600 font-semibold ">
          <img
              src="/KCCLogo.svg"
              alt="Logo KCC"
              className="h-10 w-32 transition-transform hover:scale-105"
              width={128}
              height={40}
            />
          </div>
          <div className="text-center">
            <h2 className="text-red-700 font-bold text-base uppercase">BON DE FARINE</h2>
            <p className="text-base font-semibold">25 KG</p>
          </div>
          <div className="text-center ">
            <img src="" alt=""  />
          </div>
        </div>

        {/* Contenu du bon */}
        <div className="border border-gray-500 ">
          <div className="grid grid-cols-2 border-b border-gray-500">
            <p className="border-r border-gray-500 p-1 font-bold text-base">Noms</p>
            <p className="p-1 text-base font-semibold">Gael MONGA M.</p>
          </div>

          <div className="grid grid-cols-2 border-b border-gray-500">
            <div>
                <div className="grid grid-cols-2 border-b border-gray-500">
                <p className="border-r border-gray-500 p-1 font-bold text-base">Matricule</p>
                <p className="p-1 text-base font-semibold">K26579</p>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-500">
            <p className="border-r border-gray-500 p-1 font-bold text-base">GSP</p>
            <p className="p-1 text-base font-semibold">DT_PRJ - KZI</p>
          </div>

         

          <div className="grid grid-cols-2 border-b border-gray-500">
            <p className="border-r border-gray-500 p-1 font-bold text-base">Mois</p>
            <p className="p-1 text-base font-semibold">FEV. 2025</p>
          </div>

            </div>
            <div className="border border-gray-500 text-xl text-center">
            <p className="border-r border-gray-500 p-1 font-bold">N°</p>
            <p className="p-1 font-bold">237</p>
            </div>
          </div>

         
          <div className="border-b border-gray-500">
            <p className="p-1 font-bold text-base">
              Point de distribution : <span className="font-semibold">JAMBO MART</span>
            </p>
          </div>
        </div>

        {/* Pied de page */}
        <div className="flex justify-center items-center p-6 border-x border-b border-gray-500 text-gray-700 ">
        <img
              src="/KCCLogo.svg"
              alt="Logo KCC"
              className="h-10 w-32 transition-transform hover:scale-105"
              width={128}
              height={40}
            />
        </div>
      </div>
    </div>
  );
}
