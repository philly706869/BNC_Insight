const getInputFunction = (id) => {
  const input = document.querySelector(`#${id}`);
  const errorMessageLabel = document.querySelector(`.error-message[for=${id}]`);

  const getValue = () => input.value;

  const throwError = (error) => {
    input.classList.add("input-error");
    errorMessageLabel.innerText = error;
    errorMessageLabel.hidden = false;
  };

  const clearError = () => {
    input.classList.remove("input-error");
    errorMessageLabel.innerText = "";
    errorMessageLabel.hidden = true;
  };

  input.addEventListener("input", () => {
    clearError();
  });

  return [getValue, throwError, clearError];
};

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
