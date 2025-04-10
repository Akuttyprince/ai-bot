import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">ChatBot Bro</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 mt-4 border rounded"
        placeholder="Ask me anything!"
      />
      <button
        onClick={sendMessage}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>
      <p className="mt-4">{response}</p>
    </div>
  );
}

export default App;