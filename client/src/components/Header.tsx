import styles from "../styles/Header.module.scss";

import { FC, useCallback, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryContext } from "../contexts/category-context";
import { CurrentUserContext } from "../contexts/current-user-context";
import { signout } from "../services/auth-service";
import { getDateTime } from "../utils/time";
import { Logo } from "./Logo";

export const Header: FC = () => {
  const currentUser = useContext(CurrentUserContext);
  const categories = useContext(CategoryContext);

  const navigate = useNavigate();

  const [dateTime, dateString] = useMemo(() => {
    const date = new Date();
    const dateTime = getDateTime(date);
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
      <div className={styles.headline}>
        <section>
          <time className={styles.time} dateTime={dateTime}>
            {dateString}
          </time>
        </section>
        <section>
          <Link className={styles.logo} to="/">
            <Logo />
          </Link>
        </section>
        <section>
          <nav>
            {currentUser !== undefined &&
              (currentUser !== null ? (
                <>
                  <Link className={styles["nav-button"]} to="/myaccount">
                    {currentUser.name}
                  </Link>
                  <button
                    className={styles["nav-button"]}
                    onClick={handleSignout}
                  >
                    Sign out
                  </button>
                  <Link className={styles["nav-button"]} to="/myarticles">
                    My Articles
                  </Link>
                </>
              ) : (
                <>
                  <Link className={styles["nav-button"]} to="/signup">
                    Sign up
                  </Link>
                  <Link className={styles["nav-button"]} to="/signin">
                    Sign in
                  </Link>
                </>
              ))}
          </nav>
        </section>
      </div>
      <nav className={styles["category-nav"]}>
        {categories !== undefined && (
          <>
            <Link className={styles["nav-button"]} to="/articles">
              All
            </Link>
            <Link className={styles["nav-button"]} to="/articles?category=">
              Uncategorized
            </Link>
            {categories.map(({ name: category }) => (
              <Link
                key={category}
                className={styles["nav-button"]}
                to={`/articles?category=${category}`}
              >
                {category}
              </Link>
            ))}
          </>
        )}
      </nav>
    </header>
  );
};
