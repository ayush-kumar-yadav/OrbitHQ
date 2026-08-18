import { ORBIT_BG_VIDEO_URL } from "../../constants/media";

type OrbitBrandPanelProps = {
  heading: string;
  subheading: string;
};

export function OrbitBrandPanel({ heading, subheading }: OrbitBrandPanelProps) {
  return (
    <div className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden bg-[#050608] p-10 lg:flex">

      {/* Same background video as the landing page, so this
          doesn't feel like a different product after signing
          up. Dimmed harder since there's a form on the other
          side of the screen that needs to stay legible. */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={ORBIT_BG_VIDEO_URL} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,8,0.75) 0%, rgba(5,6,8,0.55) 45%, rgba(5,6,8,0.92) 100%)",
        }}
      />

      {/* Dissolves the panel's right edge into the ambient
          background instead of a hard vertical cut */}
      <div className="orbit-panel-fade" />

      {/* Logo */}
      <div className="relative flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#4C6FFF] shadow-[0_0_12px_rgba(76,111,255,0.8)]" />
        <span className="font-display text-sm tracking-wide text-white">
          OrbitHQ
        </span>
      </div>

      {/* Copy */}
      <div className="relative max-w-xs orbit-reveal">
        <h2 className="font-display text-[26px] leading-snug text-white">
          {heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#c4c2c3]">
          {subheading}
        </p>
      </div>
    </div>
  );
}