import styles from "./styles/Layout.module.scss";

import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";

export const Layout: FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.decoline}></div>
        <Header />
        <div className={styles["children-container"]}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
        <div className={styles.decoline}></div>
      </div>
    </>
  );
};
