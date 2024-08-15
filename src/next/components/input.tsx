"use client";
import { ChangeEventHandler, useState } from "react";
import styles from "./input.module.css";

type Props = {
  onChange?: ChangeEventHandler;
  placeholder?: string;
  hideContent?: boolean;
  error?: boolean;
};

export default function Input({
  onChange,
  placeholder,
  hideContent,
  error,
}: Props) {
  const [hold, setHold] = useState(false);

  return (
    <div className={styles.container}>
      <input
        className={`${styles.input} ${error ? styles.error : ""}`}
        type={hideContent ? "password" : "text"}
        onChange={onChange}
        onFocus={({ target }) => setHold(true)}
        onBlur={({ target }) => setHold(!!target.value)}
        autoComplete="off"
        spellCheck="false"
        required
      />
      <label
        className={`${styles.placeholder} ${hold ? styles.hold : ""}`}
        htmlFor="input"
      >
        {placeholder || ""}
      </label>
    </div>
  );
}
