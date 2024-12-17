import styles from "../styles/SignInUp.module.scss";

import { FC, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralTextField } from "../components/GeneralTextField";
import { signin } from "../services/auth-service";
import { TextFieldChangeEvent } from "../types/mui";

export const Signin: FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleCredentialsSubmit = useCallback(
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

  return (
    <>
      <h2 className={styles.title}>Sign In</h2>
      <form className={styles.form} onSubmit={handleCredentialsSubmit}>
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
          type="password"
          value={password}
          onChange={handlePasswordChange}
          helperText={passwordMessage ?? ""}
          error={passwordMessage !== null}
        />
        <button className={styles.submit} type="submit">
          Sign In
        </button>
      </form>
    </>
  );
};
