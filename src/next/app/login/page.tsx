"use client";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./page.module.css";

export default function LogIn() {
  const router = useRouter();

  const idInput = useRef<HTMLInputElement>();
  const [idHelperText, setIdHelperText] = useState("");
  const passwordInput = useRef<HTMLInputElement>();
  const [passwordHelperText, setPasswordHelperText] = useState("");

  return (
    <>
      <title>BNC_Insight Login</title>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <TextField
          label="ID"
          fullWidth
          inputRef={idInput}
          helperText={idHelperText}
          error={idHelperText.length > 0}
          autoComplete="off"
          spellCheck="false"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          inputRef={passwordInput}
          helperText={passwordHelperText}
          error={passwordHelperText.length > 0}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          className={styles.submit}
          onClick={async () => {
            const id = idInput.current!.value;
            const password = passwordInput.current!.value;

            const res = await fetch("/api/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, password }),
            });

            if (!res.ok) {
              setIdHelperText("error");
              setPasswordHelperText("error");
              return;
            }

            router.push("/");
          }}
        >
          Login
        </button>
      </div>
    </>
  );
}
