import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/issues/')
      .then(res => setIssues(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>🗳️ Janmat - Public Issue Tracker</h1>
      <ul>
        {issues.map(issue => (
          <li key={issue.id}>
            <strong>{issue.title}</strong> - {issue.status} ({issue.category})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
