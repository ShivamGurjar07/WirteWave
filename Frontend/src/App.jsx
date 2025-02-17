import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header"; // Fixed typo in "components"
import Post from "./components/Post"; // Fixed typo in "components"
import Layout from "./components/Layout";
import IndexPages from "./IndexPages";
import LoginPage from "./components/LoginPage";
import Register from "./components/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPages />} />
        <Route path={"/login"} element={<LoginPage/>} />
        <Route path={"/register"} element={<Register/>} />
      </Route>
    </Routes>
  );
}

export default App;
