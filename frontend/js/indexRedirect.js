const sendDona = document.getElementById("goDonas");
const sendBebi = document.getElementById("goBebida");
const sendSouv = document.getElementById("goSouvenir");

document.addEventListener("DOMContentLoaded", () => {
    sendDona.addEventListener("click", () => {
        location.href = "categoria.html#formSearch";
    });

    sendBebi.addEventListener("click", () => {
        location.href = "categoria.html#TituloDonas";
    });

    sendSouv.addEventListener("click", () => {
        location.href = "categoria.html#TituloBebidas";
    });
});