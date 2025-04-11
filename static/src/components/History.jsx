import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get_history')
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Chat History</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
        {history.length === 0 ? (
          <p>No chats yet, bro!</p>
        ) : (
          <ul className="space-y-4">
            {history.map((chat, index) => (
              <li key={index}>
                <p className="font-semibold">Q: {chat.question}</p>
                <p>R: {chat.response}</p>
              </li>
            ))}
          </ul>
        )}
        <Link to="/chat">
          <button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Back to Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default History;