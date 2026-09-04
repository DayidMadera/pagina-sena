document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       KBDA SHOWCASE — SLIDER
       ========================================================= */

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


        /* =====================================================
           BOTÓN SIGUIENTE
           ===================================================== */

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


        /* =====================================================
           BOTÓN ANTERIOR
           ===================================================== */

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


        /* =====================================================
           OBTENER POSICIÓN
           ===================================================== */

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


        /* =====================================================
           INICIAR ARRASTRE
           ===================================================== */

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


        /* =====================================================
           MOVER
           ===================================================== */

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


        /* =====================================================
           ANIMACIÓN DEL ARRASTRE
           ===================================================== */

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


        /* =====================================================
           FINALIZAR ARRASTRE
           ===================================================== */

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


        /* =====================================================
           MOUSE
           ===================================================== */

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


        /* =====================================================
           TOUCH
           ===================================================== */

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


        /* =====================================================
           EVITAR ARRASTRE NATIVO DE IMÁGENES
           ===================================================== */

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


        /* =====================================================
           TECLADO
           ===================================================== */

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


        /* =====================================================
           RESPONSIVE
           ===================================================== */

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


        /* =====================================================
           INICIO
           ===================================================== */

        updateShowcase(false);
    }



    /* =========================================================
       MENÚ
       ========================================================= */

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



    /* =========================================================
       FORMULARIO
       ========================================================= */

    const contactForm =
        document.querySelector(
            ".contact-form"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "nombre"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "cliente";


                alert(
                    `¡Gracias ${name}! Tu mensaje ha sido enviado correctamente.`
                );


                contactForm.reset();
            }
        );
    }



    /* =========================================================
       PLANTILLAS
       ========================================================= */

    const templateButtons =
        document.querySelectorAll(
            ".template-buy"
        );


    templateButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const template =
                        button.dataset.template ||
                        "esta plantilla";


                    const price =
                        button.dataset.price ||
                        "";


                    alert(
                        `Has elegido ${template} ${price}`
                    );
                }
            );
        }
    );



    /* =========================================================
       ANIMACIONES
       ========================================================= */

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


/* =========================================================
   KBDA STUDIO — EXPERIENCIA PILOTO
   ========================================================= */

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


    /* ---------------------------------------------------------
       VERIFICAR QUE STUDIO EXISTA
       --------------------------------------------------------- */

    if (
        !pilot ||
        !launch ||
        !close
    ) {
        return;
    }


    /* ---------------------------------------------------------
       ELEMENTOS DEL EDITOR
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       GUARDAR ESTADO INICIAL
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       PALETAS KBDA
       --------------------------------------------------------- */

    const palettes = [
        "",
        "color-blue",
        "color-vino"
    ];


    const paletteNames = [
        "CREMA KBDA",
        "AZUL SUAVE",
        "VINO KBDA"
    ];


    /* ---------------------------------------------------------
       TOAST
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       ABRIR STUDIO
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       CERRAR STUDIO
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       SELECCIONAR HERRAMIENTA
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       ACTIVAR EDICIÓN DE TEXTO
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       DESACTIVAR EDICIÓN
       --------------------------------------------------------- */

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


    /* ---------------------------------------------------------
       EJECUTAR HERRAMIENTA
       --------------------------------------------------------- */

    function runTool() {


        /* =====================================================
           AGREGAR SECCIÓN
           ===================================================== */

        if (
            currentTool === "add"
        ) {

            if (!addedSection) {
                return;
            }


            const willShow =
                addedSection.hidden;


            addedSection.hidden =
                !willShow;


            showToast(
                willShow
                    ? "Sección agregada a la propuesta"
                    : "Sección retirada"
            );


            if (action) {

                action.textContent =
                    willShow
                        ? "QUITAR BLOQUE −"
                        : "AGREGAR BLOQUE ＋";
            }


            return;
        }


        /* =====================================================
           EDITAR TEXTO
           ===================================================== */

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


        /* =====================================================
           CAMBIAR ESTILO
           ===================================================== */

        if (
            currentTool === "layout"
        ) {

            if (!page) {
                return;
            }


            page.classList.toggle(
                "layout-minimal"
            );


            const minimal =
                page.classList.contains(
                    "layout-minimal"
                );


            if (mode) {

                mode.textContent =
                    minimal
                        ? "LANDING / MINIMAL"
                        : "LANDING / EDITORIAL";
            }


            showToast(
                minimal
                    ? "Composición minimal activada"
                    : "Composición editorial activada"
            );


            return;
        }


        /* =====================================================
           CAMBIAR COLOR
           ===================================================== */

        if (
            currentTool === "color"
        ) {

            if (!page) {
                return;
            }


            page.classList.remove(
                "color-blue",
                "color-vino"
            );


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


        /* =====================================================
           EXPORTAR
           ===================================================== */

        if (
            currentTool === "export"
        ) {

            showToast(
                "✓ Propuesta preparada para presentar al cliente"
            );


            if (mode) {

                mode.textContent =
                    "PROPUESTA / LISTA";
            }
        }
    }


    /* ---------------------------------------------------------
       REINICIAR EXPERIENCIA
       --------------------------------------------------------- */

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
                "color-blue",
                "color-vino",
                "edit-mode"
            );
        }


        colorIndex =
            0;


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


    /* =========================================================
       EVENTOS DE KBDA STUDIO
       ========================================================= */


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


    /* =========================================================
       ESTADO INICIAL
       ========================================================= */

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