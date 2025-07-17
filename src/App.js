import './App.css';
import AnimatedRoutes from './components/AnimatedRoutes';
import Header from './components/Header';
import ImagePreloader from './components/ImagePreloader';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ImagePreloader>
        <div className="App">
          <Header />
          <AnimatedRoutes />
        </div>
      </ImagePreloader>
    </Router>
  );
}

export default App;