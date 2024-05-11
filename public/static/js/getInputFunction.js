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
