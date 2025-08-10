import "./globals.css";
import { ReactNode } from "react";
export const metadata = { title: "Vet Roster" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
