import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../services/auth-service";

export default function Signin() {
  const navigate = useNavigate();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<
    string | null
  >(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >(null);

  return (
    <>
      <h1>Sign In</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await signin(username, password);
            navigate("/");
            navigate(0);
          } catch {
            usernameInputRef.current!.focus();
            alert("Failed to sign in");
          }
        }}
      >
        <TextField
          label="Username"
          fullWidth
          inputRef={usernameInputRef}
          value={username}
          onChange={({ target }) => {
            setUsername(target.value);
            setUsernameErrorMessage(null);
          }}
          helperText={usernameErrorMessage ?? ""}
          error={usernameErrorMessage !== null}
          autoComplete="off"
          spellCheck="false"
          autoFocus
        />
        <TextField
          label="Password"
          fullWidth
          inputRef={passwordInputRef}
          value={password}
          onChange={({ target }) => {
            setPassword(target.value);
            setPasswordErrorMessage(null);
          }}
          helperText={passwordErrorMessage ?? ""}
          error={passwordErrorMessage !== null}
          type="password"
          autoComplete="off"
          spellCheck="false"
        />
        <button type="submit">Sign In</button>
      </form>
    </>
  );
}
