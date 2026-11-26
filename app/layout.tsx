
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vtcar-web-production.up.railway.app"),

  title: {
    default: "VTCAR PREMIUM | Movemos Conquistas",
    template: "%s | VTCAR PREMIUM",
  },

  description:
    "Descubra uma nova experiência automotiva com a VTCAR PREMIUM. Conheça nosso atendimento, consulte oportunidades e encontre seu próximo veículo.",

  applicationName: "VTCAR PREMIUM",

  keywords: [
    "VTCAR PREMIUM",
    "veículos",
    "automóveis",
    "carros seminovos",
    "carros usados",
    "compra de veículos",
    "venda de veículos",
  ],

  authors: [
    {
      name: "VTCAR PREMIUM",
    },
  ],

  creator: "VTCAR PREMIUM",
  publisher: "VTCAR PREMIUM",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "VTCAR PREMIUM",
    title: "VTCAR PREMIUM | Movemos Conquistas",
    description:
      "Uma experiência automotiva moderna, transparente e diferenciada.",
  },

  twitter: {
    card: "summary_large_image",
    title: "VTCAR PREMIUM | Movemos Conquistas",
    description:
      "Conheça a VTCAR PREMIUM e descubra uma nova experiência automotiva.",
  },

  category: "automotive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#090909] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
