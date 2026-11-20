/* =====================================================
   main.js  -  Script único del sitio
   Cada función muestra una técnica del DOM:

   [1] Cambiar contenido        textContent / innerHTML
   [2] Modificar estilos CSS    elemento.style.propiedad
   [3] Agregar / quitar clases  classList.add / remove / toggle
   [4] Atributos                getAttribute / setAttribute / removeAttribute
   [5] Eventos (3 formas)       onclick en HTML, propiedad onclick, addEventListener
   [6] Crear / insertar / eliminar  createElement / appendChild / remove
   ===================================================== */

"use strict";

/* -----------------------------------------------------
   EVENTO FORMA 1: atributo onclick escrito en el HTML
   (index.html: <button onclick="cambiarSaludo()">)
   La función debe ser global para que el HTML la encuentre.
   ----------------------------------------------------- */
const saludos = [
  "¡Gracias por visitar mi sitio profesional!",
  "Me encantaría trabajar contigo, escríbeme.",
  "Aquí puedes conocer mi experiencia y mis proyectos.",
  "Bienvenido a mi portafolio."
];
let indiceSaludo = -1; // -1 para que el primer clic muestre el primer saludo

function cambiarSaludo() {
  indiceSaludo = (indiceSaludo + 1) % saludos.length;
  // [1] CAMBIAR CONTENIDO con textContent
  document.getElementById("saludo").textContent = saludos[indiceSaludo];
}

/* -----------------------------------------------------
   Arranque: se ejecuta cuando el HTML ya cargó
   y según la página activa llama a su función.
   ----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarGeneral();

  const pagina = document.body.dataset.pagina; // lee data-pagina="..."
  const paginas = {
    inicio: iniciarInicio,
    perfil: iniciarPerfil,
    experiencia: iniciarExperiencia,
    formacion: iniciarFormacion,
    proyectos: iniciarProyectos,
    referencias: iniciarReferencias
  };
  if (paginas[pagina]) paginas[pagina]();
});

/* =====================================================
   GENERAL (se usa en las 6 páginas)
   ===================================================== */
function iniciarGeneral() {
  // [1] Cambiar contenido: año del pie de página
  document.getElementById("anio").textContent = new Date().getFullYear();

  // [4] Atributos + [3] Clases: modo claro / oscuro
  const html = document.documentElement;
  const btnTema = document.getElementById("btn-tema");

  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado) aplicarTema(temaGuardado);

  btnTema.addEventListener("click", () => {
    // getAttribute lee el valor y setAttribute lo modifica
    const nuevo = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    aplicarTema(nuevo);
    localStorage.setItem("tema", nuevo);
  });

  function aplicarTema(tema) {
    html.setAttribute("data-bs-theme", tema);
    const icono = btnTema.querySelector("i");
    // [3] reemplazar clases del icono
    icono.classList.remove("bi-moon-stars", "bi-sun");
    icono.classList.add(tema === "dark" ? "bi-sun" : "bi-moon-stars");
  }

  // [5] Evento scroll + [3] classList.toggle: botón "subir"
  const btnSubir = document.getElementById("btn-subir");
  window.addEventListener("scroll", () => {
    btnSubir.classList.toggle("visible", window.scrollY > 300);
  });
  btnSubir.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* =====================================================
   PÁGINA 1: INICIO (datos personales y contacto)
   ===================================================== */
