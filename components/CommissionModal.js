import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { database } from '../firebaseConfig';
import { ref, push } from 'firebase/database';

/* ── Treasury wallet — replace before going live ── */
const TREASURY = '0x55A4Da52B693DFB5A89A812cD56fd768828860A5';

const TIERS = [
    {
        id: 'budget',
        label: 'Budget Commission',
        price: '0.006',
        priceEth: 0.006,
        badge: '⚡ Fast Track',
        perks: ['Fast creation (24-48 hrs)', 'AI-generated 1/1 artwork', 'Minted to your wallet', 'Certificate of authenticity'],
        color: '#00f0ff',
    },
    {
        id: 'standard',
        label: 'Standard Commission',
        price: '0.009',
        priceEth: 0.009,
        badge: '👑 Priority VIP',
        perks: ['Priority creation (6-12 hrs)', 'Exclusive high-res 1/1', 'Full creation process video', 'Minted + all agent files', 'Direct Bloom Atelier contact'],
        color: '#ff6ec7',
        featured: true,
    },
];

export default function CommissionModal({ onClose }) {
    const { address } = useAccount();
    const [prompt, setPrompt] = useState('');
    const [selectedTier, setSelectedTier] = useState('standard');
    const [step, setStep] = useState('form'); // 'form' | 'confirming' | 'success'
    const [error, setError] = useState('');

    const tier = TIERS.find(t => t.id === selectedTier);

    const { sendTransaction, isPending } = useSendTransaction();

    const handlePay = async () => {
        if (!prompt.trim()) { setError('Please describe your dream NFT.'); return; }
        setError('');
        setStep('confirming');

        try {
            sendTransaction(
                {
                    to: TREASURY,
                    value: parseEther(tier.price),
                },
                {
                    onSuccess: async (hash) => {
                        /* Write commission to Firebase */
                        try {
                            await push(ref(database, 'commissions/pending'), {
                                prompt: prompt.trim(),
                                buyerAddress: address,
                                tier: tier.id,
                                amountPaid: tier.priceEth,
                                txHash: hash,
                                timestamp: Date.now(),
                                status: 'queued',
                            });
                        } catch (fbErr) {
                            console.error('Firebase write error:', fbErr);
                        }
                        setStep('success');
                    },
                    onError: (err) => {
                        setError(err.shortMessage || err.message || 'Transaction rejected.');
                        setStep('form');
                    },
                }
            );
        } catch (err) {
            setError(err.message || 'Something went wrong.');
            setStep('form');
        }
    };

    const handleSuccessClose = () => {
        onClose();
        setTimeout(() => {
            document.getElementById('office')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    return (
        <div className="cm-overlay" onClick={(e) => e.target === e.currentTarget && step !== 'confirming' && onClose()}>
            <div className="cm-panel">

                {/* ── Close ── */}
                {step !== 'confirming' && (
                    <button className="cm-close" onClick={onClose} aria-label="Close">✕</button>
                )}

                {/* ══ FORM STEP ══ */}
                {step === 'form' && (
                    <>
                        <div className="cm-header">
                            <div className="cm-tag">🌸 BLOOM AI ATELIER</div>
                            <h2 className="cm-title glitch-title" data-text="Commission the Atelier">
                                Commission the Atelier
                            </h2>
                            <p className="cm-sub">Your vision, brought to life by AI agents — autonomously, on-chain.</p>
                        </div>

                        {/* Wallet pill */}
                        <div className="cm-wallet-pill">
                            <span className="cm-wallet-dot" />
                            <span className="cm-wallet-addr">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                            <span className="cm-wallet-label">Connected</span>
                        </div>

                        {/* Prompt */}
                        <div className="cm-field">
                            <label className="cm-label">Describe your dream NFT</label>
                            <textarea
                                className="cm-textarea"
                                placeholder="e.g. A cyberpunk lotus flower blooming in a neon Tokyo rainstorm, ultra-detailed, glowing petals, 8K..."
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                rows={4}
                                maxLength={1000}
                            />
                            <div className="cm-char-count">{prompt.length}/1000</div>
                        </div>

                        {/* Tier cards */}
                        <div className="cm-tiers">
                            {TIERS.map(t => (
                                <div
                                    key={t.id}
                                    className={`cm-tier ${selectedTier === t.id ? 'selected' : ''} ${t.featured ? 'featured' : ''}`}
                                    style={{ '--tier-color': t.color }}
                                    onClick={() => setSelectedTier(t.id)}
                                >
                                    {t.featured && <div className="cm-tier-ribbon">MOST POPULAR</div>}
                                    <div className="cm-tier-badge">{t.badge}</div>
                                    <div className="cm-tier-name">{t.label}</div>
                                    <div className="cm-tier-price">
                                        <span className="cm-tier-eth">◈ {t.price}</span>
                                        <span className="cm-tier-unit">ETH</span>
                                    </div>
                                    <ul className="cm-tier-perks">
                                        {t.perks.map(p => <li key={p}>▹ {p}</li>)}
                                    </ul>
                                    <div className={`cm-tier-check ${selectedTier === t.id ? 'active' : ''}`}>
                                        {selectedTier === t.id ? '✓ Selected' : 'Select'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {error && <div className="cm-error">⚠ {error}</div>}

                        <button
                            className="cm-pay-btn btn-glow"
                            onClick={handlePay}
                            disabled={isPending}
                        >
                            🚀 Pay ◈ {tier.price} ETH & Start Creation
                        </button>

                        <p className="cm-disclaimer">
                            Payment goes directly to the BLOOM treasury on Base. Your commission enters the autonomous queue immediately.
                        </p>
                    </>
                )}

                {/* ══ CONFIRMING STEP ══ */}
                {step === 'confirming' && (
                    <div className="cm-confirming">
                        <div className="cm-spinner" />
                        <h3 className="cm-confirming-title glitch-title" data-text="Confirming on Base...">
                            Confirming on Base...
                        </h3>
                        <p className="cm-confirming-sub">
                            Please confirm the transaction in your wallet.<br />
                            Do not close this window.
                        </p>
                        <div className="cm-chain-badge">⬡ Base Network</div>
                    </div>
                )}

                {/* ══ SUCCESS STEP ══ */}
                {step === 'success' && (
                    <div className="cm-success">
                        <div className="cm-success-icon">🌸</div>
                        <h3 className="cm-success-title">Commission Live!</h3>
                        <p className="cm-success-msg">
                            Payment confirmed on Base. Your commission is now{' '}
                            <strong style={{ color: '#ff6ec7' }}>LIVE in the Office</strong>.
                            <br /><br />
                            The agents have been notified and will begin creating your masterpiece.
                        </p>
                        <div className="cm-success-detail">
                            <span>Tier: <strong>{tier.label}</strong></span>
                            <span>Paid: <strong>◈ {tier.price} ETH</strong></span>
                        </div>
                        <button className="cm-pay-btn btn-glow" onClick={handleSuccessClose}>
                            🎨 Watch Agents Work Live
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
