import { useEffect, useRef } from 'react';

/**
 * PollenCanvas – Bioluminescent Void upgrade.
 *
 * Changes:
 *  • Standard particles: unchanged sakura/purple/cyan drift
 *  • NEW "Bokeh Bloom" layer: 6 large, very blurred orbs that slowly drift
 *    and subtly warp toward the mouse cursor
 */

const COLORS = ['#FF2E93', '#ff6ec7', '#7C3AED', '#9d5cf5', '#00f0ff'];
const COUNT = 60;

// Bokeh blob colours — low-saturation, bioluminescent
const BOKEH_COLORS = [
    'rgba(255, 46, 147, 0.045)',
    'rgba(124, 58, 237, 0.04)',
    'rgba(0, 240, 255, 0.035)',
    'rgba(255, 110, 199, 0.04)',
    'rgba(100, 0, 255, 0.03)',
    'rgba(0, 200, 255, 0.03)',
];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function createParticle(w, h) {
    return {
        x: randomBetween(0, w),
        y: randomBetween(h * 0.2, h + 20),
        radius: randomBetween(1, 4),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedY: randomBetween(0.2, 0.75),
        speedX: randomBetween(-0.15, 0.15),
        sineAmp: randomBetween(0.4, 1.2),
        sineFreq: randomBetween(0.005, 0.015),
        phase: Math.random() * Math.PI * 2,
        opacity: 0,
        maxOpacity: randomBetween(0.25, 0.6),
        fadeSpeed: randomBetween(0.004, 0.012),
        lifetime: 0,
        maxLifetime: randomBetween(200, 600),
    };
}

function createBokeh(w, h, i) {
    return {
        x: randomBetween(w * 0.05, w * 0.95),
        y: randomBetween(h * 0.05, h * 0.95),
        radius: randomBetween(160, 340),
        color: BOKEH_COLORS[i % BOKEH_COLORS.length],
        vx: randomBetween(-0.12, 0.12),
        vy: randomBetween(-0.08, 0.08),
    };
}

export default function PollenCanvas() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];
        let bokehBlobs = [];
        let frame = 0;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = Array.from({ length: COUNT }, () =>
                createParticle(canvas.width, canvas.height)
            );
            bokehBlobs = Array.from({ length: 6 }, (_, i) =>
                createBokeh(canvas.width, canvas.height, i)
            );
        }

        function tick() {
            if (document.hidden) { animId = requestAnimationFrame(tick); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // ── Bokeh Bloom layer ──────────────────────────────────────────
            bokehBlobs.forEach(b => {
                // Gentle mouse attraction (very subtle)
                const dx = mx - b.x;
                const dy = my - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                b.vx += (dx / dist) * 0.0015;
                b.vy += (dy / dist) * 0.0015;

                // Dampen
                b.vx *= 0.98;
                b.vy *= 0.98;
                b.x += b.vx;
                b.y += b.vy;

                // Bounce off edges
                if (b.x < -b.radius) b.x = canvas.width + b.radius;
                if (b.x > canvas.width + b.radius) b.x = -b.radius;
                if (b.y < -b.radius) b.y = canvas.height + b.radius;
                if (b.y > canvas.height + b.radius) b.y = -b.radius;

                ctx.save();
                ctx.filter = `blur(${Math.round(b.radius * 0.55)}px)`;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.fill();
                ctx.restore();
            });

            // ── Standard pollen particles ──────────────────────────────────
            particles.forEach((p, i) => {
                p.lifetime++;
                p.x += p.speedX + p.sineAmp * Math.sin(frame * p.sineFreq + p.phase);
                p.y -= p.speedY;

                if (p.opacity < p.maxOpacity) p.opacity = Math.min(p.opacity + p.fadeSpeed, p.maxOpacity);
                if (p.lifetime > p.maxLifetime * 0.7) p.opacity = Math.max(p.opacity - p.fadeSpeed, 0);

                if (p.y < -10 || (p.lifetime > p.maxLifetime && p.opacity <= 0)) {
                    particles[i] = createParticle(canvas.width, canvas.height);
                    particles[i].y = canvas.height + 10;
                    return;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();

                if (p.radius >= 2.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
                    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
                    grd.addColorStop(0, p.color + '55');
                    grd.addColorStop(1, p.color + '00');
                    ctx.fillStyle = grd;
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            });

            animId = requestAnimationFrame(tick);
        }

        function onMouseMove(e) {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        }

        resize();
        tick();

        const ro = new ResizeObserver(resize);
        ro.observe(document.body);
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                willChange: 'transform',
            }}
        />
    );
}
