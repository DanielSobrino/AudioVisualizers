const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileUpload');
const shape = document.getElementById('visualiserShape');
const barNum = document.getElementById('numberOfBars');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Customize
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 5;
ctx.shadowBlur = 0;
ctx.shadowColor = 'white';

let audioSource;
let analyser;
let audioCtx;
let bufferLength;
let dataArray;
let barWidth;

barNum.addEventListener('change', function () {
    analyser.fftSize =
        barNum.children[barNum.selectedIndex].getAttribute('value');
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    barWidth = canvas.width / bufferLength;
});

file.addEventListener('change', function () {
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audioCtx = new window.AudioContext();
    audio1.play();

    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize =
        barNum.children[barNum.selectedIndex].getAttribute('value'); // 64 => 32 bufferLength (32 bars)

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);

        switch (shape.selectedIndex) {
            case 0:
                drawVBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray
                );
                break;
            case 1:
                drawCBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray
                );
                break;
            case 2:
                drawSBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray
                );
                break;
            case 3:
                drawWhirlVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray
                );
                break;
            case 4:
                drawDotGVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray
                );
                break;
            default:
                drawVBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray
                );
                break;
        }

        requestAnimationFrame(animate);
    }
    animate();
});

function drawVBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        const red = (i * barHeight) / 10;
        const green = i * 6;
        const blue = barHeight / 3;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}

function drawCBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i + (Math.PI * 2) / bufferLength);
        const red = (i * barHeight) / 10;
        const green = i * 6;
        const blue = barHeight / 3;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(0, 0, barWidth, (barHeight * 2) / 3);
        x += barWidth;
        ctx.restore();
    }
}

function drawSBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((i * (Math.PI * 6)) / bufferLength);
        const hue = i * 5;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.fillRect(0, 0, barWidth, (barHeight * 2) / 3);
        x += barWidth;
        ctx.restore();
    }
}

function drawWhirlVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2.5;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 4.184);
        const hue = 120 + i * 0.05;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.beginPath();
        ctx.arc(10, barHeight / 2, barHeight / 2, 0, Math.PI / 4);
        ctx.fill();
        ctx.stroke();
        x += barWidth;
        ctx.restore();
    }
}

function drawDotGVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.4;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * bufferLength * -4.0003);
        const hue = 250 + i * 2;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.beginPath();
        ctx.arc(0, barHeight, barHeight / 10, 0, Math.PI * 2);
        ctx.arc(0, barHeight / 1.5, barHeight / 20, 0, Math.PI * 2);
        ctx.arc(0, barHeight / 2, barHeight / 30, 0, Math.PI * 2);
        ctx.arc(0, barHeight / 3, barHeight / 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        x += barWidth;
        ctx.restore();
    }
}
