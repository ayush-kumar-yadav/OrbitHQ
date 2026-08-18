import { Link } from "react-router-dom";
import { ArrowRight, Check, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./landing.css";
const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="orbit-landing">
      {/* Background */}
      <video
        className="orbit-landing-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={VIDEO_URL}
          type="video/mp4"
        />
      </video>

      <div className="orbit-landing-overlay" />

      {/* Navigation */}
      <header className="orbit-landing-header">
        <Link
          to="/"
          className="orbit-logo"
        >
          <span className="orbit-logo-dot" />
          <span>OrbitHQ</span>
        </Link>

        <nav className="orbit-nav">
          <a href="#product">Product</a>
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="orbit-header-actions">
          <Link
            to="/login"
            className="orbit-signin"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="orbit-nav-cta"
          >
            Get started
            <ArrowRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          className="orbit-mobile-menu"
          onClick={() =>
            setMenuOpen((value) => !value)
          }
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </header>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="orbit-mobile-nav">
          <a
            href="#product"
            onClick={() => setMenuOpen(false)}
          >
            Product
          </a>

          <a
            href="#workflow"
            onClick={() => setMenuOpen(false)}
          >
            Workflow
          </a>

          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="orbit-mobile-cta"
            onClick={() => setMenuOpen(false)}
          >
            Get started
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Main */}
      <main>
        {/* Hero */}
        <section
          id="product"
          className="orbit-hero"
        >
          <div className="orbit-trust">
            <div className="orbit-trust-icons">
              <span>O</span>
              <span>AI</span>
              <span>+</span>
            </div>

            <span>
              Built for modern teams
            </span>
          </div>

          <h1 className="orbit-hero-title">
            <span>Work.</span>
            <span>In Orbit.</span>
          </h1>

          <p className="orbit-hero-description">
            A unified workspace for projects,
            tasks, teams and intelligent
            productivity — designed to keep
            everything moving.
          </p>

          <div className="orbit-hero-actions">
            <Link
              to="/register"
              className="orbit-primary-button"
            >
              Start building
              <ArrowRight size={17} />
            </Link>

            <a
              href="#features"
              className="orbit-secondary-button"
            >
              Explore OrbitHQ
            </a>
          </div>

          <div className="orbit-hero-note">
            <span className="orbit-live-dot" />
            Your entire team, one workspace
          </div>
        </section>

        {/* Stats */}
        <section className="orbit-stats">
          <div>
            <strong>01</strong>
            <span>Workspace</span>
          </div>

          <div>
            <strong>∞</strong>
            <span>Possibilities</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Productivity</span>
          </div>

          <div>
            <strong>AI</strong>
            <span>Assisted</span>
          </div>
        </section>

        {/* Product section */}
        <section
          id="workflow"
          className="orbit-section orbit-section-light"
        >
          <div className="orbit-section-heading">
            <span className="orbit-eyebrow">
              THE WORKSPACE
            </span>

            <h2>
              Everything your team needs.
              <br />
              Nothing in the way.
            </h2>

            <p>
              OrbitHQ brings your projects,
              tasks, people and conversations
              into one connected workspace.
            </p>
          </div>

          <div className="orbit-feature-grid">
            <Feature
              number="01"
              title="Projects"
              description="Organize work into focused projects with clear ownership, progress and visibility."
            />

            <Feature
              number="02"
              title="Tasks"
              description="Create, assign, prioritize and move work through your team's workflow."
            />

            <Feature
              number="03"
              title="Team"
              description="Manage members, roles and responsibilities from one centralized workspace."
            />

            <Feature
              number="04"
              title="Intelligence"
              description="Build the foundation for AI-assisted productivity directly into your workflow."
            />
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="orbit-section orbit-dark-section"
        >
          <div className="orbit-section-heading">
            <span className="orbit-eyebrow">
              DESIGNED TO SCALE
            </span>

            <h2>
              Simple on the surface.
              <br />
              Powerful underneath.
            </h2>
          </div>

          <div className="orbit-capabilities">
            <Capability text="Multi-tenant architecture" />
            <Capability text="Role-based access control" />
            <Capability text="Real-time notifications" />
            <Capability text="Project & task management" />
            <Capability text="Activity & audit history" />
            <Capability text="Redis-powered performance" />
            <Capability text="Background job processing" />
            <Capability text="Socket-powered collaboration" />
          </div>
        </section>

        {/* CTA */}
        <section
          id="about"
          className="orbit-final-cta"
        >
          <div>
            <span className="orbit-eyebrow">
              YOUR WORK. IN ORBIT.
            </span>

            <h2>
              Ready to move
              <br />
              everything forward?
            </h2>

            <p>
              Create your workspace and bring
              your team's work into orbit.
            </p>

            <Link
              to="/register"
              className="orbit-primary-button"
            >
              Create workspace
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="orbit-footer">
        <span>© 2026 OrbitHQ</span>
        <span>
          Intelligence designed to evolve.
        </span>
      </footer>
    </div>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="orbit-feature">
      <span>{number}</span>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="orbit-feature-arrow">
        <ArrowRight size={16} />
      </div>
    </article>
  );
}

function Capability({
  text,
}: {
  text: string;
}) {
  return (
    <div className="orbit-capability">
      <Check size={16} />
      <span>{text}</span>
    </div>
  );
}