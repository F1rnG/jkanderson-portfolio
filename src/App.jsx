import { useState, useEffect, useRef } from "react";

const COLORS = {
  stone: "#141412",
  bark: "#1f1e1a",
  trail: "#322f28",
  ridge: "#8b7d6b",
  summit: "#c4a97d",
  snow: "#f5f0e8",
  sky: "#6b8f9e",
  alpine: "#4a7c6f",
  sunset: "#c7603d",
  cloud: "#e8e2d6",
  ember: "#a34e2e",
};

const FONTS = {
  display: "'Playfair Display', serif",
  body: "'DM Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// ========== BACKGROUND ELEMENTS ==========

function TopoBackground() {
  return (
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.035,
        pointerEvents: "none",
      }}
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {[...Array(22)].map((_, i) => (
        <path
          key={i}
          d={`M${-100 + i * 12},${450 + Math.sin(i * 0.7) * 130} Q${280 + i * 8},${180 + Math.cos(i * 0.45) * 160} ${580 + i * 6},${340 + Math.sin(i * 0.55) * 110} T${1500 + i * 8},${280 + Math.cos(i * 0.35) * 140}`}
          fill="none"
          stroke={COLORS.summit}
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

function MountainDivider() {
  return (
    <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, margin: "0 0 -1px 0" }}>
      <svg viewBox="0 0 1440 100" style={{ width: "100%", height: "60px", display: "block" }} preserveAspectRatio="none">
        <path d="M0,100 L0,70 L180,50 L320,65 L480,25 L600,45 L720,15 L840,35 L960,20 L1080,40 L1200,10 L1320,35 L1440,50 L1440,100 Z" fill={COLORS.bark} opacity="0.7" />
        <path d="M0,100 L0,80 L120,70 L280,78 L440,48 L580,60 L700,35 L840,52 L1000,38 L1140,55 L1300,30 L1440,55 L1440,100 Z" fill={COLORS.stone} opacity="0.5" />
      </svg>
    </div>
  );
}

function Compass({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke={COLORS.summit} strokeWidth="1" opacity="0.4" />
      <circle cx="20" cy="20" r="13" stroke={COLORS.ridge} strokeWidth="0.5" opacity="0.3" />
      <polygon points="20,6 22,18 20,16 18,18" fill={COLORS.sunset} />
      <polygon points="20,34 22,22 20,24 18,22" fill={COLORS.ridge} />
      <circle cx="20" cy="20" r="1.5" fill={COLORS.summit} />
    </svg>
  );
}

// ========== HOOKS ==========

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ========== SECTION WRAPPER ==========

function Section({ id, children, style = {} }) {
  const [ref, visible] = useInView(0.08);
  return (
    <section
      id={id}
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// ========== NAV ==========

function Nav({ activeSection }) {
  const links = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "14px 40px" : "22px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: scrolled ? `${COLORS.stone}f0` : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.trail}88` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Compass size={26} />
        <span style={{ fontFamily: FONTS.display, fontSize: "18px", color: COLORS.summit, fontWeight: 700, letterSpacing: "0.3px" }}>
          J. Anderson
        </span>
      </div>
      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            style={{
              fontFamily: FONTS.body,
              fontSize: "12px",
              color: activeSection === link.id ? COLORS.snow : COLORS.ridge,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              fontWeight: 500,
              transition: "color 0.3s",
              position: "relative",
            }}
          >
            {link.label}
            {activeSection === link.id && (
              <span style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: COLORS.sunset,
              }} />
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ========== HERO ==========

function Hero() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handler = () => setOffset(window.scrollY * 0.25);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 30%, #1a2520 0%, #161a1d 30%, ${COLORS.stone} 70%)`,
      }}
    >
      {/* Stars */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${offset}px)` }}>
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              background: COLORS.snow,
              borderRadius: "50%",
              top: Math.random() * 55 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
              animation: `twinkle ${3 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Layered mountains */}
      <svg
        style={{ position: "absolute", bottom: 0, width: "100%", height: "55%", transform: `translateY(${offset * 0.15}px)` }}
        viewBox="0 0 1440 500" preserveAspectRatio="none"
      >
        <path d="M0,500 L0,300 L150,240 L300,280 L450,160 L600,220 L750,100 L900,180 L1050,120 L1200,190 L1350,140 L1440,170 L1440,500 Z" fill="#141f1a" opacity="0.4" />
        <path d="M0,500 L0,340 L100,290 L250,320 L400,200 L520,260 L680,140 L800,210 L920,150 L1100,220 L1250,160 L1440,210 L1440,500 Z" fill="#131c17" opacity="0.6" />
        <path d="M0,500 L0,380 L180,310 L350,360 L500,240 L650,300 L800,180 L950,260 L1100,200 L1280,280 L1440,240 L1440,500 Z" fill="#101812" opacity="0.85" />
        <path d="M800,180 L820,190 L810,185 Z" fill="#f5f0e8" opacity="0.15" />
        <path d="M500,240 L520,252 L510,248 Z" fill="#f5f0e8" opacity="0.12" />
        {[...Array(50)].map((_, i) => {
          const x = i * 29 + Math.random() * 15;
          const baseY = 420 + Math.sin(i * 0.25) * 25;
          const h = 12 + Math.random() * 22;
          return (
            <polygon key={i} points={`${x},${baseY} ${x + 4},${baseY - h} ${x + 8},${baseY}`}
              fill="#0a120d" opacity={0.3 + Math.random() * 0.4} />
          );
        })}
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: "11px", color: COLORS.alpine, letterSpacing: "5px",
          textTransform: "uppercase", marginBottom: "28px",
          animation: "fadeInUp 1s ease forwards", opacity: 0,
        }}>
          40.7608° N · 111.8910° W · Salt Lake City
        </div>
        <h1 style={{
          fontFamily: FONTS.display, fontSize: "clamp(44px, 7vw, 88px)", color: COLORS.snow,
          fontWeight: 400, lineHeight: 1.08, margin: "0 0 20px 0",
          animation: "fadeInUp 1s ease 0.2s forwards", opacity: 0,
        }}>
          James<br />
          <span style={{ color: COLORS.summit, fontStyle: "italic", fontWeight: 700 }}>Anderson</span>
        </h1>
        <p style={{
          fontFamily: FONTS.body, fontSize: "17px", color: COLORS.ridge, maxWidth: "480px",
          margin: "0 auto 16px", lineHeight: 1.7,
          animation: "fadeInUp 1s ease 0.4s forwards", opacity: 0,
        }}>
          SEO Manager · Digital Strategist · Outdoor Enthusiast
        </p>
        <div style={{
          fontFamily: FONTS.mono, fontSize: "11px", color: `${COLORS.ridge}88`,
          animation: "fadeInUp 1s ease 0.5s forwards", opacity: 0, marginBottom: "48px",
        }}>
          Technical SEO · Schema Architecture · AI Search Optimization
        </div>
        <div style={{
          display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
          animation: "fadeInUp 1s ease 0.6s forwards", opacity: 0, marginBottom: "40px",
        }}>
          <a href="#contact" style={{
            fontFamily: FONTS.mono, fontSize: "12px", color: COLORS.snow, padding: "12px 28px",
            background: COLORS.sunset, borderRadius: "6px", fontWeight: 500,
            letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none",
            transition: "all 0.3s", display: "inline-block",
          }}>
            Get in Touch
          </a>
          <a href="/James_Anderson_Resume.pdf" download style={{
            fontFamily: FONTS.mono, fontSize: "12px", color: COLORS.summit, padding: "12px 28px",
            border: `1.5px solid ${COLORS.summit}44`, borderRadius: "6px", fontWeight: 500,
            letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none",
            transition: "all 0.3s", display: "inline-flex", alignItems: "center", gap: "8px",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v9m0 0L3.5 6.5M7 10l3.5-3.5M1 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Resume
          </a>
        </div>
        <a href="#about" style={{ animation: "fadeInUp 1s ease 0.8s forwards", opacity: 0, display: "inline-block" }}>
          <div style={{
            width: "26px", height: "42px", border: `1.5px solid ${COLORS.ridge}66`, borderRadius: "13px",
            position: "relative", margin: "0 auto", cursor: "pointer",
          }}>
            <div style={{
              width: "2px", height: "7px", background: COLORS.summit, borderRadius: "2px",
              position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
              animation: "scrollDot 2s ease-in-out infinite",
            }} />
          </div>
        </a>
      </div>
    </div>
  );
}

// ========== SECTION TITLE ==========

function SectionTitle({ label, title }) {
  return (
    <div style={{ marginBottom: "52px" }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: "11px", color: COLORS.alpine, letterSpacing: "3px",
        textTransform: "uppercase", marginBottom: "14px", display: "flex", alignItems: "center", gap: "14px",
      }}>
        <span style={{ display: "inline-block", width: "32px", height: "1px", background: COLORS.alpine }} />
        {label}
      </div>
      <h2 style={{
        fontFamily: FONTS.display, fontSize: "clamp(30px, 4vw, 46px)", color: COLORS.snow,
        fontWeight: 400, margin: 0, lineHeight: 1.2,
      }}>
        {title}
      </h2>
    </div>
  );
}

