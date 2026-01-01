// src/App.js
import './App.css';
import AnimatedRoutes from './components/AnimatedRoutes';
import Header from './components/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import { DataProvider } from "./contexts/DataContext";

function App() {
    return (
        <DataProvider>
            <Router>
                <div className="App">
                    <Header />
                    <AnimatedRoutes />
                </div>
            </Router>
        </DataProvider>
    );
}

export default App;