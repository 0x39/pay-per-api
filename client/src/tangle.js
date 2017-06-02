const LINE_WIDTH = 3;
const FILL_COLOR = '#fff';

class Vector {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
}

const POINTS = [
  new Vector(0, 57),
  new Vector(6, 41),
  new Vector(14, 65),
  new Vector(19, 28),

  new Vector(23, 83),
  new Vector(28, 64),
  new Vector(29, 9),

  new Vector(34, 35),
  new Vector(39, 14),

  new Vector(40, 78),
  new Vector(44, 45),
  new Vector(46, 91),

  new Vector(52, 8),
  new Vector(54, 50),
  new Vector(58, 89),
  new Vector(59, 21),

  new Vector(64, 47),
  new Vector(65, 83),
  new Vector(68, 11),
  new Vector(73, 47),
  new Vector(74, 93),

  new Vector(74, 24),
  new Vector(79, 10),
  new Vector(81, 41),
  new Vector(83, 75),
  new Vector(87, 9),
  new Vector(90, 51),

  new Vector(92, 90),
  new Vector(92, 26),
  new Vector(95, 77),
  new Vector(98, 9),
  new Vector(100, 46),
  new Vector(104, 83),
  new Vector(110, 110),
  new Vector(112, 37),
  new Vector(114, 10)
];

const LINES = [
  [],
  [0],
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [2, 3],
  [3, 5],
  [6, 7],
  [7, 4],
  [5, 7],
  [4, 9],
  [8, 10],
  [8, 11],
  [9, 10],
  [12, 13],
  [14, 15],
  [13, 12],
  [13, 15],
  [16, 17],
  [14, 17],
  [16, 18],
  [18, 19],
  [15, 20],
  [19, 20],
  [21, 23],
  [22, 24],
  [23, 20],
  [25, 26],
  [23, 27],
  [26, 28],
  [29, 28],
  [27, 29],
  [29, 27],
  [28, 30]
]

function tangle(canvas, color) {
  let width = window.document.body.clientWidth;
  let height = Math.floor(width / 3.8);
  const ctx = canvas.getContext('2d');
  let h0 = height;
  let minHeight = 300;
  if (height < minHeight) {
    height = minHeight;
    width = ((width / h0) * minHeight);
  }
  canvas.width = width;
  canvas.height = height;
  let fillColor = color ? color : FILL_COLOR;
  POINTS.forEach((point) => {
    drawTx(ctx, point, width, height, fillColor);
  });
  LINES.forEach((points, i) => {
    points.forEach((j) => {
      drawLine(ctx, POINTS[i], POINTS[j], width, height, fillColor);
    });
  });
}

function drawTx(ctx, center, width, height, color) {
  ctx.beginPath();
  ctx.arc(width * center.x / 100, height * center.y / 100, width / 100, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(ctx, from, to, width, height, color) {
  ctx.beginPath();
  ctx.moveTo(width * from.x / 100, height * from.y / 100);
  ctx.lineTo(width * to.x / 100, height * to.y / 100);
  ctx.strokeStyle = color;
  ctx.lineWidth = width / 400;
  ctx.stroke();
  ctx.closePath();
}

export default tangle;
