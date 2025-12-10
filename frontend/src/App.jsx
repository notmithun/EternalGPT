import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/signup.jsx"
import Login from "./pages/login.jsx"
import Chat from "./pages/chat.jsx"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/signup" element={<Signup/>}></Route>
                <Route path="/c" element={<Chat/>}></Route>
            </Routes>
        </Router>
    );
}