
import './App.css'
import TestComponent from './Components/TestComponent'
import Chat from './Components/Chat/Chat'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from "./Pages/HomePage/HomePage";
import ChatRoom from './Pages/ChatRoomPage/ChatRoom'

function App() {
  

  return (
    <Router>
      <Routes>
         <Route path="/home" element={<HomePage/>} />
      </Routes>
    </Router>
       
  )
}

export default App
