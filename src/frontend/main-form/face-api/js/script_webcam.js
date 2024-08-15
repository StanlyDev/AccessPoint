const video = document.getElementById('videoInput');
const canvas = document.getElementById('overlay');

// Inicializar la cámara
async function initVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    return new Promise(resolve => video.onloadedmetadata = () => resolve());
}

// Procesar el video
async function onPlay() {
    const MODEL_URL = '/src/frontend/main-form/face-api/models';

    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

    video.addEventListener('play', async () => {
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        const detectFaces = async () => {
            const fullFaceDescriptions = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
                .withFaceLandmarks()
                .withFaceDescriptors();

            const resizedResults = faceapi.resizeResults(fullFaceDescriptions, displaySize);

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedResults);
            faceapi.draw.drawFaceLandmarks(canvas, resizedResults);

            requestAnimationFrame(detectFaces);
        };

        detectFaces();
    });
}

// Inicializar video y comenzar el procesamiento
initVideo().then(onPlay).catch(console.error);