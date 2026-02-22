import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig'; // Ensure this path is correct
import { ref, onValue } from "firebase/database";
import Head from 'next/head';
import bgImage from '../media/Gemini_Generated_Image_l02bjml02bjml02b.png';
// --- 6 AGENTS CONFIG (Updated to match the Python Code) ---
// Using percentage-based positioning so it scales on mobile/tablets
const AGENTS_CONFIG = [
  { id: "Creative Director", name: "Director", seed: "Director", emoji: "🎨", color: "#ff00aa", position: { top: "20%", left: "50%" }, role: "Visionary" },
  { id: "Artist", name: "Artist", seed: "Artist", emoji: "🖌️", color: "#00f0ff", position: { top: "50%", left: "18%" }, role: "Painter" },
  { id: "Manager", name: "Manager", seed: "Manager", emoji: "📦", color: "#00ff88", position: { top: "50%", left: "50%" }, role: "Operations" },
  { id: "Promoter", name: "Promoter", seed: "Promoter", emoji: "📣", color: "#aa00ff", position: { top: "50%", left: "82%" }, role: "Marketing" },
  { id: "Publisher", name: "Publisher", seed: "Publisher", emoji: "🐦", color: "#1da1f2", position: { top: "80%", left: "35%" }, role: "Socials" },
  { id: "Analyst", name: "Analyst", seed: "Analyst", emoji: "📊", color: "#ffff00", position: { top: "80%", left: "65%" }, role: "Data" },
];

const ASSETS = {
  // Adding the leading slash is key for Next.js routing
 background: bgImage.src || bgImage,
};

