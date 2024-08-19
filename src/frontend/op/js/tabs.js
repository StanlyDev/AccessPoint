document.addEventListener('DOMContentLoaded', () => {
    const contenedorQR = document.getElementById('contQR');
    const form = document.getElementById('form');

    function loadContent(tabId) {
        const main = document.querySelector('main');
        let url;

        switch(tabId) {
            case 'tab1':
                url = '/src/pages/gen/qr-gen.html';
                break;
            case 'tab2':
                url = '/';
                break;
            case 'tab3':
                url = '/src/pages/login/qr-login.html';
                break;
            case 'tab4':
                url = '/src/pages/login/face-login.html';
                break;
            case 'tab5':
                url = '';
                break;
            case 'tab6':
                url = '';
                break;
        }

        fetch(url)
            .then(response => response.text())
            .then(html => {
                main.innerHTML = html;
                // Ejecuta el script específico para el nuevo contenido cargado
                if (tabId === 'tab1') {
                    initializeQR();
                }
            })
            .catch(err => {
                console.error('Error loading content:', err);
            });
    }

    function initializeQR() {
        // Asegúrate de que el script de QR se cargue correctamente
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            // Espera a que el script esté completamente cargado
            const contenedorQR = document.getElementById('contQR');
            const form = document.getElementById('form');
            if (contenedorQR && form) {
                const QR = new QRCode(contenedorQR);

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const url = form.link.value.trim();
                    if (url) {
                        QR.makeCode(url);
                    } else {
                        alert('Por favor, ingresa una URL.');
                    }
                });

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
        };
    }

    const tabs = document.querySelectorAll('input[name="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('change', function() {
            if (this.checked) {
                loadContent(this.id);
            }
        });
    });

    loadContent('tab1');
});
