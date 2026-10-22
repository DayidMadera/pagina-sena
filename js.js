document.addEventListener("DOMContentLoaded", () => {

    /* 
       KBDA SHOWCASE — SLIDER
 */

    const showcaseWindow =
        document.getElementById("showcaseWindow");

    const showcaseTrack =
        document.getElementById("showcaseTrack");

    const showcasePrev =
        document.getElementById("showcasePrev");

    const showcaseNext =
        document.getElementById("showcaseNext");

    if (showcaseWindow && showcaseTrack) {

        const cards = Array.from(
            showcaseTrack.querySelectorAll(".showcase-card")
        );

        let currentIndex = 0;
        let isDragging = false;

        let startX = 0;
        let startTranslate = 0;
        let currentTranslate = 0;

        let animationFrame = null;


        function getGap() {

            const styles =
                window.getComputedStyle(
                    showcaseTrack
                );

            return (
                parseFloat(styles.gap) ||
                parseFloat(styles.columnGap) ||
                20
            );
        }


        function getCardWidth() {

            return cards.length
                ? cards[0].getBoundingClientRect().width
                : 0;
        }


        function getVisibleCards() {

            const windowWidth =
                showcaseWindow.getBoundingClientRect().width;

            const cardWidth =
                getCardWidth();

            const gap =
                getGap();

            if (!cardWidth) {
                return 1;
            }

            return Math.max(
                1,
                Math.floor(
                    (windowWidth + gap) /
                    (cardWidth + gap)
                )
            );
        }


        function getMaxIndex() {

            return Math.max(
                0,
                cards.length -
                getVisibleCards()
            );
        }


        function updateShowcase(
            animate = true
        ) {

            const maxIndex =
                getMaxIndex();

            currentIndex =
                Math.max(
                    0,
                    Math.min(
                        currentIndex,
                        maxIndex
                    )
                );

            const cardWidth =
                getCardWidth();

            const gap =
                getGap();

            if (!cardWidth) {
                return;
            }

            currentTranslate =
                -(
                    currentIndex *
                    (cardWidth + gap)
                );

            startTranslate =
                currentTranslate;

            showcaseTrack.style.transition =
                animate
                    ? "transform .6s cubic-bezier(.22,.61,.36,1)"
                    : "none";

            showcaseTrack.style.transform =
                `translate3d(
                    ${currentTranslate}px,
                    0,
                    0
                )`;


            if (showcasePrev) {

                showcasePrev.disabled =
                    currentIndex === 0;

                showcasePrev.style.opacity =
                    currentIndex === 0
                        ? "0.45"
                        : "1";
            }


            if (showcaseNext) {

                showcaseNext.disabled =
                    currentIndex >= maxIndex;

                showcaseNext.style.opacity =
                    currentIndex >= maxIndex
                        ? "0.45"
                        : "1";
            }
        }


        function goNext() {

            if (
                currentIndex <
                getMaxIndex()
            ) {

                currentIndex++;

                updateShowcase(true);
            }
        }


        function goPrev() {

            if (
                currentIndex > 0
            ) {

                currentIndex--;

                updateShowcase(true);
            }
        }


        /* 
           BTN SIGUIENTE
           =*/

        if (showcaseNext) {

            showcaseNext.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    goNext();
                }
            );
        }


        /* 
           BTN ANTERIOR
         */

        if (showcasePrev) {

            showcasePrev.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    goPrev();
                }
            );
        }



        function getX(event) {

            if (
                event.touches &&
                event.touches.length
            ) {

                return event.touches[0].clientX;
            }

            if (
                event.changedTouches &&
                event.changedTouches.length
            ) {

                return event.changedTouches[0].clientX;
            }

            return event.clientX;
        }



        function startDrag(event) {

            if (
                event.type === "mousedown" &&
                event.button !== 0
            ) {

                return;
            }

            isDragging = true;

            startX =
                getX(event);

            startTranslate =
                currentTranslate;

            showcaseTrack.style.transition =
                "none";

            showcaseWindow.classList.add(
                "is-dragging"
            );

            animationFrame =
                requestAnimationFrame(
                    animateDrag
                );
        }


        /* 
           MOVER
          */

        function moveDrag(event) {

            if (!isDragging) {
                return;
            }

            const movement =
                getX(event) -
                startX;

            currentTranslate =
                startTranslate +
                movement;

            const maxTranslate =
                -(
                    getMaxIndex() *
                    (
                        getCardWidth() +
                        getGap()
                    )
                );


            if (
                currentTranslate > 0
            ) {

                currentTranslate *=
                    0.25;
            }


            if (
                currentTranslate <
                maxTranslate
            ) {

                currentTranslate =
                    maxTranslate +
                    (
                        currentTranslate -
                        maxTranslate
                    ) * 0.25;
            }


            if (
                event.type === "touchmove" &&
                event.cancelable
            ) {

                event.preventDefault();
            }
        }


 

        function animateDrag() {

            if (!isDragging) {
                return;
            }

            showcaseTrack.style.transform =
                `translate3d(
                    ${currentTranslate}px,
                    0,
                    0
                )`;

            animationFrame =
                requestAnimationFrame(
                    animateDrag
                );
        }


       

        function endDrag() {

            if (!isDragging) {
                return;
            }

            isDragging = false;

            showcaseWindow.classList.remove(
                "is-dragging"
            );


            if (animationFrame) {

                cancelAnimationFrame(
                    animationFrame
                );

                animationFrame = null;
            }


            const movement =
                currentTranslate -
                startTranslate;

            const threshold =
                Math.max(
                    30,
                    getCardWidth() * 0.18
                );


            if (
                movement < -threshold
            ) {

                currentIndex++;

            } else if (
                movement > threshold
            ) {

                currentIndex--;
            }


            updateShowcase(true);
        }


        /*
           MOUSE
        */

        showcaseWindow.addEventListener(
            "mousedown",
            startDrag
        );

        showcaseWindow.addEventListener(
            "mousemove",
            moveDrag
        );

        showcaseWindow.addEventListener(
            "mouseup",
            endDrag
        );

        showcaseWindow.addEventListener(
            "mouseleave",
            endDrag
        );


        showcaseWindow.addEventListener(
            "touchstart",
            startDrag,
            {
                passive: true
            }
        );

        showcaseWindow.addEventListener(
            "touchmove",
            moveDrag,
            {
                passive: false
            }
        );

        showcaseWindow.addEventListener(
            "touchend",
            endDrag
        );

        showcaseWindow.addEventListener(
            "touchcancel",
            endDrag
        );


        /* 
           EVITAR ARRASTRE NATIVO DE IMÁGENES
          */

        cards.forEach(
            card => {

                const image =
                    card.querySelector("img");

                if (image) {

                    image.draggable =
                        false;

                    image.addEventListener(
                        "dragstart",
                        event => {
                            event.preventDefault();
                        }
                    );
                }
            }
        );


        /*
           TECLADO
         */

        document.addEventListener(
            "keydown",
            event => {

                const active =
                    document.activeElement;


                if (
                    active &&
                    (
                        active.tagName === "INPUT" ||
                        active.tagName === "TEXTAREA" ||
                        active.isContentEditable
                    )
                ) {

                    return;
                }


                if (
                    event.key === "ArrowRight"
                ) {

                    goNext();
                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    goPrev();
                }
            }
        );


        /*
           RESPONSIVE
         */

        let resizeTimer;

        window.addEventListener(
            "resize",
            () => {

                clearTimeout(
                    resizeTimer
                );

                resizeTimer =
                    setTimeout(
                        () => {

                            updateShowcase(
                                false
                            );

                        },
                        150
                    );
            }
        );


        /*
           INICIO
         */

        updateShowcase(false);
    }



    /*
       MENU
   */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const menuClose =
        document.getElementById(
            "menuClose"
        );

    const menuOverlay =
        document.getElementById(
            "menuOverlay"
        );

    const menuLinks =
        document.querySelectorAll(
            ".menu-link"
        );


    function openMenu() {

        if (!menuOverlay) {
            return;
        }

        menuOverlay.classList.add(
            "active"
        );

        menuOverlay.setAttribute(
            "aria-hidden",
            "false"
        );


        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }


        document.body.classList.add(
            "menu-open"
        );
    }


    function closeMenu() {

        if (!menuOverlay) {
            return;
        }

        menuOverlay.classList.remove(
            "active"
        );

        menuOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        document.body.classList.remove(
            "menu-open"
        );
    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            openMenu
        );
    }


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeMenu
        );
    }


    if (menuOverlay) {

        menuOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    menuOverlay
                ) {

                    closeMenu();
                }
            }
        );
    }


    menuLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    closeMenu();
                }
            );
        }
    );



    /*
       FORMULARIO
    */

    const contactForm =
        document.querySelector(
            ".contact-form"
        );


    if (contactForm) {
        const projectFile = document.getElementById("archivoProyecto");
        const fileNameLabel = document.getElementById("selectedFileName");
        const formSuccess = document.getElementById("formSuccess");

        if (projectFile && fileNameLabel) {
            projectFile.addEventListener("change", () => {
                const file = projectFile.files && projectFile.files[0];
                if (!file) {
                    fileNameLabel.textContent = "Ningún archivo seleccionado";
                    fileNameLabel.classList.remove("file-selected", "file-error");
                    return;
                }
                const validExtension = /\.(html?|zip)$/i.test(file.name);
                const validSize = file.size <= 10 * 1024 * 1024;
                if (!validExtension || !validSize) {
                    projectFile.value = "";
                    fileNameLabel.textContent = !validExtension
                        ? "Formato no compatible. Sube un archivo HTML o ZIP."
                        : "El archivo supera el límite de 10 MB.";
                    fileNameLabel.classList.add("file-error");
                    fileNameLabel.classList.remove("file-selected");
                    return;
                }
                fileNameLabel.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
                fileNameLabel.classList.add("file-selected");
                fileNameLabel.classList.remove("file-error");
            });
        }

        contactForm.addEventListener("submit", event => {
            event.preventDefault();
            const nameInput = document.getElementById("nombre");
            const name = nameInput ? nameInput.value.trim() : "cliente";
            const file = projectFile && projectFile.files ? projectFile.files[0] : null;

            if (formSuccess) {
                formSuccess.textContent = `Gracias, ${name}. El formulario está validado${file ? ` y tu archivo “${file.name}” está adjunto en esta sesión` : ""}. Para recibir realmente la solicitud y el archivo, KBDA debe conectar este formulario a un servicio de envío.`;
                formSuccess.classList.add("is-visible");
            } else {
                alert(`Gracias, ${name}. El formulario está validado, pero todavía no está conectado a un servicio de envío.`);
            }
        });
    }



    /*
       PLANTILLAS
    */

    const templateButtons =
        document.querySelectorAll(
            ".template-buy"
        );


    const templateInfo = {
        "Plantilla Editorial": { layout: "editorial", title: "Una historia visual que conecta.", eyebrow: "EDICIÓN N.º 01 / HISTORIAS DE MARCA", description: "Una experiencia de revista: titulares serif, jerarquía tipográfica, una historia principal y bloques de contenido cuidadosamente editados.", sections: ["Portada e historia", "Artículo destacado", "Notas y contacto"], cta: "LEER LA HISTORIA" },
        "Plantilla Minimal": { layout: "minimal", title: "Menos ruido. Más impacto.", eyebrow: "EST. 2026 / DISEÑO ESENCIAL", description: "Mucho espacio en blanco, pocos elementos, una sola idea protagonista y navegación discreta. Cada detalle tiene una función.", sections: ["Idea principal", "Tres principios", "Contacto simple"], cta: "DESCUBRIR" },
        "Plantilla Creative": { layout: "creative", title: "Ideas fuera de lo común.", eyebrow: "LABORATORIO CREATIVO / 001", description: "Composición experimental con bloques asimétricos, tipografía de gran escala, acentos inesperados y piezas visuales superpuestas.", sections: ["Manifiesto ↗", "Experimentos visuales", "Ideas en proceso"], cta: "ENTRAR AL LABORATORIO" },
        "Plantilla Business": { layout: "business", title: "Construyamos lo que sigue.", eyebrow: "CONSULTORÍA / SOLUCIONES PARA EMPRESAS", description: "Estructura corporativa pulcra con propuesta de valor clara, servicios organizados, indicadores de confianza y un siguiente paso concreto.", sections: ["Servicios y capacidades", "Resultados e indicadores", "Solicitar propuesta"], cta: "AGENDAR UNA CONSULTA" },
        "Plantilla Portfolio": { layout: "portfolio", title: "Trabajo que habla por sí mismo.", eyebrow: "ARCHIVO DE OBRA / VOL. 01", description: "Un portafolio artístico con ritmo de libro: índice, fichas de obra, numeración, notas de proceso y una selección curada de proyectos.", sections: ["Índice de proyectos", "Estudios de caso", "Cuaderno de proceso"], cta: "ABRIR EL ARCHIVO" },
        "Plantilla Fashion": { layout: "fashion", title: "Forma, detalle y personalidad.", eyebrow: "MAISON / COLECCIÓN N.º 06", description: "Dirección de arte de moda con portada editorial, tipografía de contraste, detalles de colección y una composición elegante tipo revista.", sections: ["Portada de colección", "Detalles y materiales", "Campaña editorial"], cta: "VER LA COLECCIÓN" }
    };
    const paletteChoices = [
        { id: "original", name: "Crema KBDA", color: "#f8f7f3" },
        { id: "blue", name: "Azul suave", color: "#e5ecf8" },
        { id: "wine", name: "Vino", color: "#542c3e" },
        { id: "forest", name: "Verde bosque", color: "#e8ede4" },
        { id: "dark", name: "Noche", color: "#20212b" },
        { id: "terracotta", name: "Terracota", color: "#f4e4da" }
    ];
    let activeTemplateButton = null;
    let activeTemplatePalette = "original";

    const templateModal = document.createElement("div");
    templateModal.className = "template-modal";
    templateModal.id = "templatePreviewModal";
    templateModal.setAttribute("aria-hidden", "true");
    templateModal.innerHTML = `
      <section class="template-modal-panel" role="dialog" aria-modal="true" aria-labelledby="templateModalTitle">
        <header class="template-modal-head">
          <div><small id="templateModalEyebrow">PLANTILLA / VISTA PREVIA</small><h2 id="templateModalTitle">Editorial</h2></div>
          <button class="template-modal-close" type="button" aria-label="Cerrar vista previa">×</button>
        </header>
        <div class="template-modal-tools"><label>PRUEBA LOS COLORES</label><div class="template-swatches" style="display:flex;gap:10px;flex-wrap:wrap"></div><span class="template-palette-name" style="font-size:11px;color:var(--text-soft)">Crema KBDA</span></div>
        <div class="template-preview-site" data-palette="original">
          <nav class="template-site-nav"><strong class="template-site-brand">YOUR BRAND</strong><span>ESTUDIO / DIGITAL</span><span>MENU ↗</span></nav>
          <div class="template-site-hero"><small class="template-site-eyebrow"></small><h3 class="template-site-title"></h3><p class="template-site-description"></p><span class="template-site-cta"></span></div>
          <div class="template-site-sections"></div>
        </div>
        <footer class="template-modal-foot"><p>Vista conceptual de la estructura que incluye esta plantilla. Puedes cambiar la paleta para explorar otras identidades.</p><button type="button" class="template-select-confirm">ELEGIR ESTA PLANTILLA ↗</button></footer>
      </section>`;
    document.body.appendChild(templateModal);

    const modalSite = templateModal.querySelector(".template-preview-site");
    const modalSwatches = templateModal.querySelector(".template-swatches");
    const closeTemplateModal = () => {
        templateModal.classList.remove("is-open");
        templateModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        if (activeTemplateButton) activeTemplateButton.focus();
    };
    paletteChoices.forEach((palette) => {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "template-swatch";
        swatch.style.background = palette.color;
        swatch.setAttribute("aria-label", palette.name);
        swatch.setAttribute("aria-pressed", "false");
        swatch.addEventListener("click", () => {
            activeTemplatePalette = palette.id;
            modalSite.dataset.palette = palette.id;
            templateModal.querySelector(".template-palette-name").textContent = palette.name;
            modalSwatches.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === swatch)));
        });
        modalSwatches.appendChild(swatch);
    });
    function openTemplatePreview(button) {
        activeTemplateButton = button;
        activeTemplatePalette = "original";
        const name = button.dataset.template || "Plantilla KBDA";
        const info = templateInfo[name] || templateInfo["Plantilla Editorial"];
        const title = name.replace("Plantilla ", "");
        templateModal.querySelector("#templateModalTitle").textContent = title;
        templateModal.querySelector("#templateModalEyebrow").textContent = `${name.toUpperCase()} / VISTA PREVIA`;
        templateModal.querySelector(".template-site-brand").textContent = title.toUpperCase() + "®";
        templateModal.querySelector(".template-site-eyebrow").textContent = info.eyebrow;
        templateModal.querySelector(".template-site-title").innerHTML = info.title.replace(/(visual|impacto|sigue|mismo|personalidad)/i, "<em>$1</em>");
        templateModal.querySelector(".template-site-description").textContent = info.description;
        templateModal.querySelector(".template-site-cta").textContent = info.cta + "  ↗";
        const sections = templateModal.querySelector(".template-site-sections");
        sections.innerHTML = "";
        info.sections.forEach((section, index) => {
            const item = document.createElement("div");
            item.className = "template-site-section";
            item.innerHTML = `<small>0${index + 1} / SECCIÓN</small><strong></strong>`;
            item.querySelector("strong").textContent = section;
            sections.appendChild(item);
        });
        modalSite.dataset.palette = "original";
        modalSite.dataset.layout = info.layout || "editorial";
        modalSite.className = `template-preview-site layout-${info.layout || "editorial"}`;
        templateModal.querySelector(".template-palette-name").textContent = "Crema KBDA";
        modalSwatches.querySelectorAll("button").forEach((item, index) => item.setAttribute("aria-pressed", String(index === 0)));
        templateModal.querySelector(".template-select-confirm").textContent = `ELEGIR ${title.toUpperCase()} · ${button.dataset.price || ""} ↗`;
        templateModal.classList.add("is-open");
        templateModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        templateModal.querySelector(".template-modal-close").focus();
    }
    templateButtons.forEach(button => button.addEventListener("click", () => openTemplatePreview(button)));
    templateModal.querySelector(".template-modal-close").addEventListener("click", closeTemplateModal);
    templateModal.addEventListener("click", event => { if (event.target === templateModal) closeTemplateModal(); });
    templateModal.querySelector(".template-select-confirm").addEventListener("click", () => {
        if (activeTemplateButton) {
            const template = activeTemplateButton.dataset.template || "esta plantilla";
            const price = activeTemplateButton.dataset.price || "";
            closeTemplateModal();
            alert(`Has elegido ${template} ${price}. La selección está lista para continuar con KBDA.`);
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && templateModal.classList.contains("is-open")) closeTemplateModal();
    });



    /*
       ANIMACIONES
    */

    const revealElements =
        document.querySelectorAll(
            ".template-card, .service-item, .process-step"
        );


    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );
            }
        );
    }

});


