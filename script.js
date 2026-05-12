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
      // 1. Guardar en Firebase Firestore
      await addDoc(collection(db, "contactos"), {
        nombre: name,
        email: email,
        telefono: phone,
        mensaje: message,
        fecha: serverTimestamp()
      });

      // 2. Enviar correo automático via EmailJS
      const templateParams = {
        name: name,
        email: email,
        phone: phone,
        message: message
      };

      // Usamos el método send de emailjs (asegurándonos de que esté cargado)
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(
          "service_jntry55",
          "template_iupf74m",
          templateParams,
          "sHnF5U9PO99FOUM4D"
        );
      } else {
        throw new Error("El servicio de correo no se cargó correctamente.");
      }

      note.textContent = "¡Mensaje enviado y guardado con éxito! Nos contactaremos pronto.";
      note.style.color = "#10b981";
      form.reset();

    } catch (error) {
      console.error("Error detallado:", error);
      
      let errorMsg = "Hubo un error al procesar tu mensaje.";
      if (error.code === 'permission-denied') {
        errorMsg = "Error de permisos en Firebase. Por favor, revisa las Reglas de Firestore.";
      } else if (error.status === 404 || error.text === 'The user ID is invalid') {
        errorMsg = "Error en la configuración de EmailJS (IDs incorrectos).";
      }
      
      note.textContent = `${errorMsg} (Detalle: ${error.message || error.text || 'Error desconocido'})`;
      note.style.color = "#ef4444";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
