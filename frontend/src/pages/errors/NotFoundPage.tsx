import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050608] px-6 text-center">

      {/* Orbit ring decoration */}
      <svg
        viewBox="0 0 320 260"
        className="pointer-events-none absolute h-[420px] w-[520px] opacity-40"
        aria-hidden="true"
      >
        <ellipse cx="160" cy="130" rx="150" ry="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <ellipse cx="160" cy="130" rx="100" ry="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="160" cy="130" r="6" fill="#4C6FFF" />
        <circle cx="285" cy="130" r="5" fill="#2FD9C4" />
      </svg>

      <div className="relative orbit-reveal">
        <span className="orbit-logo-mark mx-auto mb-8 h-11 w-11">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="2.4" fill="#4C6FFF" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#111" strokeWidth="1.3" />
          </svg>
        </span>

        <p className="font-display text-[110px] leading-none text-white">
          404
        </p>

        <h1 className="mt-4 text-xl font-semibold text-white">
          This orbit doesn't exist.
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#8D919D]">
          The page you're looking for was moved, renamed, or never existed
          in the first place.
        </p>

        <Link
          to="/"
          className="orbit-btn-glow group mx-auto mt-8"
        >
          Back to OrbitHQ
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
