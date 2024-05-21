import intializeInput from "./intializeInput.js";
import byteSizeOf from "./byteSizeOf.js";

// input 초기화 하기
const emailInput = intializeInput("email-input");
const passwordInput = intializeInput("password-input");
const passwordConfirmInput = intializeInput("password-confirm-input");
const nameInput = intializeInput("name-input");
const authTokenInput = intializeInput("auth-token-input");

const signupButton = document.querySelector(".continue-button");

// sign up 버튼 클릭시 이벤트 처리
signupButton.addEventListener("click", async (event) => {
  // 기존 이벤트 막기
  event.preventDefault();

  // 오류 메세지 지우기
  emailInput.clearError();
  passwordInput.clearError();
  passwordConfirmInput.clearError();
  nameInput.clearError();
  authTokenInput.clearError();

  emailInput.throwError("test\ntest");

  // input에서 값 불러오기
  const email = emailInput.value.trim() || "";
  const password = passwordInput.value || "";
  const passwordConfirm = passwordConfirmInput.value || "";
  const name = nameInput.value.trim() || "";
  const authToken = authTokenInput.value.trim() || "";

  // 전체 성공 여부
  let success = true;

  const fail = (input, message) => {
    success = false;
    input.throwError(message);
  };

  // Email 유효성 검사
  switch (true) {
  }

  // Password 유효성 검사
  switch (true) {
    case password.length < 12:
      fail(passwordInput, "Password cannot be shoter than 12 characters.");
      break;
    case byteSizeOf(password) > 72:
      fail("Password cannot be greater than 72 bytes.");
      break;
  }

  // Password Confirm 유효성 검사
  if (passwordConfirm !== password)
    fail(passwordConfirmInput, "Password does not match.");

  // Name 유효성 검사
  switch (true) {
    case name.length < 1:
      fail(nameInput, "Name cannot be empty.");
      break;
    case name.length > 32:
      fail(nameInput, "Name must be greater than 32 charaters.");
      break;
  }

  if (!success) return;

  const res = await fetch("/api/signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      name: name,
      authToken: authToken,
    }),
  });

  if (res.ok) window.location.replace("/");

  const {
    email: emailError,
    password: passwordError,
    name: nameError,
    authToken: authTokenError,
  } = (await res.json()).error;

  if (emailError) emailInput.throwError(emailError);
  if (passwordError) passwordInput.throwError(passwordError);
  if (nameError) nameInput.throwError(nameError);
  if (authTokenError) authTokenInput.throwError(authTokenError);
});
