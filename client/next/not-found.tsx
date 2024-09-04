import { Metadata } from "next";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "BNC_Insight Page Not Found",
};

export default function NotFound() {
  return (
    <>
      <span className={styles.message}>Page Not Found</span>
    </>
  );
}
