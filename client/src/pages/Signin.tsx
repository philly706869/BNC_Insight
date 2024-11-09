import { FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralTextField } from "../components/GeneralTextField";
import { signin } from "../services/auth-service";
import { TextFieldChangeEvent } from "../types/mui";

export default function Signin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<
    string | null
  >(null);
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >(null);

  const formSubmitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        await signin(username, password);
        navigate("/");
        navigate(0);
      } catch {
        alert("Failed to sign in");
      }
    },
    [password, username, navigate]
  );

  const usernameChangeHandler = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setUsername(target.value);
      setUsernameErrorMessage(null);
    },
    []
  );

  const passwordChangeHandler = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setPassword(target.value);
      setPasswordErrorMessage(null);
    },
    []
  );

  return (
    <>
      <h1>Sign In</h1>
      <form onSubmit={formSubmitHandler}>
        <GeneralTextField
          label="Username"
          value={username}
          onChange={usernameChangeHandler}
          helperText={usernameErrorMessage ?? ""}
          error={usernameErrorMessage !== null}
          autoFocus
        />
        <GeneralTextField
          label="Password"
          type="password"
          value={password}
          onChange={passwordChangeHandler}
          helperText={passwordErrorMessage ?? ""}
          error={passwordErrorMessage !== null}
        />
        <button type="submit">Sign In</button>
      </form>
    </>
  );
}
