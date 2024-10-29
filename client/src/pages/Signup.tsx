import { TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, verifyAuthToken } from "../services/auth-service";

export default function Signup() {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameMessage, setNameMessage] = useState<string | null>(null);

  const [hasToken, setHasToken] = useState<boolean>(false);

  return (
    <>
      <h1>Sign Up</h1>
      {!hasToken ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const valid = await verifyAuthToken(token);
            if (!valid) {
              setTokenMessage("Invalid auth token");
              return;
            }
            setHasToken(true);
          }}
        >
          <TextField
            label="Auth Token"
            fullWidth
            value={token}
            onChange={({ target }) => {
              setToken(target.value);
              setTokenMessage(null);
            }}
            helperText={tokenMessage ?? ""}
            error={tokenMessage !== null}
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          <button type="submit">Next</button>
        </form>
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              await signup(token, username, password, name);
              navigate("/");
              navigate(0);
            } catch (error: any) {
              if (error.details) {
                for (const issue of error.details as {
                  path: string[];
                  message: string;
                }[]) {
                  if (issue.path.includes("username")) {
                    setUsernameMessage(issue.message);
                  } else if (issue.path.includes("password")) {
                    setPasswordMessage(issue.message);
                  } else if (issue.path.includes("name")) {
                    setNameMessage(issue.message);
                  }
                }
              } else {
                alert("Unknown error occured while signing up");
              }
            }
          }}
        >
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={({ target }) => {
              setUsername(target.value);
              setUsernameMessage(null);
            }}
            helperText={usernameMessage ?? ""}
            error={usernameMessage !== null}
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          <TextField
            label="Password"
            fullWidth
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);
              setPasswordMessage(null);
            }}
            helperText={passwordMessage ?? ""}
            error={passwordMessage !== null}
            autoComplete="off"
            spellCheck="false"
          />
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={({ target }) => {
              setName(target.value);
              setNameMessage(null);
            }}
            helperText={nameMessage ?? ""}
            error={nameMessage !== null}
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit">Sign Up</button>
        </form>
      )}
    </>
  );
}
