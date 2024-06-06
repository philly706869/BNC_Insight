import {} from "../components/account/app.js";
import {} from "../components/account/input.js";
import {} from "../components/account/slide.js";
import {} from "../components/header.js";

const app = document.querySelector("#app");

const idSlide = app.querySelector("#id-slide");
const passwordSlide = app.querySelector("#password-slide");

let id;
let password;

idSlide.addEventListener("submit", async () => {
  const value = idSlide.value;

  const validation = await fetch("/api/validate/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: value }),
  }).then((res) => res.json());

  if (!validation.exists) {
    idSlide.throwError("Wrong ID.");
    return;
  }

  id = value;
  app.nextSlide();
});

passwordSlide.addEventListener("submit", async () => {
  const password = passwordSlide.value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });

  if (!res.ok) {
    passwordSlide.throwError("Wrong password.");
    return;
  }

  window.location.replace("/");
});
