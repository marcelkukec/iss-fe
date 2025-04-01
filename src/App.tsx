import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import User from "./pages/User.tsx";
import Post from "./components/Post.tsx";
import Group from "./components/Group.tsx";
import Explore from "./pages/Explore.tsx";
import CreatePost from "./components/CreatePost.tsx";
import UserPosts from "./pages/UserPosts.tsx";
import CreateGroup from "./components/CreateGroup.tsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/:id/posts" element={<UserPosts />} />
        <Route path="groups/create" element={<CreateGroup />} />
        <Route path="/groups/:id" element={<Group />} />
    </Routes>
  )
}

export default App
