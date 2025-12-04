const modal = document.getElementById("loginModal")
const loginBtn = document.getElementById("loginBtn")
const closeModal = document.getElementById("closeModal")

const form = document.getElementById("formLogin")
const toggleForm = document.getElementById("toggleForm")
const toggleText = document.getElementById("toggleText")
const modalTitle = document.getElementById("modalTitle")
const submitBtn = document.getElementById("submitBtn")

const nombreInput = document.getElementById("nombre")
const emailInput = document.getElementById("login")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmPassword")

let isRegister = false

// Abrir modal
loginBtn.addEventListener("click", () => {
    modal.style.display = "flex"
})

// Cerrar modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none"
})

// Cambiar entre Login y Registro
toggleForm.addEventListener("click", (e) => {
    e.preventDefault()
    isRegister = !isRegister

    if (isRegister) {
        modalTitle.textContent = "Registrarse"
        submitBtn.textContent = "Registrar"
        toggleText.textContent = "¿Ya tienes cuenta?"
        toggleForm.textContent = " Inicia sesión"
        nombreInput.style.display = "block"
        confirmPasswordInput.style.display = "block"
    } else {
        modalTitle.textContent = "Iniciar Sesión"
        submitBtn.textContent = "Login"
        toggleText.textContent = "¿No tienes cuenta?"
        toggleForm.textContent = " Regístrate"
        nombreInput.style.display = "none"
        confirmPasswordInput.style.display = "none"
    }

    if (typeof grecaptcha !== "undefined") {
      grecaptcha.reset()
    }
})

// Enviar formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = emailInput.value
  const password = passwordInput.value
  const nombre = nombreInput.value

  // Obtener token del captcha
  const captchaToken = grecaptcha.getResponse()

  if (!captchaToken) {
    swal("Error", "Confirma que no eres un robot", "error")
    return
  }

  if (isRegister) {
    const confirmPassword = confirmPasswordInput.value

    if (password !== confirmPassword) {
      swal("Error", "Las contraseñas no coinciden", "error")
      return
    }
  }

  const API = "https://proyectofinal-programacionweb-5tosemestre.onrender.com"

  const url = isRegister
    ? `${API}/api/auth/register`
    : `${API}/api/auth/login`

  const body = isRegister
    ? { nombre, email, password, captchaToken }
    : { email, password, captchaToken }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (!res.ok) {
      swal("Error", data.msg || "Algo salió mal", "error")
      grecaptcha.reset() // reinicia captcha al fallar
      return
    }

    // Guardar token
    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))
    }

    swal("¡Listo!", isRegister ? "Usuario registrado" : "Sesión iniciada", "success")
    .then(() => {
      grecaptcha.reset()
      modal.style.display = "none"
      location.reload()
    })

  } catch (error) {
    console.error(error)
    swal("Error", "No se pudo conectar al servidor", "error")
    grecaptcha.reset()
  }
})


// Mostrar usuario si ya está logueado
const userNameSpan = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

const usuarioGuardado = localStorage.getItem("usuario");
const tokenGuardado = localStorage.getItem("token");

if (usuarioGuardado && tokenGuardado) {
  const usuario = JSON.parse(usuarioGuardado);

  // Muestra el correo del usuario
  userNameSpan.textContent = usuario.email;

  // Mostrar botón logout
  logoutBtn.style.display = "inline-block";

  // Ocultar botón login
  loginBtn.style.display = "none";
}

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  location.reload();
});
