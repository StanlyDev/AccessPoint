document.addEventListener('DOMContentLoaded', () => {
    const contenedorQR = document.getElementById('contQR');
    const form = document.getElementById('form');

    if (contenedorQR && form) {
        // Crea una nueva instancia de QRCode
        const QR = new QRCode(contenedorQR);

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita el envío del formulario y la recarga de la página
            const url = form.link.value.trim(); // Obtiene el valor del input

            if (url) {
                // Genera el código QR con el texto o URL proporcionado
                QR.makeCode(url);
            } else {
                // Muestra un mensaje de alerta si no se ingresa una URL
                alert('Por favor, ingresa una URL.');
            }
        });

        // Maneja el clic en el botón para generar el QR
        document.querySelector('.btn').addEventListener('click', (e) => {
            e.preventDefault();
            const url = form.link.value.trim();

            if (url) {
                QR.makeCode(url);
            } else {
                alert('Por favor, ingresa una URL.');
            }
        });
    } else {
        console.error('Elementos no encontrados en el DOM.');
    }
});
