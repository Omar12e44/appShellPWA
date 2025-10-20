document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const navButtons = document.querySelectorAll('.nav__button');

    // --- DATOS SIMULADOS ---
    const productos = [
        { "id": 1, "nombre": "Laptop Pro X", "descripcion": "Una laptop potente para profesionales.", "precio": 1499.99 },
        { "id": 2, "nombre": "Smartphone Galaxy S25", "descripcion": "La última tecnología móvil.", "precio": 999.50 },
        { "id": 3, "nombre": "Audífonos Inalámbricos", "descripcion": "Cancelación de ruido activa.", "precio": 199.00 },
        { "id": 4, "nombre": "Smartwatch Fit+", "descripcion": "Monitor de actividad y GPS.", "precio": 249.95 },
    ];

    // --- VISTAS DE CONTENIDO ---
    const pages = {
        inicio: `
            <h2>Bienvenido a nuestra Tienda</h2>
            <p>Esta es una PWA de demostración .</p>
            <p>Explora nuestra sección de productos para ver el contenido dinámico cargado y almacenado en caché por el Service Worker.</p>
        `,
        productos: `
            <h2>Nuestros Productos</h2>
            <div class="product-grid">
                ${productos.map(p => `
                    <div class="product-card">
                        <h3>${p.nombre}</h3>
                        <p>${p.descripcion}</p>
                        <div class="price">$${p.precio.toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
        `
    };

    // --- LÓGICA DE NAVEGACIÓN ---
    function loadPage(page) {
        content.innerHTML = pages[page];

        // Actualizar el estado activo del botón
        navButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.page === page);
        });
    }

    // Cargar la página de inicio por defecto
    loadPage('inicio');

    // Manejar clics en los botones de navegación
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.dataset.page;
            loadPage(page);
        });
    });

    // --- REGISTRO DEL SERVICE WORKER ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registrado con éxito:', registration);
                })
                .catch(error => {
                    console.log('Error en el registro del Service Worker:', error);
                });
        });
    }
});
