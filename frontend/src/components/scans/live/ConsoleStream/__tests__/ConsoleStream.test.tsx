import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConsoleStream } from '../ConsoleStream';
import type { WebSocketLog } from '@/hooks/useWebSocket';

describe('ConsoleStream Component', () => {
  it('renders empty log state when no logs are received', () => {
    render(<ConsoleStream logs={[]} connected={false} status="pending" />);

    expect(screen.getByText('Console Stream')).toBeInTheDocument();
    expect(screen.getByText('Waiting for engine logs...')).toBeInTheDocument();
    expect(screen.getByText('○ IDLE')).toBeInTheDocument();
  });

  it('renders live status badge when connected', () => {
    render(<ConsoleStream logs={[]} connected={true} status="running" />);

    expect(screen.getByText('● LIVE')).toBeInTheDocument();
  });

  it('renders completed status badge when scan is finished', () => {
    render(<ConsoleStream logs={[]} connected={false} status="completed" />);

    expect(screen.getByText('✓ COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('Assessment completed · Stream finished')).toBeInTheDocument();
  });

  it('renders incoming log messages with levels and timestamps', () => {
    const mockLogs: WebSocketLog[] = [
      {
        message: 'Engine initialized: Nuclei v3.3.0',
        level: 'info',
        timestamp: new Date().toISOString(),
      },
      {
        message: 'SQL Injection signature detected on /login.php',
        level: 'warning',
        timestamp: new Date().toISOString(),
      },
    ];

    render(<ConsoleStream logs={mockLogs} connected={true} status="running" />);

    expect(screen.getByText('Engine initialized: Nuclei v3.3.0')).toBeInTheDocument();
    expect(screen.getByText('SQL Injection signature detected on /login.php')).toBeInTheDocument();
  });

  it('allows toggling the auto-scroll checkbox', () => {
    render(<ConsoleStream logs={[]} connected={true} status="running" />);

    const checkbox = screen.getByRole('checkbox', { name: /auto-scroll/i }) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});
