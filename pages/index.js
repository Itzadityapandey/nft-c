import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from "firebase/database";
import Head from 'next/head';

// --- AGENT CONFIG (New 6-Agent System) ---
const AGENTS_CONFIG = [
  {
    id: "Creative Director",
    name: "Creative Director",
    seed: "Director",
    emoji: "🎨",
    color: "#ff00aa",
    position: { top: "140px", left: "380px" },
    role: "Visionary Leader",
  },
  {
    id: "Artist",
    name: "Artist",
    seed: "Artist",
    emoji: "🖌️",
    color: "#00f0ff",
    position: { top: "320px", left: "120px" },
    role: "Digital Painter",
  },
  {
    id: "Curator",
    name: "Curator",
    seed: "Curator",
    emoji: "🔍",
    color: "#ffaa00",
    position: { top: "320px", left: "280px" },
    role: "Quality Guardian",
  },
  {
    id: "Manager",
    name: "Manager",
    seed: "Manager",
    emoji: "📦",
    color: "#00ff88",
    position: { top: "320px", left: "520px" },
    role: "Operations",
  },
  {
    id: "Promoter",
    name: "Promoter",
    seed: "Promoter",
    emoji: "📣",
    color: "#aa00ff",
    position: { top: "460px", left: "180px" },
    role: "Marketing Genius",
  },
  {
    id: "Analyst",
    name: "Analyst",
    seed: "Analyst",
    emoji: "📊",
    color: "#ffff00",
    position: { top: "460px", left: "440px" },
    role: "Data Strategist",
  },
];

// --- ASSETS ---
const ASSETS = {
  background: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2070&auto=format&fit=crop", // Cyberpunk pixel office vibe
  officeOverlay: "https://i.imgur.com/8ZfK8zL.png", // Optional subtle grid overlay
};

