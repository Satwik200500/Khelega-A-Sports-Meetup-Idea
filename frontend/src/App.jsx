import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route
          path="/my-posts"
          element={
           <ProtectedRoute>
              <MyPosts />
           </ProtectedRoute>
        }
     />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;