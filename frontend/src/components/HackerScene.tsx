'use client';

// Stable deterministic positions - no Math.random() to avoid hydration errors
const CHARACTERS = [
  { emoji: '🥷', label: 'HUNTER',   sub: 'scanning...',     color: '#00ff88', size: 56, bottom: '10%', anim: 'hw1', dur: '22s', delay: '0s',   bobAnim: 'hBounce', bobDur: '0.6s' },
  { emoji: '👾', label: 'ATTACKER', sub: 'injecting...',    color: '#ff4444', size: 52, bottom: '18%', anim: 'hw2', dur: '17s', delay: '0s',   bobAnim: 'hShake',  bobDur: '0.35s' },
  { emoji: '🛡️', label: 'DEFENDER', sub: 'blocking...',     color: '#00d4ff', size: 50, bottom: '28%', anim: 'hw6', dur: '26s', delay: '2s',   bobAnim: 'hPulse',  bobDur: '1.2s' },
  { emoji: '🕵️', label: 'RECON',    sub: 'enumerating...', color: '#FFB020', size: 46, bottom: '5%',  anim: 'hw3', dur: '32s', delay: '4s',   bobAnim: 'hSneak',  bobDur: '1s' },
  { emoji: '💀', label: 'EXPLOIT',  sub: 'pwning...',       color: '#ff0040', size: 44, bottom: '38%', anim: 'hw4', dur: '12s', delay: '1s',   bobAnim: 'hShake',  bobDur: '0.2s' },
  { emoji: '🤖', label: 'BOT',      sub: 'fuzzing...',      color: '#8b5cf6', size: 42, bottom: '48%', anim: 'hw5', dur: '38s', delay: '6s',   bobAnim: 'hBounce', bobDur: '0.9s' },
  { emoji: '🎯', label: 'SCANNER',  sub: 'probing...',      color: '#00ff88', size: 40, bottom: '55%', anim: 'hw2', dur: '14s', delay: '8s',   bobAnim: 'hBounce', bobDur: '0.7s' },
];

const VULNS = [
  { label: 'SQLi',  color: '#ff4444', left: '3%',  top: '12%', anim: 'hCode0', dur: '5s',   delay: '0s' },
  { label: 'XSS',   color: '#FFB020', left: '12%', top: '8%',  anim: 'hCode1', dur: '6s',   delay: '0.5s' },
  { label: 'RCE',   color: '#ff0040', left: '22%', top: '15%', anim: 'hCode2', dur: '4.5s', delay: '1s' },
  { label: 'SSRF',  color: '#8b5cf6', left: '32%', top: '9%',  anim: 'hCode0', dur: '7s',   delay: '1.5s' },
  { label: 'LFI',   color: '#0088ff', left: '55%', top: '11%', anim: 'hCode1', dur: '5.5s', delay: '0.3s' },
  { label: 'IDOR',  color: '#00ff88', left: '65%', top: '7%',  anim: 'hCode2', dur: '6.5s', delay: '0.8s' },
  { label: 'XXE',   color: '#00d4ff', left: '75%', top: '13%', anim: 'hCode0', dur: '5s',   delay: '1.2s' },
  { label: 'CSRF',  color: '#FFB020', left: '85%', top: '9%',  anim: 'hCode1', dur: '7s',   delay: '0.6s' },
  { label: 'SSTI',  color: '#ff4444', left: '92%', top: '15%', anim: 'hCode2', dur: '4s',   delay: '1.8s' },
  { label: 'CORS',  color: '#8b5cf6', left: '7%',  top: '20%', anim: 'hCode0', dur: '6s',   delay: '2s' },
];

export default function HackerScene() {
  return (
    <>
      <style>{`
        @keyframes hw1 { 0% { left: -100px; } 100% { left: 110vw; } }
        @keyframes hw2 { 0% { right: -100px; } 100% { right: 110vw; } }
        @keyframes hw3 { 0% { left: -80px; } 100% { left: 110vw; } }
        @keyframes hw4 { 0% { right: -80px; } 100% { right: 110vw; } }
        @keyframes hw5 { 0% { left: -80px; } 100% { left: 110vw; } }
        @keyframes hw6 { 0% { right: -80px; } 100% { right: 110vw; } }
        @keyframes hBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes hShake  { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
        @keyframes hPulse  { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        @keyframes hSneak  { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.88); } }
        @keyframes hFight  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes hSpark  { 0%,100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
        @keyframes hExplode { 0%,100% { transform: scale(0.8); opacity:0.5; } 50% { transform: scale(1.4); opacity:1; } }
        @keyframes hBlink  { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes hCode0  { 0%,100% { transform: translateY(0); opacity:0.8; } 50% { transform: translateY(-14px); opacity:1; } }
        @keyframes hCode1  { 0%,100% { transform: translateY(0); opacity:0.6; } 50% { transform: translateY(10px); opacity:1; } }
        @keyframes hCode2  { 0%,100% { transform: translateY(0); opacity:0.7; } 50% { transform: translateY(-8px); opacity:1; } }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>

        {/* Walking characters */}
        {CHARACTERS.map((c, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: c.bottom,
            animation: `${c.anim} ${c.dur} linear infinite`,
            animationDelay: c.delay,
            willChange: 'left, right',
          }}>
            <div style={{
              fontSize: c.size,
              filter: `drop-shadow(0 0 8px ${c.color})`,
              animation: `${c.bobAnim} ${c.bobDur} ease-in-out infinite`,
            }}>{c.emoji}</div>
            <div style={{ fontSize: 9, color: c.color, fontFamily: 'monospace', textAlign: 'center', fontWeight: 700 }}>{c.label}</div>
          </div>
        ))}

        {/* Battle scene */}
        <div style={{ position: 'absolute', bottom: '14%', left: '44%', animation: 'hFight 0.5s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            <div style={{ fontSize: 48, filter: 'drop-shadow(0 0 16px #00ff88)' }}>🥷</div>
            <div style={{ fontSize: 28, animation: 'hSpark 0.3s ease-in-out infinite' }}>⚔️</div>
            <div style={{ fontSize: 48, filter: 'drop-shadow(0 0 16px #ff4444)', transform: 'scaleX(-1)' }}>👾</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 9, color: '#FFB020', fontFamily: 'monospace', fontWeight: 700, animation: 'hBlink 0.5s infinite' }}>
            ⚡ BATTLE ⚡
          </div>
        </div>

        {/* Explosions */}
        <div style={{ position: 'absolute', bottom: '20%', left: '41%', animation: 'hExplode 1.8s ease-in-out infinite' }}>💥</div>
        <div style={{ position: 'absolute', bottom: '16%', left: '51%', animation: 'hExplode 2s ease-in-out infinite 0.9s' }}>✨</div>

        {/* Floating vuln labels */}
        {VULNS.map((v) => (
          <div key={v.label} style={{
            position: 'absolute', left: v.left, top: v.top,
            animation: `${v.anim} ${v.dur} ease-in-out infinite`,
            animationDelay: v.delay,
          }}>
            <div style={{
              padding: '3px 8px', borderRadius: 5, fontSize: 10,
              fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1,
              background: 'rgba(0,0,0,0.6)', border: `1px solid ${v.color}40`,
              color: v.color,
            }}>{v.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
