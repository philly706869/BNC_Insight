import { FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralTextField } from "../components/GeneralTextField";
import { signup, verifyAuthToken } from "../services/auth-service";
import { TextFieldChangeEvent } from "../types/mui";

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

  const authTokenSubmitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const valid = await verifyAuthToken(token);
      if (!valid) {
        setTokenMessage("Invalid auth token");
        return;
      }
      setHasToken(true);
    },
    [token]
  );

  const authTokenChangeHandler = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setToken(target.value);
      setTokenMessage(null);
    },
    []
  );

  const credentialSubmitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [name, password, token, username, navigate]
  );

  const usernameChangeHandler = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setUsername(target.value);
      setUsernameMessage(null);
    },
    []
  );

  const passwordChangeHandler = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setPassword(target.value);
      setPasswordMessage(null);
    },
    []
  );

  const nameChangeHandler = useCallback(({ target }: TextFieldChangeEvent) => {
    setName(target.value);
    setNameMessage(null);
  }, []);

  return (
    <>
      <h1>Sign Up</h1>
      {!hasToken ? (
        <form onSubmit={authTokenSubmitHandler}>
          <GeneralTextField
            label="Auth Token"
            value={token}
            onChange={authTokenChangeHandler}
            helperText={tokenMessage ?? ""}
            error={tokenMessage !== null}
            autoFocus
          />
          <button type="submit">Next</button>
        </form>
      ) : (
        <form onSubmit={credentialSubmitHandler}>
          <GeneralTextField
            label="Username"
            value={username}
            onChange={usernameChangeHandler}
            helperText={usernameMessage ?? ""}
            error={usernameMessage !== null}
            autoFocus
          />
          <GeneralTextField
            label="Password"
            value={password}
            onChange={passwordChangeHandler}
            helperText={passwordMessage ?? ""}
            error={passwordMessage !== null}
          />
          <GeneralTextField
            label="Name"
            value={name}
            onChange={nameChangeHandler}
            helperText={nameMessage ?? ""}
            error={nameMessage !== null}
          />
          <button type="submit">Sign Up</button>
        </form>
      )}
    </>
  );
}
