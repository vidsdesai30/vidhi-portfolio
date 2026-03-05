import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidhi Desai ✌️",
  description: "Vidhi Desai — a developer by profession, a creative at heart.",
  authors: [{ name: "Vidhi Desai" }],
  keywords: ["Vidhi Desai", "Frontend Developer", "React", "Portfolio", "Creative Developer"],
  robots: "index, follow",
  openGraph: {
    title: "Vidhi Desai – Portfolio",
    description: "Vidhi Desai — a developer by profession, a creative at heart.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidhi Desai – Portfolio",
    description: "Vidhi Desai — a developer by profession, a creative at heart.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#05080f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
