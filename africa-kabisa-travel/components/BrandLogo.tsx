import Image from "next/image";

type BrandLogoProps = {
  tone?: "light" | "dark";
  size?: "sm" | "md";
  showSubtitle?: boolean;
};

export default function BrandLogo({
  tone = "light",
  size = "sm",
}: BrandLogoProps) {
  const isLightTone = tone === "light";
  const imageClass = size === "sm" ? "h-[52px] w-auto sm:h-[58px]" : "h-[82px] w-auto sm:h-[94px]";
  const toneClass = isLightTone
    ? "brightness-0 invert drop-shadow-[0_12px_18px_rgba(8,18,15,0.4)]"
    : "drop-shadow-[0_10px_16px_rgba(8,18,15,0.14)]";

  return (
    <div className="inline-flex">
      <Image
        src="/branding/brilliant-explore-safaris-logo-transparent.png"
        alt="Brilliant Explore Safaris"
        width={820}
        height={889}
        priority
        className={`${imageClass} ${toneClass}`}
      />
    </div>
  );
}
