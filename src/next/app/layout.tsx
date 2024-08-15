import Header from "@/components/header";
import { Metadata } from "next";
import { ReactNode } from "react";
import "./global.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "BNC_Insight Login",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.decoline}></div>
        <div className={styles.container}>
          <Header />
          <div className={styles.content}>{children}</div>
        </div>
        <div className={styles.decoline}></div>
      </body>
    </html>
  );
}
