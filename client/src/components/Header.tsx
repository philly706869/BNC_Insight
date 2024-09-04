import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fonts from "../styles/fonts.module.css";
import styles from "../styles/Header.module.css";
import { Session, User } from "../types/session";

const categories = [
  { name: "Financial" },
  { name: "Economy" },
  { name: "Social" },
  { name: "IT" },
  { name: "Science" },
];

export default function Header() {
  const date = new Date();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>();

  function updateSession() {
    fetch("/api/session", { cache: "no-cache" })
      .then((res) => res.json())
      .then((session: Session) => {
        setUser(session.user || null);
      });
  }

  useEffect(() => {
    updateSession();
  }, []);

  return (
    <header className={`${styles.container} ${fonts.robotoSlab}`}>
      <time className={styles.time} dateTime={date.toISOString().split(`T`)[0]}>
        {date.toDateString()}
      </time>
      <Link className={`${styles.logo} ${fonts.cormorant}`} to="/">
        BNC_Insight
      </Link>
      <nav className={styles.user}>
        {user ? (
          <>
            <Link to="/user">{user.name}</Link>
            <button
              onClick={async () => {
                await fetch("/api/logout", { method: "POST" });
                updateSession();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">Create Account</Link>
            <Link to="/login">Login</Link>
          </>
        )}
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
