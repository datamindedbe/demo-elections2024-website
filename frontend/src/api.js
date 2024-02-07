export const queryDecisions =  (message) => {
    let data = fetch('http://127.0.0.1:8000/no-memory-decision-query', { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message})})
        .then(response => response.json()); 
    return data.data;
  };
