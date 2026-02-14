import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from "firebase/database";
import Head from 'next/head';

// --- CONFIG: IMAGE LINKS ---
const ASSETS = {
  background: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Isometric_pixel_art_example.png/800px-Isometric_pixel_art_example.png",
  artist: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Artist", 
  manager: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Manager&glassesProbability=100",
  marketer: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Marketer"
};

export default function Home() {
  const [artist, setArtist] = useState({ action: 'Sleeping', message: 'Zzz...' });
  const [manager, setManager] = useState({ action: 'Sleeping', message: 'Zzz...' });
  const [gallery, setGallery] = useState([]);

  // 1. LISTEN TO LIVE AGENTS (Firebase)
  useEffect(() => {
    const officeRef = ref(database, 'office_status');
    onValue(officeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.Artist) setArtist(data.Artist);
        if (data.Manager) setManager(data.Manager);
      }
    });
  }, []);

  // 2. LOAD GALLERY (With Error Handling)
  useEffect(() => {
    // This fetches the raw JSON from your GitHub repo to show past art
    // Replace 'Itzadityapandey' and 'nft-c' with your actual username/repo
    fetch('https://raw.githubusercontent.com/Itzadityapandey/nft-c/main/database.json')
      .then(res => res.json())
      .then(data => setGallery(data))
      .catch(err => console.log("No art yet!"));
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Autonomous Art Office</title>
      </Head>

      <h1 style={{ fontFamily: 'monospace', margin: '20px' }}>LIVE AI WORKSPACE</h1>

      {/* --- THE PIXEL OFFICE --- */}
      <div className="office-floor" style={{ 
          position: 'relative', 
          width: '800px', 
          height: '600px', 
          backgroundImage: `url(${ASSETS.background})`,
          backgroundSize: 'cover',
          border: '8px solid #333',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}>
        
        {/* ARTIST AVATAR */}
        <div className={`avatar-container ${artist.action !== 'Sleeping' ? 'bouncing' : ''}`} 
             style={{ position: 'absolute', top: '350px', left: '200px', transition: 'all 0.5s' }}>
          <img src={ASSETS.artist} width="100" alt="Artist" />
          
          <div className="speech-bubble" style={{ 
              display: artist.action !== 'Sleeping' ? 'block' : 'none',
              position: 'absolute', top: '-80px', left: '-20px', 
              background: 'white', color: 'black', padding: '10px', 
              borderRadius: '10px', width: '150px', fontSize: '12px', zIndex: 10 
          }}>
            <b>{artist.action}</b><br/>{artist.message}
          </div>
        </div>

        {/* MANAGER AVATAR */}
        <div className={`avatar-container ${manager.action !== 'Sleeping' ? 'bouncing' : ''}`} 
             style={{ position: 'absolute', top: '250px', left: '500px', transition: 'all 0.5s' }}>
          <img src={ASSETS.manager} width="100" alt="Manager" />
          
          <div className="speech-bubble" style={{ 
              display: manager.action !== 'Sleeping' ? 'block' : 'none',
              position: 'absolute', top: '-80px', left: '-20px', 
              background: 'white', color: 'black', padding: '10px', 
              borderRadius: '10px', width: '150px', fontSize: '12px', zIndex: 10 
          }}>
            <b>{manager.action}</b><br/>{manager.message}
          </div>
        </div>

      </div>

      {/* --- THE GALLERY --- */}
      <div className="gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '800px', marginTop: '40px' }}>
        {gallery.map((art, index) => (
          <div key={index} style={{ background: '#222', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <img src={art.image} style={{ width: '100%', borderRadius: '5px' }} />
            <p style={{ fontSize: '12px', marginTop: '10px' }}>{art.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
