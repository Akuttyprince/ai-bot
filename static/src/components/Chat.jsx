import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FloatingJokeBar from './FloatingJokeBar';

const Chat = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input) return;

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      console.log('Chat response:', data);

      await fetch('http://localhost:5000/save_history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, response: data.response || data.answer }),
      }).then((res) => res.json()).then((historyData) => {
        console.log('History save:', historyData);
      });

      if (data.levels) {
        setResponse(data.response);
        setLevels(data.levels);
        setSelectedQuestion(data.question);
      } else if (data.answer) {
        setResponse(`${data.response}\nAnswer: ${data.answer}`);
        const utterance = new SpeechSynthesisUtterance(data.answer);
        window.speechSynthesis.speak(utterance);
        setLevels([]);
        setSelectedQuestion(null);
      } else {
        setResponse(data.response);
      }

      setInput('');
    } catch (error) {
      console.error('Chat error:', error);
      setResponse('Oops, something broke, bro!');
    }
  };

  const handleVoiceInput = async () => {
    setResponse('Listening... Speak now!');
    try {
      const res = await fetch('http://localhost:5000/voice_input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      console.log('Voice input:', data);

      if (data.input) {
        setInput(data.input);
        setResponse(`Heard: "${data.input}"—hit Send to ask!`);
      } else {
        setResponse(data.error || 'Mic didn’t catch that, bro!');
      }
    } catch (error) {
      console.error('Voice error:', error);
      setResponse('Mic’s acting up, bro! Check your setup.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) alert(`Uploaded ${file.name}! (Processing TBD)`);
  };

  const selectLevel = (level) => {
    navigate(`/content?level=${level}&question=${encodeURIComponent(selectedQuestion.question)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Chat with Bro</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="mb-4 h-64 overflow-y-auto">
          <p className="text-gray-800">{response}</p>
          {levels.length > 0 && (
            <div className="mt-4">
              <p className="text-blue-600">Pick your level:</p>
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => selectLevel(level)}
                  className="m-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {level}
                </button>
              ))}
              {selectedQuestion && (
                <>
                  <p className="text-blue-600 mt-2">Fun Fact: {selectedQuestion.funFact}</p>
                  <p className="text-blue-600">Tip: {selectedQuestion.suggestion}</p>
                  <Link to={`/content?level=beginner&question=${encodeURIComponent(selectedQuestion.question)}`}>
                    <button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Click here to get your answer
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Ask away!"
        />
        <div className="flex gap-2">
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
          <button
            onClick={handleVoiceInput}
            className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            🎙️ Voice
          </button>
          <input
            type="file"
            onChange={handleFileUpload}
            className="p-2"
          />
        </div>
        <Link to="/history">
          <button className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            View History
          </button>
        </Link>
      </div>
      <FloatingJokeBar />
    </div>
  );
};

export default Chat;    