document.addEventListener('DOMContentLoaded', () => {
    const elVideo = document.getElementById('videoInput');
    const canvas = document.getElementById('overlay');
    const ctx = canvas.getContext('2d');

    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

    const cargarCamera = () => {
        navigator.getMedia(
            {
                video: true,
                audio: false
            },
            stream => {
                elVideo.srcObject = stream;
                console.log("Stream de cámara cargado:", stream);
            },
            console.error
        );
    };

    // Cargar Modelos
    Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/src/frontend/main-form/face-api/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/src/frontend/main-form/face-api/models'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('/src/frontend/main-form/face-api/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/src/frontend/main-form/face-api/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/src/frontend/main-form/face-api/models'),
    ]).then(cargarCamera);

    elVideo.addEventListener('play', async () => {
        // Ajustar el tamaño del canvas al del video
        const resizeCanvas = () => {
            canvas.width = elVideo.videoWidth;
            canvas.height = elVideo.videoHeight;
        };
        
        // Llamar a la función de ajuste inicial
        resizeCanvas();

        // Ajustar el tamaño del canvas cuando el tamaño del video cambie
        elVideo.addEventListener('resize', resizeCanvas);

        const displaySize = { width: elVideo.videoWidth, height: elVideo.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            // Hacer las detecciones de cara
            const detections = await faceapi.detectAllFaces(elVideo)
                .withFaceLandmarks()
                .withFaceDescriptors();

            // Verifica que haya detecciones válidas
            if (detections.length === 0) {
                console.warn('No se detectaron caras.');
                return;
            }

            // Ponerlas en su sitio
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            // Limpiar el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dibujar las detecciones
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }, 100); // Ajusta el intervalo según sea necesario
    });
});
