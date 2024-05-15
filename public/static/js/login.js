import intializeInput from "./intializeInput.js";

// input 제어 함수 불러오기
const emailInput = intializeInput("email-input");
const passwordInput = intializeInput("password-input");

const loginButton = document.querySelector(".submit-button");

// login 버튼 클릭시 이벤트 처리
loginButton.addEventListener("click", (event) => {
  // 기존 이벤트 막기
  event.preventDefault();

  // 오류 메세지 지우기
  emailInput.clearError();
  passwordInput.clearError();

  // input에서 값 불러오기
  const email = emailInput.value;
  const password = passwordInput.value;

  emailInput.throwError("test error");
  passwordInput.throwError("test error");
});
