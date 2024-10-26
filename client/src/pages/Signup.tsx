import { TextField } from "@mui/material";
import { useState } from "react";
import { verifyAuthToken } from "../services/auth-service";

export default function Signup() {
  const [token, setToken] = useState("");
  const [tokenErrorMessage, setTokenErrorMessage] = useState<string | null>("");
  const [username, setUsername] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<
    string | null
  >("");
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >("");
  const [name, setName] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState<string | null>("");

  const [currentInputType, setCurrentInputType] = useState<
    "token" | "username" | "password" | "name"
  >("token");

  return (
    <>
      <h1>Sign Up</h1>
      {currentInputType === "token" && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const valid = await verifyAuthToken(token);
            if (!valid) {
              setTokenErrorMessage("Invalid auth token");
              return;
            }
            setCurrentInputType("username");
          }}
        >
          <TextField
            label="Auth Token"
            fullWidth
            value={token}
            onChange={({ target }) => {
              setToken(target.value);
              setTokenErrorMessage(null);
            }}
            helperText={tokenErrorMessage ?? ""}
            error={tokenErrorMessage !== null}
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          <input type="submit">Next</input>
        </form>
      )}
      {currentInputType === "username" && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
          }}
        >
          <TextField
            label="Username"
            fullWidth
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
          <input type="submit">Next</input>
        </form>
      )}
      {currentInputType === "password" && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
          }}
        >
          <TextField
            label="Password"
            fullWidth
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);
              setPasswordErrorMessage(null);
            }}
            helperText={usernameErrorMessage ?? ""}
            error={usernameErrorMessage !== null}
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          <input type="submit">Next</input>
        </form>
      )}
      {currentInputType === "name" && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
          }}
        >
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={({ target }) => {
              setName(target.value);
              setNameErrorMessage(null);
            }}
            helperText={nameErrorMessage ?? ""}
            error={nameErrorMessage !== null}
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          <input type="submit">Sign Up</input>
        </form>
      )}
    </>
  );
}
