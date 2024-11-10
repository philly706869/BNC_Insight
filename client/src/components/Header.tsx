import fonts from "../styles/fonts.module.scss";
import styles from "../styles/Header.module.scss";

import { FC, useCallback, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryContext } from "../contexts/category-context";
import { CurrentUserContext } from "../contexts/current-user-context";
import { signout } from "../services/auth-service";

export const Header: FC = () => {
  const currentUser = useContext(CurrentUserContext);
  const categories = useContext(CategoryContext);

  const navigate = useNavigate();

  const [dateTime, dateString] = useMemo(() => {
    const date = new Date();
    const dateTime = date.toISOString().split(`T`)[0];
    const dateString = date.toDateString();
    return [dateTime, dateString];
  }, []);

  const handleLogout = useCallback(async () => {
    await signout();
    navigate("/");
    navigate(0);
  }, [navigate]);

  return (
    <header className={`${styles.container} ${fonts.robotoSlab}`}>
      <time className={styles.time} dateTime={dateTime}>
        {dateString}
      </time>
      <Link className={`${styles.logo} ${fonts.cormorant}`} to="/">
        BNC_Insight
      </Link>
      <nav className={styles.user}>
        {currentUser !== undefined &&
          (currentUser !== null ? (
            <>
              <Link to="/myaccount">{currentUser.name}</Link>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/myarticles">My Articles</Link>
            </>
          ) : (
            <>
              <Link to="/signup">Sign up</Link>
              <Link to="/signin">Sign in</Link>
            </>
          ))}
      </nav>
      <nav className={styles.categories}>
        {categories !== undefined && (
          <>
            <Link to="/articles">All</Link>
            <Link to="/articles?category=">Uncategorized</Link>
            {categories.map(({ name: category }) => (
              <Link key={category} to={`/articles?category=${category}`}>
                {category}
              </Link>
            ))}
          </>
        )}
      </nav>
    </header>
  );
};
