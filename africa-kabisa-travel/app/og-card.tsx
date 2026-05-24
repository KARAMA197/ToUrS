import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const ogSize = {
  width: 1200,
  height: 630,
};

export const ogContentType = "image/png";

type OgCardOptions = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  chips?: string[];
};

function shorten(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function getChips(chips: string[] | undefined) {
  const fallback = ["Safari", "Kilimanjaro", "Zanzibar"];
  const safeChips = (chips ?? fallback)
    .map((chip) => chip.trim())
    .filter(Boolean)
    .slice(0, 3);

  return safeChips.length > 0 ? safeChips : fallback;
}

function BrandMark() {
  return (
    <svg width="220" height="160" viewBox="0 0 220 160" fill="none">
      <circle cx="110" cy="76" r="68" fill="#FFFDF8" fillOpacity="0.96" />
      <circle cx="110" cy="76" r="68" stroke="#6E3D14" strokeWidth="7" />
      <circle cx="92" cy="46" r="16" fill="#6E3D14" />
      <path
        d="M48 112C66 104 80 95 94 80C100 74 107 69 114 64C121 60 129 59 137 61C147 63 156 70 163 84C167 92 171 101 175 112H48Z"
        fill="#6E3D14"
      />
      <path
        d="M95 73L106 62L116 72L127 59L138 72L149 65"
        stroke="#FFFDF8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M78 39L72 24" stroke="#6E3D14" strokeWidth="6" strokeLinecap="round" />
      <path d="M94 31V16" stroke="#6E3D14" strokeWidth="6" strokeLinecap="round" />
      <path d="M110 36L118 22" stroke="#6E3D14" strokeWidth="6" strokeLinecap="round" />
      <path d="M66 54L50 48" stroke="#6E3D14" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M90 123C91 113 95 106 101 103C104 102 105 104 105 108V127"
        stroke="#FFFDF8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M107 108C103 106 99 106 96 108"
        stroke="#FFFDF8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M121 125C122 115 126 108 132 104C135 103 136 105 136 109V127"
        stroke="#FFFDF8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M138 109C134 107 130 107 127 109"
        stroke="#FFFDF8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 134H168"
        stroke="#6E3D14"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function createOgImageResponse({
  eyebrow,
  title,
  description,
  accent,
  chips,
}: OgCardOptions) {
  const cardChips = getChips(chips);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background:
            "linear-gradient(160deg, rgb(8, 18, 15) 0%, rgb(15, 44, 36) 58%, rgb(24, 62, 48) 100%)",
          color: "#FFF7EA",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(200, 154, 70, 0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(255, 247, 234, 0.08)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "54px",
            gap: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "67%",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: 9999,
                    background: "#C89A46",
                  }}
                />
                <div
                  style={{
                    fontSize: 20,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#E3C68E",
                    fontWeight: 700,
                  }}
                >
                  {shorten(eyebrow, 42)}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  maxWidth: "700px",
                }}
              >
                <div
                  style={{
                    fontSize: 66,
                    lineHeight: 1.04,
                    fontWeight: 700,
                    color: "#FFF7EA",
                  }}
                >
                  {shorten(title, 86)}
                </div>

                <div
                  style={{
                    fontSize: 28,
                    lineHeight: 1.42,
                    color: "rgba(255, 247, 234, 0.78)",
                    maxWidth: "690px",
                  }}
                >
                  {shorten(description, 180)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {cardChips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "14px 20px",
                    borderRadius: 9999,
                    border: "1px solid rgba(255, 247, 234, 0.16)",
                    background: "rgba(255, 247, 234, 0.08)",
                    fontSize: 18,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#FFF7EA",
                    fontWeight: 700,
                  }}
                >
                  {shorten(chip, 28)}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "33%",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "28px",
              borderRadius: "34px",
              border: "1px solid rgba(255, 247, 234, 0.12)",
              background: "rgba(255, 247, 234, 0.06)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.22)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "190px",
              }}
            >
              <BrandMark />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  padding: "12px 18px",
                  borderRadius: 9999,
                  background: "rgba(200, 154, 70, 0.16)",
                  color: "#E8D2A4",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {shorten(accent, 34)}
              </div>

              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.5,
                  color: "rgba(255, 247, 234, 0.76)",
                }}
              >
                Private Tanzania trip planning for safari, Kilimanjaro, Zanzibar, and combined
                journeys.
              </div>

              <div
                style={{
                  fontSize: 28,
                  color: "#FFF7EA",
                  fontWeight: 700,
                }}
              >
                {siteConfig.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    ogSize
  );
}
