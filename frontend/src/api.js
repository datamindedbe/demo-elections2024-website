export const queryDecisions = async (message) => {
    let data = await fetch('http://127.0.0.1:8000/no-memory-decision-query', { method: 'POST',
        headers: { 'Content-Type': 'application/json' },body: JSON.stringify({ query: message})})
    let response_json =  await data.json();
    console.log(response_json);
    return response_json;
  };
