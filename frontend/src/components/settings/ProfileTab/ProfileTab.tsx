import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Field } from '@/components/settings/Field';
import { settingsApi } from '@/lib/settingsApi';
import type { User } from '@/types/user';
import styles from './ProfileTab.module.css';

export interface ProfileTabProps {
  user: User | null;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
  });
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      await settingsApi.updateProfile(profile);
      setProfileMsg({ type: 'success', msg: 'Profile updated successfully' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', msg: err.message || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon="👤"
        title="Profile Information"
        subtitle="Update your display name, username, and email address"
      />
      {profileMsg && <Alert type={profileMsg.type} msg={profileMsg.msg} />}
      <form onSubmit={saveProfile}>
        <Field label="Full Name">
          <input
            className="input-field"
            value={profile.full_name}
            onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
            placeholder="Your full name"
          />
        </Field>
        <Field label="Username">
          <input
            className="input-field"
            value={profile.username}
            onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
            placeholder="username"
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            className="input-field"
            value={profile.email}
            onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </Field>
        <div className={styles.roleBox}>
          <div className={styles.roleLabel}>Role</div>
          <div className={styles.roleValue}>
            {user?.is_admin ? '🛡️ Administrator' : '👤 User'}
          </div>
        </div>
        <button
          type="submit"
          className={`btn-glow btn-glow-green ${styles.submitBtn}`}
          disabled={profileLoading}
        >
          {profileLoading ? 'Saving...' : '💾 Save Profile'}
        </button>
      </form>
    </Card>
  );
}
