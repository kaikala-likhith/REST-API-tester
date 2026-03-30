import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function ResponsePanel({ response, isLoading, onClear }) {
  const [activeTab, setActiveTab] = useState('body');
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <section className="response-panel">
        <header className="panel-header">
          <h2>Response</h2>
          <button className="btn btn-secondary btn-sm" disabled>Clear</button>
        </header>
        <div className="response-loading">
          <div className="spinner"></div>
          <p>Sending request...</p>
        </div>
      </section>
    );
  }

  if (!response) {
    return (
      <section className="response-panel">
        <header className="panel-header">
          <h2>Response</h2>
          <button className="btn btn-secondary btn-sm" disabled>Clear</button>
        </header>
        <div className="response-empty">
          <div className="response-empty-icon"></div>
          <p>Enter an  URL and click Send to see the response.</p>
        </div>
      </section>
    );
  }

  const handleCopy = async () => {
    let textToCopy = '';
    if (typeof response.data === 'object') {
      textToCopy = JSON.stringify(response.data, null, 2);
    } else {
      textToCopy = String(response.data);
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const renderStatus = () => {
    if (response.error) return <span className="meta-value status-error">Error</span>;

    let statusClass = '';
    if (response.status >= 200 && response.status < 300) statusClass = 'status-success';
    else if (response.status >= 400) statusClass = 'status-error';
    else if (response.status >= 300) statusClass = 'status-warning';

    return (
      <span className={`meta-value ${statusClass}`}>
        {response.status} {response.statusText}
      </span>
    );
  };

  const renderHeaders = () => {
    if (response.error || !response.headers || Object.keys(response.headers).length === 0) {
      return <div className="kv-display-row" style={{ color: 'var(--text-muted)' }}><i>No headers returned</i></div>;
    }

    return Object.entries(response.headers).map(([key, value]) => (
      <div className="kv-display-row" key={key}>
        <div className="kv-display-key">{key}</div>
        <div className="kv-display-value">{value}</div>
      </div>
    ));
  };

  const syntaxHighlight = (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  const renderBody = () => {
    if (response.error) {
      return (
        <pre><code className="null">{response.message}</code></pre>
      );
    }

    if (typeof response.data === 'object') {
      const highlighted = syntaxHighlight(response.data);
      return (
        <pre><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>
      );
    }

    return (
      <pre><code>{String(response.data)}</code></pre>
    );
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="response-panel">
      <header className="panel-header">
        <h2>Response</h2>
        <button onClick={onClear} className="btn btn-secondary btn-sm">Clear</button>
      </header>

      <div className="response-content">
        <div className="response-meta">
          <div className="meta-item">Status: {renderStatus()}</div>
          <div className="meta-item">Time: <span className="meta-value">{response.time || 0} ms</span></div>
          <div className="meta-item">Size: <span className="meta-value">{response.error ? '0 B' : formatSize(response.size || 0)}</span></div>
        </div>

        <div className="tabs">
          <div className="tab-buttons">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'body' ? 'active' : ''}`}
              onClick={() => setActiveTab('body')}
            >
              Body
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'headers' ? 'active' : ''}`}
              onClick={() => setActiveTab('headers')}
            >
              Headers {response.headers && Object.keys(response.headers).length > 0 && `(${Object.keys(response.headers).length})`}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'body' && (
              <div className="tab-pane active code-pane">
                <div className="pane-actions">
                  <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                    {copied ? <Check size={14} className="status-success" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {renderBody()}
              </div>
            )}

            {activeTab === 'headers' && (
              <div className="tab-pane active">
                <div className="kv-display">
                  {renderHeaders()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResponsePanel;
