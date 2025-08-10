import "./globals.css";
import { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";

export const metadata = { title: "VetDuty" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
