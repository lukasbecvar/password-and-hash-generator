// include styles
import './assets/css/index.scss'

// include react
import ReactDOM from 'react-dom/client'

// include router
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// include app components
import HashGenerator from './components/HashGenerator'
import PasswordGenerator from './components/PasswordGenerator'

// main app function component routing
export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                
                {/* Navbar links */}
                <nav className="bg-white shadow-md p-4 flex gap-4">
                    <Link to="/" className="text-blue-500 hover:underline">Password generator</Link>
                    <Link to="/hashGenerator" className="text-green-500 hover:underline">Hash generator</Link>
                </nav>

                {/* Component routing */}
                <Routes>
                    <Route path="/" element={<PasswordGenerator/>}/>
                    <Route path="/hashGenerator" element={<HashGenerator/>}/>
                </Routes>
            </div>
        </Router>
    )
}

// render app
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
