import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryContext } from "../contexts/CategoryContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { signout } from "../services/auth-service";

import fonts from "../styles/fonts.module.scss";
import styles from "../styles/Header.module.scss";

export default function Header() {
  const currentUser = useContext(CurrentUserContext);
  const categories = useContext(CategoryContext);
  const date = new Date();
  const navigate = useNavigate();

  return (
    <header className={`${styles.container} ${fonts.robotoSlab}`}>
      <time className={styles.time} dateTime={date.toISOString().split(`T`)[0]}>
        {date.toDateString()}
      </time>
      <Link className={`${styles.logo} ${fonts.cormorant}`} to="/">
        BNC_Insight
      </Link>
      <nav className={styles.user}>
        {currentUser.isInitialized ? (
          currentUser.data ? (
            <>
              <Link to="/myaccount">{currentUser.data.name}</Link>
              <button
                onClick={async () => {
                  await signout();
                  navigate("/");
                  navigate(0);
                }}
              >
                Logout
              </button>
              <Link to="/myarticles">My Articles</Link>
            </>
          ) : (
            <>
              <Link to="/signup">Sign up</Link>
              <Link to="/signin">Sign in</Link>
            </>
          )
        ) : null}
      </nav>
      <nav className={styles.categories}>
        {categories.isInitialized && (
          <>
            <Link to="/articles">All</Link>
            <Link to="/articles?category=">Uncategorized</Link>
            {categories.data.map(({ name: category }) => (
              <Link key={category} to={`/articles?category=${category}`}>
                {category}
              </Link>
            ))}
          </>
        )}
      </nav>
    </header>
  );
}
