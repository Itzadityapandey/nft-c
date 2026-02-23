import Head from 'next/head';
import Link from 'next/link';

/* ─── DATA ────────────────────────────────────────────── */

const ABOUT_CARDS = [
    {
        icon: "🤖",
        title: "Fully Autonomous Agents",
        text: "Each of our 6 AI agents is powered by Gemini and operates 24/7 — conceiving ideas, generating art, managing drops, and growing an audience without any human input.",
        color: "#ff00aa",
    },
    {
        icon: "⛓️",
        title: "On-Chain Transparency",
        text: "Every drop is logged on-chain and committed to GitHub in real-time. You can trace every piece back to its origin — prompt, timestamp, and creator agent.",
        color: "#00f0ff",
    },
    {
        icon: "🌐",
        title: "Community-First",
        text: "Collectors get early access, governance votes, and a share of future revenue. BLOOM NFT is built for the community, powered by the community.",
        color: "#9000ff",
    },
    {
        icon: "🔮",
        title: "Evolving Intelligence",
        text: "The agents learn from audience feedback and market analytics. Each new drop is smarter, more aesthetic, and more culturally relevant than the last.",
        color: "#00ff88",
    },
    {
        icon: "🎨",
        title: "Infinite Creativity",
        text: "With no creative blocks, no sleep, and no limits — BLOOM NFT can produce dozens of unique artworks per day, each with its own concept and mood.",
        color: "#ffd700",
    },
    {
        icon: "🛡️",
        title: "Secure & Verified",
        text: "All agent actions are cryptographically signed. Every image hash is stored. You always know exactly what was created, when, and by which agent.",
        color: "#1da1f2",
    },
];

const PIPELINE = [
    { label: "Conceive", desc: "Director agent generates a unique art concept and brief based on trends and aesthetics.", emoji: "💡" },
    { label: "Create", desc: "Artist agent renders the piece using state-of-the-art diffusion models.", emoji: "🖌️" },
    { label: "Curate", desc: "Manager reviews quality, logs the drop to the database, and sets rarity metadata.", emoji: "📦" },
    { label: "Promote", desc: "Promoter writes compelling copy and Analyst identifies the optimal release window.", emoji: "📣" },
    { label: "Publish", desc: "Publisher posts across all platforms and mints the NFT to the blockchain.", emoji: "🐦" },
];

const TEAM_AGENTS = [
    { id: "Creative Director", name: "Director", seed: "Director", emoji: "🎨", color: "#ff00aa", role: "Visionary", desc: "Sets the creative direction for every drop." },
    { id: "Artist", name: "Artist", seed: "Artist", emoji: "🖌️", color: "#00f0ff", role: "Painter", desc: "Generates the actual artwork using AI models." },
    { id: "Manager", name: "Manager", seed: "Manager", emoji: "📦", color: "#00ff88", role: "Operations", desc: "Manages quality, database, and metadata." },
    { id: "Promoter", name: "Promoter", seed: "Promoter", emoji: "📣", color: "#aa00ff", role: "Marketing", desc: "Writes copy and crafts the promotional strategy." },
    { id: "Publisher", name: "Publisher", seed: "Publisher", emoji: "🐦", color: "#1da1f2", role: "Socials", desc: "Publishes to platforms and mints NFTs." },
    { id: "Analyst", name: "Analyst", seed: "Analyst", emoji: "📊", color: "#ffd700", role: "Data", desc: "Tracks performance and feeds insights back to Director." },
];

/* ─── PAGE ─────────────────────────────────────────────── */

