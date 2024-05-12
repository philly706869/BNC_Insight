import intializeInput from "./intializeInput.js";

// input 초기화 하기
const idInput = intializeInput("id-input");
const pwInput = intializeInput("password-input");
const pwcInput = intializeInput("password-confirm-input");
const nameInput = intializeInput("name-input");
const authTokenInput = intializeInput("auth-token-input");

const signupButton = document.querySelector(".submit-button");

// sign up 버튼 클릭시 이벤트 처리
signupButton.addEventListener("click", async (event) => {
  // 기존 이벤트 막기
  event.preventDefault();

  // 오류 메세지 지우기
  idInput.clearError();
  pwInput.clearError();
  pwcInput.clearError();
  nameInput.clearError();
  authTokenInput.clearError();

  // input에서 값 불러오기
  const id = idInput.value.trim() || "";
  const pw = pwInput.value || "";
  const pwc = pwcInput.value || "";
  const name = nameInput.value.trim() || "";
  const authToken = authTokenInput.value.trim() || "";

  // 전체 성공 여부
  let success = true;

  const fail = (input, message) => {
    success = false;
    input.throwError(message);
  };

  // ID 유효성 검사
  switch (true) {
    case id.length < 1:
      fail(idInput, "ID cannot be empty");
      break;
    case id.length > 32:
      fail(idInput, "ID cannot be greater than 32 characters.");
      break;
    case !/^\w+$/.test(id):
      fail(idInput, "ID can only contain A-Z, a-z, 0-9, _.");
      break;
  }

  // PW 유효성 검사
  switch (true) {
    case pw.length < 12:
      fail(pwInput, "Password cannot be shoter than 12 characters.");
      break;
    case id.length > 32:
      fail("Password cannot be greater than 32 characters.");
      break;
  }

  // PWC 유효성 검사
  if (pwc !== pw) fail(pwcInput, "Password does not match.");

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

  const res = await fetch("/signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      password: pw,
      name: name,
      authToken: authToken,
    }),
  });

  if (res.ok) {
    window.location.replace("/");
  }
});
