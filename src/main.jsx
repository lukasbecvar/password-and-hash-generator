import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// import main app component
import App from './App'

// init app
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)