function iniciarInicio() {
  const hero = document.querySelector(".hero");
  const foto = document.getElementById("foto");

  /* ---- EVENTO FORMA 2: propiedad onclick desde JavaScript ---- */
  const colores = [
    ["#4f46e5", "#06b6d4"],
    ["#059669", "#84cc16"],
    ["#e11d48", "#f59e0b"],
    ["#7c3aed", "#ec4899"]
  ];
  let c = 0;
  document.getElementById("btn-color").onclick = function () {
    c = (c + 1) % colores.length;
    // [2] MODIFICAR ESTILOS CSS con element.style
    hero.style.background = `linear-gradient(135deg, ${colores[c][0]}, ${colores[c][1]})`;
    document.getElementById("nombre").style.textShadow = "2px 2px 8px rgba(0,0,0,.35)";
  };

  /* ---- EVENTO FORMA 3: addEventListener ---- */
  const btnAtributos = document.getElementById("btn-atributos");
  const info = document.getElementById("info-atributos");

  btnAtributos.addEventListener("click", () => {
    // [4] CONSULTAR atributos
    const src = foto.getAttribute("src");
    const alt = foto.getAttribute("alt");
    const correo = document.getElementById("enlace-correo").getAttribute("href");

    // [4] MODIFICAR y QUITAR atributos
    foto.setAttribute("title", "Foto de perfil de Daniela");
    foto.removeAttribute("width"); // si no existe, no pasa nada

    // [1] innerHTML/textContent para mostrar el resultado
    info.textContent = `src   = ${src}\nalt   = ${alt}\nhref  = ${correo}\ntiene title: ${foto.hasAttribute("title")}`;
    // [3] mostrar u ocultar con classList.toggle
    info.classList.toggle("oculto");
  });

  // Otro evento con addEventListener: clic en la foto -> clase resaltado
  foto.addEventListener("click", () => {
    foto.classList.toggle("resaltado"); // [3] agrega o quita la clase
  });

  /* ---- Lista de contacto: eventos del mouse ---- */
  const lista = document.getElementById("lista-contacto");

  lista.addEventListener("mouseover", (e) => {
    const item = e.target.closest("li");
    if (item) item.classList.add("fila-activa");
  });
  lista.addEventListener("mouseout", (e) => {
    const item = e.target.closest("li");
    if (item) item.classList.remove("fila-activa");
  });

  /* ---- [6] CREAR e INSERTAR un elemento nuevo ---- */
  document.getElementById("form-contacto").addEventListener("submit", (e) => {
    e.preventDefault(); // evita que la página se recargue
    const etiqueta = document.getElementById("dato-etiqueta");
    const valor = document.getElementById("dato-valor");

    const li = document.createElement("li");                       // crear
    li.className = "list-group-item d-flex justify-content-between align-items-center nuevo";
    li.innerHTML = `<span><i class="bi bi-link-45deg text-primary me-2"></i><strong></strong> </span>`;
    li.querySelector("strong").textContent = etiqueta.value + ":";
    li.querySelector("span").append(valor.value);                  // texto seguro
    lista.appendChild(li);                                         // insertar

    e.target.reset();
    etiqueta.focus();
  });

  /* ---- [6] ELIMINAR un elemento ---- */
  document.getElementById("btn-quitar-ultimo").addEventListener("click", () => {
    const ultimo = lista.lastElementChild;
    if (ultimo && lista.children.length > 1) ultimo.remove();      // eliminar
  });
}

/* =====================================================
   PÁGINA 2: PERFIL PROFESIONAL
   ===================================================== */
function iniciarPerfil() {
  // [2] Estilos: animar barras de progreso con style.width
  document.querySelectorAll(".progress-bar").forEach((barra) => {
    const nivel = barra.getAttribute("data-nivel");   // [4] leer atributo data-*
    setTimeout(() => (barra.style.width = nivel + "%"), 200);
  });

  // [2] Estilos: cambiar el tamaño del texto
  const texto = document.getElementById("texto-perfil");
  let tamanio = 16;
  document.getElementById("btn-mas").addEventListener("click", () => {
    if (tamanio < 26) tamanio += 2;
    texto.style.fontSize = tamanio + "px";
  });
  document.getElementById("btn-menos").addEventListener("click", () => {
    if (tamanio > 12) tamanio -= 2;
    texto.style.fontSize = tamanio + "px";
  });

  // [3] Clases + [1] contenido: mostrar / ocultar párrafo extra
  const extra = document.getElementById("parrafo-extra");
  const btnLeer = document.getElementById("btn-leer");
  btnLeer.addEventListener("click", () => {
    const oculto = extra.classList.toggle("oculto");
    btnLeer.textContent = oculto ? "Leer más" : "Leer menos";
  });

  // [6] Crear etiquetas (badges) y eliminarlas al hacer clic
  const contenedor = document.getElementById("etiquetas");
  document.getElementById("form-etiqueta").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("nueva-etiqueta");
    const badge = document.createElement("span");
    badge.className = "badge rounded-pill text-bg-warning nuevo";
    badge.style.cursor = "pointer";
    badge.setAttribute("title", "Clic para quitar");
    badge.textContent = input.value;
    contenedor.appendChild(badge);
    e.target.reset();
  });
  contenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains("text-bg-warning")) e.target.remove();
  });
}

/* =====================================================
   PÁGINA 3: EXPERIENCIA LABORAL
   ===================================================== */
