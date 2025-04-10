import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      console.log('Response from backend:', data);
      setResponse(data.response);
      setInput(''); // Clear input after sending
    } catch (error) {
      console.error('Fetch error:', error);
      setResponse('Oops, something broke, bro!');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-600">ChatBot Bro</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 mt-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask me anything!"
      />
      <button
        onClick={sendMessage}
        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Send
      </button>
      <p className="mt-4 text-gray-800">{response}</p>
    </div>
  );
}

export default App;