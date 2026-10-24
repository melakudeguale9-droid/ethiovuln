'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Field } from '@/components/settings/Field';
import { Toggle } from '@/components/settings/Toggle';

interface VpnProfile {
  id: string;
  name: string;
  protocol: 'OpenVPN' | 'WireGuard';
  serverEndpoint: string;
  status: 'connected' | 'disconnected' | 'idle';
  assignedIp: string;
  lastConnected?: string;
}

const INITIAL_VPN_PROFILES: VpnProfile[] = [
  {
    id: 'vpn-1',
    name: 'Addis Ababa HQ Enterprise Tunnel',
    protocol: 'WireGuard',
    serverEndpoint: 'vpn.hq.ethiovuln.local:51820',
    status: 'connected',
    assignedIp: '10.8.0.4/24',
    lastConnected: 'Active now',
  },
  {
    id: 'vpn-2',
    name: 'Internal Staging Lab Gateway',
    protocol: 'OpenVPN',
    serverEndpoint: 'staging-gw.lab.ethiovuln.local:1194',
    status: 'idle',
    assignedIp: '192.168.10.15/24',
    lastConnected: 'Yesterday at 17:40',
  },
];

export function VpnProfilesTab() {
  const [profiles, setProfiles] = useState<VpnProfile[]>(INITIAL_VPN_PROFILES);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [protocol, setProtocol] = useState<'OpenVPN' | 'WireGuard'>('OpenVPN');
  const [dnsLeakProtection, setDnsLeakProtection] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);

  const handleToggleConnection = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === 'connected' ? 'disconnected' : 'connected';
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: VpnProfile = {
      id: `vpn-${Date.now()}`,
      name: name.trim(),
      protocol,
      serverEndpoint: protocol === 'WireGuard' ? 'wg.custom.local:51820' : 'ovpn.custom.local:1194',
      status: 'idle',
      assignedIp: '10.10.0.2/24',
      lastConnected: 'Never',
    };

    setProfiles([...profiles, newProfile]);
    setName('');
    setIsAdding(false);
  };

  return (
    <Card>
      <SectionHeader
        icon="🛡️"
        title="VPN Profiles"
        subtitle="Route automated vulnerability scans through secure VPN tunnels to assess private, on-premise, and staging networks"
        action={
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: '#00E5FF',
              color: '#0B0F19',
              fontWeight: 600,
              fontSize: 13.5,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isAdding ? '✕ Cancel' : '＋ Add VPN Profile'}
          </button>
        }
      />

      {/* Add Profile Form */}
      {isAdding && (
        <form
          onSubmit={handleAddProfile}
          style={{
            background: 'rgba(30, 41, 59, 0.45)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', marginBottom: 14 }}>
            Upload VPN Configuration
          </h3>
          <Field label="Profile Name *">
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. AWS VPC Staging Tunnel"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="VPN Protocol">
            <select
              className="input-field"
              value={protocol}
              onChange={(e) => setProtocol(e.target.value as 'OpenVPN' | 'WireGuard')}
            >
              <option value="OpenVPN">OpenVPN (.ovpn configuration)</option>
              <option value="WireGuard">WireGuard (.conf configuration)</option>
            </select>
          </Field>
          <Field label="Configuration File">
            <input
              type="file"
              accept=".ovpn,.conf,.zip"
              className="input-field"
              style={{ padding: '8px' }}
            />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setIsAdding(false)}
              style={{ padding: '8px 16px', fontSize: 13.5 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                background: '#00E5FF',
                color: '#0B0F19',
                fontWeight: 600,
                fontSize: 13.5,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Profiles List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {profiles.map((vpn) => {
          const isConnected = vpn.status === 'connected';
          return (
            <div
              key={vpn.id}
              style={{
                background: isConnected ? 'rgba(0, 229, 255, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                border: `1px solid ${isConnected ? '#00E5FF' : 'rgba(148, 163, 184, 0.16)'}`,
                borderRadius: 12,
                padding: '18px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                    {vpn.name}
                  </h4>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: 'rgba(148, 163, 184, 0.15)',
                      color: '#CBD5E1',
                    }}
                  >
                    {vpn.protocol}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: isConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.12)',
                      color: isConnected ? '#10B981' : '#94A3B8',
                      border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
                    }}
                  >
                    {isConnected ? '● Connected' : '○ Standby'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#94A3B8', marginTop: 6 }}>
                  <span>🌐 Endpoint: <strong style={{ color: '#E2E8F0' }}>{vpn.serverEndpoint}</strong></span>
                  <span>🔒 Tunnel IP: <strong style={{ color: '#00E5FF' }}>{vpn.assignedIp}</strong></span>
                  <span>⏱️ Status: {vpn.lastConnected}</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleToggleConnection(vpn.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: isConnected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 229, 255, 0.15)',
                    border: `1px solid ${isConnected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 229, 255, 0.4)'}`,
                    color: isConnected ? '#EF4444' : '#00E5FF',
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isConnected ? 'Disconnect Tunnel' : 'Connect Tunnel'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Security Controls */}
      <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.14)', paddingTop: 16 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
          Security & Routing Safeguards
        </h4>
        <Toggle
          label="DNS Leak Protection (Enforce internal resolver during tunnel scans)"
          checked={dnsLeakProtection}
          onChange={setDnsLeakProtection}
        />
        <Toggle
          label="Scan Kill Switch (Halt scanner instantly if VPN drops unexpectedly)"
          checked={killSwitch}
          onChange={setKillSwitch}
        />
      </div>
    </Card>
  );
}
