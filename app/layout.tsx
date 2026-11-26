import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTCAR PREMIUM | Veículos selecionados",
  description:
    "Encontre seu próximo veículo com a VTCAR PREMIUM.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
