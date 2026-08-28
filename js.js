document.addEventListener("DOMContentLoaded", () => {


    const showcaseWindow =
        document.getElementById("showcaseWindow");

    const showcaseTrack =
        document.getElementById("showcaseTrack");

    const showcasePrev =
        document.getElementById("showcasePrev");

    const showcaseNext =
        document.getElementById("showcaseNext");

    if (
        showcaseWindow &&
        showcaseTrack
    ) {

        const cards =
            Array.from(
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
                window.getComputedStyle(showcaseTrack);

            const gap =
                parseFloat(styles.gap) ||
                parseFloat(styles.columnGap) ||
                20;

            return gap;
        }


        function getCardWidth() {

            if (!cards.length) {
                return 0;
            }

            return cards[0]
                .getBoundingClientRect()
                .width;
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

            const visible =
                getVisibleCards();

            return Math.max(
                0,
                cards.length - visible
            );
        }


        /* =====================================================
           ACTUALIZAR CARRUSEL
           ===================================================== */

        function updateShowcase(
            animate = true
        ) {

            const maxIndex =
                getMaxIndex();

            if (
                currentIndex < 0
            ) {
                currentIndex = 0;
            }

            if (
                currentIndex > maxIndex
            ) {
                currentIndex = maxIndex;
            }


            const cardWidth =
                getCardWidth();

            const gap =
                getGap();


            currentTranslate =
                -(currentIndex * (
                    cardWidth + gap
                ));


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


            /* =================================================
               BOTÓN ANTERIOR
               ================================================= */

            if (showcasePrev) {

                showcasePrev.disabled =
                    currentIndex === 0;

                showcasePrev.style.opacity =
                    currentIndex === 0
                        ? "0.45"
                        : "1";
            }


            /* =================================================
               BOTÓN SIGUIENTE
               ================================================= */

            if (showcaseNext) {

                showcaseNext.disabled =
                    currentIndex >= maxIndex;

                showcaseNext.style.opacity =
                    currentIndex >= maxIndex
                        ? "0.45"
                        : "1";
            }
        }


        /* =====================================================
           SIGUIENTE
           ================================================= */

        if (showcaseNext) {

            showcaseNext.addEventListener(
                "click",
                () => {

                    const maxIndex =
                        getMaxIndex();

                    if (
                        currentIndex <
                        maxIndex
                    ) {

                        currentIndex++;

                        updateShowcase(true);
                    }
                }
            );
        }


        /* =====================================================
           ANTERIOR
           ================================================= */

        if (showcasePrev) {

            showcasePrev.addEventListener(
                "click",
                () => {

                    if (
                        currentIndex > 0
                    ) {

                        currentIndex--;

                        updateShowcase(true);
                    }
                }
            );
        }


        /* =====================================================
           TOUCH / MOUSE
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


        function moveDrag(event) {

            if (!isDragging) {
                return;
            }

            const x =
                getX(event);

            const movement =
                x - startX;


            currentTranslate =
                startTranslate +
                movement;


            const maxIndex =
                getMaxIndex();

            const cardWidth =
                getCardWidth();

            const gap =
                getGap();


            const maxTranslate =
                -(
                    maxIndex *
                    (cardWidth + gap)
                );


            /* ================================================
               LÍMITE IZQUIERDO
               ================================================= */

            if (
                currentTranslate > 0
            ) {

                currentTranslate *=
                    0.25;
            }


            /* ================================================
               LÍMITE DERECHO
               ================================================= */

            if (
                currentTranslate <
                maxTranslate
            ) {

                const extra =
                    currentTranslate -
                    maxTranslate;

                currentTranslate =
                    maxTranslate +
                    extra * 0.25;
            }


            if (
                event.type === "touchmove" &&
                event.cancelable
            ) {

                event.preventDefault();
            }
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


            const cardWidth =
                getCardWidth();


            const threshold =
                cardWidth * 0.18;


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
            () => {

                if (isDragging) {
                    endDrag();
                }
            }
        );


        /* =====================================================
           TOUCH
           ===================================================== */

        showcaseWindow.addEventListener(
            "touchstart",
            startDrag,
            { passive: true }
        );

        showcaseWindow.addEventListener(
            "touchmove",
            moveDrag,
            { passive: false }
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

        cards.forEach(card => {

            const image =
                card.querySelector("img");

            if (image) {

                image.draggable = false;

                image.addEventListener(
                    "dragstart",
                    event => {
                        event.preventDefault();
                    }
                );
            }
        });


        /* =====================================================
           TECLADO
           ===================================================== */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "ArrowRight"
                ) {

                    const maxIndex =
                        getMaxIndex();

                    if (
                        currentIndex <
                        maxIndex
                    ) {

                        currentIndex++;

                        updateShowcase(true);
                    }
                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    if (
                        currentIndex > 0
                    ) {

                        currentIndex--;

                        updateShowcase(true);
                    }
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
           INICIAR
           ===================================================== */

        updateShowcase(false);
    }



    /* =========================================================
       MENÚ LATERAL
       ========================================================= */

    const menuToggle =
        document.getElementById("menuToggle");

    const menuClose =
        document.getElementById("menuClose");

    const menuOverlay =
        document.getElementById("menuOverlay");

    const menuLinks =
        document.querySelectorAll(".menu-link");


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


    menuLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {
                closeMenu();
            }
        );
    });



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
       BOTONES DE PLANTILLAS
       ========================================================= */

    const templateButtons =
        document.querySelectorAll(
            ".template-buy"
        );


    templateButtons.forEach(button => {

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
    });



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