// ========== TIMELINE ==========

function TimelineItem({ year, title, company, bullets, index }) {
  const [ref, visible] = useInView(0.15);
  return (
    <div
      ref={ref}
      style={{
        display: "grid", gridTemplateColumns: "140px 36px 1fr", gap: "0", marginBottom: "52px",
        opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-25px)",
        transition: `all 0.7s ease ${index * 0.12}s`,
      }}
    >
      <div style={{ fontFamily: FONTS.mono, fontSize: "12px", color: COLORS.alpine, paddingTop: "5px", textAlign: "right" }}>
        {year}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: "10px", height: "10px", borderRadius: "50%", border: `2px solid ${COLORS.sunset}`,
          background: COLORS.stone, flexShrink: 0, marginTop: "5px",
        }} />
        <div style={{ width: "1.5px", flex: 1, background: `linear-gradient(to bottom, ${COLORS.sunset}33, transparent)` }} />
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <h3 style={{ fontFamily: FONTS.display, fontSize: "21px", color: COLORS.snow, margin: "0 0 4px 0", fontWeight: 600 }}>
          {title}
        </h3>
        <div style={{ fontFamily: FONTS.body, fontSize: "13px", color: COLORS.sunset, marginBottom: "12px", fontWeight: 600, letterSpacing: "0.5px" }}>
          {company}
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{
              fontFamily: FONTS.body, fontSize: "14px", color: COLORS.ridge, lineHeight: 1.7,
              marginBottom: "6px", paddingLeft: "16px", position: "relative",
            }}>
              <span style={{
                position: "absolute", left: 0, top: "10px", width: "4px", height: "4px",
                borderRadius: "50%", background: COLORS.trail,
              }} />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ========== SKILL CATEGORY ==========

