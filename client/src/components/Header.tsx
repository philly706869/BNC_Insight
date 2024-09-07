import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/MeContext";
import fonts from "../styles/fonts.module.css";
import styles from "../styles/Header.module.css";

export default function Header() {
  const currentUser = useContext(CurrentUserContext);
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
        {(() => {
          switch (currentUser) {
            case undefined:
              return <></>;
            case null:
              return (
                <>
                  <Link to="/signup">Create Account</Link>
                  <Link to="/login">Login</Link>
                </>
              );
            default:
              <>
                <Link to="/user">{currentUser.name}</Link>
                <button
                  onClick={async () => {
                    await fetch("/api/logout", { method: "POST" });
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>;
          }
        })()}
      </nav>
      <nav className={styles.categories}>
        {categories.map(({ name: category }) => (
          <Link key={category} to={`/category/${category}`}>
            {category}
          </Link>
        ))}
      </nav>
    </header>
  );
}
