// EthioVuln — About Page

'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* ─── Navigation ───────────────────────────────────────────── */}
      <header style={{
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        background: 'rgba(10,14,26,0.3)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
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
          <Link href="/about" style={{ color: '#00ff88', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>About</Link>
          <Link href="/login" className="btn-glow btn-glow-green" style={{ padding: '8px 20px', fontSize: 14, textDecoration: 'none' }}>Login</Link>
        </nav>
      </header>

      {/* ─── Hero Banner with Background Image ────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: 340,
        display: 'flex',
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
          opacity: 0.35,
          zIndex: 0,
        }} />
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,14,26,0.2) 0%, rgba(10,14,26,0.7) 60%, #0a0e1a 100%)',
          zIndex: 1,
        }} />

        {/* Floating Particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: (i % 3) + 2,
              height: (i % 3) + 2,
              borderRadius: '50%',
              background: ['#00ff88', '#0088ff', '#00d4ff', '#8b5cf6'][i % 4],
              opacity: 0.2 + (i % 5) * 0.06,
              left: `${(i * 19 + 7) % 100}%`,
              top: `${(i * 11 + 8) % 100}%`,
              animation: `aboutFloat${i % 3} ${8 + (i % 4) * 3}s ease-in-out infinite`,
              animationDelay: `${(i % 5) * 1}s`,
            }} />
          ))}
        </div>

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '60px 24px',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Shield Icon */}
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 0 50px rgba(0,255,136,0.2)',
          }}>
            <img src="/shield-icon.png" alt="DAST Shield" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }} />
          </div>

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
            marginBottom: 16,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', animation: 'aboutPulse 2s infinite' }} />
            About the Developer
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Meet the{' '}
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #0088ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Security Researcher
            </span>
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
            Building the next generation of automated vulnerability detection tools.
          </p>
        </div>
      </section>

      {/* ─── About Section ────────────────────────────────────────── */}
      <section style={{
        padding: '60px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div className="glass-card" style={{
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}>
          {/* Profile Header with Large Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{
              width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
              border: '3px solid rgba(0,255,136,0.3)',
              boxShadow: '0 0 40px rgba(0,255,136,0.15), 0 0 80px rgba(0,136,255,0.08)',
              flexShrink: 0,
              position: 'relative',
            }}>
              {/* Profile photo */}
              <img src="/profile.png" alt="Melaku Deguale" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Animated ring */}
              <div style={{
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: '#00ff88',
                borderRightColor: '#0088ff',
                animation: 'aboutSpin 4s linear infinite',
              }} />
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, marginBottom: 8, color: '#f1f5f9' }}>
                 Melaku Deguale | <span className="text-gradient">Professional Bio</span>
              </h2>
              <p style={{ fontSize: 18, color: '#00ff88', fontWeight: 600, marginBottom: 4 }}>Ethical Hacker & Security Researcher</p>
              <p style={{ fontSize: 16, color: '#94a3b8' }}>Certified Security Researcher & Consultant</p>
              {/* Status badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 12,
                padding: '4px 14px',
                borderRadius: 9999,
                background: 'rgba(0,255,136,0.08)',
                border: '1px solid rgba(0,255,136,0.2)',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#00ff88',
                  animation: 'aboutPulse 2s infinite',
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#00ff88' }}>Available for Consultation</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(280px, 1fr)', gap: 40, alignItems: 'start' }}>
            {/* Bio & Expertise */}
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, borderBottom: '1px solid rgba(148,163,184,0.1)', paddingBottom: 8 }}>About Me</h3>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 32 }}>
                I am a professional Ethical Hacker and Software Developer specializing in offensive security and vulnerability research. My work focuses on identifying critical security flaws and building robust applications to mitigate digital threats. I am currently developing an automated Web Application Vulnerability Scanner designed to provide real-time security insights and protect web infrastructures from sophisticated attacks.
              </p>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, borderBottom: '1px solid rgba(148,163,184,0.1)', paddingBottom: 8 }}>Technical Expertise</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { title: 'Offensive Security', desc: 'Specialized in vulnerability assessment, penetration testing, and exploit research.', icon: '⬡', color: '#00ff88' },
                  { title: 'Security Automation', desc: 'Building custom tools using Python (FastAPI/Flask) to automate threat detection.', icon: '◉', color: '#0088ff' },
                  { title: 'Web Vulnerabilities', desc: 'Deep expertise in the OWASP Top 10, with a focus on SQL Injection, XSS, and broken access control.', icon: '◈', color: '#8b5cf6' },
                  { title: 'Modern Web Stack', desc: 'Architecting secure, high-performance dashboards with Next.js, React, and TypeScript.', icon: '◧', color: '#00d4ff' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px',
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(148,163,184,0.06)',
                    transition: 'all 0.3s',
                    opacity: 1,
                    transform: 'translateX(0)',
                    transitionDelay: `${0.4 + i * 0.1}s`,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${item.color}12`,
                      border: `1px solid ${item.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, color: item.color, flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{item.title}</h4>
                      <p style={{ fontSize: 14, color: '#64748b' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Photo Gallery + Socials */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Featured Image */}
              <div style={{
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(0,255,136,0.15)',
                boxShadow: '0 0 30px rgba(0,255,136,0.08)',
                position: 'relative',
              }}>
                {/* Avatar card placeholder */}
                <img src="/profile.png" alt="Melaku Deguale - Security Researcher" style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }} />
                {/* Overlay gradient */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(transparent, rgba(10,14,26,0.9))',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  right: 16,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Melaku Deguale</p>
                  <p style={{ fontSize: 12, color: '#00ff88' }}>Ethical Hacker & Security Researcher</p>
                </div>
              </div>

              {/* Shield / Platform Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '20px',
                borderRadius: 16,
                background: 'rgba(0,136,255,0.03)',
                border: '1px solid rgba(0,136,255,0.15)',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 0 20px rgba(0,255,136,0.15)',
                }}>
                  <img src="/shield-icon.png" alt="DAST Shield" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>EthioVuln Creator</p>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Enterprise-grade vulnerability scanner built with Next.js & FastAPI</p>
                </div>
              </div>

              {/* Socials & Contact */}
              <div style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 16, padding: '32px 24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Contact & Social Media</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <a href="https://github.com/melakudeguale9-droid/ethiovuln" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#94a3b8', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.color = '#00ff88'; e.currentTarget.style.transform = 'translateX(4px)';}} onMouseOut={e => {e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'translateX(0px)';}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span style={{ fontWeight: 500 }}>GitHub</span>
                  </a>
                  <a href="https://t.me/InfoSecureTech" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#94a3b8', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.color = '#00ff88'; e.currentTarget.style.transform = 'translateX(4px)';}} onMouseOut={e => {e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'translateX(0px)';}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.222-.524.222l.213-3.05 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>
                    <span style={{ fontWeight: 500 }}>Telegram Channel</span>
                  </a>
                  <a href="https://www.youtube.com/channel/UC5AyGUzC06A0QKIkqlMyn1g" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#94a3b8', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.color = '#00ff88'; e.currentTarget.style.transform = 'translateX(4px)';}} onMouseOut={e => {e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'translateX(0px)';}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.547 12 3.547 12 3.547s-7.505 0-9.377.503A3.014 3.014 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.503 9.376.503 9.376.503s7.505 0 9.377-.503a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span style={{ fontWeight: 500 }}>YouTube Channel</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        padding: '30px 48px',
        borderTop: '1px solid rgba(148,163,184,0.1)',
        background: 'rgba(10,14,26,0.8)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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
        @keyframes aboutFloat0 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(12px); }
        }
        @keyframes aboutFloat1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(18px) translateX(-16px); }
        }
        @keyframes aboutFloat2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(-8px); }
        }
        @keyframes aboutPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes aboutSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
