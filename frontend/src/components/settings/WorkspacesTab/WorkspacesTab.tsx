'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Field } from '@/components/settings/Field';

interface Workspace {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  targetsCount: number;
  isDefault: boolean;
  createdAt: string;
}

const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'My Workspace',
    description: 'Primary workspace for continuous perimeter scans and external vulnerability monitoring',
    membersCount: 3,
    targetsCount: 14,
    isDefault: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'ws-2',
    name: 'Internal Red Team Assessments',
    description: 'Dedicated isolated environment for staging infrastructure, internal APIs, and fuzzing tests',
    membersCount: 2,
    targetsCount: 8,
    isDefault: false,
    createdAt: '2026-03-22',
  },
];

export function WorkspacesTab() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws-1');
  const [isCreating, setIsCreating] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: newWsName.trim(),
      description: newWsDesc.trim() || 'Custom security workspace',
      membersCount: 1,
      targetsCount: 0,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setWorkspaces([...workspaces, newWs]);
    setActiveWorkspaceId(newWs.id);
    setNewWsName('');
    setNewWsDesc('');
    setIsCreating(false);
  };

  return (
    <Card>
      <SectionHeader
        icon="🏢"
        title="Workspaces"
        subtitle="Organize security targets, automated scan configurations, and reports into isolated workspaces"
        action={
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
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
            {isCreating ? '✕ Cancel' : '＋ New Workspace'}
          </button>
        }
      />

      {/* Workspace Creation Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          style={{
            background: 'rgba(30, 41, 59, 0.45)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', marginBottom: 14 }}>
            Create New Workspace
          </h3>
          <Field label="Workspace Name *">
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Staging Penetration Scope"
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
            />
          </Field>
          <Field label="Description">
            <input
              type="text"
              className="input-field"
              placeholder="Short description of this workspace's scope..."
              value={newWsDesc}
              onChange={(e) => setNewWsDesc(e.target.value)}
            />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setIsCreating(false)}
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
              Save Workspace
            </button>
          </div>
        </form>
      )}

      {/* Workspaces List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspaceId;
          return (
            <div
              key={ws.id}
              style={{
                background: isActive ? 'rgba(0, 229, 255, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                border: `1px solid ${isActive ? '#00E5FF' : 'rgba(148, 163, 184, 0.16)'}`,
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
                    {ws.name}
                  </h4>
                  {isActive && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: 'rgba(0, 229, 255, 0.2)',
                        color: '#00E5FF',
                        border: '1px solid rgba(0, 229, 255, 0.4)',
                      }}
                    >
                      Active Workspace
                    </span>
                  )}
                  {ws.isDefault && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: 'rgba(148, 163, 184, 0.15)',
                        color: '#94A3B8',
                      }}
                    >
                      Default
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13.5, color: '#94A3B8', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                  {ws.description}
                </p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: '#64748B' }}>
                  <span>👥 {ws.membersCount} Members</span>
                  <span>🎯 {ws.targetsCount} Target Assets</span>
                  <span>📅 Created {ws.createdAt}</span>
                </div>
              </div>

              <div>
                {!isActive ? (
                  <button
                    type="button"
                    onClick={() => setActiveWorkspaceId(ws.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      color: '#F8FAFC',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Switch to Workspace
                  </button>
                ) : (
                  <span style={{ fontSize: 13.5, color: '#00E5FF', fontWeight: 600 }}>
                    ✓ Current Workspace
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
