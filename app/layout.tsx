import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";


export const metadata: Metadata = {
  title: "KCC",
  description: "KCC",
  icons: {
    icon: "/kccicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={` bg-white`}
      >
        <Navbar/>
        {children}
      </body>
     
    </html>
  );
}
