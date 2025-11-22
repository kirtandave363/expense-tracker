"use client";

import { useEffect, useRef, useState } from "react";

interface AdSenseProps {
  slot?: string;
  style?: React.CSSProperties;
  format?: string;
  className?: string;
  minHeight?: string;
  minWidth?: string;
}

export default function AdSense({
  slot,
  style = { display: "block" },
  format = "auto",
  className = "",
  minHeight = "100px",
  minWidth = "100%",
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adInitialized, setAdInitialized] = useState(false);

  useEffect(() => {
    // Wait for AdSense script to load
    const initAd = () => {
      try {
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
          if (adRef.current && !adInitialized) {
            ((window as any).adsbygoogle =
              (window as any).adsbygoogle || []).push({});
            setAdInitialized(true);
          }
        }
      } catch (err) {
        // Silently handle errors (ad blockers, etc.)
      }
    };

    // Try immediately
    initAd();

    // If not loaded, wait a bit and try again
    if (!adInitialized) {
      const timer = setTimeout(() => {
        initAd();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [adInitialized]);

  return (
    <div
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        height: minHeight, // Fixed height, not min-height
        maxHeight: minHeight,
        minWidth,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "relative",
        display: "block",
        flexShrink: 0, // Prevent flexbox from shrinking
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            overflow: "hidden",
            position: "relative",
          }}
          data-ad-client="ca-pub-5294896791916834"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}
