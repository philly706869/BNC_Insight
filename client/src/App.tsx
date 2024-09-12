import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CategoryContext,
  CategoryContextData,
} from "./contexts/CategoryContext";
import {
  CurrentUserContext,
  CurrentUserContextData,
} from "./contexts/CurrentUserContext";
import Layout from "./Layout";
import EditArticle from "./pages/article/EditArticle";
import MyArticles from "./pages/article/MyArticles";
import NewArticle from "./pages/article/NewArticle";
import ViewArticle from "./pages/article/ViewArticle";
import Category from "./pages/Category";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import User from "./pages/User";
import { getCategories } from "./services/articleService";
import { getCurrentUser } from "./services/userService";
import "./styles/global.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUserContextData>({
    isInitialized: false,
  });
  const [category, setCategory] = useState<CategoryContextData>({
    isInitialized: false,
  });

  const theme = useMemo(
    () => createTheme({ typography: { button: { textTransform: "none" } } }),
    []
  );

  useEffect(() => {
    getCurrentUser().then((currentUser) =>
      setCurrentUser({ isInitialized: true, data: currentUser })
    );

    getCategories().then((category) =>
      setCategory({ isInitialized: true, data: category })
    );
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <CategoryContext.Provider value={category}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/category/:category" element={<Category />} />
                  <Route path="/myarticles" element={<MyArticles />} />
                  <Route path="/article/view/:id" element={<ViewArticle />} />
                  <Route path="/article/new" element={<NewArticle />} />
                  <Route path="/article/edit" element={<EditArticle />} />
                  <Route path="/myaccount" element={<MyAccount />} />
                  <Route path="/user/:username" element={<User />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </CategoryContext.Provider>
      </CurrentUserContext.Provider>
    </>
  );
}
