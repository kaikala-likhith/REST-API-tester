import { useState } from 'react';
import { Plus } from 'lucide-react';

function RequestPanel({ activeRequest, setActiveRequest, onSend, onExample, isLoading }) {
  const [activeTab, setActiveTab] = useState('headers');

  const updateMethod = (e) => {
    setActiveRequest({ ...activeRequest, method: e.target.value });
  };

  const updateUrl = (e) => {
    setActiveRequest({ ...activeRequest, url: e.target.value });
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...activeRequest.headers];
    newHeaders[index][field] = value;
    setActiveRequest({ ...activeRequest, headers: newHeaders });
  };

  const addHeaderRow = () => {
    setActiveRequest({
      ...activeRequest,
      headers: [...activeRequest.headers, { key: '', value: '' }]
    });
  };

  const removeHeaderRow = (index) => {
    const newHeaders = activeRequest.headers.filter((_, i) => i !== index);
    if (newHeaders.length === 0) newHeaders.push({ key: '', value: '' });
    setActiveRequest({ ...activeRequest, headers: newHeaders });
  };

  const updateBody = (e) => {
    setActiveRequest({ ...activeRequest, body: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  const isBodyDisabled = activeRequest.method === 'GET' || activeRequest.method === 'DELETE';

  return (
    <section className="request-panel">
      <header className="panel-header">
        <h1>REST API Tester</h1>
        <button onClick={onExample} className="btn btn-secondary btn-sm">
          Example API
        </button>
      </header>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="input-group url-group">
          <select 
            className="method-select" 
            value={activeRequest.method}
            onChange={updateMethod}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input 
            type="url" 
            className="url-input" 
            placeholder="https://api.example.com/data" 
            value={activeRequest.url}
            onChange={updateUrl}
            required 
          />
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>

        <div className="tabs">
          <div className="tab-buttons">
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'headers' ? 'active' : ''}`}
              onClick={() => setActiveTab('headers')}
            >
              Headers {activeRequest.headers.filter(h => h.key).length > 0 && `(${activeRequest.headers.filter(h => h.key).length})`}
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'body' ? 'active' : ''}`}
              onClick={() => setActiveTab('body')}
            >
              Body
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'headers' && (
              <div className="tab-pane active">
                <div className="kv-list">
                  {activeRequest.headers.map((header, index) => (
                    <div className="kv-row" key={index}>
                      <input 
                        type="text" 
                        placeholder="Key (e.g. Authorization)" 
                        value={header.key}
                        onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Value" 
                        value={header.value}
                        onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="btn-remove-row"
                        onClick={() => removeHeaderRow(index)}
                      >×</button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={addHeaderRow}
                >
                  <Plus size={14} style={{ marginRight: 4, display: 'inline' }} />
                  Add Header
                </button>
              </div>
            )}

            {activeTab === 'body' && (
              <div className="tab-pane active">
                <div className="body-controls">
                  <span className="body-label">JSON Data</span>
                </div>
                <textarea 
                  className="code-textarea" 
                  placeholder="&#123;&#10;  &quot;key&quot;: &quot;value&quot;&#10;&#125;"
                  value={activeRequest.body}
                  onChange={updateBody}
                  disabled={isBodyDisabled}
                  style={{ opacity: isBodyDisabled ? 0.5 : 1 }}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

export default RequestPanel;
