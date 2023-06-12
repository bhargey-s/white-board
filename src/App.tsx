import Canvas1 from './Components/Canvas/Canvas1';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="canvas1" element={<Canvas1 />} />
    </Routes>
  );
}

export default App;
