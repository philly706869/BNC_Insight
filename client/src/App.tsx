import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CategoryContext,
  CategoryContextData,
} from "./contexts/category-context";
import {
  CurrentUserContext,
  CurrentUserContextData,
} from "./contexts/current-user-context";
import { Layout } from "./Layout";
import { ViewArticle } from "./pages/article/ViewArticle";
import { WriteArticle } from "./pages/article/WriteArticle";
import { Articles } from "./pages/Articles";
import { Home } from "./pages/Home";
import { MyAccount } from "./pages/MyAccount";
import { MyArticles } from "./pages/MyArticles";
import { NotFound } from "./pages/NotFound";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { User } from "./pages/User";
import { getCurrentUser } from "./services/auth-service";
import { getCategories } from "./services/category-service";

import "normalize.css";
import "./styles/global.scss";

export function App() {
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
    getCurrentUser()
      .then((currentUser) =>
        setCurrentUser({ isInitialized: true, data: currentUser })
      )
      .catch(() => {
        setCurrentUser({ isInitialized: true, data: null });
      });

    getCategories().then((category) =>
      setCategory({ isInitialized: true, data: category })
    );
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <CategoryContext.Provider value={category}>
          {/* mui 테마 설정 */}
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/myarticles" element={<MyArticles />} />
                  <Route path="/article/write" element={<WriteArticle />} />
                  <Route path="/article/:uid" element={<ViewArticle />} />
                  <Route path="/myaccount" element={<MyAccount />} />
                  <Route path="/:username" element={<User />} />
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
