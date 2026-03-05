"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import HeroOverlay from "@/components/HeroOverlay";
import HubSection from "@/components/HubSection";
import SocialFooter from "@/components/SocialFooter";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const { progress } = useScrollProgress();

  // Always dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "night");
  }, []);

  // Portal flash opacity: peaks during mid-rush (progress 0.56–0.70), very subtle
  const portalFlash = Math.max(0,
    Math.min(1, (progress - 0.56) / 0.06) * (1 - Math.min(1, (progress - 0.66) / 0.06))
  ) * 0.35;

  return (
    <>
      {/* Fixed 3D canvas */}
      <Scene progress={progress} />

      {/* Dark sky background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "radial-gradient(ellipse at 50% 80%, rgba(20,30,60,0.6) 0%, rgba(5,8,15,1) 70%)",
        }}
      />

      {/* Portal radial flash – soft warm bloom during tunnel rush */}
      {portalFlash > 0.01 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5,
            pointerEvents: "none",
            background: `radial-gradient(ellipse 55% 65% at 50% 50%, rgba(255,220,140,${portalFlash}) 0%, rgba(220,160,60,${portalFlash * 0.4}) 40%, transparent 75%)`,
          }}
        />
      )}

      <main className="scroll-container">
        <HeroOverlay progress={progress} />

        {/* Door cinematic spacer */}
        <div className="section-door" aria-hidden="true" />

        {/* Portal tunnel spacer — extra scroll for falling-through-portal effect */}
        <div className="section-portal" aria-hidden="true" />

        {/* Hub: painting portals */}
        <HubSection progress={progress} />

        <SocialFooter progress={progress} />
      </main>
    </>
  );
}
