// EthioVuln — Login Page
'use client';

import React, { Suspense } from 'react';
import { LoginForm } from '@/components/auth';
import { Skeleton } from '@/components/ui/Skeleton';

export default function LoginPage() {
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
      <Suspense fallback={<Skeleton width={440} height={400} />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
