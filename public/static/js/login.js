import intializeInput from "./intializeInput.js";

// input 제어 함수 불러오기
const emailInput = intializeInput("email-input");
const passwordInput = intializeInput("password-input");

emailInput.addEventListener("input", () => {
  passwordInput.clearError();
});

passwordInput.addEventListener("input", () => {
  emailInput.clearError();
});

const loginButton = document.querySelector(".submit-button");

// login 버튼 클릭시 이벤트 처리
loginButton.addEventListener("click", async (event) => {
  // 기존 이벤트 막기
  event.preventDefault();

  // 오류 메세지 지우기
  emailInput.clearError();
  passwordInput.clearError();

  // input에서 값 불러오기
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await fetch("/api/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (res.ok) window.location.replace("/");

  emailInput.throwError("Email or password is incorrect.");
  passwordInput.throwError("Email or password is incorrect.");
});
