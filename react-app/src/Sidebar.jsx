import { Trash2 } from 'lucide-react';

function Sidebar({ history, onClearHistory, onSelectHistory }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>History</h2>
        <button 
          onClick={onClearHistory} 
          className="icon-btn" 
          title="Clear History"
          disabled={history.length === 0}
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <ul className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">No history yet</div>
        ) : (
          history.map(item => {
            let statusColor = 'var(--text-muted)';
            if (item.status >= 200 && item.status < 300) statusColor = 'var(--color-success)';
            else if (item.status >= 400) statusColor = 'var(--color-error)';
            else if (item.status > 0) statusColor = 'var(--color-warning)';

            return (
              <li 
                key={item.id} 
                className="history-item"
                onClick={() => onSelectHistory(item)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={`history-method method-${item.method}`}>
                    {item.method}
                  </span>
                </div>
                <span className="history-url" title={item.url}>
                  {item.url}
                </span>
                <div className="history-meta">
                  <span style={{ color: statusColor }}>
                    {item.status || 'Error'}
                  </span>
                  <span>{item.time} ms</span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
