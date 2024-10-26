import { TextField } from "@mui/material";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../services/auth-service";

export default function Signin() {
  const navigate = useNavigate();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <h1>Sign In</h1>
      <TextField
        label="Username"
        fullWidth
        inputRef={usernameInputRef}
        autoComplete="off"
        spellCheck="false"
      />
      <TextField
        label="Password"
        fullWidth
        inputRef={passwordInputRef}
        type="password"
        autoComplete="off"
        spellCheck="false"
      />
      <button
        onClick={async () => {
          try {
            await signin(
              usernameInputRef.current!.value,
              passwordInputRef.current!.value
            );
            navigate("/");
            navigate(0);
          } catch {
            alert("Failed to sign in");
          }
        }}
      >
        Sign In
      </button>
    </>
  );
}
