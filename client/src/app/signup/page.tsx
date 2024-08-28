"use client";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./page.module.css";

export default function SignUp() {
  const router = useRouter();

  const authTokenInput = useRef<HTMLInputElement>();
  const [authTokenHelperText, setAuthTokenHelperText] = useState("");
  const idInput = useRef<HTMLInputElement>();
  const [idHelperText, setIdHelperText] = useState("");
  const passwordInput = useRef<HTMLInputElement>();
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const nameInput = useRef<HTMLInputElement>();
  const [nameHelpterText, setNameHelperText] = useState("");

  return (
    <>
      <title>BNC_Insight Create Account</title>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <TextField
          label="AuthToken"
          fullWidth
          inputRef={authTokenInput}
          helperText={authTokenHelperText}
          error={authTokenHelperText.length > 0}
          autoComplete="off"
          spellCheck="false"
        />
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
        <TextField
          label="Name"
          fullWidth
          inputRef={nameInput}
          helperText={nameHelpterText}
          error={nameHelpterText.length > 0}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          className={styles.submit}
          onClick={async () => {
            const authToken = authTokenInput.current!.value;
            const id = idInput.current!.value;
            const password = passwordInput.current!.value;
            const name = nameInput.current!.value;

            const userPostRes = await fetch("/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ authToken, id, password, name }),
            });

            if (!userPostRes.ok) {
              setAuthTokenHelperText("error");
              setIdHelperText("error");
              setPasswordHelperText("error");
              setNameHelperText("error");
              return;
            }

            const loginRes = await fetch("/api/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, password }),
            });

            if (!loginRes.ok) {
              setAuthTokenHelperText("error");
              setIdHelperText("error");
              setPasswordHelperText("error");
              setNameHelperText("error");
              return;
            }

            router.push("/");
          }}
        >
          Create Account
        </button>
      </div>
    </>
  );
}
