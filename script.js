const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const form = document.querySelector("[data-contact-form]");
const note = document.querySelector("[data-form-note]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (form && note) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Consulta desde la web - ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nTelefono: ${phone || "No informado"}\n\nMensaje:\n${message}`
    );

    note.textContent = "Abriendo tu cliente de correo para enviar la consulta.";
    window.location.href = `mailto:lumenstrategyvdl@gmail.com?subject=${subject}&body=${body}`;
  });
}
