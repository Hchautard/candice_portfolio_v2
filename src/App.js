import './App.css';
import AnimatedRoutes from './components/AnimatedRoutes';
import Header from './components/Header';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
        <div className="App">
          <Header />
          <AnimatedRoutes />
        </div>
    </Router>
  );
}

export default App;