import React, { useState, useEffect, useRef } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from "firebase/database";
import Head from 'next/head';
import Link from 'next/link';
import bgImage from '../media/Gemini_Generated_Image_l02bjml02bjml02b.png';

/* ─── CONSTANTS ─────────────────────────────────────────── */

const COMPANY = {
  name: "BLOOM NFT",
  tagline: "The World's First Autonomous AI Art Studio",
  description: "Six AI agents collaborate in real-time to conceive, paint, manage, and publish original digital art – entirely on their own.",
};

const AGENTS_CONFIG = [
  { id: "Creative Director", name: "Director", seed: "Director", emoji: "🎨", color: "#ff00aa", position: { top: "20%", left: "50%" }, role: "Visionary" },
  { id: "Artist", name: "Artist", seed: "Artist", emoji: "🖌️", color: "#00f0ff", position: { top: "50%", left: "18%" }, role: "Painter" },
  { id: "Manager", name: "Manager", seed: "Manager", emoji: "📦", color: "#00ff88", position: { top: "50%", left: "50%" }, role: "Operations" },
  { id: "Promoter", name: "Promoter", seed: "Promoter", emoji: "📣", color: "#aa00ff", position: { top: "50%", left: "82%" }, role: "Marketing" },
  { id: "Publisher", name: "Publisher", seed: "Publisher", emoji: "🐦", color: "#1da1f2", position: { top: "80%", left: "35%" }, role: "Socials" },
  { id: "Analyst", name: "Analyst", seed: "Analyst", emoji: "📊", color: "#ffd700", position: { top: "80%", left: "65%" }, role: "Data" },
];

const STATS = [
  { num: "6", label: "AI Agents" },
  { num: "24/7", label: "Operation" },
  { num: "∞", label: "Creativity" },
  { num: "0", label: "Human Input" },
];

const BG = bgImage.src || bgImage;

/* ─── MAIN COMPONENT ────────────────────────────────────── */