function SkillCategory({ title, skills, index }) {
  const [ref, visible] = useInView(0.15);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ease ${index * 0.1}s`,
      }}
    >
      <h4 style={{
        fontFamily: FONTS.mono, fontSize: "11px", color: COLORS.alpine, letterSpacing: "2px",
        textTransform: "uppercase", marginBottom: "14px", paddingBottom: "8px",
        borderBottom: `1px solid ${COLORS.trail}`,
      }}>
        {title}
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {skills.map((s) => (
          <span key={s} style={{
            fontFamily: FONTS.body, fontSize: "13px", color: COLORS.cloud, fontWeight: 500,
            background: `${COLORS.trail}aa`, padding: "7px 16px", borderRadius: "6px",
            border: `1px solid ${COLORS.trail}`,
          }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ========== PROJECT CARD ==========

function ProjectCard({ title, description, tags, index }) {
  const [ref, visible] = useInView(0.15);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(145deg, ${COLORS.bark}, #252218)` : COLORS.bark,
        border: `1px solid ${hovered ? COLORS.ridge + "44" : COLORS.trail}`,
        borderRadius: "10px", padding: "30px", cursor: "default",
        transition: "all 0.4s ease",
        transform: visible ? (hovered ? "translateY(-3px)" : "translateY(0)") : "translateY(30px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.1}s`,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, ${COLORS.sunset}, ${COLORS.alpine})`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
      }} />
      <h3 style={{ fontFamily: FONTS.display, fontSize: "20px", color: COLORS.snow, margin: "0 0 10px", fontWeight: 600 }}>
        {title}
      </h3>
      <p style={{ fontFamily: FONTS.body, fontSize: "14px", color: COLORS.ridge, lineHeight: 1.7, margin: "0 0 18px 0" }}>
        {description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {tags.map((tag) => (
          <span key={tag} style={{
            fontFamily: FONTS.mono, fontSize: "10px", color: COLORS.alpine,
            background: `${COLORS.alpine}14`, padding: "3px 10px", borderRadius: "16px",
            border: `1px solid ${COLORS.alpine}28`,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ========== AEO HIGHLIGHT ==========

function AEOSection() {
  const [ref, visible] = useInView(0.15);
  return (
    <div
      ref={ref}
      style={{
        background: `linear-gradient(135deg, ${COLORS.bark}, #1a2018)`,
        border: `1px solid ${COLORS.alpine}33`,
        borderRadius: "12px", padding: "36px", marginBottom: "32px",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(25px)",
        transition: "all 0.7s ease",
      }}
    >
      <div style={{
        fontFamily: FONTS.mono, fontSize: "10px", color: COLORS.sunset, letterSpacing: "3px",
        textTransform: "uppercase", marginBottom: "12px",
      }}>
        Specialization
      </div>
      <h3 style={{ fontFamily: FONTS.display, fontSize: "24px", color: COLORS.snow, margin: "0 0 16px", fontWeight: 600 }}>
        AI Search Optimization (AEO)
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {[
          "Architect AEO strategies for ChatGPT, Google AI Overviews & Perplexity",
          "Build entity-based content & schema frameworks for machine understanding",
          "Develop high-confidence answer blocks & structured data targeting AI inclusion",
          "Audit content for LLM citation likelihood & zero-click answer eligibility",
        ].map((item, i) => (
          <div key={i} style={{
            fontFamily: FONTS.body, fontSize: "13px", color: COLORS.ridge, lineHeight: 1.6,
            paddingLeft: "14px", position: "relative",
          }}>
            <span style={{
              position: "absolute", left: 0, top: "8px", width: "5px", height: "5px",
              borderRadius: "50%", background: COLORS.alpine,
            }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================
// ========== MAIN ==========
// ===========================

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const sections = ["about", "experience", "skills", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const experience = [
    {
      year: "2022 – Present",
      title: "SEO Manager",
      company: "ARS / Rescue Rooter",
      bullets: [
        "Own technical SEO strategy across 50+ localized websites and the national corporate site for a leading HVAC and plumbing brand, driving measurable gains in organic visibility and lead volume.",
        "Led full development and launch of a redesigned national website, improving page speed scores by 30%+ and establishing a scalable, SEO-first CMS architecture.",
        "Orchestrated migration of 20+ localized sites to a new enterprise CMS with comprehensive redirect mapping and schema implementation — maintaining ranking stability across all properties post-launch.",
        "Developed standardized JSON-LD schema templates and semantic HTML specifications deployed across hundreds of service pages, reducing markup errors and improving structured data coverage.",
        "Partnered with content, creative, and agency teams to build localized SEO strategies that strengthened GMB performance and expanded local market share across key service areas.",
      ],
    },
    {
      year: "2019 – 2022",
      title: "Digital Marketing Manager",
      company: "Swans Wharf Digital",
      bullets: [
        "Managed a portfolio of 16+ SEO clients — from local businesses to Fortune 500 brands — consistently exceeding traffic and revenue KPIs with a 90%+ client retention rate.",
        "Built custom SEO and PPC strategies combining on-site optimization, off-site authority building, and technical audits that drove double-digit organic growth across accounts.",
        "Led cross-functional execution through JIRA and GitLab, coordinating developers, designers, and content teams to ship SEO improvements on schedule.",
        "Managed paid campaigns across Google Ads, Facebook, Instagram, and Pinterest, optimizing spend allocation to maximize ROAS alongside organic initiatives.",
      ],
    },
    {
      year: "2019",
      title: "SEO Lead",
      company: "Student Universe",
      bullets: [
        "Designed and executed a comprehensive SEO roadmap spanning on-site content, off-site link strategy, and technical infrastructure for a leading student travel platform.",
        "Managed a GTM implementation with 500+ tags and triggers, partnering with third-party vendors and internal developers to build a reliable analytics and tracking foundation.",
        "Collaborated with design and engineering teams to diagnose and resolve UX bottlenecks, site architecture gaps, and Core Web Vitals issues impacting conversion.",
        "Redesigned the site's information architecture, improving crawl efficiency and user navigation across thousands of destination and deal pages.",
      ],
    },
    {
      year: "2017 – 2019",
      title: "SEO Account Manager",
      company: "MD Connect",
      bullets: [
        "Managed 20+ SEO clients across healthcare verticals — from solo practices to national pharma brands — growing organic traffic and patient lead volume across the portfolio.",
        "Built full-funnel reporting dashboards tying organic traffic to lead generation to successful patient procedures, giving clients clear ROI visibility on their SEO investment.",
        "Pioneered a structured onboarding process including SEO road-mapping and schema markup implementation, reducing time-to-first-results for new client engagements.",
        "Drove content strategy through blog programs, backlink acquisition, and technical SEO audits that consistently moved clients into top-3 positions for high-intent local keywords.",
      ],
    },
    {
      year: "2016 – 2017",
      title: "SEO Specialist",
      company: "Incollect",
      bullets: [
        "Built the entire eCommerce SEO program from scratch for a luxury design marketplace, delivering 110% organic traffic growth and acquiring 5,500+ backlinks within 8 months.",
        "Managed paid acquisition campaigns across Google Ads, Facebook, Instagram, and Pinterest, complementing organic growth with targeted paid visibility for high-value product categories.",
      ],
    },
  ];

  const skillCategories = [
    {
      title: "Technical SEO",
      skills: ["Technical SEO", "Site Architecture", "Schema / JSON-LD", "AI Search (AEO)", "Local SEO", "Keyword Research"],
    },
    {
      title: "Tools & Platforms",
      skills: ["Google Analytics", "Search Console", "Screaming Frog", "SEM Rush", "Ahrefs", "OnCrawl", "SiteBulb", "Conductor"],
    },
    {
      title: "Development & Design",
      skills: ["HTML", "CSS", "JavaScript", "WordPress", "Figma", "Illustrator", "Photoshop"],
    },
    {
      title: "Management & Workflow",
      skills: ["People Management", "Agency Management", "Client Communication", "GitLab / JIRA", "Asana", "Excel"],
    },
    {
      title: "AI & Emerging",
      skills: ["ChatGPT", "Claude AI", "AI Search Optimization", "Entity-Based SEO", "Semantic SEO"],
    },
  ];

  const projects = [
    {
      title: "National Website Launch",
      description: "Led end-to-end development and launch of ARS/Rescue Rooter's national corporate website — defining SEO architecture, CMS requirements, URL structure, and internal linking framework from the ground up. Delivered 30%+ improvement in page speed scores.",
      tags: ["Technical SEO", "CMS", "UX", "Site Architecture"],
    },
    {
      title: "Enterprise CMS Migration — 20+ Sites",
      description: "Orchestrated the migration of 20+ localized websites to a new enterprise CMS, building comprehensive redirect maps, implementing schema markup across all properties, and monitoring post-migration performance to ensure zero ranking loss.",
      tags: ["Migrations", "Schema", "Multi-site", "Enterprise"],
    },
    {
      title: "Scalable Schema & HTML Framework",
      description: "Designed and documented standardized JSON-LD schema templates and semantic HTML specifications deployed across hundreds of HVAC, plumbing, and electrical service pages — reducing structured data errors and improving rich result eligibility at scale.",
      tags: ["JSON-LD", "Schema", "Semantic HTML", "Standardization"],
    },
    {
      title: "Local Service Page Architecture",
      description: "Architected a scalable local service page framework supporting GMB optimization across hundreds of locations, establishing content templates, standardized HTML structure, and location-specific schema for each market.",
      tags: ["Local SEO", "GMB", "Content Architecture", "Multi-location"],
    },
    {
      title: "AI Search Optimization (AEO) Program",
      description: "Pioneered AEO strategy integrating entity-based content, structured data, and semantic SEO to improve brand visibility in AI-generated search results across ChatGPT, Google AI Overviews, and Perplexity.",
      tags: ["AEO", "Structured Data", "LLM Optimization", "Entities"],
    },
    {
      title: "eCommerce SEO — 110% Growth",
      description: "Built the entire SEO program from scratch at Incollect, a luxury design marketplace. Achieved 110% organic traffic growth and acquired 5,500+ high-authority backlinks within 8 months through technical optimization and content strategy.",
      tags: ["eCommerce", "Link Building", "Content Strategy"],
    },
  ];

  return (
    <div style={{ background: COLORS.stone, minHeight: "100vh", color: COLORS.snow }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${COLORS.stone}; overflow-x: hidden; }
        ::selection { background: ${COLORS.sunset}44; color: ${COLORS.snow}; }
        a { color: inherit; text-decoration: none; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollDot {
          0%, 100% { opacity: 1; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.3; transform: translateX(-50%) translateY(12px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.7; }
        }

        @media (max-width: 768px) {
          nav > div:last-child { gap: 14px !important; }
          nav > div:last-child a { font-size: 10px !important; letter-spacing: 1.5px !important; }
        }
      `}</style>

      <TopoBackground />
      <Nav activeSection={activeSection} />
      <Hero />

      {/* ===== ABOUT ===== */}
      <div style={{ background: COLORS.stone, position: "relative" }}>
        <MountainDivider />
        <Section id="about" style={{ maxWidth: "920px", margin: "0 auto", padding: "100px 40px" }}>
          <SectionTitle label="01 / Base Camp" title="About Me" />
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "48px", alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: FONTS.body, fontSize: "15px", color: COLORS.cloud, lineHeight: 1.85, marginBottom: "18px" }}>
                SEO Manager with 9+ years of experience driving organic growth for multi-brand, multi-location businesses. Built and led technical SEO programs across 50+ websites, orchestrated enterprise CMS migrations with zero ranking loss, and developed JSON-LD schema frameworks deployed at scale.
              </p>
              <p style={{ fontFamily: FONTS.body, fontSize: "15px", color: COLORS.ridge, lineHeight: 1.85, marginBottom: "18px" }}>
                Now pioneering AI search optimization (AEO) strategies that position content for visibility in ChatGPT, Google AI Overviews, and Perplexity — bridging traditional SEO with the next generation of search.
              </p>
              <p style={{ fontFamily: FONTS.body, fontSize: "15px", color: COLORS.ridge, lineHeight: 1.85 }}>
                When I'm not optimizing search visibility, you'll find me splitboarding in the Wasatch backcountry or paragliding above the ridgelines. I bring the same methodical, detail-oriented approach to both — whether mapping redirect chains or mapping a skin track.
              </p>
            </div>
            <div style={{
              background: COLORS.bark, border: `1px solid ${COLORS.trail}`, borderRadius: "10px", padding: "26px",
            }}>
              <div style={{
                fontFamily: FONTS.mono, fontSize: "10px", color: COLORS.alpine, marginBottom: "18px",
                letterSpacing: "2.5px", textTransform: "uppercase",
              }}>
                Quick Stats
              </div>
              {[
                ["Location", "Salt Lake City, UT"],
                ["Experience", "9+ Years in SEO"],
                ["Current", "ARS / Rescue Rooter"],
                ["Focus", "Technical & AI Search"],
                ["Side Hustle", "Freelance SEO Consulting"],
                ["Off-Grid", "Splitboarding · Paragliding"],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", padding: "9px 0",
                  borderBottom: `1px solid ${COLORS.trail}`, fontFamily: FONTS.body, fontSize: "13px",
                }}>
                  <span style={{ color: COLORS.ridge }}>{label}</span>
                  <span style={{ color: COLORS.snow, fontWeight: 500, textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* ===== EXPERIENCE ===== */}
      <Section id="experience" style={{ maxWidth: "920px", margin: "0 auto", padding: "80px 40px 100px" }}>
        <SectionTitle label="02 / The Trail" title="Experience" />
        {experience.map((item, i) => (
          <TimelineItem key={i} {...item} index={i} />
        ))}
      </Section>

      {/* ===== SKILLS ===== */}
      <div style={{ background: `${COLORS.bark}88` }}>
        <Section id="skills" style={{ maxWidth: "920px", margin: "0 auto", padding: "100px 40px" }}>
          <SectionTitle label="03 / Gear List" title="Skills & Tools" />
          <AEOSection />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {skillCategories.map((cat, i) => (
              <SkillCategory key={cat.title} {...cat} index={i} />
            ))}
          </div>
        </Section>
      </div>

      {/* ===== PROJECTS ===== */}
      <Section id="projects" style={{ maxWidth: "920px", margin: "0 auto", padding: "100px 40px" }}>
        <SectionTitle label="04 / Summit Log" title="Projects & Impact" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.title} {...project} index={i} />
          ))}
        </div>
      </Section>

      {/* ===== CONTACT ===== */}
      <div style={{ background: `linear-gradient(180deg, ${COLORS.stone}, #0f1210)` }}>
        <Section id="contact" style={{ maxWidth: "920px", margin: "0 auto", padding: "100px 40px 80px", textAlign: "center" }}>
          <SectionTitle label="05 / Signal Fire" title="Let's Connect" />
          <p style={{
            fontFamily: FONTS.body, fontSize: "16px", color: COLORS.ridge, lineHeight: 1.8,
            maxWidth: "520px", margin: "0 auto 40px",
          }}>
            Currently exploring new opportunities. Whether you're looking for an SEO leader, need a freelance technical audit, or just want to talk shop — I'd love to hear from you.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a href="mailto:jkanderson09@gmail.com" style={{
              fontFamily: FONTS.mono, fontSize: "13px", color: COLORS.snow, padding: "14px 32px",
              background: COLORS.sunset, borderRadius: "8px", fontWeight: 500,
              transition: "all 0.3s", display: "inline-block",
            }}>
              jkanderson09@gmail.com
            </a>
            <a href="tel:5087695760" style={{
              fontFamily: FONTS.mono, fontSize: "13px", color: COLORS.summit, padding: "14px 32px",
              border: `1px solid ${COLORS.summit}44`, borderRadius: "8px", fontWeight: 500,
              transition: "all 0.3s", display: "inline-block",
            }}>
              (508) 769-5760
            </a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "28px", alignItems: "center" }}>
            <a href="/James_Anderson_Resume.pdf" download style={{
              fontFamily: FONTS.mono, fontSize: "12px", color: COLORS.alpine, letterSpacing: "1px",
              display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none",
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v9m0 0L3.5 6.5M7 10l3.5-3.5M1 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download Resume
            </a>
            <span style={{ color: COLORS.trail, fontSize: "10px" }}>·</span>
            <a href="https://linkedin.com/in/jamesanderson" style={{
              fontFamily: FONTS.mono, fontSize: "12px", color: COLORS.sky, letterSpacing: "1px", textDecoration: "none",
            }}>
              LinkedIn →
            </a>
          </div>
        </Section>
      </div>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: `1px solid ${COLORS.trail}44`, padding: "40px", textAlign: "center" }}>
        <Compass size={28} />
        <p style={{ fontFamily: FONTS.body, fontSize: "13px", color: `${COLORS.ridge}88`, marginTop: "14px" }}>
          Built with grit & good routes · © {new Date().getFullYear()} James Anderson
        </p>
      </footer>
    </div>
  );
}