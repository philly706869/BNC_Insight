"use client";
import { LegacyRef, useState } from "react";
import styles from "../styles/Input.module.css";

type Props = {
  className?: string;
  ref?: LegacyRef<HTMLInputElement>;
  placeholder?: string;
  hideContent?: boolean;
  error?: boolean;
};

export default function Input({
  className,
  ref,
  placeholder,
  hideContent,
  error,
}: Props) {
  const [hold, setHold] = useState(false);

  return (
    <div className={`${styles.container} ${className}`}>
      <input
        className={`${styles.input} ${error ? styles.error : ""}`}
        type={hideContent ? "password" : "text"}
        ref={ref}
        onFocus={() => setHold(true)}
        onBlur={({ target }) => setHold(!!target.value)}
        autoComplete="off"
        spellCheck="false"
        required
      />
      <label className={`${styles.placeholder} ${hold ? styles.hold : ""}`}>
        {placeholder || ""}
      </label>
    </div>
  );
}
