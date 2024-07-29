import type { Metadata } from "next";
import Link from "next/link";
import { font } from "./font";
import "./global.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "BNC_Insight",
};

const categories = [
  { name: "Financial" },
  { name: "Economy" },
  { name: "Social" },
  { name: "IT" },
  { name: "Science" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const date = new Date();

  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.decoline}></div>
        <header className={styles.header}>
          <div>
            <time
              className={styles.time}
              dateTime={date.toISOString().split(`T`)[0]}
            >
              {date.toDateString()}
            </time>
          </div>
          <div>
            <Link className={`${styles.logo} ${font.cormorant}`} href="/">
              BNC_Insight
            </Link>
          </div>
          <div></div>
        </header>
        <nav className={`${styles.categories} ${font.robotoSlab}`}>
          <ul>
            {categories.map(({ name: category }) => (
              <li key={category}>
                <Link href={`/category/${category}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.container}>{children}</div>
        <div className={styles.decoline}></div>
      </body>
    </html>
  );
}
