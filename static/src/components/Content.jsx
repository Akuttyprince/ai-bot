import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart2, Video, AlertCircle, CheckCircle } from 'lucide-react';

const dummyData = {
  beginner: {
    title: 'Basics 101',
    description: 'Start your journey with the fundamentals!',
    overview: 'This section introduces you to the basics. Watch the videos, read the materials, and test your skills with the quiz.',
    videos: [
      { title: 'Intro to Coding', url: 'https://www.youtube.com/embed/HcOc7P5BMi4' },
      { title: 'HTML Basics', url: 'https://www.youtube.com/embed/PkZNo7MFNFg' },
    ],
    readings: [
      { title: 'What is Programming?', url: 'https://example.com/programming' },
      { title: 'HTML Guide', url: 'https://example.com/html' },
    ],
    exercises: ['Write a simple HTML page', 'Create a button with JavaScript'],
    quiz: [
      { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Multi Language'], answer: 'Hyper Text Markup Language' },
      { question: 'What is a variable?', options: ['A fixed value', 'A storage for data'], answer: 'A storage for data' },
    ],
  },
  medium: {
    title: 'Intermediate Skills',
    description: 'Level up with practical projects!',
    overview: 'Build on your basics with hands-on coding and debugging.',
    videos: [
      { title: 'JavaScript Basics', url: 'https://www.youtube.com/embed/Oe421EPjeBE' },
      { title: 'APIs Explained', url: 'https://www.youtube.com/embed/Edsxf_NBFrw' },
    ],
    readings: [
      { title: 'JavaScript Guide', url: 'https://example.com/js' },
      { title: 'API Basics', url: 'https://example.com/api' },
    ],
    exercises: ['Fetch data from an API', 'Debug a simple script'],
    quiz: [
      { question: 'What is an API?', options: ['A programming language', 'A way to connect apps'], answer: 'A way to connect apps' },
      { question: 'What does CSS stand for?', options: ['Creative Style Sheets', 'Cascading Style Sheets'], answer: 'Cascading Style Sheets' },
    ],
  },
  advanced: {
    title: 'Pro Level',
    description: 'Master complex concepts and systems!',
    overview: 'Tackle full-stack development and advanced algorithms.',
    videos: [
      { title: 'React Deep Dive', url: 'https://www.youtube.com/embed/2Ji-clqUYnA' },
      { title: 'Node.js Basics', url: 'https://www.youtube.com/embed/rv2jXkijb1o' },
    ],
    readings: [
      { title: 'React Docs', url: 'https://reactjs.org' },
      { title: 'Node.js Guide', url: 'https://nodejs.org' },
    ],
    exercises: ['Build a REST API', 'Optimize an algorithm'],
    quiz: [
      { question: 'What is a closure?', options: ['A loop', 'A function with preserved data'], answer: 'A function with preserved data' },
      { question: 'What is MongoDB?', options: ['A SQL database', 'A NoSQL database'], answer: 'A NoSQL database' },
    ],
  },
};

const Content = () => {
  const { search } = useLocation();
  const level = new URLSearchParams(search).get('level') || 'beginner';
  const question = new URLSearchParams(search).get('question') || 'Your Question';
  const data = dummyData[level];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState({ completed: [], quizScore: 0 });
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState('');

  const overviewRef = useRef(null);
  const videosRef = useRef(null);
  const readingsRef = useRef(null);
  const exercisesRef = useRef(null);
  const quizRef = useRef(null);

  useEffect(() => {
    // Load progress from localStorage or MongoDB later
    const savedProgress = JSON.parse(localStorage.getItem(`progress-${question}-${level}`)) || { completed: [], quizScore: 0 };
    setProgress(savedProgress);
  }, [question, level]);

  const calculateOverallProgress = () => {
    const totalSections = 5; // overview, videos, readings, exercises, quiz
    const completedSections = progress.completed.length + (progress.quizScore > 0 ? 1 : 0);
    return Math.round((completedSections / totalSections) * 100);
  };

  const markAsCompleted = (section) => {
    if (!progress.completed.includes(section)) {
      const newProgress = { ...progress, completed: [...progress.completed, section] };
      setProgress(newProgress);
      localStorage.setItem(`progress-${question}-${level}`, JSON.stringify(newProgress));
    }
  };

  const handleVideoEnd = (index) => {
    if (index === data.videos.length - 1) {
      markAsCompleted('videos');
    }
    if (index < data.videos.length - 1) {
      setCurrentVideoIndex(index + 1);
    }
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    data.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.answer) correct++;
    });
    const score = Math.round((correct / data.quiz.length) * 100);
    setQuizResult(`You got ${correct}/${data.quiz.length} correct (${score}%)!`);
    const newProgress = { ...progress, quizScore: score };
    setProgress(newProgress);
    localStorage.setItem(`progress-${question}-${level}`, JSON.stringify(newProgress));
    markAsCompleted('quiz');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main content */}
      <div className="flex-grow flex">
        <main className="flex-1 py-6 px-4 sm:px-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Hero section */}
            <div className="rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-6 mb-8 border border-green-100">
              <h1 className="text-2xl font-bold text-gray-900">{question}</h1>
              <p className="text-gray-700 mt-2">{data.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {data.title}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {data.readings.length} Readings
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {data.videos.length} Videos
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {data.quiz.length} Quiz Questions
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Course Progress</span>
                  <span className="text-gray-700 font-medium">{calculateOverallProgress()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateOverallProgress()}%` }}
                  ></div>
                </div>
              </div>
              <Link to="/chat">
                <button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Back to Chat
                </button>
              </Link>
            </div>

            {/* Overview section */}
            <section ref={overviewRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BarChart2 size={20} className="mr-2 text-green-700" />
                  Course Overview
                </h2>
                {!progress.completed.includes('overview') && (
                  <button
                    onClick={() => markAsCompleted('overview')}
                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <div className="prose max-w-none text-gray-700">
                <p>{data.overview}</p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Learning Path</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Complete all sections in order: videos, readings, exercises, then quiz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Videos section */}
            <section ref={videosRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Video size={20} className="mr-2 text-green-700" />
                  Video Lessons
                </h2>
                {progress.completed.includes('videos') && <CheckCircle size={20} className="text-green-500" />}
              </div>
              <div className="mb-4 bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="400"
                  src={data.videos[currentVideoIndex].url}
                  title={data.videos[currentVideoIndex].title}
                  frameBorder="0"
                  allowFullScreen
                  onEnded={() => handleVideoEnd(currentVideoIndex)}
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Lesson Playlist</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {data.videos.map((video, index) => (
                    <div
                      key={index}
                      className={`p-3 flex items-center cursor-pointer hover:bg-gray-100 ${
                        index === currentVideoIndex ? 'bg-gray-100 font-semibold' : ''
                      }`}
                      onClick={() => setCurrentVideoIndex(index)}
                    >
                      <span className="text-gray-700">{index + 1}. {video.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Readings section */}
            <section ref={readingsRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BarChart2 size={20} className="mr-2 text-green-700" />
                  Readings
                </h2>
                {!progress.completed.includes('readings') && (
                  <button
                    onClick={() => markAsCompleted('readings')}
                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {data.readings.map((reading, index) => (
                  <li key={index}>
                    <a
                      href={reading.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {reading.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* Exercises section */}
            <section ref={exercisesRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BarChart2 size={20} className="mr-2 text-green-700" />
                  Exercises
                </h2>
                {!progress.completed.includes('exercises') && (
                  <button
                    onClick={() => markAsCompleted('exercises')}
                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
              <ul className="list-disc ml-6 text-gray-700">
                {data.exercises.map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))}
              </ul>
            </section>

            {/* Quiz section */}
            <section ref={quizRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BarChart2 size={20} className="mr-2 text-green-700" />
                  Quiz
                </h2>
                {progress.quizScore > 0 && <CheckCircle size={20} className="text-green-500" />}
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                {data.quiz.map((q, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-medium text-gray-900">{q.question}</p>
                    {q.options.map((option) => (
                      <label key={option} className="block mt-1">
                        <input
                          type="radio"
                          name={`quiz-${index}`}
                          value={option}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [index]: option })}
                          disabled={progress.quizScore > 0}
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                ))}
                <button
                  onClick={handleQuizSubmit}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                  disabled={progress.quizScore > 0}
                >
                  Submit Quiz
                </button>
                {quizResult && <p className="mt-2 text-gray-700">{quizResult}</p>}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Content;