export default function Home() {
  const [agentStatuses, setAgentStatuses] = useState({});
  const [gallery, setGallery] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastDropTime, setLastDropTime] = useState("");
  const [lightbox, setLightbox] = useState(null); // { art, index }
  const revealRefs = useRef([]);

  /* Firebase live updates */
  useEffect(() => {
    const officeRef = ref(database, 'office_status');
    return onValue(officeRef, (snap) => {
      const data = snap.val();
      if (data) {
        setIsConnected(true);
        setAgentStatuses(data);
        if (data.Manager?.action?.includes("Success") || data.Manager?.action?.includes("updated")) {
          setLastDropTime(new Date().toLocaleTimeString());
        }
      }
    }, () => setIsConnected(false));
  }, []);

  /* Gallery from GitHub */
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/Itzadityapandey/nft-c/main/database.json")
      .then(r => r.ok ? r.json() : [])
      .then(d => setGallery(Array.isArray(d) ? [...d].reverse() : []))
      .catch(() => { });
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    const cur = revealRefs.current.filter(Boolean);
    cur.forEach(el => io.observe(el));
    return () => cur.forEach(el => io.unobserve(el));
  }, [gallery]);

  /* Stat counter animation */
  useEffect(() => {
    const statEls = document.querySelectorAll('.stat-num[data-target]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = el.dataset.target;
        if (isNaN(target)) return;
        let start = 0;
        const end = parseInt(target);
        const duration = 1400;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          el.textContent = Math.floor(progress * end);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = end;
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Lightbox keyboard close */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const addReveal = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  const systemState = agentStatuses['System']?.action || 'Sleeping';
  const isSystemAwake = !['Sleep', 'Sleeping', 'Stopped'].includes(systemState);

  const wakeUp = () => window.open("https://itzadityapandey-ceo.hf.space/wakeup", "_blank");
  const stop = () => window.open("https://itzadityapandey-ceo.hf.space/stop", "_blank");

  const openLightbox = (art, index) => setLightbox({ art, index });
  const closeLightbox = () => setLightbox(null);

  const [featured, ...rest] = gallery;

  return (
    <>
      <Head>
        <title>BLOOM NFT • Autonomous AI Art Studio</title>
        <meta name="description" content="6 AI agents that create, curate, and publish original art — 24/7 with zero human input." />
        <meta property="og:title" content="BLOOM NFT • Autonomous AI Art Studio" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>" />
      </Head>

      {/* ── BACKGROUND ORBS ── */}
      <div className="bg-orbs" aria-hidden>
        <span /><span /><span />
      </div>

      {/* ── FLOATING PARTICLES ── */}
      <div className="particles" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
          }} />
        ))}
      </div>

      {/* ════════════════════ NAVBAR ════════════════════ */}
      <nav className="navbar">
        <div className="nav-logo">
          <span aria-hidden>🌸</span>
          {COMPANY.name}
        </div>

        <ul className="nav-links">
          <li><a href="#office">Live Office</a></li>
          <li><Link href="/about">About</Link></li>
          <li><a href="#gallery">Gallery</a></li>
        </ul>

        <div className={`nav-status ${isConnected ? 'online' : 'offline'}`}>
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
          {isConnected ? "LIVE" : "OFFLINE"}
        </div>
      </nav>

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="hero">
        <div className="hero-badge">🌸 Next-Gen Autonomous Art Studio</div>

        <h1 className="hero-title">
          <span className="line-1 glitch" data-text="BLOOM">BLOOM</span>
          <span className="line-2">NFT STUDIO</span>
        </h1>

        <p className="hero-sub">{COMPANY.description}</p>

        <div className="hero-btns">
          <button className="btn-primary btn-glow" onClick={wakeUp}>🚀 Wake Up Company</button>
          <button className="btn-secondary" onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}>
            🖼️ View Gallery
          </button>
        </div>

        <div className="hero-stats">
          {STATS.map(s => (
            <div className="stat-item" key={s.label}>
              <div
                className="stat-num"
                data-target={isNaN(s.num) ? undefined : s.num}
              >
                {s.num}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {lastDropTime && (
          <div className="last-drop-badge">
            🟢 Last Drop: {lastDropTime}
          </div>
        )}

        <div className="hero-scroll-hint">
          <span className="scroll-arrow">↓</span>
          Scroll to explore
        </div>
      </section>

      {/* ════════════════════ LIVE OFFICE ════════════════════ */}
      <section id="office" className="section office-section">
        <div className="section-header">
          <div className="section-tag reveal" ref={addReveal}>Live Agent Office</div>
          <h2 className="section-title reveal" ref={addReveal}>Watch the agents work</h2>
          <p className="section-desc reveal" ref={addReveal}>Real-time status from Firebase. Each agent updates their status as they create art.</p>
          <div className="section-divider" />
        </div>

        <div className="office-container">
          <div className="office-controls reveal" ref={addReveal}>
            <button className="btn-primary btn-glow" onClick={wakeUp}>🚀 Wake Up Company</button>
            <button className="btn-secondary" onClick={stop}>⏹ Stop All Agents</button>
          </div>

          <div className="office-arena-wrap reveal" ref={addReveal}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,0,12,0.58)', zIndex: 1 }} />
            <img src={BG} alt="AI Office Background" className="bg" style={{ opacity: 0.55 }} />

            {AGENTS_CONFIG.map((agent) => {
              let status = agentStatuses[agent.id] || { action: 'Sleeping', message: 'Resting...' };
              if (!isSystemAwake) status = { action: 'Sleeping', message: 'Resting...' };

              const isActive = status.action !== 'Sleeping' && !status.action.toLowerCase().includes('offline');

              return (
                <div
                  key={agent.id}
                  className="agent-pin"
                  style={{
                    top: agent.position.top,
                    left: agent.position.left,
                    zIndex: 2,
                    animation: isActive ? 'agentBounce .6s infinite alternate' : 'none',
                  }}
                >
                  {isActive && (
                    <div className="speech-bubble" style={{ borderColor: agent.color, boxShadow: `0 0 18px ${agent.color}55` }}>
                      <div className="bubble-action" style={{ color: agent.color }}>{status.action}</div>
                      <div className="bubble-msg">{status.message}</div>
                    </div>
                  )}

                  <img
                    className={`agent-avatar ${isActive ? 'active' : 'sleeping'}`}
                    style={{ filter: isActive ? `drop-shadow(0 0 12px ${agent.color})` : 'none' }}
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${agent.seed}&backgroundColor=000000&glassesProbability=${agent.id === "Manager" ? 100 : 0}`}
                    alt={agent.name}
                  />

                  <span
                    className="agent-badge"
                    style={{ background: agent.color + '22', color: agent.color, border: `1px solid ${agent.color}44` }}
                  >
                    {agent.emoji} {agent.role}
                  </span>

                  <div className="agent-name">{agent.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ GALLERY ════════════════════ */}
      <section id="gallery" className="section gallery-section">
        {/* Floating gallery particles */}
        <div className="gallery-particles" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="g-particle" style={{
              left: `${10 + i * 9}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + (i % 3) * 2}s`,
            }} />
          ))}
        </div>

        <div className="section-header">
          <div className="section-tag reveal" ref={addReveal}>The Collection</div>
          <h2 className="section-title reveal" ref={addReveal}>
            🌸 BLOOM NFT Drops
          </h2>
          <p className="section-desc reveal" ref={addReveal}>
            Each piece is autonomously conceived, created, and published. Every image is one-of-a-kind.
          </p>
          <div className="section-divider" />
        </div>

        {gallery.length > 0 ? (
          <div className="gallery-layout">
            {/* ── FEATURED CARD ── */}
            {featured && (
              <article
                className="gallery-featured reveal"
                ref={addReveal}
                onClick={() => openLightbox(featured, 0)}
                style={{ '--delay': '0s' }}
              >
                <div className="gallery-featured-img-wrap">
                  <img className="gallery-featured-img" src={featured.image} alt={featured.description || 'Drop #1'} loading="lazy" />
                  <div className="gallery-featured-overlay">
                    <div className="gallery-featured-badge">✦ Featured Drop</div>
                    <div className="gallery-featured-info">
                      <p className="gallery-featured-title">{featured.description || 'Drop #1'}</p>
                      <p className="gallery-featured-date">{featured.date || '—'}</p>
                    </div>
                    <div className="gallery-featured-price">◈ {featured.price || '1.0 ETH'}</div>
                  </div>
                  <div className="shimmer-bar" />
                </div>
                <div className="gallery-featured-footer">
                  <span className="bloom-badge">🌸 BLOOM NFT</span>
                  <span className="art-edition-lg">1 of 1</span>
                </div>
              </article>
            )}

            {/* ── MASONRY SUB-GRID ── */}
            {rest.length > 0 && (
              <div className="gallery-masonry">
                {rest.map((art, i) => (
                  <article
                    key={i + 1}
                    className="art-card reveal"
                    ref={addReveal}
                    style={{ '--delay': `${(i % 4) * 0.1}s` }}
                    onClick={() => openLightbox(art, i + 1)}
                  >
                    <div className="art-card-img-wrap">
                      <img className="art-card-img" src={art.image} alt={art.description || `Art Drop #${i + 2}`} loading="lazy" />
                      <div className="art-card-overlay">
                        <span className="overlay-tag">✦ AI Generated</span>
                      </div>
                      <div className="shimmer-bar" />
                    </div>
                    <div className="art-card-body">
                      <p className="art-card-title">{art.description || `Drop #${i + 2}`}</p>
                      <p className="art-card-date">{art.date || "—"}</p>
                    </div>
                    <div className="art-card-footer">
                      <span className="art-price">◈ {art.price || "1.0 ETH"}</span>
                      <span className="bloom-pill">🌸 BLOOM</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="gallery-empty reveal" ref={addReveal}>
            <span className="gallery-empty-icon">🌸</span>
            No drops yet.<br />
            Wake up the agents to create the first masterpiece!
          </div>
        )}
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="footer">
        <div className="footer-logo">🌸 {COMPANY.name}</div>
        <p className="footer-tagline">{COMPANY.tagline}</p>
        <p className="footer-powered">
          Powered by 6 Autonomous Agents &nbsp;•&nbsp; CrewAI &nbsp;•&nbsp; Gemini &nbsp;•&nbsp; Hugging Face &nbsp;•&nbsp; Firebase
        </p>
      </footer>

      {/* ════════════════════ LIGHTBOX ════════════════════ */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">✕</button>
            <div className="lightbox-img-wrap">
              <img className="lightbox-img" src={lightbox.art.image} alt={lightbox.art.description || `Drop #${lightbox.index + 1}`} />
            </div>
            <div className="lightbox-info">
              <div className="bloom-badge lb-badge">🌸 BLOOM NFT &nbsp;•&nbsp; 1 of 1</div>
              <h3 className="lightbox-title">{lightbox.art.description || `Drop #${lightbox.index + 1}`}</h3>
              <p className="lightbox-date">{lightbox.art.date || '—'}</p>
              <div className="lightbox-price">◈ {lightbox.art.price || '1.0 ETH'}</div>
              <span className="lightbox-gen-tag">✦ AI Generated</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes agentBounce {
          from { margin-top: 0; }
          to   { margin-top: -14px; }
        }
      `}</style>
    </>
  );
}
