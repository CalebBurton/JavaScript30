const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let filterVal = 'none';

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.error('Video denied 😢');
        });
}

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    //console.log(width, height);
    
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        
        // mess with them
        if(filterVal === 'red'){
            pixels = redEffect(pixels);
        } else if (filterVal === 'rgb') {
            pixels = rgbSplit(pixels);
            ctx.globalAlpha = 0.5;
        }
        
        
        //pixels = greenScreen(pixels);
        
        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto(){
    // play the snap sound
    snap.currentTime = 0;
    snap.play();
    
    // get the data from the canvas
    const data = canvas.toDataURL('image/jpeg');
    //console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="me" />`;
    strip.insertBefore(link, strip.firstChild);
}

function filter(s){
    filterVal = s;
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i += 4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100;  // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50;   // green
        pixels.data[i + 2] = pixels.data[i + 2] / 1.5;    // blue
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i += 4){
        pixels.data[i - 500] = pixels.data[i + 0];  // red
        pixels.data[i + 550] = pixels.data[i + 1];  // green
        pixels.data[i - 300] = pixels.data[i + 2];   // blue
    }
    return pixels;
}

//function greenScreen(pixels){
//}

getVideo();

video.addEventListener('canplay', paintToCanvas);
