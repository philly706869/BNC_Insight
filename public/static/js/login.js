const [getID, throwIDError, clearIDError] = getInputFunction("id-input");
const [getPW, throwPWError, clearPWError] = getInputFunction("password-input");

const signupButton = document.querySelector(".signup-button");

signupButton.addEventListener("click", (event) => {
  event.preventDefault();

  clearIDError();
  clearPWError();

  const id = getID();
  const pw = getPW();

  throwIDError("test error");
  throwPWError("test error");
});
