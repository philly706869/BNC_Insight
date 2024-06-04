import {} from "../components/account/app.js";
import {} from "../components/account/input.js";
import {} from "../components/account/slide.js";
import {} from "../components/header.js";

const app = document.querySelector("#app");
const slides = app.querySelectorAll(".slide");

const authTokenSlide = app.querySelector("#auth-token-slide");
const idSlide = app.querySelector("#id-slide");
const passwordSlide = app.querySelector("#password-slide");
const passwordConfirmSlide = app.querySelector("#password-confirm-slide");
const nameSlide = app.querySelector("#name-slide");

let authToken;
let id;
let password;
let name;

authTokenSlide.addEventListener("submit", async () => {
  const value = authTokenSlide.value;

  const res = await fetch("/api/signup/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  const json = await res.json();

  if (!res.ok || !json.valid) {
    authTokenSlide.setAttribute("error", json.error || "invalid token");
    return;
  }

  authToken = value;
  app.nextSlide();
});

idSlide.addEventListener("submit", async () => {
  const value = idSlide.value;

  const res = await fetch("/api/signup/auth/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  const json = await res.json();

  if (!res.ok || !json.valid) {
    idSlide.setAttribute("error", json.error || "invalid id");
    return;
  }

  id = value;
  app.nextSlide();
});

passwordSlide.addEventListener("submit", () => {
  const value = passwordSlide.value;
});
