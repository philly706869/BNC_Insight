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

      const timePanel = shadowRoot.querySelector("#time-panel");
      timePanel.textContent = new Date().toDateString();

      const userPanel = shadowRoot.querySelector("#user-panel");

      const [firstButton, secondButton] = userPanel.querySelectorAll("li > a");

      if (user) {
        firstButton.textContent = user.name;
        firstButton.setAttribute("href", "/user");

        secondButton.textContent = "Log Out";
        secondButton.removeAttribute("href");
        secondButton.addEventListener("click", async () => {
          await fetch("/api/logout", { method: "POST" });
          window.location.href = "/";
        });
      }
    }
  }
);
