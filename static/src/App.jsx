import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Content from './components/Content';
import History from './components/History';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/content" element={<Content />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;