/*
   EXPERIENCIA PILOTO!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

(() => {

    const pilot =
        document.getElementById(
            "studioPilot"
        );

    const launch =
        document.getElementById(
            "studioLaunch"
        );

    const menuLink =
        document.getElementById(
            "menuStudioLink"
        );

    const close =
        document.getElementById(
            "studioClose"
        );



    if (
        !pilot ||
        !launch ||
        !close
    ) {
        return;
    }


    /*
       ELEMENTOS DEL EDITOR
       */

    const page =
        document.getElementById(
            "pilotPage"
        );

    const brand =
        document.getElementById(
            "pilotBrand"
        );

    const title =
        document.getElementById(
            "pilotTitle"
        );

    const description =
        document.getElementById(
            "pilotDescription"
        );

    const addedSection =
        document.getElementById(
            "pilotAddedSection"
        );

    const action =
        document.getElementById(
            "pilotAction"
        );

    const reset =
        document.getElementById(
            "pilotReset"
        );

    const controlLabel =
        document.getElementById(
            "pilotControlLabel"
        );

    const controlHint =
        document.getElementById(
            "pilotControlHint"
        );

    const mode =
        document.getElementById(
            "pilotMode"
        );

    const toast =
        document.getElementById(
            "pilotToast"
        );

    const tools =
        document.querySelectorAll(
            ".pilot-tool"
        );


    /* 
       GUARDAR ESTADO INICIAL
  */

    const initialState = {

        title:
            title
                ? title.innerHTML
                : "",

        brand:
            brand
                ? brand.textContent
                : "",

        description:
            description
                ? description.textContent
                : ""
    };


    let currentTool =
        "add";

    let colorIndex =
        0;

    let toastTimer;


    /* 
       PALETAS KBDA
      */

    const palettes = ["", "color-blue", "color-vino", "color-forest", "color-dark", "color-terracotta", "color-lilac"];
    const paletteNames = ["CREMA KBDA", "AZUL SUAVE", "VINO KBDA", "VERDE BOSQUE", "NOCHE", "TERRACOTA", "LILA SUAVE"];
    const sectionPresets = [
        { label: "02 / SERVICIOS", title: "Soluciones<br>hechas para ti.", toast: "Sección de servicios agregada" },
        { label: "03 / PROYECTOS", title: "Ideas que se<br>convierten en impacto.", toast: "Sección de proyectos agregada" },
        { label: "04 / CONTACTO", title: "Hagamos algo<br>extraordinario.", toast: "Sección de contacto agregada" }
    ];
    let sectionIndex = 0;
    let layoutIndex = 0;


    /* 
       TOAST
        */

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2200
            );
    }


    /* 
       ABRIR STUDIO
        */

    function openPilot() {

        pilot.classList.add(
            "is-open"
        );

        pilot.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "studio-pilot-open"
        );


        setTimeout(
            () => {

                close.focus();

            },
            100
        );
    }


    /* 
       CERRAR STUDIO
        */

    function closePilot() {

        pilot.classList.remove(
            "is-open"
        );

        pilot.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "studio-pilot-open"
        );
    }


    /* 
       SELECCIONAR HERRAMIENTA
        */

    function setTool(tool) {

        currentTool =
            tool;


        tools.forEach(
            button => {

                button.classList.toggle(
                    "is-active",
                    button.dataset.tool ===
                    tool
                );
            }
        );


        const content = {

            add: [
                "AGREGAR SECCIÓN",
                "Añade un bloque para ampliar la propuesta.",
                "AGREGAR BLOQUE ＋"
            ],

            text: [
                "EDITAR TEXTOS",
                "Modifica directamente el nombre, título y descripción.",
                "ACTIVAR EDICIÓN T"
            ],

            layout: [
                "CAMBIAR ESTILO",
                "Prueba una composición más editorial o minimalista.",
                "CAMBIAR COMPOSICIÓN □"
            ],

            color: [
                "IDENTIDAD VISUAL",
                "Cambia el ambiente de la propuesta con la paleta KBDA.",
                "CAMBIAR COLOR ◯"
            ],

            export: [
                "EXPORTAR PROPUESTA",
                "Simula la entrega de la propuesta lista para el cliente.",
                "EXPORTAR ↗"
            ]

        }[tool];


        if (!content) {
            return;
        }


        if (controlLabel) {

            controlLabel.textContent =
                content[0];
        }


        if (controlHint) {

            controlHint.textContent =
                content[1];
        }


        if (action) {

            action.textContent =
                content[2];
        }
    }


    /* 
       ACTIVAR EDICIÓN DE TEXTO
        */

    function enableTextEditing() {

        if (!page) {
            return;
        }

        page.classList.add(
            "edit-mode"
        );


        [
            title,
            brand,
            description

        ].forEach(
            element => {

                if (!element) {
                    return;
                }

                element.contentEditable =
                    "true";

                element.setAttribute(
                    "spellcheck",
                    "false"
                );
            }
        );


        if (title) {
            title.focus();
        }


        showToast(
            "Edición activa · cambia el contenido en vivo"
        );


        if (mode) {

            mode.textContent =
                "LANDING / EDITANDO";
        }
    }


    /* 
       DESACTIVAR EDICIÓN
        */

    function disableTextEditing() {

        if (!page) {
            return;
        }

        page.classList.remove(
            "edit-mode"
        );


        [
            title,
            brand,
            description

        ].forEach(
            element => {

                if (!element) {
                    return;
                }

                element.contentEditable =
                    "false";
            }
        );


        if (mode) {

            mode.textContent =
                "LANDING / EDITABLE";
        }
    }


    /* 
       EJECUTAR HERRAMIENTA
        */

    function runTool() {


        /*
           AGREGAR SECCIÓN
         */

        if (
            currentTool === "add"
        ) {

            if (!addedSection) {
                return;
            }


            const willShow =
                addedSection.hidden;


            if (willShow) {
                const preset = sectionPresets[sectionIndex % sectionPresets.length];
                const label = addedSection.querySelector("span");
                const heading = addedSection.querySelector("strong");
                if (label) label.textContent = preset.label;
                if (heading) heading.innerHTML = preset.title;
                sectionIndex++;
            }
            addedSection.hidden = !willShow;
            showToast(willShow ? sectionPresets[(sectionIndex - 1) % sectionPresets.length].toast : "Sección retirada");


            if (action) {

                action.textContent =
                    willShow
                        ? "QUITAR BLOQUE −"
                        : "AGREGAR BLOQUE ＋";
            }


            return;
        }


        /*
           EDITAR TEXTO
         */

        if (
            currentTool === "text"
        ) {

            if (
                page &&
                page.classList.contains(
                    "edit-mode"
                )
            ) {

                disableTextEditing();

            } else {

                enableTextEditing();
            }


            return;
        }


        /*
           CAMBIAR ESTILO
         */

        if (
            currentTool === "layout"
        ) {

            if (!page) {
                return;
            }


            const layouts = ["layout-minimal", "layout-bold"];
            page.classList.remove("layout-minimal", "layout-bold");
            layoutIndex = (layoutIndex + 1) % 3;
            if (layoutIndex > 0) page.classList.add(layouts[layoutIndex - 1]);
            const minimal = layoutIndex === 1;
            const bold = layoutIndex === 2;


            if (mode) {

                mode.textContent = minimal ? "LANDING / MINIMAL" : bold ? "LANDING / IMPACTO" : "LANDING / EDITORIAL";
            }


            showToast(minimal ? "Composición minimal activada" : bold ? "Composición de impacto activada" : "Composición editorial activada");


            return;
        }


        /*
           CAMBIAR COLOR
         */

        if (
            currentTool === "color"
        ) {

            if (!page) {
                return;
            }


            page.classList.remove("color-blue", "color-vino", "color-forest", "color-dark", "color-terracotta", "color-lilac");


            colorIndex =
                (
                    colorIndex + 1
                ) %
                palettes.length;


            if (
                palettes[colorIndex]
            ) {

                page.classList.add(
                    palettes[colorIndex]
                );
            }


            showToast(
                `Paleta: ${paletteNames[colorIndex]}`
            );


            return;
        }


        /*
           EXPORTAR
         */

        if (currentTool === "export") {
            const exportPage = page ? page.cloneNode(true) : null;
            if (exportPage) {
                exportPage.querySelectorAll("[contenteditable]").forEach(el => el.removeAttribute("contenteditable"));
                const exportHtml = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Propuesta KBDA Studio</title><style>body{margin:0;font-family:Arial,sans-serif} .pilot-page{position:relative;min-height:80vh;padding:5vw;overflow:hidden}.pilot-page-header{display:flex;justify-content:space-between;gap:20px}.pilot-page-header nav{display:flex;gap:18px}.pilot-hero{max-width:760px;padding:10vh 0}.pilot-hero h1{font-size:clamp(42px,8vw,100px);line-height:.95}.pilot-hero h1 em{color:#5065a7;font-style:normal}.pilot-hero p{max-width:520px;line-height:1.8}.pilot-actions{display:flex;gap:20px;align-items:center}.pilot-added-section{padding:30px;border-top:1px solid currentColor}.layout-minimal{text-align:center}.layout-bold .pilot-hero h1{font-weight:700;letter-spacing:-.06em}.color-blue{background:#dfe6f3;color:#27325f}.color-vino{background:#5b3445;color:#f7f5f1}.color-vino em{color:#d7c3c9}.color-forest{background:#e8ede4;color:#263f35}.color-dark{background:#20212b;color:#f5f0e8}.color-dark em{color:#a6b5dd}.color-terracotta{background:#f4e4da;color:#603d32}.color-terracotta em{color:#b96e51}.color-lilac{background:#eee8f8;color:#40355e}.color-lilac em{color:#8b72b5}</style></head><body>${exportPage.outerHTML}</body></html>`;
                const blob = new Blob([exportHtml], { type: "text/html;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "propuesta-kbda-studio.html";
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
                showToast("Propuesta HTML exportada");
            } else {
                showToast("No se encontró la propuesta para exportar");
            }
            if (mode) mode.textContent = "PROPUESTA / EXPORTADA";
        }
    }


    /* 
       REINICIAR EXPERIENCIA
        */

    function resetPilot() {

        if (title) {

            title.innerHTML =
                initialState.title;
        }


        if (brand) {

            brand.textContent =
                initialState.brand;
        }


        if (description) {

            description.textContent =
                initialState.description;
        }


        if (addedSection) {

            addedSection.hidden =
                true;
        }


        if (page) {

            page.classList.remove(
                "layout-minimal",
                "layout-bold",
                "color-blue",
                "color-vino",
                "color-forest",
                "color-dark",
                "color-terracotta",
                "color-lilac",
                "edit-mode"
            );
        }


        colorIndex = 0;
        layoutIndex = 0;
        sectionIndex = 0;


        disableTextEditing();

        setTool("add");


        if (action) {

            action.textContent =
                "AGREGAR BLOQUE ＋";
        }


        showToast(
            "Experiencia reiniciada"
        );
    }


    /*====
       EVENTOS DE KBDA STUDIO
    */


    /* ABRIR DESDE EL BOTÓN */

    launch.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openPilot();
        }
    );


    /* CERRAR */

    close.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closePilot();
        }
    );


    /* CERRAR HACIENDO CLICK EN EL FONDO */

    const backdrop =
        document.querySelector(
            "[data-studio-close]"
        );


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    backdrop
                ) {

                    closePilot();
                }
            }
        );
    }


    /* ABRIR DESDE EL MENÚ */

    if (menuLink) {

        menuLink.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closePilot();

                /*
                 * Pequeño retraso para permitir
                 * cerrar el menú antes de abrir Studio.
                 */

                setTimeout(
                    () => {

                        openPilot();

                    },
                    80
                );
            }
        );
    }


    /* HERRAMIENTAS */

    tools.forEach(
        tool => {

            tool.addEventListener(
                "click",
                () => {

                    setTool(
                        tool.dataset.tool
                    );
                }
            );
        }
    );


    /* BOTÓN PRINCIPAL */

    if (action) {

        action.addEventListener(
            "click",
            runTool
        );
    }


    /* REINICIAR */

    if (reset) {

        reset.addEventListener(
            "click",
            resetPilot
        );
    }


    /* ESCAPE */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                pilot.classList.contains(
                    "is-open"
                )
            ) {

                closePilot();
            }
        }
    );


    /* CTA DEL SITIO PREVISUALIZADO */

    const pilotCta =
        document.getElementById(
            "pilotCta"
        );


    if (pilotCta) {

        pilotCta.addEventListener(
            "click",
            event => {

                event.preventDefault();

                showToast(
                    "Vista de proyecto seleccionada · así se vería la web final"
                );
            }
        );
    }


    /*====
       ESTADO INICIAL
    */

    if (pilot) {

        pilot.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    if (addedSection) {

        addedSection.hidden =
            true;
    }


    setTool("add");

})();