function iniciarExperiencia() {
  const tbody = document.querySelector("#tabla-exp tbody");
  const totalAnios = document.getElementById("total-anios");

  // [1] Cambiar contenido: sumar los años de la tabla
  function actualizarTotal() {
    let suma = 0;
    tbody.querySelectorAll("tr").forEach((fila) => {
      suma += Number(fila.cells[2].textContent);
    });
    totalAnios.textContent = suma;
  }
  actualizarTotal();

  // [6] CREAR e INSERTAR una fila nueva
  document.getElementById("form-exp").addEventListener("submit", (e) => {
    e.preventDefault();
    const cargo = document.getElementById("exp-cargo").value;
    const empresa = document.getElementById("exp-empresa").value;
    const anios = document.getElementById("exp-anios").value;

    const fila = tbody.insertRow();          // crea <tr> dentro del tbody
    fila.classList.add("nuevo");
    fila.insertCell().textContent = cargo;
    fila.insertCell().textContent = empresa;
    const celdaAnios = fila.insertCell();
    celdaAnios.textContent = anios;
    celdaAnios.className = "text-center";

    const celdaBoton = fila.insertCell();
    celdaBoton.className = "text-end";
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-sm btn-outline-danger btn-borrar-fila";
    boton.setAttribute("aria-label", "Eliminar fila");
    boton.innerHTML = '<i class="bi bi-x-lg"></i>';
    celdaBoton.appendChild(boton);

    actualizarTotal();
    e.target.reset();
  });

  // [6] ELIMINAR una fila (delegación de eventos: un solo listener para todos los botones)
  tbody.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-borrar-fila");
    if (boton) {
      boton.closest("tr").remove();
      actualizarTotal();
    }
  });

  // [5] + [3] Resaltar la fila bajo el mouse
  tbody.addEventListener("mouseover", (e) => {
    const fila = e.target.closest("tr");
    if (fila) fila.classList.add("fila-activa");
  });
  tbody.addEventListener("mouseout", (e) => {
    const fila = e.target.closest("tr");
    if (fila) fila.classList.remove("fila-activa");
  });
}

/* =====================================================
   PÁGINA 4: FORMACIÓN ACADÉMICA
   ===================================================== */
function iniciarFormacion() {
  const botones = document.querySelectorAll("#filtros button");
  const items = document.querySelectorAll(".item-formacion");
  const contador = document.getElementById("contador-estudios");

  function contarVisibles() {
    // [1] contenido: cuenta los que NO tienen la clase "oculto"
    contador.textContent = document.querySelectorAll(".item-formacion:not(.oculto)").length;
  }
  contarVisibles();

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.getAttribute("data-filtro");     // [4] leer atributo

      // [3] cambiar la clase del botón activo
      botones.forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-outline-primary");
      });
      boton.classList.remove("btn-outline-primary");
      boton.classList.add("btn-primary");

      // [3] mostrar u ocultar elementos con la clase "oculto"
      items.forEach((item) => {
        const tipo = item.dataset.tipo;                      // otra forma: dataset
        item.classList.toggle("oculto", filtro !== "todos" && tipo !== filtro);
      });
      contarVisibles();
    });
  });

  // [5] Evento mouseenter / mouseleave y click en certificados
  const mensaje = document.getElementById("mensaje-certificado");
  document.querySelectorAll(".certificado").forEach((cert) => {
    cert.addEventListener("mouseenter", () => {
      mensaje.textContent = "Certificado: " + cert.getAttribute("data-certificado");
    });
    cert.addEventListener("mouseleave", () => {
      mensaje.textContent = "Pasa el mouse o haz clic sobre un certificado.";
    });
    cert.addEventListener("click", (e) => {
      e.preventDefault();
      cert.classList.toggle("active");                      // [3]
      cert.style.fontWeight = cert.classList.contains("active") ? "700" : "400"; // [2]
    });
  });
}

/* =====================================================
   PÁGINA 5: PROYECTOS
   ===================================================== */
