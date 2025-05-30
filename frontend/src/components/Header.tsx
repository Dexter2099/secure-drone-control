import React from 'react';

type Props = {
  connected: boolean;
};

export const Header = ({ connected }: Props) => {
  return (
    <header className="app-header">
      <h1>Secure Drone Command Center</h1>
      <span
        className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}
      >
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </header>
  );
};
