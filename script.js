const graphSets = [
  [
    { t: 0, d: 0 },
    { t: 1, d: 2 },
    { t: 2, d: 2 },
    { t: 3, d: 4 },
    { t: 4, d: 0 },
    { t: 6, d: 0 },
    { t: 7, d: 5 },
    { t: 8, d: 5 },
    { t: 9, d: 0 }
  ],
  [
    { t: 0, d: 0 },
    { t: 1, d: 3 },
    { t: 2, d: 5 },
    { t: 3, d: 3 },
    { t: 4, d: 0 },
    { t: 6, d: 0 },
    { t: 7, d: 4 },
    { t: 8, d: 0 }
  ],
  [
    { t: 0, d: 0 },
    { t: 2, d: 2 },
    { t: 3, d: 5 },
    { t: 4, d: 0 },
    { t: 5, d: 0 },
    { t: 6, d: 2 },
    { t: 8, d: 0 }
  ]
];

let currentGraphIndex = 0;
let dataPoints = graphSets[currentGraphIndex];

let currentTime = 0;
let isPlaying = false;
let totalTime = dataPoints[dataPoints.length - 1].t;

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const car = document.getElementById("car");


function getInterpolatedPoint(time) {
  for (let i = 0; i < dataPoints.length - 1; i++) {
    const p1 = dataPoints[i];
    const p2 = dataPoints[i + 1];
    if (time >= p1.t && time <= p2.t) {
      const ratio = (time - p1.t) / (p2.t - p1.t);
      const d = p1.d + ratio * (p2.d - p1.d);
      return { t: time, d: d };
    }
  }
  return dataPoints[dataPoints.length - 1];
}

function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Axes
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  ctx.beginPath();
  ctx.moveTo(50, 250);
  ctx.lineTo(350, 250); // X-axis
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50, 250);
  ctx.lineTo(50, 25); // Y-axis
  ctx.stroke();

  //labels
  ctx.font = "14px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Time (s)", 180, 270); //x axis
  ctx.save();
  ctx.translate(15, 150); //rotate for y axis
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Distance (m)", 0, 0);
  ctx.restore();

  // Graph line
  ctx.beginPath();
  ctx.moveTo(50 + dataPoints[0].t * 30, 250 - dataPoints[0].d * 40);
  for (let i = 1; i < dataPoints.length; i++) {
    ctx.lineTo(50 + dataPoints[i].t * 30, 250 - dataPoints[i].d * 40);
  }
  ctx.strokeStyle = "blue";
  ctx.stroke();

  // Current point
  let { t, d } = getInterpolatedPoint(currentTime);

  // 🔴 Red point
  let xAxisX = 50 + t * 30;
  let xAxisY = 250;
  ctx.beginPath();
  ctx.arc(xAxisX, xAxisY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  // ⚫ Black point
  let graphX = 50 + t * 30;
  let graphY = 250 - d * 40;
  ctx.beginPath();
  ctx.arc(graphX, graphY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(xAxisX, xAxisY);
  ctx.lineTo(graphX, graphY);
  ctx.strokeStyle = "gray";
  ctx.setLineDash([4, 2]);
  ctx.stroke();
  ctx.setLineDash([]);

}

function updateCar() {
  let { d } = getInterpolatedPoint(currentTime);
  car.style.left = (100 + d * 60) + "px";
}

function animate() {
  if (isPlaying) {
    currentTime += 0.02;
    if (currentTime > totalTime) {
      currentTime = totalTime;
      isPlaying = false;
    }
    drawGraph();
    updateCar();
    requestAnimationFrame(animate);
  }
}

document.getElementById("playBtn").onclick = () => {
  if (!isPlaying && currentTime < totalTime) {
    isPlaying = true;
    animate();
  }
};

document.getElementById("pauseBtn").onclick = () => {
  isPlaying = false;
};

document.getElementById("resetBtn").onclick = () => {
  isPlaying = false;
  currentTime = 0;
  drawGraph();
  updateCar();
};

document.getElementById("newGraphBtn").onclick = () => {
  isPlaying = false;
  currentTime = 0;
  currentGraphIndex = (currentGraphIndex + 1) % graphSets.length;
  dataPoints = graphSets[currentGraphIndex];
  totalTime = dataPoints[dataPoints.length - 1].t;
  drawGraph();
  updateCar();
};

// Initial
drawGraph();
updateCar();
