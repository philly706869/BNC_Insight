import Header from "@/components/header";
import { Session } from "@/session";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Metadata } from "next";
import { ReactNode } from "react";
import "./global.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "BNC_Insight",
};

type Props = {
  children: ReactNode;
};

async function getSession() {
  const res = await fetch("/api/session");
  const session = await res.json();
  return session as Session;
}

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <AppRouterCacheProvider>
          <div className={styles.decoline}></div>
          <div className={styles.container}>
            <Header user={(await getSession()).user} />
            <div className={styles.content}>{children}</div>
          </div>
          <div className={styles.decoline}></div>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
