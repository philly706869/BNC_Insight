import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import styles from "./styles/Layout.module.css";

export default function Layout() {
  return (
    <>
      <div className={styles.body}>
        <div className={styles.decoline}></div>
        <div className={styles.container}>
          <Header />
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
        <div className={styles.decoline}></div>
      </div>
    </>
  );
}
