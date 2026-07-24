document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('sliderTrack');
    const wrapper = document.getElementById('sliderWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    
    let currentIndex = 0;

    function getVisibleCardsCount() {
        const width = window.innerWidth;
        if (width <= 600) return 1;  // Móvil
        if (width <= 900) return 2;  // Tablet
        if (width <= 1200) return 3; // Pantallas medianas
        return 4;                    // Escritorio
    }

    function updateSlider() {
        const cards = document.querySelectorAll('.ambient-card');
        const totalCards = cards.length;
        const visibleCards = getVisibleCardsCount();
        const maxIndex = Math.max(0, totalCards - visibleCards);

        // Limitar el índice dentro del rango permitido
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        // Calcular el desplazamiento exacto considerando el gap de 20px
        const cardWidth = cards[0].getBoundingClientRect().width;
        const offset = currentIndex * (cardWidth + 20);
        
        track.style.transform = `translateX(-${offset}px)`;

        // Actualizar estados de los botones de flecha
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
        
        // Actualizar barra de progreso (Mínimo 10% para que siempre sea visible un tramo)
        const progressPercentage = maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100;
        progressBar.style.width = `${Math.max(10, progressPercentage)}%`;
    }

    nextBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCardsCount();
        const totalCards = document.querySelectorAll('.ambient-card').length;
        if (currentIndex < totalCards - visibleCards) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // Adaptar slider dinámicamente si cambia el tamaño de la ventana
    window.addEventListener('resize', updateSlider);

    // Inicializar estado del componente
    updateSlider();
});
