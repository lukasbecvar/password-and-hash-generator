// include styles
import './assets/css/index.scss'

// include react
import { useState } from 'react'
import ReactDOM from 'react-dom/client'

// include router
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// include app components
import HashGenerator from './components/HashGenerator'
import PasswordGenerator from './components/PasswordGenerator'

// main app function component routing
export default function App() {
    // flag for menu open/close
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-[#0c1621]">
                {/* navigation bar */}
                <nav className="bg-[#0c1621] text-white px-6 py-4 border-b border-gray-700 shadow-md">
                <div className="flex items-center justify-between">
                    {/* logo */}
                    <img src="favicon.svg" alt="logo" className="h-7 w-auto mt-[-10px] mb-[-10px]"/>

                    {/* mobile menu toggle button */}
                    <button className="md:hidden text-white focus:outline-none hover:text-blue-400 text-xl mt-[-4px] mb-[-4px]" onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>  

                    {/* desktop menu */}
                    <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wide uppercase">
                    <Link to="/" className="group relative text-white">
                        Password generator
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/hash" className="group relative text-white">
                        Hash generator
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    </div>
                </div>

                {/* mobile menu */}
                {isMenuOpen && (
                    <div className="mt-4 flex flex-col gap-4 md:hidden text-sm font-semibold tracking-wide uppercase">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="group relative w-max text-white">
                            Password generator
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/hash" onClick={() => setIsMenuOpen(false)} className="group relative w-max text-white">
                            Hash generator
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                )}
                </nav>

                {/* main component wrapper */}
                <main className="flex-grow flex flex-col items-center">
                    <Routes>
                        <Route path="/" element={<PasswordGenerator/>}/>
                        <Route path="/hash" element={<HashGenerator/>}/>
                    </Routes>
                </main>

                {/* footer */}
                <footer className="bg-[#0c1621] text-white px-6 py-4 border-t border-gray-700 shadow-md">
                    <div className="text-sm font-semibold tracking-wide uppercase text-center">
                        <div className="text-sm font-semibold tracking-wide uppercase text-center">
                            {/* link to author's website */}
                            <a href="https://becvar.xyz" className="text-blue-400 hover:text-blue-500 mr-1">
                                Lukáš Bečvář
                            </a>
                            {/* copyright notice */}
                            <span className="text-gray-400">© {new Date().getFullYear()} Copyright</span>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    )
}

// render app
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
