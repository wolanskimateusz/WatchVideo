import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TestComponent from './Components/TestComponent'
import Chat from './Components/Chat/Chat'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <TestComponent />
        <Chat />
      <Routes>
         <Route path="/" element={<TestComponent />} />
      </Routes>
    </Router>
       
  )
}

export default App
