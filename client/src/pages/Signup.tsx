import { FC, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralTextField } from "../components/GeneralTextField";
import { signup, verifyAuthToken } from "../services/auth-service";
import { TextFieldChangeEvent } from "../types/mui";

export const Signup: FC = () => {
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

  const handleAuthTokenSubmit = useCallback(
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

  const handleAuthTokenChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setToken(target.value);
      setTokenMessage(null);
    },
    []
  );

  const handleCredentialsSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        await signup(token, username, password, name);
        navigate("/");
        navigate(0);
      } catch (error: any) {
        const details = error.details;
        if (details) {
          const usernameError = details?.fieldErrors?.username?.errorMessage;
          if (typeof usernameError === "string") {
            setUsernameMessage(usernameError);
            return;
          }
          const passwordError = details?.fieldErrors?.password?.errorMessage;
          if (typeof passwordError === "string") {
            setPasswordMessage(passwordError);
            return;
          }
          const nameError = details?.fieldErrors?.name?.errorMessage;
          if (typeof nameError === "string") {
            setNameMessage(nameError);
            return;
          }
        }
        alert("Unknown error occured while signing up");
      }
    },
    [name, password, token, username, navigate]
  );

  const handleUsernameChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setUsername(target.value);
      setUsernameMessage(null);
    },
    []
  );

  const handlePasswordChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setPassword(target.value);
      setPasswordMessage(null);
    },
    []
  );

  const handleNameChange = useCallback(({ target }: TextFieldChangeEvent) => {
    setName(target.value);
    setNameMessage(null);
  }, []);

  return (
    <>
      <h1>Sign Up</h1>
      {!hasToken ? (
        <form onSubmit={handleAuthTokenSubmit}>
          <GeneralTextField
            label="Auth Token"
            value={token}
            onChange={handleAuthTokenChange}
            helperText={tokenMessage ?? ""}
            error={tokenMessage !== null}
            autoFocus
          />
          <button type="submit">Next</button>
        </form>
      ) : (
        <form onSubmit={handleCredentialsSubmit}>
          <GeneralTextField
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            helperText={usernameMessage ?? ""}
            error={usernameMessage !== null}
            autoFocus
          />
          <GeneralTextField
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            helperText={passwordMessage ?? ""}
            error={passwordMessage !== null}
          />
          <GeneralTextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            helperText={nameMessage ?? ""}
            error={nameMessage !== null}
          />
          <button type="submit">Sign Up</button>
        </form>
      )}
    </>
  );
};
