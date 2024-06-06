const html = await fetch("/static/page/components/header.html").then((data) =>
  data.text()
);

const user = await (async () => {
  const res = await fetch("/api/user");
  if (!res.ok) return null;
  return await res.json();
})();

customElements.define(
  "x-header",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.innerHTML = html;

      const userPanel = shadowRoot.querySelector("#user-panel");

      const [firstButton, secondButton] =
        userPanel.querySelectorAll("li > button");

      if (user) {
        firstButton.textContent = user.name;
        firstButton.addEventListener("click", () => {
          window.location.href = "/user";
        });

        secondButton.textContent = "Log Out";
        secondButton.addEventListener("click", async () => {
          await fetch("/api/logout", { method: "POST" });
          window.location.href = "/";
        });
      } else {
        firstButton.textContent = "Log In";
        firstButton.addEventListener("click", () => {
          window.location.href = "/login";
        });

        secondButton.textContent = "Sign Up";
        secondButton.addEventListener("click", () => {
          window.location.href = "/signup";
        });
      }
    }
  }
);