function iniciarProyectos() {
  const contenedor = document.getElementById("contenedor-proyectos");
  const total = document.getElementById("total-proyectos");

  function actualizarTotal() {
    total.textContent = contenedor.children.length;
  }
  actualizarTotal();

  // [4] Leer atributos data-* del botón para llenar la ventana modal
  contenedor.addEventListener("click", (e) => {
    const detalle = e.target.closest(".btn-detalle");
    if (detalle) {
      document.getElementById("modal-titulo").textContent = detalle.getAttribute("data-titulo");
      document.getElementById("modal-tecnologias").textContent = detalle.getAttribute("data-tecnologias");
      document.getElementById("modal-enlace").setAttribute("href", detalle.getAttribute("data-enlace")); // [4] modificar
    }

    // [6] ELIMINAR la tarjeta completa
    const quitar = e.target.closest(".btn-quitar");
    if (quitar) {
      quitar.closest(".col-md-6").remove();
      actualizarTotal();
    }
  });

  // [6] CREAR una tarjeta nueva con createElement y insertarla al inicio con prepend
  document.getElementById("form-proyecto").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("pro-nombre").value;
    const desc = document.getElementById("pro-desc").value;
    const imagen = document.getElementById("pro-img").value;

    const columna = document.createElement("div");
    columna.className = "col-md-6 col-xl-4";

    const tarjeta = document.createElement("div");
    tarjeta.className = "card tarjeta proyecto-card h-100 nuevo";

    const btnQuitar = document.createElement("button");
    btnQuitar.type = "button";
    btnQuitar.className = "btn btn-danger btn-sm btn-quitar";
    btnQuitar.setAttribute("aria-label", "Quitar proyecto");
    btnQuitar.innerHTML = '<i class="bi bi-x-lg"></i>';

    const img = document.createElement("img");
    img.className = "proyecto-img";
    img.setAttribute("src", imagen);
    img.setAttribute("alt", "Captura de " + nombre);

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body";
    const titulo = document.createElement("h2");
    titulo.className = "h5 card-title";
    titulo.textContent = nombre;
    const parrafo = document.createElement("p");
    parrafo.className = "card-text";
    parrafo.textContent = desc;

    cuerpo.append(titulo, parrafo);
    tarjeta.append(btnQuitar, img, cuerpo);
    columna.appendChild(tarjeta);
    contenedor.prepend(columna);   // insertar al principio

    actualizarTotal();
    e.target.reset();
  });
}

/* =====================================================
   PÁGINA 6: REFERENCIAS LABORALES
   ===================================================== */
function iniciarReferencias() {
  const lista = document.getElementById("lista-referencias");
  const total = document.getElementById("total-ref");
  const form = document.getElementById("form-ref");
  const comentario = document.getElementById("ref-comentario");

  function actualizarTotal() {
    total.textContent = lista.children.length;
  }
  actualizarTotal();

  // [5] Evento "input": contador de caracteres en tiempo real
  comentario.addEventListener("input", () => {
    document.getElementById("contador-letras").textContent = comentario.value.length;
  });

  // [5] Evento "submit" con validación de Bootstrap (clase was-validated)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");   // [3] muestra los mensajes en rojo
      return;
    }
    form.classList.remove("was-validated");

    const nombre = document.getElementById("ref-nombre").value;
    const cargo = document.getElementById("ref-cargo").value;
    const tel = document.getElementById("ref-tel").value;

    // [6] Crear la tarjeta con una plantilla y completar los textos con textContent
    const articulo = document.createElement("article");
    articulo.className = "card tarjeta referencia nuevo";
    articulo.innerHTML = `
      <div class="card-body d-flex gap-3">
        <div class="avatar-ref"></div>
        <div class="flex-grow-1">
          <blockquote class="mb-2"></blockquote>
          <p class="mb-0"><strong class="r-nombre"></strong> · <span class="r-cargo"></span><br>
            <small class="text-body-secondary"><i class="bi bi-telephone me-1"></i><span class="r-tel"></span></small></p>
        </div>
        <button class="btn btn-sm btn-outline-danger align-self-start btn-borrar-ref" type="button" aria-label="Eliminar referencia"><i class="bi bi-x-lg"></i></button>
      </div>`;
    articulo.querySelector(".avatar-ref").textContent = nombre.trim().charAt(0).toUpperCase();
    articulo.querySelector("blockquote").textContent = "“" + comentario.value + "”";
    articulo.querySelector(".r-nombre").textContent = nombre;
    articulo.querySelector(".r-cargo").textContent = cargo;
    articulo.querySelector(".r-tel").textContent = tel;

    lista.appendChild(articulo);
    actualizarTotal();
    form.reset();
    document.getElementById("contador-letras").textContent = 0;
  });

  // [6] Eliminar una referencia
  lista.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-borrar-ref");
    if (boton) {
      boton.closest("article").remove();
      actualizarTotal();
    }
  });
}
