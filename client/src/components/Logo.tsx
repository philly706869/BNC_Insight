import { FC } from "react";
import { ReactComponent as CHNLogo } from "../assets/CHN.svg";
import styles from "../styles/Logo.module.scss";

export const Logo: FC = () => {
  return <CHNLogo className={styles.logo} />;
};