export default function About() {
    return (
        <>
            <Head>
                <title>About • BLOOM NFT</title>
                <meta name="description" content="Learn about BLOOM NFT — the world's first autonomous AI art studio powered by 6 AI agents." />
            </Head>

            {/* ── NAVBAR ── */}
            <nav className="navbar">
                <Link href="/" className="nav-logo">
                    <span aria-hidden>🌸</span> BLOOM NFT
                </Link>
                <ul className="nav-links">
                    <li><Link href="/#office">Live Office</Link></li>
                    <li><Link href="/about" style={{ color: '#fff' }}>About</Link></li>
                    <li><Link href="/#gallery">Gallery</Link></li>
                </ul>
                <Link href="/" className="btn-secondary" style={{ fontSize: '13px', padding: '8px 20px', textDecoration: 'none' }}>
                    ← Home
                </Link>
            </nav>

            {/* ── HERO ── */}
            <div className="about-page-hero">
                <div className="hero-badge" style={{ animationDelay: '0s' }}>🌸 Our Story</div>
                <h1 className="hero-title" style={{ fontSize: 'clamp(36px,6vw,72px)', marginTop: '16px' }}>
                    <span className="line-1">The Studio</span>
                    <span className="line-2">Behind the Art</span>
                </h1>
                <p className="hero-sub" style={{ marginTop: '16px' }}>
                    BLOOM NFT was born from a single question: <em>what if creativity never sleeps?</em>{' '}
                    Six AI agents work around the clock to answer that question — one masterpiece at a time.
                </p>
            </div>

            {/* ── MISSION ── */}
            <section className="section" style={{ paddingTop: '40px' }}>
                <div className="about-mission-grid">
                    <div className="about-mission-text">
                        <div className="section-tag">Our Mission</div>
                        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '18px' }}>
                            Art made by machines,<br />loved by humans
                        </h2>
                        <p style={{ color: 'var(--text-sub)', fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
                            BLOOM NFT is a first-of-its-kind autonomous studio where every step — from concept to community — is handled entirely by AI. We don't have a human creative team. We have something better: six tireless agents that collaborate, iterate, and evolve with every drop.
                        </p>
                        <p style={{ color: 'var(--text-sub)', fontSize: '16px', lineHeight: '1.8' }}>
                            Our mission is to push the boundary of machine creativity and make the resulting art accessible, verifiable, and collectible by everyone.
                        </p>
                    </div>
                    <div className="about-mission-stats">
                        {[
                            { num: "6", label: "AI Agents", icon: "🤖" },
                            { num: "24/7", label: "Always Creating", icon: "⏰" },
                            { num: "∞", label: "Creative Ceiling", icon: "🔮" },
                            { num: "0", label: "Human Input", icon: "🤝" },
                        ].map(s => (
                            <div className="about-stat-box" key={s.label}>
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                                <div className="stat-num">{s.num}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="section" style={{ paddingTop: '0' }}>
                <div className="section-header">
                    <div className="section-tag">What We Stand For</div>
                    <h2 className="section-title">Our Core Principles</h2>
                    <div className="section-divider" />
                </div>
                <div className="about-features-grid">
                    {ABOUT_CARDS.map(c => (
                        <div className="about-card" key={c.title} style={{ borderColor: c.color + '22' }}>
                            <div className="about-card-icon">{c.icon}</div>
                            <div className="about-card-title" style={{ color: c.color }}>{c.title}</div>
                            <div className="about-card-text">{c.text}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PIPELINE ── */}
            <section className="section" style={{ paddingTop: '0' }}>
                <div className="section-header">
                    <div className="section-tag">How It Works</div>
                    <h2 className="section-title">The Art Pipeline</h2>
                    <p className="section-desc">From a spark of an idea to a minted NFT — fully automated.</p>
                    <div className="section-divider" />
                </div>
                <div className="pipeline-visual">
                    {PIPELINE.map((step, i) => (
                        <div className="pipeline-visual-step" key={step.label}>
                            <div className="pipeline-visual-num">
                                <span style={{ fontSize: '20px' }}>{step.emoji}</span>
                            </div>
                            {i < PIPELINE.length - 1 && <div className="pipeline-visual-line" />}
                            <div className="pipeline-visual-label">{step.label}</div>
                            <div className="pipeline-visual-desc">{step.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MEET THE AGENTS ── */}
            <section className="section" style={{ paddingTop: '0' }}>
                <div className="section-header">
                    <div className="section-tag">The Team</div>
                    <h2 className="section-title">Meet the Agents</h2>
                    <p className="section-desc">Six specialized AI agents, each with a distinct role in the creative process.</p>
                    <div className="section-divider" />
                </div>
                <div className="agents-about-grid">
                    {TEAM_AGENTS.map(agent => (
                        <div className="agent-about-card" key={agent.id} style={{ borderColor: agent.color + '33' }}>
                            <div className="agent-about-avatar-wrap" style={{ boxShadow: `0 0 30px ${agent.color}44`, background: agent.color + '11' }}>
                                <img
                                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${agent.seed}&backgroundColor=000000&glassesProbability=${agent.id === "Manager" ? 100 : 0}`}
                                    width="80"
                                    alt={agent.name}
                                    style={{ display: 'block', margin: '0 auto' }}
                                />
                            </div>
                            <div className="agent-about-badge" style={{ background: agent.color + '18', color: agent.color, border: `1px solid ${agent.color}44` }}>
                                {agent.emoji} {agent.role}
                            </div>
                            <div className="agent-about-name">{agent.name}</div>
                            <div className="agent-about-desc">{agent.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FOOTER CTA ── */}
            <section className="section" style={{ textAlign: 'center', paddingTop: '0' }}>
                <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '60px 40px', maxWidth: '700px', margin: '0 auto', backdropFilter: 'blur(12px)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
                    <h2 className="section-title" style={{ fontSize: 'clamp(24px,4vw,40px)', marginBottom: '16px' }}>Ready to Watch the Magic?</h2>
                    <p style={{ color: 'var(--text-sub)', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
                        Head back to the live office and watch the agents create art in real-time.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/#office" className="btn-primary" style={{ textDecoration: 'none' }}>🎨 Watch Live Office</Link>
                        <Link href="/#gallery" className="btn-secondary" style={{ textDecoration: 'none' }}>🖼️ View Gallery</Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="footer">
                <div className="footer-logo">🌸 BLOOM NFT</div>
                <p className="footer-tagline">The World's First Autonomous AI Art Studio</p>
                <p className="footer-powered">
                    Powered by 6 Autonomous Agents &nbsp;•&nbsp; CrewAI &nbsp;•&nbsp; Gemini &nbsp;•&nbsp; Hugging Face &nbsp;•&nbsp; Firebase
                </p>
            </footer>

            <style jsx>{`
        .about-page-hero {
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 130px 5vw 60px;
          position: relative;
          z-index: 1;
        }

        .about-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 1100px;
          margin: 0 auto;
          align-items: center;
        }

        .about-mission-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .about-stat-box {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 28px 20px;
          text-align: center;
          backdrop-filter: blur(12px);
          transition: transform .3s;
        }
        .about-stat-box:hover { transform: translateY(-4px); }

        .about-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .pipeline-visual {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        }

        .pipeline-visual-step {
          flex: 1;
          min-width: 160px;
          max-width: 220px;
          text-align: center;
          position: relative;
          padding: 0 10px;
        }

        .pipeline-visual-num {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--neon-pink), var(--neon-violet));
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          font-size: 24px;
          box-shadow: 0 0 24px rgba(255,0,170,.4);
        }

        .pipeline-visual-line {
          position: absolute;
          top: 32px;
          left: calc(50% + 32px);
          right: calc(-50% + 32px);
          height: 2px;
          background: linear-gradient(90deg, var(--neon-violet), transparent);
        }

        .pipeline-visual-label {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .pipeline-visual-desc {
          font-size: 13px;
          color: var(--text-sub);
          line-height: 1.6;
        }

        .agents-about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .agent-about-card {
          background: var(--bg-card);
          border: 1px solid;
          border-radius: 20px;
          padding: 28px 24px;
          text-align: center;
          transition: transform .3s, box-shadow .3s;
        }
        .agent-about-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 50px rgba(0,0,0,.4);
        }

        .agent-about-avatar-wrap {
          width: 96px; height: 96px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }

        .agent-about-badge {
          display: inline-block;
          font-size: 12px; font-weight: 700;
          letter-spacing: .5px; text-transform: uppercase;
          padding: 4px 14px; border-radius: 99px;
          margin-bottom: 10px;
        }

        .agent-about-name {
          font-size: 20px; font-weight: 800;
          color: #fff; margin-bottom: 8px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .agent-about-desc {
          font-size: 14px; color: var(--text-sub); line-height: 1.6;
        }

        @media (max-width: 768px) {
          .about-mission-grid { grid-template-columns: 1fr; }
          .pipeline-visual { gap: 20px; }
          .pipeline-visual-line { display: none; }
        }
      `}</style>
        </>
    );
}
