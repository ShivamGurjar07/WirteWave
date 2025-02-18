import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header"; 
import Post from "./components/Post"; 
import Layout from "./components/Layout";
import IndexPages from "./IndexPages";
import LoginPage from "./components/LoginPage";
import Register from "./components/Register";
import { UserContextProvider } from "./components/UserContext";
import CreatePost from "./components/CreatePost";
import PostPage from "./components/PostPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPages />} />
          <Route path={"/login"} element={<LoginPage />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/create"} element={<CreatePost />} />
          <Route path={"/post/:id"} element={<PostPage />} />
          
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
