interface Props {
  connected: boolean;
}

export const StatusBadge = ({ connected }: Props) => {
  return (
    <div className="status-indicator">
      <span className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}> 
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

