import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/chat.jsx"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Chat/>}></Route>
            </Routes>
        </Router>
    );
}