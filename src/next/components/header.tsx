"use client";
import { User } from "@/session";
import Link from "next/link";
import { fonts } from "../app/fonts";
import styles from "./header.module.css";

const categories = [
  { name: "Financial" },
  { name: "Economy" },
  { name: "Social" },
  { name: "IT" },
  { name: "Science" },
];

type Props = {
  user?: User;
};

export default function Header({ user }: Props) {
  const date = new Date();

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
            <button onClick={() => {}}>Logout</button>
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
