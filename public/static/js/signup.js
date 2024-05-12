import intializeInput from "./intializeInput.js";

// input 초기화 하기
const idInput = intializeInput("id-input");
const pwInput = intializeInput("password-input");
const pwcInput = intializeInput("password-confirm-input");
const nameInput = intializeInput("name-input");
const authTokenInput = intializeInput("auth-token-input");

const signupButton = document.querySelector(".submit-button");

// sign up 버튼 클릭시 이벤트 처리
signupButton.addEventListener("click", (event) => {
  // 기존 이벤트 막기
  event.preventDefault();

  // 오류 메세지 지우기
  idInput.clearError();
  pwInput.clearError();
  pwcInput.clearError();
  nameInput.clearError();
  authTokenInput.clearError();

  // input에서 값 불러오기
  const id = idInput.value;
  const pw = pwInput.value;
  const pwc = pwcInput.value;
  const name = nameInput.value;
  const authToken = authTokenInput.value;

  idInput.throwError("test error");
  pwInput.throwError("test error");
  pwcInput.throwError("test error");
  nameInput.throwError("test error");
  authTokenInput.throwError("test error");
});
