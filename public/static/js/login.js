import intializeInput from "./intializeInput.js";

// input 제어 함수 불러오기
const idInput = intializeInput("id-input");
const pwInput = intializeInput("password-input");

const loginButton = document.querySelector(".submit-button");

// login 버튼 클릭시 이벤트 처리
loginButton.addEventListener("click", (event) => {
  // 기존 이벤트 막기
  event.preventDefault();

  // 오류 메세지 지우기
  idInput.clearError();
  pwInput.clearError();

  // input에서 값 불러오기
  const id = idInput.value;
  const pw = pwInput.value;

  idInput.throwError("test error");
  pwInput.throwError("test error");
});