export default function Home() {
  // --- STATE ---
  const [agentStatuses, setAgentStatuses] = useState<Record<string, { action: string; message: string }>>({});
  const [gallery, setGallery] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastDropTime, setLastDropTime] = useState<string>("");

  // --- 1. REAL-TIME FIREBASE LISTENER (Supports All 6 Agents) ---
  useEffect(() => {
    const officeRef = ref(database, 'office_status');
    
    const unsubscribe = onValue(officeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsConnected(true);
        setAgentStatuses(data);

        // Update last drop time if manager finished
        if (data.Manager?.action?.includes("Success") || data.Manager?.action?.includes("updated")) {
          setLastDropTime(new Date().toLocaleTimeString());
        }
      }
    }, (error) => {
      console.error("❌ Firebase Error:", error);
      setIsConnected(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. LOAD GALLERY FROM GITHUB ---
  useEffect(() => {
    const url = `https://raw.githubusercontent.com/Itzadityapandey/nft-c/main/database.json`;
    fetch(url)
      .then(res => res.ok ? res.json() : [])
      .then(data => setGallery(data.reverse())) // Newest first
      .catch(() => console.log("⚠️ Gallery empty – first drop coming soon!"));
  }, []);

  // --- 3. MANUAL WAKE-UP (Direct Link to Your HF Space) ---
  const wakeUpCompany = () => {
    window.open("https://itzadityapandey-ceo.hf.space/wakeup", "_blank");
  };

  const stopCompany = () => {
    window.open("https://itzadityapandey-ceo.hf.space/stop", "_blank");
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Autonomous Art Company • Voxyz AI Office</title>
        <meta name="description" content="Live 6-Agent Autonomous Art Company" />
      </Head>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={{ fontSize: "42px", filter: "drop-shadow(0 0 10px #ff00aa)" }}>🎨</span>
          <h1 style={styles.title}>AUTONOMOUS ART COMPANY</h1>
        </div>
        
        <div style={styles.statusBar}>
          <div style={{ ...styles.dot, backgroundColor: isConnected ? '#00ff88' : '#ff0055' }} />
          <span style={{ color: isConnected ? '#00ff88' : '#ff0055', fontWeight: 'bold' }}>
            {isConnected ? "ALL SYSTEMS ONLINE" : "DISCONNECTED"}
          </span>
          {lastDropTime && <span style={styles.lastDrop}>Last Drop: {lastDropTime}</span>}
        </div>
      </div>

      {/* CONTROL PANEL */}
      <div style={styles.controls}>
        <button onClick={wakeUpCompany} style={styles.wakeupBtn}>🚀 WAKE UP COMPANY</button>
        <button onClick={stopCompany} style={styles.stopBtn}>⏹ STOP ALL AGENTS</button>
      </div>

      {/* OFFICE FLOOR */}
      <div style={styles.office}>
        <img src={ASSETS.background} alt="Cyberpunk Office" style={styles.officeBg} />
        
        {AGENTS_CONFIG.map((agent, index) => {
          const status = agentStatuses[agent.id] || { action: 'Sleeping', message: 'Waiting for next drop...' };
          const isActive = status.action !== 'Sleeping' && !status.action.toLowerCase().includes('offline');

          return (
            <div
              key={index}
              style={{
                ...styles.avatarBox,
                top: agent.position.top,
                left: agent.position.left,
                animation: isActive ? 'bounce 0.6s infinite alternate, glow 2s infinite alternate' : 'none',
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <img 
                  src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${agent.seed}&backgroundColor=000000&glassesProbability=${agent.id === "Manager" ? 100 : 0}`} 
                  width="92" 
                  alt={agent.name}
                  style={{ filter: isActive ? 'drop-shadow(0 0 15px ' + agent.color + ')' : 'none' }}
                />
                <div style={{ ...styles.roleBadge, backgroundColor: agent.color + '33', color: agent.color }}>
                  {agent.emoji} {agent.role}
                </div>
              </div>

              {/* Status Bubble */}
              {isActive && (
                <div style={{ ...styles.bubble, borderColor: agent.color }}>
                  <div style={{ color: agent.color, fontWeight: 'bold' }}>{status.action}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px' }}>{status.message}</div>
                </div>
              )}

              {/* Agent Name */}
              <div style={styles.agentName}>{agent.name}</div>
            </div>
          );
        })}
      </div>

      {/* GALLERY SECTION */}
      <div style={styles.gallerySection}>
        <h2 style={styles.galleryTitle}>🖼️ RECENT AI ART DROPS</h2>
        <div style={styles.gallery}>
          {gallery.length > 0 ? (
            gallery.map((art, index) => (
              <div key={index} style={styles.card}>
                <img src={art.image} style={styles.cardImage} alt={art.description} />
                <div style={styles.cardInfo}>
                  <p style={styles.cardDesc}>{art.description}</p>
                  <p style={styles.cardDate}>{art.date}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyGallery}>
              No drops yet.<br/>Wake up the company to create the first masterpiece!
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        Powered by 6 Autonomous Agents • Built with CrewAI + Gemini + Hugging Face
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-12px); }
        }
        @keyframes glow {
          from { filter: drop-shadow(0 0 8px currentColor); }
          to { filter: drop-shadow(0 0 20px currentColor); }
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────── STYLES ──────────────────────────────────────
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0a0a0f 0%, #1a0022 100%)',
    color: '#e0e0ff',
    fontFamily: "'Courier New', monospace",
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '2px solid #ff00aa33',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    background: 'linear-gradient(90deg, #ff00aa, #00f0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    boxShadow: '0 0 12px currentColor',
  },
  lastDrop: {
    marginLeft: '20px',
    fontSize: '13px',
    opacity: 0.8,
  },
  controls: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    margin: '25px 0',
  },
  wakeupBtn: {
    padding: '14px 32px',
    fontSize: '17px',
    background: 'linear-gradient(45deg, #ff00aa, #00f0ff)',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 0 25px #ff00aa',
    transition: 'all 0.3s',
  },
  stopBtn: {
    padding: '14px 32px',
    fontSize: '17px',
    background: '#330022',
    color: '#ff0055',
    border: '2px solid #ff0055',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  office: {
    position: 'relative',
    width: '860px',
    height: '620px',
    margin: '0 auto',
    border: '12px solid #220033',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 0 60px rgba(255,0,170,0.4)',
  },
  officeBg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.85,
  },
  avatarBox: {
    position: 'absolute',
    textAlign: 'center',
    width: '110px',
    transition: 'all 0.4s ease',
  },
  roleBadge: {
    position: 'absolute',
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '9px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  bubble: {
    position: 'absolute',
    top: '-92px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#0f0f1f',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '14px',
    width: '180px',
    fontSize: '13px',
    border: '3px solid',
    boxShadow: '0 0 15px currentColor',
    zIndex: 20,
  },
  agentName: {
    marginTop: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    textShadow: '0 0 8px currentColor',
  },
  gallerySection: {
    width: '860px',
    margin: '60px auto',
    padding: '0 20px',
  },
  galleryTitle: {
    fontSize: '26px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#00f0ff',
    textShadow: '0 0 15px #00f0ff',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#110022',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid #330044',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  cardImage: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
  },
  cardInfo: {
    padding: '16px',
  },
  cardDesc: {
    fontSize: '15px',
    margin: '0 0 8px 0',
    color: '#ffddff',
  },
  cardDate: {
    fontSize: '12px',
    opacity: 0.7,
  },
  emptyGallery: {
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '18px',
    opacity: 0.6,
    gridColumn: '1 / -1',
  },
  footer: {
    textAlign: 'center',
    padding: '40px 20px',
    fontSize: '13px',
    opacity: 0.6,
    borderTop: '1px solid #330044',
  },
};
