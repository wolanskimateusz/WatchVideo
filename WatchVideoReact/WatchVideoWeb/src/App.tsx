
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from "./Pages/HomePage/HomePage";
import ChatRoom from './Pages/ChatRoomPage/ChatRoom';


function App() {
  
  return (
    <Router>
      <Routes>
         <Route path="/home" element={<HomePage/>} />
         <Route path="/room/:url" element = {<ChatRoom />} ></Route>
      </Routes>
    </Router>
       
  )
}

export default App
