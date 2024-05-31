import {} from "../components/account/app.js";
import {} from "../components/account/input.js";
import {} from "../components/account/slide.js";
import {} from "../components/header.js";

const authTokenSlide = document.getElementById("auth-token-slide");
const idSlide = document.getElementById("id-slide");
const passwordSlide = document.getElementById("password-slide");
const passwordConfirmSlide = document.getElementById("password-confirm-slide");
const nameSlide = document.getElementById("name-slide");

authTokenSlide.addEventListener("input", (event) => {
  console.log(event);
});

const seconds = 5;

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    authTokenSlide.setAttribute(
      "error",
      `error disapper after ${seconds - i} seconds`
    );
  }, i * 1000);
}

setTimeout(() => {
  authTokenSlide.removeAttribute("error");
}, seconds * 1000);
