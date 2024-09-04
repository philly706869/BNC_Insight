import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import EditArticle from "./pages/article/EditArticle";
import PostArticle from "./pages/article/PostArticle";
import ViewArticle from "./pages/article/ViewArticle";
import Category from "./pages/Category";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import User from "./pages/User";
import "./styles/global.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<CreateAccount />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/article/post" element={<PostArticle />} />
            <Route path="/article/edit" element={<EditArticle />} />
            <Route path="/article/:article" element={<ViewArticle />} />
            <Route path="/user/:user" element={<User />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
