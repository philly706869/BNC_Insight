const [getID, throwIDError, clearIDError] = getInputFunction("id-input");
const [getPW, throwPWError, clearPWError] = getInputFunction("password-input");
const [getPWC, throwPWCError, clearPWCError] = getInputFunction(
  "password-confirm-input"
);
const [getName, throwNameError, clearNameError] =
  getInputFunction("name-input");
const [getAuthToken, throwAuthTokenError, clearAuthTokenError] =
  getInputFunction("auth-token-input");

const signupButton = document.querySelector(".signup-button");

signupButton.addEventListener("click", (event) => {
  event.preventDefault();

  clearIDError();
  clearPWError();
  clearPWCError();
  clearNameError();
  clearAuthTokenError();

  const id = getID();
  const pw = getPW();
  const pwc = getPWC();
  const name = getName();
  const authToken = getAuthToken();

  throwIDError("test error");
  throwPWError("test error");
  throwPWCError("test error");
  throwNameError("test error");
  throwAuthTokenError("test error");
});
