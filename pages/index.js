import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from "firebase/database";
import Head from 'next/head';

// --- ASSETS (Direct Links) ---
const ASSETS = {
  background: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Isometric_pixel_art_example.png/800px-Isometric_pixel_art_example.png",
  artist: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Artist", 
  manager: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Manager&glassesProbability=100",
};

export default function Home() {
  // --- STATE ---
  const [artist, setArtist] = useState({ action: 'Sleeping', message: 'Zzz...' });
  const [manager, setManager] = useState({ action: 'Sleeping', message: 'Zzz...' });
  const [gallery, setGallery] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // To check Firebase

  // --- 1. LISTEN TO FIREBASE (The Brain) ---
  useEffect(() => {
    console.log("🔌 Attempting to connect to Firebase...");
    const officeRef = ref(database, 'office_status');
    
    // This runs whenever the database changes
    const unsubscribe = onValue(officeRef, (snapshot) => {
      const data = snapshot.val();
      setIsConnected(true); // Connection successful!
      console.log("📥 Data received:", data);

      if (data) {
        if (data.Artist) setArtist(data.Artist);
        if (data.Manager) setManager(data.Manager);
      }
    }, (error) => {
      console.error("❌ Firebase Error:", error);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. LOAD GALLERY FROM GITHUB ---
  useEffect(() => {
    // Replace with YOUR exact repo URL
    const REPO_USER = "Itzadityapandey";
    const REPO_NAME = "nft-c"; 
    const url = `https://raw.githubusercontent.com/${REPO_USER}/${REPO_NAME}/main/database.json`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Database file not found yet");
        return res.json();
      })
      .then(data => {
        console.log("🎨 Gallery loaded:", data);
        setGallery(data);
      })
      .catch(err => console.log("⚠️ No art in gallery yet (Normal for new projects)"));
  }, []);

  // --- 3. MANUAL TEST BUTTON ---
  const runTest = () => {
    setArtist({ action: 'Painting', message: 'Testing Animation...' });
    setManager({ action: 'Uploading', message: 'Looks good!' });
    setTimeout(() => {
      setArtist({ action: 'Sleeping', message: 'Zzz...' });
      setManager({ action: 'Sleeping', message: 'Zzz...' });
    }, 3000);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Autonomous Art Office</title>
      </Head>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>LIVE AI WORKSPACE</h1>
        <div style={styles.status}>
          <span style={{
            ...styles.dot, 
            backgroundColor: isConnected ? '#0f0' : '#f00',
            boxShadow: isConnected ? '0 0 10px #0f0' : 'none'
          }} />
          {isConnected ? "ONLINE" : "DISCONNECTED (Check Console)"}
        </div>
      </div>

      {/* OFFICE FLOOR */}
      <div style={styles.office}>
        
        {/* ARTIST AVATAR */}
        <div style={{...styles.avatarBox, top: '350px', left: '200px', animation: artist.action !== 'Sleeping' ? 'bounce 0.5s infinite alternate' : 'none'}}>
          <img src={ASSETS.artist} width="100" alt="Artist" />
          {artist.action !== 'Sleeping' && (
            <div style={styles.bubble}>
              <b>{artist.action}</b><br/>{artist.message}
            </div>
          )}
        </div>

        {/* MANAGER AVATAR */}
        <div style={{...styles.avatarBox, top: '250px', left: '500px', animation: manager.action !== 'Sleeping' ? 'bounce 0.5s infinite alternate' : 'none'}}>
          <img src={ASSETS.manager} width="100" alt="Manager" />
          {manager.action !== 'Sleeping' && (
            <div style={styles.bubble}>
              <b>{manager.action}</b><br/>{manager.message}
            </div>
          )}
        </div>
      </div>

      {/* DEBUG BUTTON */}
      <button onClick={runTest} style={styles.button}>
        Test Animations (Click Me)
      </button>

      {/* GALLERY */}
      <div style={styles.gallery}>
        {gallery.map((art, index) => (
          <div key={index} style={styles.card}>
            <img src={art.image} style={styles.cardImage} alt="Art" />
            <p>{art.description}</p>
          </div>
        ))}
      </div>

      {/* CSS STYLES (Internal for simplicity) */}
      <style jsx>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

// --- STYLES OBJECT ---
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Courier New', monospace",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '800px',
    alignItems: 'center',
    marginTop: '20px',
  },
  title: { margin: 0 },
  status: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  office: {
    position: 'relative',
    width: '800px',
    height: '600px',
    backgroundImage: `url(${ASSETS.background})`,
    backgroundSize: 'cover',
    border: '8px solid #333',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    marginTop: '20px',
  },
  avatarBox: {
    position: 'absolute',
    width: '100px',
    textAlign: 'center',
    transition: 'all 0.3s',
  },
  bubble: {
    position: 'absolute',
    top: '-80px',
    left: '-20px',
    background: 'white',
    color: 'black',
    padding: '10px',
    borderRadius: '10px',
    width: '150px',
    fontSize: '12px',
    zIndex: 10,
    border: '2px solid black',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    width: '800px',
    marginTop: '40px',
    marginBottom: '40px',
  },
  card: {
    background: '#222',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  cardImage: { width: '100%', borderRadius: '5px' },
};
