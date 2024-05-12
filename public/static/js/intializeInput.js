/**
 * input 초기화 함수(input 제어 메소드 등록 함수)
 * errorLabel: 오류 띄울 요소
 * throwError: 오류 띄우는 메서드
 * clearError: 오류 지우는 메서드
 * @param {string} id input id
 * @returns {Element & {errorLabel: Element | null, throwError(error: string): void, clearError(): void } | null} input 요소(실패 시 null)
 */
export const intializeInput = (id) => {
  // input 불러오기
  const input = document.querySelector(`#${id}`);

  // input 불러오는데 실패했거나 이미 초기화 되어있다면 리턴
  if (!input || input.__isInitialized) return input;
  input.__isInitialized = true;

  //오류 띄울 요소 등록
  input.errorLabel = document.querySelector(`.error-message[for=${id}]`);

  //오류 띄우는 함수 등록
  input.throwError = (error) => {
    input.classList.add("input-error");
    input.errorLabel.innerText = error;
    input.errorLabel.hidden = false;
  };

  //오류 지우는 함수 등록
  input.clearError = () => {
    input.classList.remove("input-error");
    input.errorLabel.innerText = "";
    input.errorLabel.hidden = true;
  };

  // input 값 업데이트 시 오류 지우는 이벤트 등록
  input.addEventListener("input", () => {
    clearError();
  });

  return input;
};

export default intializeInput;
