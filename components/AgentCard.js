import React from 'react';

/**
 * AgentCard – Bioluminescent Void upgrade.
 *
 * Changes:
 *  • Glassmorphism speech bubbles with frosted-glass + colored border glow
 *  • Stronger heartbeat "pulse ring" around active avatars
 *  • Sleeping state uses heavier desaturation + dim
 */
export default function AgentCard({ agent, status, isSystemAwake, index }) {
    const isActive =
        isSystemAwake &&
        status.action !== 'Sleeping' &&
        !status.action.toLowerCase().includes('offline');

    const floatDelay = `${(index * 0.45).toFixed(2)}s`;

    return (
        <div
            className={`agent-pin agent-float ${isActive ? 'agent-pin--active' : 'agent-pin--sleeping'}`}
            style={{
                top: agent.position.top,
                left: agent.position.left,
                zIndex: 2,
                animationDelay: floatDelay,
                '--agent-color': agent.color,
            }}
        >
            {/* ── Speech bubble (active only) ── */}
            {isActive && (
                <div className="speech-bubble" style={{ '--bubble-color': agent.color }}>
                    <div className="bubble-action" style={{ color: agent.color }}>
                        {status.action}
                    </div>
                    <div className="bubble-msg">{status.message}</div>
                </div>
            )}

            {/* ── Pulse ring on active agents ── */}
            {isActive && (
                <span
                    className="agent-pulse-ring"
                    style={{ '--agent-color': agent.color }}
                />
            )}

            {/* ── Avatar ── */}
            <img
                className={`agent-avatar ${isActive ? 'active' : 'sleeping'}`}
                style={{
                    filter: isActive
                        ? `drop-shadow(0 0 14px ${agent.color}) drop-shadow(0 0 28px ${agent.color}88)`
                        : 'grayscale(0.75) brightness(0.4)',
                }}
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${agent.seed}&backgroundColor=000000&glassesProbability=${agent.id === 'Manager' ? 100 : 0}`}
                alt={agent.name}
            />

            {/* ── Heartbeat dot ── */}
            {isActive && (
                <span
                    className="agent-heartbeat-dot"
                    style={{ background: agent.color, boxShadow: `0 0 10px ${agent.color}, 0 0 20px ${agent.color}66` }}
                />
            )}

            {/* ── Role badge ── */}
            <span
                className="agent-badge"
                style={{
                    background: agent.color + '1a',
                    color: agent.color,
                    border: `1px solid ${agent.color}55`,
                    textShadow: `0 0 8px ${agent.color}88`,
                }}
            >
                {agent.emoji} {agent.role}
            </span>

            {/* ── Name ── */}
            <div className="agent-name">{agent.name}</div>
        </div>
    );
}
