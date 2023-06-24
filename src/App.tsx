import { Routes, Route } from 'react-router-dom';
import Canvas from './Components/Canvas';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="canvas" element={<Canvas />} />
    </Routes>
  );
}

export default App;
