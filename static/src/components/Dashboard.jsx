import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">ChatBot Bro: Your Classroom Buddy</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Why We’re Awesome</h2>
          <p className="text-gray-700 mb-4">
            Unlike boring platforms, we’re a voice-powered, adaptive chatbot that feels like a real teacher! Ask anything, get answers at your level, and enjoy fun facts, jokes, and quizzes to stay engaged.
          </p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Voice answers with text-to-speech</li>
            <li>Level-based responses (beginner, medium, advanced)</li>
            <li>Fun facts, tips, and video quizzes</li>
            <li>Floating joke bar to beat boredom</li>
            <li>Speech-to-text and file uploads</li>
          </ul>
          <Link to="/chat">
            <button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Try the ChatBot!
            </button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Sample Questions</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>What is coding?</li>
            <li>How does gravity work?</li>
            <li>What’s a neural network?</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;