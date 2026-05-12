import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHcbdhWvpkbCOnqD_3cjxlQVFrpp_Im7o",
  authDomain: "lumen-5af1f.firebaseapp.com",
  projectId: "lumen-5af1f",
  storageBucket: "lumen-5af1f.firebasestorage.app",
  messagingSenderId: "867784149626",
  appId: "1:867784149626:web:79b3ecbb38c3500aa5c9c3",
  measurementId: "G-L1LT9N61QE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const submitButton = form.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    
    note.textContent = "Enviando mensaje...";
    note.style.color = "var(--primary)";

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    try {
      // Guardar en Firebase Firestore
      await addDoc(collection(db, "contactos"), {
        nombre: name,
        email: email,
        telefono: phone,
        mensaje: message,
        fecha: serverTimestamp()
      });

      note.textContent = "¡Mensaje enviado y guardado con éxito! Nos contactaremos pronto.";
      note.style.color = "#10b981"; // Color verde éxito
      form.reset();

      // Opcional: Abrir mailto como respaldo
      const subject = encodeURIComponent(`Consulta desde la web - ${name}`);
      const body = encodeURIComponent(
        `Nombre: ${name}\nEmail: ${email}\nTelefono: ${phone || "No informado"}\n\nMensaje:\n${message}`
      );
      setTimeout(() => {
        window.location.href = `mailto:lumenstrategyvdl@gmail.com?subject=${subject}&body=${body}`;
      }, 1500);

    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      note.textContent = "Hubo un error al guardar el mensaje. Por favor, intenta nuevamente.";
      note.style.color = "#ef4444"; // Color rojo error
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
