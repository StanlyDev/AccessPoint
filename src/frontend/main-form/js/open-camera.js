const theVideo = document.getElementById('camera-access');

const loadCamera = ()=>{
    const constraints = {
        audio: true,
        video: { width: 1280, height: 720 },
      };
      
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
          const video = document.querySelector("video");
          video.srcObject = mediaStream;
          video.onloadedmetadata = () => {
            video.play();
          };
        })
        .catch((err) => {
          // always check for errors at the end.
          console.error(`${err.name}: ${err.message}`);
        });
}
  