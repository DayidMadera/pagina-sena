document.addEventListener("DOMContentLoaded", () => {
    // === ELEMENTOS DEL SLIDER ===
    const track = document.getElementById("sliderTrack");
    const wrapper = document.getElementById("sliderWrapper");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const progressBar = document.getElementById("progressBar");
    const cards = document.querySelectorAll(".ambient-card");

    let currentIndex = 0;
    const totalCards = cards.length; // Ahora calculará automáticamente 4 elementos

    // === CONFIGURACIÓN Y VARIABLES DE ARRASTRE (DRAG) ===
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = 0;

    // === FUNCIONES DEL SLIDER ===
    function updateSlider() {
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= totalCards) currentIndex = totalCards - 1;

        const cardWidth = cards[0].getBoundingClientRect().width;
        // Se suma el gap de 20px al cálculo para un desplazamiento exacto
        currentTranslate = -currentIndex * (cardWidth + 20);
        prevTranslate = currentTranslate;
        
        track.style.transition = "transform 0.4s ease-out";
        track.style.transform = `translateX(${currentTranslate}px)`;

        // Actualiza la barra de progreso de forma proporcional (25% por producto)
        const progressPercentage = ((currentIndex + 1) / totalCards) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
    }

    // === EVENTOS DE BOTONES ===
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < totalCards - 1) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    // === EVENTOS DE ARRASTRE (MOUSE Y TOUCH) ===
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches.clientX;
    }

    function dragStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        track.style.transition = "none";
        animationId = requestAnimationFrame(animation);
    }

    function dragMove(event) {
        if (!isDragging) return;
        const currentX = getPositionX(event);
        const currentPosition = currentX - startX;
        currentTranslate = prevTranslate + currentPosition;
    }

    // Corregido: Validación simplificada para que el arrastre en móviles sea suave con 4 ítems
    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationId);

        const movedBy = currentTranslate - prevTranslate;
        const cardWidth = cards[0].getBoundingClientRect().width;

        if (movedBy < -cardWidth * 0.2 && currentIndex < totalCards - 1) {
            currentIndex++;
        } else if (movedBy > cardWidth * 0.2 && currentIndex > 0) {
            currentIndex--;
        }

        updateSlider();
    }

    function animation() {
        if (isDragging) {
            track.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }

    if (wrapper) {
        wrapper.addEventListener("mousedown", dragStart);
        wrapper.addEventListener("mousemove", dragMove);
        wrapper.addEventListener("mouseup", dragEnd);
        wrapper.addEventListener("mouseleave", dragEnd);

        wrapper.addEventListener("touchstart", dragStart);
        wrapper.addEventListener("touchmove", dragMove);
        wrapper.addEventListener("touchend", dragEnd);
    }

    window.addEventListener("resize", updateSlider);

    // === CONTROL DEL FORMULARIO DE CONTACTO ===
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value;
            alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.`);
            contactForm.reset();
        });
    }

    // === CONVERSOR DE DIVISAS POR REGIÓN ===
    async function adaptarPreciosPorRegion() {
        try {
            const geoResponse = await fetch('https://ipapi.co');
            const geoData = await geoResponse.json();
            const monedaLocal = geoData.currency || 'USD';
            const simboloMoneda = obtenerSimbolo(monedaLocal);

            if (monedaLocal === 'USD') return;

            const exchangeResponse = await fetch('https://er-api.com');
            const exchangeData = await exchangeResponse.json();
            const tasaCambio = exchangeData.rates[monedaLocal];

            if (!tasaCambio) return;

            const etiquetasPrecios = document.querySelectorAll('.ambient-label');
            etiquetasPrecios.forEach(etiqueta => {
                const precioBaseUSD = parseFloat(etiqueta.getAttribute('data-price'));
                if (precioBaseUSD) {
                    const precioConvertido = (precioBaseUSD * tasaCambio).toFixed(2);
                    const textoOriginal = etiqueta.textContent.split('-')[0].trim();
                    etiqueta.textContent = `${textoOriginal} - ${simboloMoneda}${precioConvertido} ${monedaLocal}`;
                }
            });
        } catch (error) {
            console.error("Error en conversión regional:", error);
        }
    }

    function obtenerSimbolo(moneda) {
        const simbolos = {
            'EUR': '€', 'GBP': '£', 'MXN': '$', 'COP': '$', 
            'ARS': '$', 'CLP': '$', 'PEN': 'S/.', 'BRL': 'R$'
        };
        return simbolos[moneda] || '$';
    }

    // Inicializaciones
    updateSlider();
    adaptarPreciosPorRegion();
});
