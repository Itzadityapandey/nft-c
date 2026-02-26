import React, { useState, useEffect, useRef, useCallback } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from "firebase/database";
import Head from 'next/head';
import Link from 'next/link';
import bgImage from '../media/Gemini_Generated_Image_l02bjml02bjml02b.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import CommissionModal from '../components/CommissionModal';
import AgentCard from '../components/AgentCard';
import PollenCanvas from '../components/PollenCanvas';

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

  /* In-page toast for wakeup/stop responses */
  const [toast, setToast] = useState(null); // { type: 'success'|'error'|'info', msg }
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };
  const [lightbox, setLightbox] = useState(null);
  const [showCommission, setShowCommission] = useState(false);
  
  /* Chat Drip State */
  const [chatLog, setChatLog] = useState([]);
  const pendingChat = useRef([]);
  const [isTyping, setIsTyping] = useState(false);
  const processedKeys = useRef(new Set());
  const initialLoadRef = useRef(true);

  const revealRefs = useRef([]);
  const heroTitleRef = useRef(null);
  const galleryCardsRef = useRef({});

  const { isConnected: walletConnected } = useAccount();

  /* Firebase live updates -> Pending Queue */
  useEffect(() => {
    const officeRef = ref(database, 'office_status');
    return onValue(officeRef, (snap) => {
      const data = snap.val();
      if (data) {
        setIsConnected(true);
        setAgentStatuses(data);
        
        let newMessages = false;
        
        // Add new actions to pending queue
        Object.keys(data).forEach(agentId => {
          if (agentId === 'System') return; // Skip system messages in chat
          
          const agentData = data[agentId];
          if (!agentData || agentData.action === 'Sleeping' || agentData.action === 'idle') return;
          
          // Create a unique key for this exact message state
          const msgKey = `${agentId}-${agentData.action}-${agentData.message || ''}`;
          
          if (!processedKeys.current.has(msgKey)) {
            processedKeys.current.add(msgKey);
            
            // On initial load, don't queue everything to avoid a massive backlog
            if (!initialLoadRef.current) {
              const fullAgentInfo = AGENTS_CONFIG.find(a => a.id === agentId);
              pendingChat.current.push({
                id: Math.random().toString(36).substr(2, 9),
                agent: fullAgentInfo ? fullAgentInfo.name : agentId,
                color: fullAgentInfo ? fullAgentInfo.color : '#fff',
                action: agentData.action,
                message: agentData.message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
              newMessages = true;
            }
          }
        });

        initialLoadRef.current = false;

        if (newMessages && pendingChat.current.length > 0) {
          setIsTyping(true);
        }

        // Trigger gallery live-reload if System says "Success" 
        // (with a small 3-second delay to ensure GitHub Pages cache clears)
        if (data.System?.action?.includes("Success")) {
          setTimeout(() => fetchGallery(), 3000);
        }

        if (data.Manager?.action?.includes("Success") || data.Manager?.action?.includes("updated")) {
          setLastDropTime(new Date().toLocaleTimeString());
        }
      }
    }, () => setIsConnected(false));
  }, []);

  /* Chat Drip Processor (every 5 seconds) */
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingChat.current.length > 0) {
        // Pop the oldest message
        const nextMsg = pendingChat.current.shift();
        
        setChatLog(prev => {
          // Keep last 8 messages max so it doesn't grow forever
          const updated = [...prev, nextMsg];
          if (updated.length > 8) return updated.slice(updated.length - 8);
          return updated;
        });
        
        // If more messages are pending, stay typing. Otherwise, stop.
        setIsTyping(pendingChat.current.length > 0);
      } else {
        setIsTyping(false);
      }
    }, 5000); // 5 second drip rate

    return () => clearInterval(interval);
  }, []);

  /* Gallery from GitHub */
  const fetchGallery = () => {
    // Append timestamp to break GitHub raw cache
    fetch(`https://raw.githubusercontent.com/Itzadityapandey/nft-c/main/database.json?t=${new Date().getTime()}`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setGallery(Array.isArray(d) ? [...d].reverse() : []))
      .catch(() => { });
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* Mouse-reactive parallax on hero title */
  useEffect(() => {
    const el = heroTitleRef.current;
    if (!el) return;
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;   // -1 to 1
      const dy = (e.clientY - cy) / cy;
      el.style.transform = `translate(${dx * -10}px, ${dy * -6}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* 3-D tilt on gallery cards */
  const handleCardTilt = useCallback((e, id) => {
    const card = galleryCardsRef.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -8;  // ±8 deg
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 10;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.02)`;
  }, []);

  const resetCardTilt = useCallback((id) => {
    const card = galleryCardsRef.current[id];
    if (card) card.style.transform = '';
  }, []);

  /* Scroll reveal — staggered float-up */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = revealRefs.current.filter(Boolean).indexOf(e.target);
          e.target.style.setProperty('--reveal-delay', `${(idx % 6) * 0.1}s`);
          e.target.classList.add('visible');
        }
      }),
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
    const handler = (e) => { if (e.key === 'Escape') { setLightbox(null); setShowCommission(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const addReveal = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  const systemState = agentStatuses['System']?.action || 'Sleeping';
  const isSystemAwake = !['Sleep', 'Sleeping', 'Stopped'].includes(systemState);

  const HF_BASE = "https://itzadityapandey-ceo.hf.space";

  const wakeUp = async () => {
    showToast('info', '🚀 Sending wake-up signal to the Atelier...');
    try {
      const res = await fetch(`${HF_BASE}/wakeup`);
      const text = await res.text();
      showToast(res.ok ? 'success' : 'error', text);
    } catch (e) {
      showToast('error', `⚠️ Could not reach backend: ${e.message}`);
    }
  };

  const stop = async () => {
    showToast('info', '⏹ Sending stop signal...');
    try {
      const res = await fetch(`${HF_BASE}/stop`);
      const text = await res.text();
      showToast(res.ok ? 'success' : 'error', text);
    } catch (e) {
      showToast('error', `⚠️ Could not reach backend: ${e.message}`);
    }
  };

  const openLightbox = (art, index) => setLightbox({ art, index });
  const closeLightbox = () => setLightbox(null);

  const [featured, ...rest] = gallery;

  /* Active agents for Bloom Sequence sidebar */
  const activeAgents = AGENTS_CONFIG.filter(a => {
    const s = agentStatuses[a.id];
    return isSystemAwake && s && s.action !== 'Sleeping' && s.action !== 'idle' && !s.action.toLowerCase().includes('offline');
  });

  return (
    <>
      <Head>

        <title>BLOOM NFT • Autonomous AI Art Studio</title>
        <meta name="description" content="6 AI agents that create, curate, and publish original art — 24/7 with zero human input." />
        <meta property="og:title" content="BLOOM NFT • Autonomous AI Art Studio" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>" />
      </Head>

      {/* ── IN-PAGE WAKEUP TOAST ── */}
      {toast && (
        <div className={`site-toast site-toast--${toast.type}`}>
          <span className="toast-msg">{toast.msg}</span>
          <button className="toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* ── BACKGROUND ORBS ── */}
      <div className="bg-orbs" aria-hidden>
        <span /><span /><span />
      </div>

      <PollenCanvas />

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

        <div className="nav-wallet-area">
          <div className={`firebase-status ${isConnected ? 'online' : 'offline'}`}>
            <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
            {isConnected ? "LIVE" : "OFFLINE"}
          </div>

          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                  })}
                >
                  {!connected ? (
                    <div className="liquid-border-wrap">
                      <button className="wallet-connect-btn" onClick={openConnectModal}>
                        <span className="wallet-icon">⬡</span>
                        Connect Wallet
                      </button>
                    </div>
                  ) : chain.unsupported ? (
                    <button className="wallet-wrong-chain" onClick={openChainModal}>
                      ⚠ Wrong Network
                    </button>
                  ) : (
                    <div className="wallet-connected-group">
                      <button className="wallet-chain-btn" onClick={openChainModal}>
                        {chain.hasIcon && chain.iconUrl && (
                          <img src={chain.iconUrl} alt={chain.name} style={{ width: 14, height: 14, borderRadius: '50%' }} />
                        )}
                        {chain.name}
                      </button>
                      <button className="wallet-addr-btn" onClick={openAccountModal}>
                        🌸 {account.displayName}
                        {account.displayBalance ? ` · ${account.displayBalance}` : ''}
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </nav>

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="hero">
        <div className="hero-badge">🌸 Next-Gen Autonomous Art Studio</div>

        {/* Mouse-reactive parallax wrapper */}
        <div ref={heroTitleRef} style={{ transition: 'transform 0.12s ease-out' }}>
          <h1 className="hero-title">
            <span className="line-1 glitch" data-text="BLOOM">BLOOM</span>
            <span className="line-2">NFT STUDIO</span>
          </h1>
        </div>

        <p className="hero-sub">{COMPANY.description}</p>

        <div className="hero-btns">
          <button className="btn-primary btn-glow" onClick={wakeUp}>🚀 Wake Up Company</button>
          <button className="btn-secondary" onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}>
            🖼️ View Gallery
          </button>
        </div>

        {/* Commission CTA */}
        <div className="commission-hero-cta">
          <button
            className={`commission-orb-btn ${!walletConnected ? 'disabled' : ''}`}
            onClick={() => walletConnected && setShowCommission(true)}
            title={!walletConnected ? 'Connect your wallet to commission' : 'Commission a custom NFT'}
          >
            <span className="commission-orb-inner">
              <span className="commission-orb-icon">🎨</span>
              <span className="commission-orb-text">
                {walletConnected ? 'Commission the Atelier' : 'Connect Wallet to Commission'}
              </span>
              <span className="commission-orb-price">from 0.035 ETH</span>
            </span>
            {walletConnected && <span className="commission-orb-ring" />}
          </button>
        </div>

        <div className="hero-stats">
          {STATS.map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num" data-target={isNaN(s.num) ? undefined : s.num}>
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

      {/* ════════════════════ BLOOM SEQUENCE SIDEBAR ════════════════════ */}
      {isSystemAwake && activeAgents.length > 0 && (
        <aside className="bloom-sequence-sidebar" aria-label="Live agent activity">
          <div className="bss-label">⚡ Live</div>
          {activeAgents.map(a => {
            const s = agentStatuses[a.id] || {};
            return (
              <div key={a.id} className="bss-row" style={{ '--bss-color': a.color }}>
                <span className="bss-dot" style={{ background: a.color }} />
                <span className="bss-agent">{a.emoji} {a.name}</span>
                <span className="bss-msg">{s.message?.slice(0, 38) || s.action}</span>
              </div>
            );
          })}
        </aside>
      )}

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
            <button
              className={`btn-commission ${!walletConnected ? 'btn-commission-locked' : ''}`}
              onClick={() => walletConnected && setShowCommission(true)}
              title={!walletConnected ? 'Connect wallet to commission' : ''}
            >
              {walletConnected ? '🎨 Commission Custom NFT' : '🔒 Connect Wallet to Commission'}
            </button>
          </div>

          <div className="office-arena-wrap reveal" ref={addReveal}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,0,12,0.58)', zIndex: 1 }} />
            <img src={BG} alt="AI Office Background" className="bg" style={{ opacity: 0.55 }} />

            {AGENTS_CONFIG.map((agent, index) => {
              const agentStatus = isSystemAwake
                ? (agentStatuses[agent.id] || { action: 'Sleeping', message: 'Resting...' })
                : { action: 'Sleeping', message: 'Resting...' };
              return (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  status={agentStatus}
                  isSystemAwake={isSystemAwake}
                  index={index}
                />
              );
            })}
          </div>

          {/* ── LIVE CHAT FEED (Delayed Drip) ── */}
          <div className="live-chat-wrap reveal" ref={addReveal}>
            <div className="live-chat-header">
              <span className="live-chat-title">⑆ Atelier Comms Feed</span>
              <span className="live-chat-sync">Sync: +5000ms delay</span>
            </div>
            <div className="live-chat-feed">
              {chatLog.length === 0 && !isTyping && (
                <div className="chat-empty">Listening for agent activity...</div>
              )}
              {chatLog.map((msg, i) => (
                <div key={msg.id || i} className="chat-line">
                  <span className="chat-time">[{msg.time}]</span>
                  <span className="chat-agent" style={{ color: msg.color }}>{msg.agent}:</span>
                  <span className="chat-action">{msg.action}</span>
                  {msg.message && <span className="chat-msg">— {msg.message}</span>}
                </div>
              ))}
              {isTyping && (
                <div className="chat-line typing-line">
                  <span className="chat-time">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                  <span className="chat-typing-dots">
                    <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════ GALLERY ════════════════════ */}
      <section id="gallery" className="section gallery-section">
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
          <h2 className="section-title reveal" ref={addReveal}>🌸 BLOOM NFT Drops</h2>
          <p className="section-desc reveal" ref={addReveal}>
            Each piece is autonomously conceived, created, and published by AI. Every image is one&#8209;of&#8209;a&#8209;kind.
          </p>
          <div className="section-divider" />
        </div>

        {gallery.length > 0 ? (
          <div className="museum-layout reveal" ref={addReveal}>

            {/* ── WALL RAIL HEADER ── */}
            <div className="museum-wall-rail">
              <span className="rail-label">EXHIBITION 01</span>
              <div className="rail-line" />
            </div>

            {/* ── FEATURED WALL (Latest Drop) ── */}
            {featured && (
              <div className="museum-feature-wall">
                <article
                  className="museum-masterpiece"
                  onClick={() => openLightbox(featured, 0)}
                >
                  <div className="masterpiece-frame">
                    <img
                      className="masterpiece-img"
                      src={featured.image}
                      alt={featured.description || 'Genesis Drop'}
                      loading="lazy"
                    />
                    <div className="masterpiece-shimmer" />
                    <div className="masterpiece-badge">LATEST ACQUISITION</div>
                  </div>
                </article>
                
                <div className="masterpiece-plaque">
                  <div className="plaque-header">
                    <span className="plaque-chain">⟠ Ethereum</span>
                    <span className="plaque-edition">Unique 1/1</span>
                  </div>
                  <h3 className="plaque-title">{featured.description || 'Genesis Drop'}</h3>
                  <div className="plaque-meta">
                    <p className="plaque-date">{featured.date || '—'}</p>
                    <p className="plaque-artist">Autonomously generated by BLOOM Studio</p>
                  </div>
                  <div className="plaque-footer">
                    <div className="plaque-price">◈ {featured.price || '1.0 ETH'}</div>
                    <button className="plaque-btn" onClick={() => openLightbox(featured, 0)}>Inspect Work ↗</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── MASONRY GALLERY ROW ── */}
            {rest.length > 0 && (
              <div className="museum-masonry">
                {rest.map((art, i) => (
                  <article
                    key={i + 1}
                    className="museum-card reveal"
                    ref={el => {
                      addReveal(el);
                      if (el) galleryCardsRef.current[i + 1] = el;
                    }}
                    style={{ '--reveal-delay': `${(i % 4) * 0.12}s` }}
                    onClick={() => openLightbox(art, i + 1)}
                    onMouseMove={e => handleCardTilt(e, i + 1)}
                    onMouseLeave={() => resetCardTilt(i + 1)}
                  >
                    <div className="museum-card-frame">
                      <img
                        className="museum-card-img"
                        src={art.image}
                        alt={art.description || `Drop #${i + 2}`}
                        loading="lazy"
                      />
                      <div className="museum-card-shimmer" />
                    </div>
                    <div className="museum-card-plaque">
                      <div className="plaque-num">No. {String(i + 2).padStart(3, '0')}</div>
                      <h4 className="plaque-sm-title">{art.description || `Drop #${i + 2}`}</h4>
                      <div className="plaque-sm-footer">
                        <span className="plaque-sm-date">{art.date || '—'}</span>
                        <span className="plaque-sm-price">◈ {art.price || '1.0 ETH'}</span>
                      </div>
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

      {/* ════════════════════ COMMISSION MODAL ════════════════════ */}
      {showCommission && <CommissionModal onClose={() => setShowCommission(false)} />}

      <style jsx>{`
        @keyframes agentBounce {
          from { margin-top: 0; }
          to   { margin-top: -14px; }
        }

        /* ── In-page Wakeup Toast ── */
        .site-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          min-width: 320px;
          max-width: 540px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 22px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.6);
          animation: toastIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .site-toast--info    { background: rgba(0,200,255,0.12); border: 1px solid rgba(0,200,255,0.35); color: #7df4ff; }
        .site-toast--success { background: rgba(0,255,136,0.1);  border: 1px solid rgba(0,255,136,0.35); color: #5dffc4; }
        .site-toast--error   { background: rgba(255,50,80,0.12); border: 1px solid rgba(255,50,80,0.35);  color: #ff8080; }
        .toast-msg { flex: 1; line-height: 1.5; }
        .toast-close {
          background: none; border: none; color: inherit;
          font-size: 16px; cursor: pointer; opacity: 0.7;
          transition: opacity 0.2s; flex-shrink: 0;
        }
        .toast-close:hover { opacity: 1; }

        /* ── Bloom Sequence Sidebar ── */
        .bloom-sequence-sidebar {
          position: fixed;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 90;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 230px;
          pointer-events: none;
        }
        .bss-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #ff6ec7;
          margin-bottom: 4px;
          text-shadow: 0 0 10px #ff6ec788;
        }
        .bss-row {
          background: rgba(8, 4, 22, 0.78);
          backdrop-filter: blur(16px);
          border: 1px solid var(--bss-color, #ff6ec7);
          border-radius: 12px;
          padding: 7px 12px;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          box-shadow: 0 0 12px color-mix(in srgb, var(--bss-color, #ff6ec7) 30%, transparent);
          animation: bssSlideIn 0.4s ease;
        }
        @keyframes bssSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .bss-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: agentHeartbeat 2s ease-in-out infinite;
        }
        .bss-agent { font-weight: 700; color: #fff; white-space: nowrap; }
        .bss-msg   { color: #8a80a8; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        @media (max-width: 900px) {
          .bloom-sequence-sidebar { display: none; }
        }
      `}</style>
    </>
  );
}
