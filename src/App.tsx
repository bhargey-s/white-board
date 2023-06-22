import Canvas from './Components/Canvas';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="canvas" element={<Canvas />} />
    </Routes>
  );
}

export default App;
