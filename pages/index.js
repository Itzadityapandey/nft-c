import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from "firebase/database";
import Head from 'next/head';

// This imports the database.json file that your bot updates!
// If it doesn't exist yet, we use a placeholder.
import artDatabase from '../database.json'; 

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

  // 2. LOAD THE GALLERY
  useEffect(() => {
    // If artDatabase is empty (first run), use empty array
    setGallery(artDatabase || []);
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Autonomous Art Office</title>
      </Head>

      <h1>LIVE AI WORKSPACE</h1>
      <p>Status: {artist.action === 'Sleeping' ? 'Offline 🌙' : 'WORKING 🔴'}</p>

      {/* --- THE PIXEL OFFICE --- */}
      <div className="office-floor">
        
        {/* ARTIST AVATAR */}
        <div className={`avatar-container ${artist.action !== 'Sleeping' ? 'bouncing' : ''}`} style={{ top: '300px', left: '150px' }}>
          <img src="https://i.imgur.com/O7K5X9M.png" width="64" />
          <div className={`speech-bubble ${artist.action !== 'Sleeping' ? 'visible' : ''}`}>
            <b>{artist.action}</b><br/>{artist.message}
          </div>
        </div>

        {/* MANAGER AVATAR */}
        <div className={`avatar-container ${manager.action !== 'Sleeping' ? 'bouncing' : ''}`} style={{ top: '300px', left: '550px' }}>
          <img src="https://i.imgur.com/O7K5X9M.png" width="64" style={{ filter: 'hue-rotate(90deg)' }} />
          <div className={`speech-bubble ${manager.action !== 'Sleeping' ? 'visible' : ''}`}>
            <b>{manager.action}</b><br/>{manager.message}
          </div>
        </div>

      </div>

      {/* --- THE GALLERY (Past Work) --- */}
      <div className="gallery">
        <h2>Latest Creations</h2>
        {gallery.map((art, index) => (
          <div key={index} className="nft-card">
            <img src={art.image} alt="NFT" />
            <p>{art.description}</p>
            <small>{art.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// Depending on your Next.js setup, you might need this to avoid build errors if database.json is missing
export async function getStaticProps() {
  return { props: {} }
}
