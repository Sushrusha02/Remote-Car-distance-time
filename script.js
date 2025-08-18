const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const car = document.getElementById("car");
const carLabel = document.getElementById("carLabel");
const marker = document.getElementById("marker");
const markerLabel = document.getElementById("markerLabel");

const dataPoints = [
  { t: 0, d: 0 },
  { t: 1, d: 2 },
  { t: 2, d: 2 },
  { t: 3, d: 4 },
  { t: 4, d: 0 },
  { t: 6, d: 0 },
  { t: 7, d: 5 },
  { t: 8, d: 5 },
  { t: 9, d: 0 }
];

let index = 0;
let playing = false;
let animationId = null;

const originX = 60, originY = canvas.height - 50;
const xScale = 60, yScale = 40;

function drawAxes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(originX, 20);
  ctx.lineTo(originX, originY);
  ctx.lineTo(canvas.width - 20, originY);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";

  for (let t = 0; t <= 9; t++) {
    const x = originX + t * xScale;
    ctx.beginPath();
    ctx.moveTo(x, originY);
    ctx.lineTo(x, originY + 6);
    ctx.stroke();
    ctx.fillText(t, x - 3, originY + 20);
  }

  for (let d = 0; d <= 6; d++) {
    const y = originY - d * yScale;
    ctx.beginPath();
    ctx.moveTo(originX - 6, y);
    ctx.lineTo(originX, y);
    ctx.stroke();
    if (d > 0) ctx.fillText(d, originX - 20, y + 4);
  }

  ctx.fillText("Distance", 15, 25);
  ctx.fillText("Time →", canvas.width - 70, originY + 25);
}

function drawGraph() {
  ctx.beginPath();
  ctx.moveTo(originX + dataPoints[0].t * xScale, originY - dataPoints[0].d * yScale);
  for (let i = 1; i < dataPoints.length; i++) {
    ctx.lineTo(originX + dataPoints[i].t * xScale, originY - dataPoints[i].d * yScale);
  }
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function animateCar() {
  if (index >= dataPoints.length - 1) {
    playing = false;
    return;
  }
  const p1 = dataPoints[index];
  const p2 = dataPoints[index + 1];

  let step = 0;
  function move() {
    if (!playing) return;
    if (step > 1) {
      index++;
      animateCar();
      return;
    }

    let t = p1.t + (p2.t - p1.t) * step;
    let d = p1.d + (p2.d - p1.d) * step;

    car.style.transform = `translateX(${d * 60}px)`;
    carLabel.style.left = `${car.offsetLeft + 20}px`;
    carLabel.innerText = `d = ${d.toFixed(1)}`;

    let mx = originX + t * xScale;
    let my = originY - d * yScale;
    marker.style.left = mx + "px";
    marker.style.top = my + "px";
    markerLabel.style.left = mx + "px";
    markerLabel.style.top = my + "px";
    markerLabel.innerText = `(${t.toFixed(1)}, ${d.toFixed(1)})`;

    step += 0.02;
    animationId = requestAnimationFrame(move);
  }
  move();
}

document.getElementById("playBtn").addEventListener("click", () => {
  if (!playing) {
    playing = true;
    animateCar();
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  playing = false;
  cancelAnimationFrame(animationId);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  playing = false;
  cancelAnimationFrame(animationId);
  index = 0;
  car.style.transform = "translateX(0)";
  carLabel.style.left = "0px";
  carLabel.innerText = "d = 0";
  marker.style.left = originX + "px";
  marker.style.top = originY + "px";
  markerLabel.style.left = originX + "px";
  markerLabel.style.top = originY + "px";
  markerLabel.innerText = "(0,0)";
});

drawAxes();
drawGraph();
marker.style.left = originX + "px";
marker.style.top = originY + "px";
markerLabel.style.left = originX + "px";
markerLabel.style.top = originY + "px";