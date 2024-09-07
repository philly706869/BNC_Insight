import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CurrentUserContext } from "./contexts/MeContext";
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
import { getMe } from "./services/userService";
import "./styles/global.css";
import { CurrentUser } from "./types/User";

export default async function App() {
  const [me, setMe] = useState<CurrentUser | null | undefined>(undefined);
  const theme = useMemo(
    () => createTheme({ typography: { button: { textTransform: "none" } } }),
    []
  );

  useEffect(() => {
    getMe().then((me) => setMe(me));
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={me}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<CreateAccount />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/article/view/:uid" element={<ViewArticle />} />
                <Route path="/article/post" element={<PostArticle />} />
                <Route path="/article/edit" element={<EditArticle />} />
                <Route path="/user/:user" element={<User />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </CurrentUserContext.Provider>
    </>
  );
}
