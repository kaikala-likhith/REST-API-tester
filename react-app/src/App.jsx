import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import RequestPanel from './RequestPanel';
import ResponsePanel from './ResponsePanel';

function App() {
  const [history, setHistory] = useState([]);
  const [test, setTest] = useState("test");
  const [activeRequest, setActiveRequest] = useState({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    headers: [],
    body: ''
  });

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('apiTesterHistory');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history');
    }
  }, []);

  const saveToHistory = (entry) => {
    const newHistory = [entry, ...history].slice(0, 50);
    setHistory(newHistory);
    try {
      localStorage.setItem('apiTesterHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your request history?')) {
      setHistory([]);
      try {
        localStorage.removeItem('apiTesterHistory');
      } catch (e) { }
    }
  };

  const handleSendRequest = async () => {
    if (!activeRequest.url) return;

    try {
      new URL(activeRequest.url);
    } catch (err) {
      setResponse({
        error: true,
        message: 'Invalid URL formatted. Please include http:// or https://'
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    const headersObj = {};
    activeRequest.headers.forEach(h => {
      if (h.key && h.key.trim()) {
        headersObj[h.key.trim()] = h.value.trim();
      }
    });

    let bodyData = null;
    if (activeRequest.method !== 'GET' && activeRequest.method !== 'DELETE') {
      const rawBody = activeRequest.body.trim();
      if (rawBody) {
        try {
          JSON.parse(rawBody);
          bodyData = rawBody;
          if (!headersObj['Content-Type']) {
            headersObj['Content-Type'] = 'application/json';
          }
        } catch (err) {
          setIsLoading(false);
          setResponse({
            error: true,
            message: 'Invalid JSON Request Body:\n' + err.message
          });
          return;
        }
      }
    }

    const startTime = performance.now();
    let status = 0;

    try {
      const fetchOptions = {
        method: activeRequest.method,
        headers: headersObj,
      };

      if (bodyData) {
        fetchOptions.body = bodyData;
      }

      const res = await fetch(activeRequest.url, fetchOptions);
      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);

      status = res.status;
      const statusText = res.statusText || 'OK';

      const responseHeaders = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const contentType = res.headers.get('content-type');
      const textResponse = await res.text();
      const sizeCalc = new Blob([textResponse]).size;

      let responseData = textResponse;
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = JSON.parse(textResponse);
        } catch (e) { }
      }

      const result = {
        status,
        statusText,
        time: timeTaken,
        size: sizeCalc,
        data: responseData,
        headers: responseHeaders
      };

      setResponse(result);

      saveToHistory({
        id: Date.now().toString(),
        method: activeRequest.method,
        url: activeRequest.url,
        time: timeTaken,
        status,
        date: new Date().toISOString()
      });

    } catch (err) {
      const timeTaken = Math.round(performance.now() - startTime);
      setResponse({
        error: true,
        message: `Network Error / CORS Issue:\n${err.message}\nMake sure the API supports CORS and is reachable.`
      });

      saveToHistory({
        id: Date.now().toString(),
        method: activeRequest.method,
        url: activeRequest.url,
        time: timeTaken,
        status: 0,
        date: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = () => {
    setActiveRequest({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      headers: [{ key: '', value: '' }],
      body: ''
    });
  };

  const loadHistoryItem = (item) => {
    setActiveRequest({
      ...activeRequest,
      method: item.method,
      url: item.url,
    });
  };

  return (
    <div className="app-container">
      <Sidebar
        history={history}
        onClearHistory={clearHistory}
        onSelectHistory={loadHistoryItem}
      />

      <main className="main-content">

        <RequestPanel
          activeRequest={activeRequest}
          setActiveRequest={setActiveRequest}
          onSend={handleSendRequest}
          onExample={loadExample}
          isLoading={isLoading}
        />

        <ResponsePanel
          response={response}
          isLoading={isLoading}
          onClear={() => setResponse(null)}
        />
      </main>
    </div>
  );
}

export default App;
