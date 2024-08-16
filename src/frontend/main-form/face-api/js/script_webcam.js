const elVideo = document.getElementById('videoInput')

navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)

const cargarCamera = () => {
    navigator.getMedia(
        {
            video: true,
            audio: false
        },
        stream => elVideo.srcObject = stream,
        console.error
    )
}

// Cargar Modelos
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/src/frontend/main-form/face-api/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/src/frontend/main-form/face-api/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/src/frontend/main-form/face-api/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/src/frontend/main-form/face-api/models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/src/frontend/main-form/face-api/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/src/frontend/main-form/face-api/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/src/frontend/main-form/face-api/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/src/frontend/main-form/face-api/models'),
]).then(cargarCamera)

elVideo.addEventListener('play', async () => {
    // creamos el canvas con los elementos de la face api
    const canvas = faceapi.createCanvasFromMedia(elVideo)
    // lo añadimos al body
    document.body.append(canvas)

    // tamaño del canvas
    const displaySize = { width: elVideo.width, height: elVideo.height }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        // hacer las detecciones de cara
        const detections = await faceapi.detectAllFaces(elVideo)
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors()

        // ponerlas en su sitio
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // limpiar el canvas
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        // dibujar las líneas
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        resizedDetections.forEach(detection => {
            const box = detection.detection.box
            new faceapi.draw.DrawBox(box, {
                label: Math.round(detection.age) + ' años ' + detection.gender
            }).draw(canvas)
        })
    })
})