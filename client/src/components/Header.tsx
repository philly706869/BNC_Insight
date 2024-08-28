"use client";
import { Session, User } from "@/session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fonts } from "../app/fonts";
import styles from "./header.module.css";

const categories = [
  { name: "Financial" },
  { name: "Economy" },
  { name: "Social" },
  { name: "IT" },
  { name: "Science" },
];

export default function Header() {
  const date = new Date();
  const router = useRouter();
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
      <Link className={`${styles.logo} ${fonts.cormorant}`} href="/">
        BNC_Insight
      </Link>
      <nav className={styles.user}>
        {user ? (
          <>
            <Link href="/user">{user.name}</Link>
            <button
              onClick={async () => {
                await fetch("/api/logout", { method: "POST" });
                updateSession();
                router.push("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/signup">Create Account</Link>
            <Link href="/login">Login</Link>
          </>
        )}
      </nav>
      <nav className={styles.categories}>
        {categories.map(({ name: category }) => (
          <Link key={category} href={`/category/${category}`}>
            {category}
          </Link>
        ))}
      </nav>
    </header>
  );
}
