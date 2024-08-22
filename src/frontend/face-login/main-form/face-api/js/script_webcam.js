document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('videoInput');
    const canvas = document.getElementById('overlay');

    if (!video || !canvas) {
        console.error('No se encontraron los elementos video o canvas.');
        return;
    }

    try {
        console.log('Cargando modelos...');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/src/frontend/face-login/main-form/face-api/models/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/src/frontend/face-login/main-form/face-api/models/');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/src/frontend/face-login/main-form/face-api/models/');
        await faceapi.nets.faceExpressionNet.loadFromUri('/src/frontend/face-login/main-form/face-api/models/');
        console.log('Modelos cargados');

        console.log('Solicitando acceso a la cámara...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            console.log('Reproduciendo video...');
            video.play();
            // Establecer el tamaño del canvas después de que el video esté listo
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            startFaceRecognition();
        };

    } catch (error) {
        console.error('Error al acceder a la cámara o inicializar face-api.js:', error);
    }
});

function startFaceRecognition() {
    const video = document.getElementById('videoInput');
    const canvas = document.getElementById('overlay');
    const displaySize = { width: video.videoWidth, height: video.videoHeight };

    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
}
