import styles from "../styles/Header.module.scss";

import { FC, useCallback, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryContext } from "../contexts/category-context";
import { CurrentUserContext } from "../contexts/current-user-context";
import { signout } from "../services/auth-service";
import { Logo } from "./Logo";

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

  const handleSignout = useCallback(async () => {
    await signout();
    navigate("/");
    navigate(0);
  }, [navigate]);

  return (
    <header className={styles.container}>
      <section className={styles["first-row"]}>
        <Link className={styles["logo"]} to="/">
          <Logo />
        </Link>
        <nav className={styles["user-navigation"]}>
          {currentUser !== undefined &&
            (currentUser !== null ? (
              <>
                <Link to="/myaccount">{currentUser.name}</Link>
                <button onClick={handleSignout}>Sign out</button>
                <Link to="/myarticles">My Articles</Link>
              </>
            ) : (
              <>
                <Link to="/signup">Sign up</Link>
                <Link to="/signin">Sign in</Link>
              </>
            ))}
        </nav>
      </section>
      <section className={styles["second-row"]}>
        <time className={styles["time-display"]} dateTime={dateTime}>
          {dateString}
        </time>
      </section>
      <section className={styles["third-row"]}>
        <nav className={styles["category-navigation"]}>
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
      </section>
    </header>
  );
};
