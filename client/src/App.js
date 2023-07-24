import './App.css';
import Post from "./Post";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function App() {
  //const deploy = 'http://localhost:4000/';
  const deploy = 'https://blog-app-backend-fqu2.onrender.com/';

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout deploy={deploy}/>}>
          <Route index element={<IndexPage deploy={deploy} />} />
          <Route path="/login" element={<LoginPage deploy={deploy} />} />
          <Route path="/register" element={<RegisterPage deploy={deploy} />} />
          <Route path="/create" element={<CreatePost deploy={deploy} />} />
          <Route path="/post/:id" element={<PostPage deploy={deploy} />} />
          <Route path="/edit/:id" element={<EditPost deploy={deploy} />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
