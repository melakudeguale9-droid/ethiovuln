// EthioVuln — Register Page
'use client';

import React from 'react';
import { RegisterForm } from '@/components/auth';

export default function RegisterPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        padding: '32px 20px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <RegisterForm />
    </div>
  );
}
