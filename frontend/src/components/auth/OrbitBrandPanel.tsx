type OrbitBrandPanelProps = {
  heading: string;
  subheading: string;
};

export function OrbitBrandPanel({ heading, subheading }: OrbitBrandPanelProps) {
  return (
    <div className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0A0D1F] to-[#131A3A] p-10 lg:flex">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#4C6FFF]" />
        <span className="font-semibold tracking-tight text-white">OrbitHQ</span>
      </div>

      <div className="max-w-xs">
        <h2 className="text-2xl font-semibold leading-snug text-white">
          {heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          {subheading}
        </p>
      </div>

      <svg
        viewBox="0 0 320 260"
        className="pointer-events-none absolute -bottom-10 -right-16 h-64 w-80 opacity-70"
        aria-hidden="true"
      >
        <ellipse cx="160" cy="140" rx="140" ry="55" fill="none" stroke="#2A3060" strokeWidth="1" />
        <ellipse cx="160" cy="140" rx="95" ry="38" fill="none" stroke="#2A3060" strokeWidth="1" />
        <ellipse cx="160" cy="140" rx="50" ry="20" fill="none" stroke="#2A3060" strokeWidth="1" />
        <circle cx="160" cy="140" r="7" fill="#4C6FFF" />
        <circle cx="300" cy="140" r="6" fill="#2FD9C4" />
        <circle cx="255" cy="102" r="5" fill="#F5A623" />
        <circle cx="65" cy="175" r="5" fill="#4C6FFF" />
      </svg>
    </div>
  );
}