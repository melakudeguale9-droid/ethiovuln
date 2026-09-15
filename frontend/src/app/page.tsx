// EthioVuln — Stunning Landing / Hero Page

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [vulnCount, setVulnCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Animated counter effect
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setScanCount(Math.round(12847 * eased));
      setVulnCount(Math.round(48293 * eased));
      setTargetCount(Math.round(3256 * eased));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: '⬡',
      title: 'Nuclei Engine',
      desc: 'Template-based vulnerability detection with 8,000+ community templates for comprehensive coverage.',
      color: '#00ff88',
    },
    {
      icon: '◉',
      title: 'OWASP ZAP',
      desc: 'Automated spidering and active scanning powered by the industry-standard ZAP engine.',
      color: '#0088ff',
    },
    {
      icon: '◈',
      title: 'Smart Fuzzer',
      desc: 'Multi-threaded directory and sensitive file discovery with intelligent severity classification.',
      color: '#8b5cf6',
    },
    {
      icon: '◧',
      title: 'PDF Reports',
      desc: 'Professional executive summary reports with CVSS v3.1 scores and CWE mappings.',
      color: '#00d4ff',
    },
    {
      icon: '◆',
      title: 'Real-time Streaming',
      desc: 'WebSocket-powered live scan logs, progress bars, and vulnerability findings as they happen.',
      color: '#FFB020',
    },
    {
      icon: '⬢',
      title: 'SSRF Protection',
      desc: 'Three-tier target verification with DNS resolution checks and private IP blocking.',
      color: '#ff3366',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* ─── Navigation ───────────────────────────────────────────── */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00ff88, #0088ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#0a0e1a', fontSize: 16
          }}>E</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>EthioVuln</span>
        </div>
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: 14, fontWeight: 700, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#00ff88'} onMouseOut={e => e.currentTarget.style.color = '#f1f5f9'}>Home</Link>
          <Link href="/dashboard/scans/new" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: 14, fontWeight: 700, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#00ff88'} onMouseOut={e => e.currentTarget.style.color = '#f1f5f9'}>Scan</Link>
          <Link href="/about" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: 14, fontWeight: 700, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#00ff88'} onMouseOut={e => e.currentTarget.style.color = '#f1f5f9'}>About</Link>
          <Link href="/login" className="btn-glow btn-glow-green" style={{ padding: '8px 20px', fontSize: 14, textDecoration: 'none' }}>Login</Link>
        </nav>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: 0,
        }} />
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.8) 60%, #0a0e1a 100%)',
          zIndex: 1,
        }} />

        {/* Floating Particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          {mounted && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: (i % 3) + 2,
              height: (i % 3) + 2,
              borderRadius: '50%',
              background: ['#00ff88', '#0088ff', '#00d4ff', '#8b5cf6'][i % 4],
              opacity: 0.2 + (i % 5) * 0.08,
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 13 + 10) % 100}%`,
              animation: `float${i % 3} ${8 + (i % 5) * 2}s ease-in-out infinite`,
              animationDelay: `${(i % 5) * 0.8}s`,
            }} />
          ))}
        </div>

        {/* Moving Hacker Characters */}
        {mounted && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
            {/* 🥷 HUNTER - walks left to right, large */}
            <div style={{ position: 'absolute', bottom: '12%', animation: 'hackerWalk1 20s linear infinite' }}>
              <div style={{ fontSize: 72, filter: 'drop-shadow(0 0 18px #00ff88)', animation: 'bounce 0.5s ease-in-out infinite alternate' }}>🥷</div>
              <div style={{ fontSize: 11, color: '#00ff88', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}>HUNTER</div>
              <div style={{ fontSize: 9, color: '#00ff8880', fontFamily: 'monospace', textAlign: 'center' }}>scanning...</div>
            </div>

            {/* 👾 ATTACKER - walks right to left, large */}
            <div style={{ position: 'absolute', bottom: '18%', animation: 'hackerWalk2 16s linear infinite' }}>
              <div style={{ fontSize: 68, filter: 'drop-shadow(0 0 18px #ff4444)', animation: 'shake 0.3s ease-in-out infinite alternate' }}>👾</div>
              <div style={{ fontSize: 11, color: '#ff4444', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}>ATTACKER</div>
              <div style={{ fontSize: 9, color: '#ff444480', fontFamily: 'monospace', textAlign: 'center' }}>injecting...</div>
            </div>

            {/* 🛡️ DEFENDER - patrols right to left */}
            <div style={{ position: 'absolute', bottom: '28%', animation: 'hackerWalk6 24s linear infinite' }}>
              <div style={{ fontSize: 64, filter: 'drop-shadow(0 0 20px #00d4ff)', animation: 'pulse 1s ease-in-out infinite' }}>🛡️</div>
              <div style={{ fontSize: 11, color: '#00d4ff', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}>DEFENDER</div>
              <div style={{ fontSize: 9, color: '#00d4ff80', fontFamily: 'monospace', textAlign: 'center' }}>blocking...</div>
            </div>

            {/* 🕵️ RECON - sneaks left to right */}
            <div style={{ position: 'absolute', bottom: '6%', animation: 'hackerWalk3 30s linear infinite' }}>
              <div style={{ fontSize: 60, filter: 'drop-shadow(0 0 14px #FFB020)', animation: 'sneak 1s ease-in-out infinite alternate' }}>🕵️</div>
              <div style={{ fontSize: 11, color: '#FFB020', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}>RECON</div>
              <div style={{ fontSize: 9, color: '#FFB02080', fontFamily: 'monospace', textAlign: 'center' }}>enumerating...</div>
            </div>

            {/* 💀 EXPLOIT - fast right to left */}
            <div style={{ position: 'absolute', bottom: '38%', animation: 'hackerWalk4 11s linear infinite' }}>
              <div style={{ fontSize: 56, filter: 'drop-shadow(0 0 16px #ff0040)', animation: 'shake 0.2s ease-in-out infinite alternate' }}>💀</div>
              <div style={{ fontSize: 11, color: '#ff0040', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}>EXPLOIT</div>
              <div style={{ fontSize: 9, color: '#ff004080', fontFamily: 'monospace', textAlign: 'center' }}>pwning...</div>
            </div>

            {/* 🤖 BOT - slow left to right */}
            <div style={{ position: 'absolute', bottom: '48%', animation: 'hackerWalk5 35s linear infinite' }}>
              <div style={{ fontSize: 52, filter: 'drop-shadow(0 0 14px #8b5cf6)', animation: 'bounce 0.8s ease-in-out infinite alternate' }}>🤖</div>
              <div style={{ fontSize: 11, color: '#8b5cf6', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}>BOT</div>
              <div style={{ fontSize: 9, color: '#8b5cf680', fontFamily: 'monospace', textAlign: 'center' }}>fuzzing...</div>
            </div>

            {/* 🔫 SNIPER - fast right to left high */}
            <div style={{ position: 'absolute', bottom: '55%', animation: 'hackerWalk2 13s linear infinite 3s' }}>
              <div style={{ fontSize: 50, filter: 'drop-shadow(0 0 12px #00ff88)' }}>🎯</div>
              <div style={{ fontSize: 11, color: '#00ff88', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, letterSpacing: 2 }}>SCANNER</div>
              <div style={{ fontSize: 9, color: '#00ff8880', fontFamily: 'monospace', textAlign: 'center' }}>probing...</div>
            </div>

            {/* ⚔️ FIGHT SCENE - center battle */}
            <div style={{ position: 'absolute', bottom: '22%', left: '45%', animation: 'fightBob 0.4s ease-in-out infinite alternate' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                <div style={{ fontSize: 56, filter: 'drop-shadow(0 0 20px #00ff88)', transform: 'scaleX(1)' }}>🥷</div>
                <div style={{ fontSize: 36, animation: 'fightSpark 0.3s ease-in-out infinite alternate' }}>⚔️</div>
                <div style={{ fontSize: 56, filter: 'drop-shadow(0 0 20px #ff4444)', transform: 'scaleX(-1)' }}>👾</div>
              </div>
              <div style={{ textAlign: 'center', fontSize: 10, color: '#FFB020', fontFamily: 'monospace', fontWeight: 700, animation: 'blink 0.5s infinite' }}>
                ⚡ BATTLE ⚡
              </div>
            </div>

            {/* 💥 Explosion effects */}
            <div style={{ position: 'absolute', bottom: '30%', left: '42%', animation: 'explode 2s ease-in-out infinite' }}>
              <div style={{ fontSize: 40 }}>💥</div>
            </div>
            <div style={{ position: 'absolute', bottom: '25%', left: '52%', animation: 'explode 2s ease-in-out infinite 1s' }}>
              <div style={{ fontSize: 32 }}>✨</div>
            </div>

            {/* Floating vulnerability labels */}
            {[
              { label: 'SQLi', color: '#ff4444' },
              { label: 'XSS', color: '#FFB020' },
              { label: 'RCE', color: '#ff0040' },
              { label: 'SSRF', color: '#8b5cf6' },
              { label: 'LFI', color: '#0088ff' },
              { label: 'IDOR', color: '#00ff88' },
              { label: 'XXE', color: '#00d4ff' },
              { label: 'CSRF', color: '#FFB020' },
              { label: 'SSTI', color: '#ff4444' },
              { label: 'CORS', color: '#8b5cf6' },
            ].map((vuln, i) => (
              <div key={vuln.label} style={{
                position: 'absolute',
                left: `${5 + i * 9.5}%`,
                top: `${8 + (i % 4) * 8}%`,
                animation: `codeFloat${i % 3} ${5 + i * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace',
                  background: 'rgba(0,0,0,0.7)', border: `1px solid ${vuln.color}50`,
                  color: vuln.color, fontWeight: 800, letterSpacing: 1,
                  boxShadow: `0 0 10px ${vuln.color}30`,
                }}>{vuln.label}</div>
              </div>
            ))}

            {/* Laser beams between fighters */}
            <div style={{
              position: 'absolute', bottom: '26%', left: '35%',
              width: '8%', height: 2,
              background: 'linear-gradient(90deg, #00ff88, transparent)',
              animation: 'laserShoot 1s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', bottom: '26%', right: '35%',
              width: '8%', height: 2,
              background: 'linear-gradient(270deg, #ff4444, transparent)',
              animation: 'laserShoot 1s ease-in-out infinite 0.5s',
            }} />
          </div>
        )}

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: 900,
          padding: '0 24px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Shield Icon */}
          <div style={{
            width: 100,
            height: 100,
            margin: '0 auto 24px',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(0,255,136,0.2)',
          }}>
            <img src="/shield-icon.png" alt="DAST Shield" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }} />
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 9999,
            border: '1px solid rgba(0,255,136,0.3)',
            background: 'rgba(0,255,136,0.05)',
            fontSize: 12,
            fontWeight: 600,
            color: '#00ff88',
            marginBottom: 24,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', animation: 'pulse 2s infinite' }} />
            Enterprise-Grade Security Testing Platform
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Dynamic Application
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #0088ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Security Testing
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#94a3b8',
            maxWidth: 640,
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            Orchestrate <span style={{ color: '#00ff88', fontWeight: 600 }}>Nuclei</span>,{' '}
            <span style={{ color: '#0088ff', fontWeight: 600 }}>OWASP ZAP</span>, and custom{' '}
            <span style={{ color: '#8b5cf6', fontWeight: 600 }}>fuzzing engines</span> from a single
            unified dashboard with real-time vulnerability streaming.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link href="/register" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '16px 36px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              color: '#0a0e1a',
              fontWeight: 700,
              fontSize: 16,
              textDecoration: 'none',
              transition: 'all 0.3s',
              boxShadow: '0 0 30px rgba(0,255,136,0.2)',
            }}>
              Get Started Free →
            </Link>
            <Link href="/login" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '16px 36px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(148,163,184,0.2)',
              color: '#f1f5f9',
              fontWeight: 600,
              fontSize: 16,
              textDecoration: 'none',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)',
            }}>
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            flexWrap: 'wrap',
          }}>
            {[
              { value: scanCount.toLocaleString(), label: 'Scans Executed', color: '#00ff88' },
              { value: vulnCount.toLocaleString(), label: 'Vulns Detected', color: '#ff3366' },
              { value: targetCount.toLocaleString(), label: 'Targets Secured', color: '#0088ff' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}+
                </div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          animation: 'bounce 2s infinite',
        }}>
          <div style={{
            width: 28,
            height: 44,
            borderRadius: 14,
            border: '2px solid rgba(148,163,184,0.3)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 8,
          }}>
            <div style={{
              width: 3,
              height: 10,
              borderRadius: 2,
              background: '#00ff88',
              animation: 'scrollDot 2s infinite',
            }} />
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────── */}
      <section style={{
        padding: '100px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            marginBottom: 16,
          }}>
            <span className="text-gradient">Powered by Industry-Leading</span>
            <br />
            <span style={{ color: '#f1f5f9' }}>Security Engines</span>
          </h2>
          <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, margin: '0 auto' }}>
            Combine multiple scanning methodologies into a single orchestrated workflow
            with real-time results streaming.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {features.map((feat, i) => (
            <div key={i} className="glass-card" style={{
              padding: 28,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
              cursor: 'default',
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${feat.color}12`,
                border: `1px solid ${feat.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 16,
                color: feat.color,
              }}>
                {feat.icon}
              </div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#f1f5f9',
                marginBottom: 8,
              }}>
                {feat.title}
              </h3>
              <p style={{
                fontSize: 14,
                color: '#64748b',
                lineHeight: 1.7,
              }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div className="glass-card" style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '60px 40px',
          borderColor: 'rgba(0,255,136,0.15)',
          background: 'linear-gradient(135deg, rgba(0,255,136,0.03), rgba(0,136,255,0.03))',
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: '#f1f5f9' }}>
            Ready to Secure Your Applications?
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Start scanning in under 60 seconds. No credit card required.
          </p>
          <Link href="/register" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '16px 40px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
            color: '#0a0e1a',
            fontWeight: 700,
            fontSize: 16,
            textDecoration: 'none',
            boxShadow: '0 0 40px rgba(0,255,136,0.25)',
          }}>
            Launch Your First Scan →
          </Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        padding: '60px 48px 30px',
        borderTop: '1px solid rgba(148,163,184,0.1)',
        background: 'rgba(10,14,26,0.8)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 40, marginBottom: 40 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #00ff88, #0088ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#0a0e1a', fontSize: 16
              }}>E</div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>EthioVuln</span>
            </div>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              Enterprise-grade dynamic application security testing platform. Orchestrate state-of-the-art vulnerability scanning tools from a single dashboard.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 60 }}>
            <div>
              <h4 style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 16 }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link href="/dashboard/scans/new" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Security Scans</Link>
                <Link href="/dashboard/reports" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Vulnerability Reports</Link>
                <Link href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>API Integration</Link>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 16 }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Terms of Service</Link>
                <Link href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Privacy Policy</Link>
                <Link href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Security Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            © 2026 EthioVuln. Built for authorized security professionals.
          </p>
          <p style={{ fontSize: 14, color: '#00ff88', fontWeight: 600 }}>
            Built by Melaku Deguale
          </p>
        </div>
      </footer>

      {/* ─── Animations ───────────────────────────────────────────── */}
      <style jsx>{`
        @keyframes float0 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(15px); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes bounce {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
        @keyframes shake {
          0% { transform: translateX(0px) rotate(0deg); }
          100% { transform: translateX(4px) rotate(5deg); }
        }
        @keyframes sneak {
          0% { transform: translateY(0px) scaleY(1); }
          100% { transform: translateY(-6px) scaleY(0.9); }
        }
        @keyframes fightBob {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-6px) scale(1.05); }
        }
        @keyframes fightSpark {
          0% { transform: rotate(-20deg) scale(1); opacity: 1; }
          100% { transform: rotate(20deg) scale(1.3); opacity: 0.7; }
        }
        @keyframes explode {
          0%, 100% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes laserShoot {
          0%, 100% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes scrollDot {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 20px #00d4ff); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 8px #00d4ff); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes hackerWalk1 {
          0% { left: -100px; }
          100% { left: 110%; }
        }
        @keyframes hackerWalk2 {
          0% { right: -100px; left: auto; }
          100% { right: 110%; left: auto; }
        }
        @keyframes hackerWalk3 {
          0% { left: -80px; }
          100% { left: 110%; }
        }
        @keyframes hackerWalk4 {
          0% { right: -80px; left: auto; }
          100% { right: 110%; left: auto; }
        }
        @keyframes hackerWalk5 {
          0% { left: -80px; }
          100% { left: 110%; }
        }
        @keyframes hackerWalk6 {
          0% { right: -80px; left: auto; }
          100% { right: 110%; left: auto; }
        }
        @keyframes codeFloat0 {
          0%, 100% { transform: translateY(0px); opacity: 0.8; }
          50% { transform: translateY(-18px); opacity: 1; }
        }
        @keyframes codeFloat1 {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(14px); opacity: 1; }
        }
        @keyframes codeFloat2 {
          0%, 100% { transform: translateY(0px); opacity: 0.7; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
