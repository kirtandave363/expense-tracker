"use client";

import { useEffect } from "react";

interface AdSenseProps {
  slot?: string;
  style?: React.CSSProperties;
  format?: string;
  className?: string;
}

export default function AdSense({
  slot,
  style = { display: "block" },
  format = "auto",
  className = "",
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-5294896791916834"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