export default function Home() {
  const [agentStatuses, setAgentStatuses] = useState({});
  const [gallery, setGallery] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastDropTime, setLastDropTime] = useState("");

  // 1. Firebase Live Updates
  useEffect(() => {
    const officeRef = ref(database, 'office_status');
    
    const unsubscribe = onValue(officeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsConnected(true);
        setAgentStatuses(data);

        // Check if manager recently succeeded to update the last drop time
        if (data.Manager && (data.Manager.action.includes("Success") || data.Manager.action.includes("updated"))) {
          setLastDropTime(new Date().toLocaleTimeString());
        }
      }
    }, (error) => {
      console.error("❌ Firebase Error:", error);
      setIsConnected(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Load Gallery from GitHub
  useEffect(() => {
    const url = "https://raw.githubusercontent.com/Itzadityapandey/nft-c/main/database.json";
    fetch(url)
      .then(res => res.ok ? res.json() : [])
      .then(data => setGallery(data.reverse()))
      .catch(() => console.log("⚠️ No art drops yet"));
  }, []);

  // 3. Buttons
  const wakeUpCompany = () => {
    window.open("https://itzadityapandey-ceo.hf.space/wakeup", "_blank");
  };

  const stopCompany = () => {
    window.open("https://itzadityapandey-ceo.hf.space/stop", "_blank");
  };

  // 4. MASTER STATUS CHECK
  // If the whole system is sleeping or offline, force all bots to sleep so they don't get stuck.
  const systemState = agentStatuses['System']?.action || 'Sleeping';
  const isSystemAwake = systemState !== 'Sleep' && systemState !== 'Sleeping' && systemState !== 'Stopped';

  return (
    <div style={styles.container}>
      <Head>
        <title>Autonomous Art Company • Voxyz AI Office</title>
      </Head>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>🎨</span>
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

      {/* CONTROL BUTTONS */}
      <div style={styles.controls}>
        <button onClick={wakeUpCompany} style={styles.wakeupBtn}>🚀 WAKE UP COMPANY</button>
        <button onClick={stopCompany} style={styles.stopBtn}>⏹ STOP ALL AGENTS</button>
      </div>

      {/* RESPONSIVE OFFICE ARENA */}
      <div style={styles.officeWrapper}>
        <div style={styles.office}>
          <img src={ASSETS.background} alt="Office" style={styles.officeBg} />
          
          {AGENTS_CONFIG.map((agent) => {
            // Apply the master system check so bots don't freeze on an old status
            let status = agentStatuses[agent.id] || { action: 'Sleeping', message: 'Waiting...' };
            if (!isSystemAwake) {
               status = { action: 'Sleeping', message: 'Resting...' };
            }
            
            const isActive = status.action !== 'Sleeping' && !status.action.toLowerCase().includes('offline');

            return (
              <div key={agent.id} style={{
                ...styles.avatarBox,
                top: agent.position.top,
                left: agent.position.left,
                // Use marginTop for animation so it doesn't break CSS transform centering
                animation: isActive ? 'bounce 0.6s infinite alternate, glow 2s infinite alternate' : 'none',
              }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${agent.seed}&backgroundColor=000000&glassesProbability=${agent.id === "Manager" ? 100 : 0}`} 
                    width="100%" 
                    style={{ 
                      maxWidth: '92px', 
                      minWidth: '50px',
                      filter: isActive ? `drop-shadow(0 0 15px ${agent.color})` : 'none',
                      opacity: isActive ? 1 : 0.6 // Dim sleeping bots
                    }}
                    alt={agent.name}
                  />
                  <div style={{ ...styles.roleBadge, backgroundColor: agent.color + '33', color: agent.color }}>
                    {agent.emoji} {agent.role}
                  </div>
                </div>

                {isActive && (
                  <div style={{ ...styles.bubble, borderColor: agent.color }}>
                    <div style={{ color: agent.color, fontWeight: 'bold' }}>{status.action}</div>
                    <div style={{ fontSize: '11px', marginTop: '4px' }}>{status.message}</div>
                  </div>
                )}

                <div style={styles.agentName}>{agent.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GALLERY */}
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

      <div style={styles.footer}>
        Powered by 6 Autonomous Agents • CrewAI + Gemini + Hugging Face
      </div>

      <style jsx>{`
        /* Changed from transform to margin-top to allow % based layout to stay centered */
        @keyframes bounce { from { margin-top: 0; } to { margin-top: -12px; } }
        @keyframes glow { from { filter: drop-shadow(0 0 8px currentColor); } to { filter: drop-shadow(0 0 20px currentColor); } }
      `}</style>
    </div>
  );
}

// ────────────────────────────── STYLES ──────────────────────────────
const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0f 0%, #1a0022 100%)', color: '#e0e0ff', fontFamily: "'Courier New', monospace", paddingBottom: '40px' },
  header: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '20px 4vw', borderBottom: '2px solid #ff00aa33', gap: '15px' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  title: { fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 'bold', letterSpacing: '2px', background: 'linear-gradient(90deg, #ff00aa, #00f0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  statusBar: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'clamp(12px, 2vw, 15px)' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', boxShadow: '0 0 12px currentColor' },
  lastDrop: { marginLeft: '10px', opacity: 0.8 },
  controls: { display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', margin: '30px 20px' },
  wakeupBtn: { padding: '14px 32px', fontSize: 'clamp(14px, 2.5vw, 17px)', background: 'linear-gradient(45deg, #ff00aa, #00f0ff)', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 25px #ff00aa' },
  stopBtn: { padding: '14px 32px', fontSize: 'clamp(14px, 2.5vw, 17px)', background: '#330022', color: '#ff0055', border: '2px solid #ff0055', borderRadius: '50px', cursor: 'pointer' },
  
  /* RESPONSIVE OFFICE STYLES */
  officeWrapper: { width: '90%', maxWidth: '1000px', margin: '0 auto', padding: '0 10px' },
  office: { position: 'relative', width: '100%', aspectRatio: '16 / 9', border: '8px solid #220033', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 60px rgba(255,0,170,0.4)' },
  officeBg: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 },
  
  /* AVATAR STYLES */
  avatarBox: { position: 'absolute', textAlign: 'center', width: '12%', minWidth: '70px', transform: 'translate(-50%, -50%)', transition: 'all 0.4s ease' },
  roleBadge: { position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(8px, 1vw, 10px)', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  bubble: { position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#0f0f1f', color: '#fff', padding: '10px 14px', borderRadius: '14px', width: 'max-content', maxWidth: '200px', fontSize: '12px', border: '2px solid', boxShadow: '0 0 15px currentColor', zIndex: 20 },
  agentName: { marginTop: '12px', fontSize: 'clamp(10px, 1.5vw, 13px)', fontWeight: 'bold', textShadow: '0 0 8px currentColor' },
  
  /* GALLERY STYLES */
  gallerySection: { width: '90%', maxWidth: '1000px', margin: '60px auto', padding: '0 10px' },
  galleryTitle: { fontSize: 'clamp(20px, 3vw, 26px)', textAlign: 'center', marginBottom: '30px', color: '#00f0ff', textShadow: '0 0 15px #00f0ff' },
  gallery: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
  card: { background: '#110022', borderRadius: '16px', overflow: 'hidden', border: '2px solid #330044', transition: 'transform 0.2s', cursor: 'pointer' },
  cardImage: { width: '100%', height: '240px', objectFit: 'cover' },
  cardInfo: { padding: '16px' },
  cardDesc: { fontSize: '15px', margin: '0 0 8px 0', color: '#ffddff', lineHeight: '1.4' },
  cardDate: { fontSize: '12px', opacity: 0.7 },
  emptyGallery: { textAlign: 'center', padding: '80px 20px', fontSize: '18px', opacity: 0.6, gridColumn: '1 / -1' },
  footer: { textAlign: 'center', padding: '40px 20px', fontSize: '13px', opacity: 0.6, borderTop: '1px solid #330044', marginTop: '40px' },
};
