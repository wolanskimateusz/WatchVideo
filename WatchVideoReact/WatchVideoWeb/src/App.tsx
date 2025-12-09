
import './App.css'
import TestComponent from './Components/TestComponent'
import Chat from './Components/Chat/Chat'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ChatRoom from './Pages/ChatRoomPage/ChatRoom'

function App() {
  

  return (
    <Router>
      <TestComponent />
        <Chat />
      <Routes>
         <Route path="/chatroom/:url" element={<ChatRoom />} />
      </Routes>
    </Router>
       
  )
}

export default App
