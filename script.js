/* ============================= */
/* INTERACTIVIDAD GENERAL - SEA */
/* ============================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ============================= */
    /* VARIABLES PRINCIPALES */
    /* ============================= */

    const barra = document.querySelector(".barra-navegacion");
    const botonMenu = document.querySelector("#boton-menu");
    const menu = document.querySelector("#menu");
    const enlacesMenu = document.querySelectorAll(".menu a");
    const secciones = document.querySelectorAll("header[id], section[id]");
    const formulario = document.querySelector(".formulario");


    /* ============================= */
    /* MENÚ RESPONSIVE */
    /* ============================= */

    if (botonMenu && menu) {
        botonMenu.addEventListener("click", function () {
            menu.classList.toggle("activo");

            if (menu.classList.contains("activo")) {
                botonMenu.textContent = "×";
                botonMenu.setAttribute("aria-label", "Cerrar menú");
            } else {
                botonMenu.textContent = "☰";
                botonMenu.setAttribute("aria-label", "Abrir menú");
            }
        });
    }


    /* ============================= */
    /* NAVEGACIÓN SUAVE PARA TODOS LOS ENLACES INTERNOS */
    /* ============================= */

    const enlacesInternos = document.querySelectorAll('a[href^="#"]');

    enlacesInternos.forEach(enlace => {
        enlace.addEventListener("click", function (evento) {
            const destino = this.getAttribute("href");

            if (destino.length > 1) {
                const seccionDestino = document.querySelector(destino);

                if (seccionDestino) {
                    evento.preventDefault();

                    const alturaBarra = barra ? barra.offsetHeight : 0;
                    const posicionDestino = seccionDestino.offsetTop - alturaBarra + 5;

                    window.scrollTo({
                        top: posicionDestino,
                        behavior: "smooth"
                    });

                    cerrarMenuMovil();
                }
            }
        });
    });


    function cerrarMenuMovil() {
        if (menu && menu.classList.contains("activo")) {
            menu.classList.remove("activo");

            if (botonMenu) {
                botonMenu.textContent = "☰";
                botonMenu.setAttribute("aria-label", "Abrir menú");
            }
        }
    }


    /* ============================= */
    /* APARTADO ACTIVO DEL MENÚ */
    /* ============================= */

    function activarEnlaceMenu() {
        let posicionActual = window.scrollY + 180;

        secciones.forEach(seccion => {
            const inicioSeccion = seccion.offsetTop;
            const altoSeccion = seccion.offsetHeight;
            const idSeccion = seccion.getAttribute("id");

            if (
                posicionActual >= inicioSeccion &&
                posicionActual < inicioSeccion + altoSeccion
            ) {
                enlacesMenu.forEach(enlace => {
                    enlace.classList.remove("activo");

                    if (enlace.getAttribute("href") === "#" + idSeccion) {
                        enlace.classList.add("activo");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", activarEnlaceMenu);
    activarEnlaceMenu();


    /* ============================= */
    /* CAMBIO VISUAL DE BARRA AL HACER SCROLL */
    /* ============================= */

    function cambiarBarraScroll() {
        if (!barra) return;

        if (window.scrollY > 80) {
            barra.style.background = "rgba(10, 45, 30, 0.97)";
            barra.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.25)";
            barra.style.padding = "12px 7%";
        } else {
            barra.style.background = "rgba(10, 45, 30, 0.88)";
            barra.style.boxShadow = "none";
            barra.style.padding = "16px 7%";
        }
    }

    window.addEventListener("scroll", cambiarBarraScroll);
    cambiarBarraScroll();


    /* ============================= */
    /* ANIMACIONES SUAVES AL DESPLAZARSE */
    /* ============================= */

    const elementosAnimados = document.querySelectorAll(".animado");

    const observadorAnimaciones = new IntersectionObserver(function (entradas) {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.15
    });

    elementosAnimados.forEach((elemento, index) => {
        elemento.style.transitionDelay = `${Math.min(index * 0.03, 0.25)}s`;
        observadorAnimaciones.observe(elemento);
    });


    /* ============================= */
    /* EFECTO EXTRA EN TARJETAS */
    /* ============================= */

    const tarjetas = document.querySelectorAll(".tarjeta, .dato, .objetivo, .miembro");

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("mouseenter", function () {
            this.style.cursor = "pointer";
        });
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
    /* EFECTO INTERACTIVO EN VIDEO */
    /* ============================= */

    const videoPlaceholder = document.querySelector(".video-placeholder");

    if (videoPlaceholder) {
        videoPlaceholder.addEventListener("click", function () {
            this.innerHTML = `
                <p>Próximamente aquí se mostrará el video oficial de SEA</p>
            `;

            this.style.transform = "scale(1.02)";

            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 300);
        });
    }


    /* ============================= */
    /* FORMULARIO DE PROPUESTAS */
    /* ============================= */

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nombre = document.querySelector("#nombre").value.trim();
            const grupo = document.querySelector("#grupo").value.trim();
            const idea = document.querySelector("#idea").value.trim();

            if (nombre === "" || grupo === "" || idea === "") {
                mostrarMensajeFormulario("Por favor, completa todos los campos.", "error");
                return;
            }

            const nuevaPropuesta = {
                nombre: nombre,
                grupo: grupo,
                idea: idea,
                fecha: new Date().toLocaleDateString("es-MX")
            };

            guardarPropuesta(nuevaPropuesta);
            mostrarMensajeFormulario("Gracias por compartir tu propuesta ambiental.", "exito");
            formulario.reset();
            mostrarPropuestasGuardadas();
        });
    }

    function guardarPropuesta(propuesta) {
        let propuestas = JSON.parse(localStorage.getItem("propuestasSEA")) || [];
        propuestas.push(propuesta);
        localStorage.setItem("propuestasSEA", JSON.stringify(propuestas));
    }

    function mostrarMensajeFormulario(texto, tipo) {
        if (!formulario) return;

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

        contenedor.innerHTML = "";

        const titulo = document.createElement("h3");
        titulo.textContent = "Últimas propuestas recibidas";

        const lista = document.createElement("div");
        lista.classList.add("lista-propuestas-js");

        propuestas.slice(-3).reverse().forEach(propuesta => {
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta-propuesta-js");

            const encabezado = document.createElement("h4");
            encabezado.textContent = `${propuesta.nombre} - ${propuesta.grupo}`;

            const texto = document.createElement("p");
            texto.textContent = propuesta.idea;

            const fecha = document.createElement("small");
            fecha.textContent = `Enviada el ${propuesta.fecha}`;

            tarjeta.appendChild(encabezado);
            tarjeta.appendChild(texto);
            tarjeta.appendChild(fecha);

            lista.appendChild(tarjeta);
        });

        contenedor.appendChild(titulo);
        contenedor.appendChild(lista);
    }

    mostrarPropuestasGuardadas();


    /* ============================= */
    /* BOTÓN PARA VOLVER ARRIBA */
    /* ============================= */

    const botonArriba = document.createElement("button");
    botonArriba.textContent = "↑";
    botonArriba.classList.add("boton-arriba");
    botonArriba.setAttribute("aria-label", "Volver arriba");
    document.body.appendChild(botonArriba);

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
    /* EFECTO DE ESCRITURA EN EL SLOGAN */
    /* ============================= */

    const slogan = document.querySelector(".slogan");

    if (slogan) {
        const textoOriginal = slogan.textContent.trim();
        slogan.textContent = "";

        let indice = 0;

        function escribirSlogan() {
            if (indice < textoOriginal.length) {
                slogan.textContent += textoOriginal.charAt(indice);
                indice++;
                setTimeout(escribirSlogan, 45);
            }
        }

        setTimeout(escribirSlogan, 600);
    }


    /* ============================= */
    /* ANIMACIÓN SUAVE PARA ESPACIOS DE IMÁGENES */
    /* ============================= */

    const imagenes = document.querySelectorAll(".marco-imagen");

    imagenes.forEach(imagen => {
        imagen.addEventListener("mousemove", function (evento) {
            const rect = this.getBoundingClientRect();
            const x = evento.clientX - rect.left;
            const y = evento.clientY - rect.top;

            const centroX = rect.width / 2;
            const centroY = rect.height / 2;

            const rotacionX = ((y - centroY) / centroY) * -3;
            const rotacionY = ((x - centroX) / centroX) * 3;

            this.style.transform = `perspective(900px) rotateX(${rotacionX}deg) rotateY(${rotacionY}deg) scale(1.01)`;
        });

        imagen.addEventListener("mouseleave", function () {
            this.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });


    /* ============================= */
    /* ANIMACIÓN SUAVE PARA ICONOS PERSONALIZABLES */
    /* ============================= */

    const iconos = document.querySelectorAll(".icono-contenedor, .avatar-miembro");

    iconos.forEach(icono => {
        icono.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.08)";
        });

        icono.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
        });
    });

});