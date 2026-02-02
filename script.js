/*************************
 * CONFIG
 *************************/
const ROWS = 12;
const COLS = 12;
const SPACING = 50;
const MARGIN = 40;
const DOT_RADIUS = 4;

/*************************
 * STATE
 *************************/
const state = {
  currentPlayer: "A",
  scores: { A: 0, B: 0 },
  lines: {},       // "r1,c1-r2,c2" -> "A" | "B"
  boxes: {},       // "r,c" -> "A" | "B"
  selectedDot: null,
  mode: "friend"
};

/*************************
 * CANVAS
 *************************/
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.width = COLS * SPACING + MARGIN;
canvas.height = ROWS * SPACING + MARGIN;

/*************************
 * UTILITIES
 *************************/
function lineKey(a, b) {
  // normalize order so (a,b) === (b,a)
  if (a.r > b.r || (a.r === b.r && a.c > b.c)) {
    [a, b] = [b, a];
  }
  return `${a.r},${a.c}-${b.r},${b.c}`;
}

function hasLine(a, b) {
  return Boolean(state.lines[lineKey(a, b)]);
}

function addLine(a, b, player) {
  state.lines[lineKey(a, b)] = player;
}

/*************************
 * BOX CHECK
 *************************/
function checkBoxes(player) {
  let madeBox = false;

  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      const edges = [
        lineKey({ r, c }, { r, c: c + 1 }),
        lineKey({ r: r + 1, c }, { r: r + 1, c: c + 1 }),
        lineKey({ r, c }, { r: r + 1, c }),
        lineKey({ r, c: c + 1 }, { r: r + 1, c: c + 1 })
      ];

      if (edges.every(e => state.lines[e]) && !state.boxes[`${r},${c}`]) {
        state.boxes[`${r},${c}`] = player;
        state.scores[player]++;
        madeBox = true;
      }
    }
  }
  return madeBox;
}

/*************************
 * DRAW
 *************************/
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // dots
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.beginPath();
      ctx.arc(c * SPACING + MARGIN, r * SPACING + MARGIN, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#e5e7eb";
      ctx.shadowColor = "rgba(255,255,255,0.2)";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // lines
  for (let k in state.lines) {
    const [a, b] = k.split("-");
    const [r1, c1] = a.split(",").map(Number);
    const [r2, c2] = b.split(",").map(Number);

    ctx.strokeStyle = state.lines[k] === "A" ? "#ef4444" : "#3b82f6";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(c1 * SPACING + MARGIN, r1 * SPACING + MARGIN);
    ctx.lineTo(c2 * SPACING + MARGIN, r2 * SPACING + MARGIN);
    ctx.stroke();
  }

  // boxes
  ctx.font = "bold 16px Segoe UI";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let b in state.boxes) {
    const [r, c] = b.split(",").map(Number);

    ctx.fillStyle =
      state.boxes[b] === "A"
        ? "rgba(239,68,68,0.25)"
        : "rgba(59,130,246,0.25)";

    ctx.fillRect(
      c * SPACING + MARGIN + 6,
      r * SPACING + MARGIN + 6,
      SPACING - 12,
      SPACING - 12
    );

    ctx.fillStyle = "#f9fafb";
    ctx.fillText(
      state.boxes[b],
      c * SPACING + MARGIN + SPACING / 2,
      r * SPACING + MARGIN + SPACING / 2
    );
  }

  // selected dot
  if (state.selectedDot) {
    const { r, c } = state.selectedDot;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(
      c * SPACING + MARGIN,
      r * SPACING + MARGIN,
      DOT_RADIUS + 5,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  document.getElementById("scoreA").textContent = state.scores.A;
  document.getElementById("scoreB").textContent = state.scores.B;
}

/*************************
 * INPUT (PLAYER)
 *************************/
canvas.addEventListener("click", e => {
  if (state.mode === "ai" && state.currentPlayer === "B") return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const c = Math.round((x - MARGIN) / SPACING);
  const r = Math.round((y - MARGIN) / SPACING);

  if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return;

  if (!state.selectedDot) {
    state.selectedDot = { r, c };
    draw();
    return;
  }

  const a = state.selectedDot;
  const b = { r, c };
  state.selectedDot = null;

  if (Math.abs(a.r - b.r) + Math.abs(a.c - b.c) !== 1) {
    draw();
    return;
  }

  if (hasLine(a, b)) {
    draw();
    return;
  }

  addLine(a, b, state.currentPlayer);
  const madeBox = checkBoxes(state.currentPlayer);

  if (!madeBox) {
    state.currentPlayer = state.currentPlayer === "A" ? "B" : "A";
  }

  draw();

  if (state.mode === "ai" && state.currentPlayer === "B") {
    setTimeout(aiMove, 120);
  }
});

/*************************
 * AI (SMART, SAFE, FAST)
 *************************/
function aiMove() {
  const moves = getAllMoves();
  if (!moves.length) return;

  // 1️⃣ always complete box
  for (let m of moves) {
    if (doesCompleteBox(m)) {
      playMove(m);
      return;
    }
  }

  // 2️⃣ avoid giving box
  const safeMoves = moves.filter(m => !createsThirdSide(m));
  if (safeMoves.length) {
    playMove(safeMoves[Math.floor(Math.random() * safeMoves.length)]);
    return;
  }

  // 3️⃣ forced move
  playMove(moves[Math.floor(Math.random() * moves.length)]);
}

function getAllMoves() {
  const moves = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 1 < COLS && !hasLine({ r, c }, { r, c: c + 1 }))
        moves.push([{ r, c }, { r, c: c + 1 }]);
      if (r + 1 < ROWS && !hasLine({ r, c }, { r: r + 1, c }))
        moves.push([{ r, c }, { r: r + 1, c }]);
    }
  }
  return moves;
}

function doesCompleteBox([a, b]) {
  const tempKey = lineKey(a, b);

  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      const edges = [
        lineKey({ r, c }, { r, c: c + 1 }),
        lineKey({ r: r + 1, c }, { r: r + 1, c: c + 1 }),
        lineKey({ r, c }, { r: r + 1, c }),
        lineKey({ r, c: c + 1 }, { r: r + 1, c: c + 1 })
      ];

      let count = 0;
      for (let e of edges) {
        if (state.lines[e] || e === tempKey) count++;
      }

      if (count === 4 && !state.boxes[`${r},${c}`]) return true;
    }
  }
  return false;
}

function createsThirdSide([a, b]) {
  const tempKey = lineKey(a, b);

  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      const edges = [
        lineKey({ r, c }, { r, c: c + 1 }),
        lineKey({ r: r + 1, c }, { r: r + 1, c: c + 1 }),
        lineKey({ r, c }, { r: r + 1, c }),
        lineKey({ r, c: c + 1 }, { r: r + 1, c: c + 1 })
      ];

      let count = 0;
      for (let e of edges) {
        if (state.lines[e] || e === tempKey) count++;
      }

      if (count === 3 && !state.boxes[`${r},${c}`]) return true;
    }
  }
  return false;
}

function playMove([a, b]) {
  addLine(a, b, "B");
  const madeBox = checkBoxes("B");
  if (!madeBox) state.currentPlayer = "A";
  draw();
  if (madeBox) setTimeout(aiMove, 120);
}

/*************************
 * UI
 *************************/
document.getElementById("mode").onchange = e => state.mode = e.target.value;
document.getElementById("restart").onclick = () => location.reload();

// initial render
draw();
