import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import User from "./pages/User.tsx";
import Post from "./components/Post.tsx";
import Group from "./components/Group.tsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/groups/:id" element={<Group />} />
    </Routes>
  )
}

export default App
