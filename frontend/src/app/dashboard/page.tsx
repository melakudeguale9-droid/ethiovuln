'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SCAN_STATUS_CONFIG } from '@/lib/constants';
import type { Scan, ScanListResponse } from '@/types/scan';

export default function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const data = await api.listScans(1, 50) as ScanListResponse;
        setScans(data.scans);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const totalScans = scans.length;
  const activeScans = scans.filter(s => s.status === 'running' || s.status === 'verifying').length;
  const totalVulns = scans.reduce((sum, s) => sum + s.total_vulnerabilities, 0);
  const totalCritical = scans.reduce((sum, s) => sum + s.critical_count, 0);
  const totalHigh = scans.reduce((sum, s) => sum + s.high_count, 0);
  const totalMedium = scans.reduce((sum, s) => sum + s.medium_count, 0);
  const totalLow = scans.reduce((sum, s) => sum + s.low_count, 0);
  const totalInfo = scans.reduce((sum, s) => sum + s.info_count, 0);

  const severityData = [
    { label: 'Critical', count: totalCritical, color: '#FF0040' },
    { label: 'High',     count: totalHigh,     color: '#FF4444' },
    { label: 'Medium',   count: totalMedium,   color: '#FFB020' },
    { label: 'Low',      count: totalLow,      color: '#44BB44' },
    { label: 'Info',     count: totalInfo,     color: '#4488FF' },
  ];
  const maxSeverity = Math.max(...severityData.map(d => d.count), 1);

  const statCards = [
    { label: 'Total Scans',     value: totalScans,    color: '#00ff88', icon: '🔍' },
    { label: 'Active Scans',    value: activeScans,   color: '#0088ff', icon: '⚡', pulse: activeScans > 0 },
    { label: 'Vulnerabilities', value: totalVulns,    color: '#FFB020', icon: '🎯' },
    { label: 'Critical',        value: totalCritical, color: '#FF0040', icon: '🔥', pulse: totalCritical > 0 },
    { label: 'High',            value: totalHigh,     color: '#FF4444', icon: '⚠️' },
    { label: 'Medium',          value: totalMedium,   color: '#FFB020', icon: '🟡' },
  ];

  const threats = [
    '🔴 SQLi attempt detected on /api/users',
    '🟠 XSS payload blocked at /search?q=',
    '🟡 Directory traversal: /../../../etc/passwd',
    '🔴 Brute force: 47 failed logins',
    '🟠 SSRF probe: http://169.254.169.254',
    '🟡 Exposed .env file found on target',
    '🔴 Command injection in /exec?cmd=',
    '🟠 CORS misconfiguration detected',
    '🟡 Missing HSTS header on 3 endpoints',
    '🔴 JWT none algorithm attack attempted',
  ];
  const visibleThreats = threats.slice(tick % threats.length, (tick % threats.length) + 4);

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 15px currentColor; } 50% { box-shadow: 0 0 30px currentColor; } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes radarSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanLine { 0% { top: -2px; } 100% { top: 100vh; } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Scan line */}
      <div style={{ position:'fixed', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#00ff8840,transparent)', animation:'scanLine 5s linear infinite', pointerEvents:'none', zIndex:1 }} />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#00ff88,#0088ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🛡</div>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:2 }}>
              <span className="text-gradient">Security Operations Center</span>
            </h1>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#00ff88', animation:'blink 1s infinite', display:'inline-block' }} />
              <span style={{ color:'#00ff88', fontSize:11, fontWeight:700 }}>SYSTEM ONLINE</span>
              <span style={{ color:'#64748b', fontSize:11 }}>· EthioVuln v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:24 }}>
        {statCards.map((card, i) => (
          <div key={card.label} className="glass-card" style={{
            padding:'16px 12px', textAlign:'center', position:'relative', overflow:'hidden',
            border:`1px solid ${card.color}25`,
            animation: mounted ? `fadeIn 0.4s ease ${i*0.08}s both` : 'none',
          }}>
            {card.pulse && <div style={{ position:'absolute', inset:0, borderRadius:'inherit', border:`1px solid ${card.color}`, animation:'pulseGlow 2s ease-in-out infinite', pointerEvents:'none' }} />}
            <div style={{ fontSize:20, marginBottom:4 }}>{card.icon}</div>
            <div style={{ fontSize:28, fontWeight:800, color:card.color, lineHeight:1 }}>{loading ? '—' : card.value}</div>
            <div style={{ fontSize:10, color:'#64748b', marginTop:4, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18, marginBottom:22 }}>

        {/* Severity Distribution */}
        <div className="glass-card" style={{ padding:22 }}>
          <h2 style={{ fontSize:14, fontWeight:700, marginBottom:18, color:'#f1f5f9', display:'flex', alignItems:'center', gap:8 }}>
            🎯 Severity Distribution
          </h2>
          {severityData.map(item => (
            <div key={item.label} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                <span style={{ color:item.color, fontWeight:700 }}>{item.label}</span>
                <span style={{ color:'#94a3b8' }}>{item.count}</span>
              </div>
              <div style={{ height:5, borderRadius:3, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:3, width:`${(item.count/maxSeverity)*100}%`, background:`linear-gradient(90deg,${item.color},${item.color}88)`, transition:'width 1s ease', boxShadow:`0 0 6px ${item.color}50` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Live Threat Feed */}
        <div className="glass-card" style={{ padding:22, border:'1px solid rgba(255,0,64,0.15)' }}>
          <h2 style={{ fontSize:14, fontWeight:700, marginBottom:14, color:'#f1f5f9', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ animation:'blink 1s infinite', display:'inline-block' }}>🔴</span>
            Live Threat Feed
            <span style={{ fontSize:9, color:'#00ff88', marginLeft:'auto', fontWeight:700 }}>LIVE</span>
          </h2>
          <div style={{ fontFamily:'monospace', fontSize:11 }}>
            {visibleThreats.map((threat, i) => (
              <div key={`${tick}-${i}`} style={{
                padding:'7px 10px', marginBottom:5, borderRadius:6,
                background:'rgba(255,0,64,0.04)', border:'1px solid rgba(255,0,64,0.08)',
                color:'#94a3b8', lineHeight:1.4,
                animation:'fadeIn 0.3s ease both',
                animationDelay:`${i*0.08}s`,
              }}>{threat}</div>
            ))}
          </div>
          <div style={{ marginTop:10, fontSize:9, color:'#475569', textAlign:'center' }}>Auto-refreshing every 2s</div>
        </div>

        {/* Radar */}
        <div className="glass-card" style={{ padding:22, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <h2 style={{ fontSize:14, fontWeight:700, marginBottom:14, color:'#f1f5f9', alignSelf:'flex-start', display:'flex', alignItems:'center', gap:8 }}>
            📡 Attack Radar
          </h2>
          <div style={{ position:'relative', width:140, height:140 }}>
            {[1, 0.66, 0.33].map((scale, i) => (
              <div key={i} style={{ position:'absolute', border:'1px solid rgba(0,255,136,0.15)', borderRadius:'50%', width:`${scale*100}%`, height:`${scale*100}%`, top:`${(1-scale)*50}%`, left:`${(1-scale)*50}%` }} />
            ))}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:'50%', height:1, background:'linear-gradient(90deg,#00ff88,transparent)', transformOrigin:'left center', animation:'radarSpin 3s linear infinite' }} />
            <div style={{ position:'absolute', top:'50%', left:'50%', width:7, height:7, borderRadius:'50%', background:'#00ff88', transform:'translate(-50%,-50%)', boxShadow:'0 0 8px #00ff88' }} />
            {mounted && scans.slice(0,5).map((_,i) => (
              <div key={i} style={{ position:'absolute', top:`${20+Math.sin(i*1.2)*35}%`, left:`${20+Math.cos(i*1.2)*35}%`, width:5, height:5, borderRadius:'50%', background:i===0?'#FF0040':'#FFB020', boxShadow:`0 0 6px ${i===0?'#FF0040':'#FFB020'}`, animation:'blink 1.5s infinite', animationDelay:`${i*0.3}s` }} />
            ))}
          </div>
          <div style={{ marginTop:10, fontSize:10, color:'#64748b', textAlign:'center' }}>
            {totalScans} targets · <span style={{ color:'#FF0040' }}>{totalCritical} critical</span>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="glass-card" style={{ padding:22 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <h2 style={{ fontSize:14, fontWeight:700, color:'#f1f5f9', display:'flex', alignItems:'center', gap:8 }}>🔍 Recent Scans</h2>
          <Link href="/dashboard/scans/new" className="btn-glow btn-glow-green" style={{ fontSize:12, padding:'6px 14px' }}>+ New Scan</Link>
        </div>

        {loading ? (
          Array.from({length:4}).map((_,i) => <div key={i} className="skeleton" style={{ height:44, marginBottom:8, borderRadius:8 }} />)
        ) : scans.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#64748b' }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🎯</div>
            <p style={{ marginBottom:14 }}>No scans yet. Start your first security assessment.</p>
            <Link href="/dashboard/scans/new" className="btn-glow btn-glow-green" style={{ fontSize:13, padding:'10px 22px' }}>🔍 Launch First Scan</Link>
          </div>
        ) : (
          <div style={{ display:'grid', gap:6 }}>
            {scans.slice(0,8).map(scan => {
              const sc = SCAN_STATUS_CONFIG[scan.status] || { label:scan.status, color:'#94a3b8' };
              const isActive = scan.status==='running'||scan.status==='verifying';
              return (
                <a key={scan.id} href={`/dashboard/scans/${scan.id}`} style={{
                  display:'grid', gridTemplateColumns:'1fr auto auto auto', alignItems:'center', gap:14,
                  padding:'10px 14px', borderRadius:9, textDecoration:'none', color:'inherit',
                  border: isActive ? '1px solid rgba(0,255,136,0.2)' : '1px solid rgba(148,163,184,0.06)',
                  background: isActive ? 'rgba(0,255,136,0.03)' : 'rgba(0,0,0,0.2)',
                  transition:'all 0.2s',
                }}
                  onMouseOver={e=>(e.currentTarget.style.borderColor='rgba(0,255,136,0.25)')}
                  onMouseOut={e=>(e.currentTarget.style.borderColor=isActive?'rgba(0,255,136,0.2)':'rgba(148,163,184,0.06)')}
                >
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#f1f5f9' }}>{scan.target_domain}</div>
                    <div style={{ fontSize:10, color:'#64748b' }}>{new Date(scan.created_at).toLocaleDateString()} · {scan.scan_type?.replace('_',' ')}</div>
                  </div>
                  <div style={{ display:'flex', gap:6, fontSize:11 }}>
                    {scan.critical_count>0 && <span style={{ color:'#FF0040', fontWeight:700 }}>🔴 {scan.critical_count}</span>}
                    {scan.high_count>0 && <span style={{ color:'#FF4444', fontWeight:700 }}>🟠 {scan.high_count}</span>}
                    {scan.medium_count>0 && <span style={{ color:'#FFB020', fontWeight:700 }}>🟡 {scan.medium_count}</span>}
                  </div>
                  <div style={{ fontSize:11, color:'#64748b' }}>{scan.total_vulnerabilities} vulns</div>
                  <div style={{ fontSize:10, fontWeight:600, color:sc.color, background:`${sc.color}15`, padding:'3px 9px', borderRadius:9999, border:`1px solid ${sc.color}25`, whiteSpace:'nowrap' }}>
                    {isActive && <span style={{ animation:'blink 1s infinite', marginRight:3 }}>●</span>}
                    {sc.label}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
