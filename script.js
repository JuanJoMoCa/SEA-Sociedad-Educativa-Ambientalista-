/* ============================= */
/* INTERACTIVIDAD GENERAL - SEA */
/* ============================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ============================= */
    /* NAVEGACIÓN SUAVE */
    /* ============================= */

    const enlacesMenu = document.querySelectorAll(".menu a");

    enlacesMenu.forEach(enlace => {
        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();

            const idSeccion = this.getAttribute("href");
            const seccion = document.querySelector(idSeccion);

            if (seccion) {
                const alturaMenu = document.querySelector(".barra-navegacion").offsetHeight;

                window.scrollTo({
                    top: seccion.offsetTop - alturaMenu,
                    behavior: "smooth"
                });
            }
        });
    });


    /* ============================= */
    /* MARCAR APARTADO ACTIVO DEL MENÚ */
    /* ============================= */

    const secciones = document.querySelectorAll("section, header");

    function activarMenu() {
        let posicionScroll = window.scrollY + 180;

        secciones.forEach(seccion => {
            const top = seccion.offsetTop;
            const alto = seccion.offsetHeight;
            const id = seccion.getAttribute("id");

            if (posicionScroll >= top && posicionScroll < top + alto) {
                enlacesMenu.forEach(enlace => {
                    enlace.classList.remove("activo");

                    if (enlace.getAttribute("href") === "#" + id) {
                        enlace.classList.add("activo");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", activarMenu);


    /* ============================= */
    /* ANIMACIÓN AL APARECER SECCIONES */
    /* ============================= */

    const elementosAnimados = document.querySelectorAll(
        ".seccion, .tarjeta, .dato, .objetivo, .miembro, .tarjeta-destacada"
    );

    elementosAnimados.forEach(elemento => {
        elemento.style.opacity = "0";
        elemento.style.transform = "translateY(35px)";
        elemento.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    });

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = "1";
                entrada.target.style.transform = "translateY(0)";
            }
        });
    }, {
        threshold: 0.15
    });

    elementosAnimados.forEach(elemento => {
        observador.observe(elemento);
    });


    /* ============================= */
    /* ACORDEÓN: SOLO UNA PREGUNTA ABIERTA */
    /* ============================= */

    const preguntas = document.querySelectorAll("details");

    preguntas.forEach(pregunta => {
        pregunta.addEventListener("toggle", function () {
            if (this.open) {
                preguntas.forEach(otraPregunta => {
                    if (otraPregunta !== this) {
                        otraPregunta.open = false;
                    }
                });
            }
        });
    });


    /* ============================= */
    /* FORMULARIO DE PROPUESTAS */
    /* ============================= */

    const formulario = document.querySelector(".formulario");

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nombre = document.querySelector("#nombre").value.trim();
            const grupo = document.querySelector("#grupo").value.trim();
            const idea = document.querySelector("#idea").value.trim();

            if (nombre === "" || grupo === "" || idea === "") {
                mostrarMensaje("Por favor, completa todos los campos.", "error");
                return;
            }

            const propuesta = {
                nombre: nombre,
                grupo: grupo,
                idea: idea,
                fecha: new Date().toLocaleDateString()
            };

            guardarPropuesta(propuesta);
            mostrarMensaje("¡Gracias por compartir tu propuesta ambiental!", "exito");

            formulario.reset();
            mostrarPropuestasGuardadas();
        });
    }

    function guardarPropuesta(propuesta) {
        let propuestas = JSON.parse(localStorage.getItem("propuestasSEA")) || [];
        propuestas.push(propuesta);
        localStorage.setItem("propuestasSEA", JSON.stringify(propuestas));
    }

    function mostrarMensaje(texto, tipo) {
        let mensaje = document.querySelector(".mensaje-formulario");

        if (!mensaje) {
            mensaje = document.createElement("p");
            mensaje.classList.add("mensaje-formulario");
            formulario.appendChild(mensaje);
        }

        mensaje.textContent = texto;

        if (tipo === "error") {
            mensaje.style.color = "#b91c1c";
            mensaje.style.background = "#fee2e2";
        } else {
            mensaje.style.color = "#166534";
            mensaje.style.background = "#dcfce7";
        }

        mensaje.style.marginTop = "15px";
        mensaje.style.padding = "12px";
        mensaje.style.borderRadius = "12px";
        mensaje.style.fontWeight = "bold";
        mensaje.style.textAlign = "center";

        setTimeout(() => {
            mensaje.textContent = "";
            mensaje.style.padding = "0";
            mensaje.style.background = "transparent";
        }, 3500);
    }


    /* ============================= */
    /* MOSTRAR PROPUESTAS GUARDADAS */
    /* ============================= */

    function mostrarPropuestasGuardadas() {
        const seccionContacto = document.querySelector(".contacto");

        if (!seccionContacto) return;

        let contenedor = document.querySelector(".propuestas-guardadas");

        if (!contenedor) {
            contenedor = document.createElement("div");
            contenedor.classList.add("propuestas-guardadas");
            seccionContacto.appendChild(contenedor);
        }

        const propuestas = JSON.parse(localStorage.getItem("propuestasSEA")) || [];

        if (propuestas.length === 0) {
            contenedor.innerHTML = "";
            return;
        }

        contenedor.innerHTML = `
            <h3>Últimas propuestas recibidas</h3>
            <div class="lista-propuestas-js"></div>
        `;

        const lista = contenedor.querySelector(".lista-propuestas-js");

        propuestas.slice(-3).reverse().forEach(propuesta => {
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta-propuesta-js");

            tarjeta.innerHTML = `
                <h4>${propuesta.nombre} - ${propuesta.grupo}</h4>
                <p>${propuesta.idea}</p>
                <small>Enviada el ${propuesta.fecha}</small>
            `;

            lista.appendChild(tarjeta);
        });

        aplicarEstilosPropuestasJS();
    }

    function aplicarEstilosPropuestasJS() {
        const contenedor = document.querySelector(".propuestas-guardadas");

        if (!contenedor) return;

        contenedor.style.maxWidth = "850px";
        contenedor.style.margin = "35px auto 0";
        contenedor.style.background = "white";
        contenedor.style.padding = "25px";
        contenedor.style.borderRadius = "25px";
        contenedor.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.12)";

        const titulo = contenedor.querySelector("h3");
        titulo.style.color = "#1f4d2f";
        titulo.style.textAlign = "center";
        titulo.style.marginBottom = "20px";

        const tarjetas = contenedor.querySelectorAll(".tarjeta-propuesta-js");

        tarjetas.forEach(tarjeta => {
            tarjeta.style.background = "#edf7e7";
            tarjeta.style.padding = "18px";
            tarjeta.style.borderRadius = "18px";
            tarjeta.style.marginBottom = "15px";
            tarjeta.style.borderLeft = "6px solid #6ca965";
        });
    }

    mostrarPropuestasGuardadas();


    /* ============================= */
    /* EFECTO EN EL VIDEO PLACEHOLDER */
    /* ============================= */

    const videoPlaceholder = document.querySelector(".video-placeholder");

    if (videoPlaceholder) {
        videoPlaceholder.addEventListener("click", function () {
            this.innerHTML = `
                <p>Próximamente aquí se mostrará el video oficial de SEA 🌱</p>
            `;

            this.style.transform = "scale(1.02)";
            this.style.transition = "0.3s";

            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 300);
        });
    }


    /* ============================= */
    /* BOTÓN PARA VOLVER ARRIBA */
    /* ============================= */

    const botonArriba = document.createElement("button");
    botonArriba.textContent = "↑";
    botonArriba.classList.add("boton-arriba");
    document.body.appendChild(botonArriba);

    botonArriba.style.position = "fixed";
    botonArriba.style.right = "25px";
    botonArriba.style.bottom = "25px";
    botonArriba.style.width = "50px";
    botonArriba.style.height = "50px";
    botonArriba.style.borderRadius = "50%";
    botonArriba.style.border = "none";
    botonArriba.style.background = "#1f4d2f";
    botonArriba.style.color = "white";
    botonArriba.style.fontSize = "1.5rem";
    botonArriba.style.fontWeight = "bold";
    botonArriba.style.cursor = "pointer";
    botonArriba.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.25)";
    botonArriba.style.display = "none";
    botonArriba.style.zIndex = "2000";

    window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
            botonArriba.style.display = "block";
        } else {
            botonArriba.style.display = "none";
        }
    });

    botonArriba.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    /* ============================= */
    /* EFECTO DE CAMBIO EN BARRA AL BAJAR */
    /* ============================= */

    const barra = document.querySelector(".barra-navegacion");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 80) {
            barra.style.background = "rgba(10, 45, 30, 0.97)";
            barra.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.25)";
        } else {
            barra.style.background = "rgba(10, 45, 30, 0.88)";
            barra.style.boxShadow = "none";
        }
    });

});