"use client";

import { font } from "@/app/font";
import Link from "next/link";
import { useState } from "react";

import styles from "./header.module.css";

const categories = [
  { name: "Financial" },
  { name: "Economy" },
  { name: "Social" },
  { name: "IT" },
  { name: "Science" },
];

// temp
interface User {
  name: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const date = new Date();

  return (
    <header className={`${styles.container} ${font.robotoSlab}`}>
      <time className={styles.time} dateTime={date.toISOString().split(`T`)[0]}>
        {date.toDateString()}
      </time>
      <Link className={`${styles.logo} ${font.cormorant}`} href="/">
        BNC_Insight
      </Link>
      <nav className={styles.user}>
        {user ? (
          <>
            <Link href="/user">{user.name}</Link>
            <button onClick={() => {}}>Sign Out</button>
          </>
        ) : (
          <>
            <Link href="/signup">Sign Up</Link>
            <Link href="/signin">Sign In</Link>
            <button onClick={() => {}}>Test</button>
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
