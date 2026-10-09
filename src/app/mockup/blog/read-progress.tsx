/*
  The burst reads the active palette tokens, so a later brand delivery
  changes the colors without a code change. Pieces are drawn on the
  contents track itself, from the end circle, so a fast scroll cannot
  leave the burst behind in the viewport.
*/

const COLOR_TOKENS = [
  "--accent",
  "--panel-accent",
  "--tint",
  "--top-row",
  "--pick-1",
  "--pick-2",
  "--pick-3",
  "--pick-4",
];

const FIELD_WIDTH = 560;
const FIELD_HEIGHT = 560;
const ORIGIN_X = FIELD_WIDTH / 2;
const ORIGIN_Y = 400;

type Rgb = [number, number, number];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  gravity: number;
  w: number;
  h: number;
  rot: number;
  spin: number;
  color: string;
  shape: "square" | "diamond";
  life: number;
  max: number;
};

function parseRgb(input: string): Rgb | null {
  const match = input.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function brandColors() {
  const root =
    document.querySelector<HTMLElement>("[data-palette]") ??
    document.documentElement;
  const style = getComputedStyle(root);
  const colors: string[] = [];

  for (const token of COLOR_TOKENS) {
    const raw = style.getPropertyValue(token).trim();
    if (!raw) continue;
    const probe = document.createElement("span");
    probe.style.color = raw;
    probe.style.display = "none";
    document.body.appendChild(probe);
    const color = parseRgb(getComputedStyle(probe).color);
    probe.remove();
    if (!color) continue;
    const painted = `rgb(${color.join(",")})`;
    if (colors.includes(painted)) continue;
    colors.push(painted);
  }

  return colors;
}

function shuffled(colors: string[], count: number) {
  const deck: string[] = [];
  while (deck.length < count) deck.push(...colors);
  const hand = deck.slice(0, count);
  for (let index = hand.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = hand[index];
    hand[index] = hand[swap] ?? current;
    hand[swap] = current;
  }
  return hand;
}

export function celebrate(
  host: HTMLElement,
  badge: HTMLElement,
  className: string,
) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return () => {};

  const colors = brandColors();
  if (colors.length === 0) return () => {};

  const canvas = document.createElement("canvas");
  canvas.className = className;
  canvas.setAttribute("aria-hidden", "true");
  const found = canvas.getContext("2d");
  if (!found) return () => {};
  const context = found;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(FIELD_WIDTH * ratio);
  canvas.height = Math.round(FIELD_HEIGHT * ratio);
  canvas.style.width = `${FIELD_WIDTH}px`;
  canvas.style.height = `${FIELD_HEIGHT}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const place = () => {
    const hostBox = host.getBoundingClientRect();
    const badgeBox = badge.getBoundingClientRect();
    const x = badgeBox.left + badgeBox.width / 2 - hostBox.left;
    const y = badgeBox.top + badgeBox.height / 2 - hostBox.top;
    canvas.style.left = `${x - ORIGIN_X}px`;
    canvas.style.top = `${y - ORIGIN_Y}px`;
  };

  place();
  host.appendChild(canvas);

  const pieces: Piece[] = [];
  const palette = shuffled(colors, 78);
  for (let index = 0; index < palette.length; index += 1) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.45;
    const speed = 4.4 + Math.random() * 4.8;
    const vx = Math.cos(angle) * speed;
    const size = 7 + Math.random() * 6.5;
    pieces.push({
      x: ORIGIN_X + (Math.random() - 0.5) * 8,
      y: ORIGIN_Y,
      vx,
      vy: Math.sin(angle) * speed,
      ax: Math.sign(vx || 1) * (0.006 + Math.abs(vx) * 0.004),
      gravity: 0.12 + Math.random() * 0.045,
      w: size,
      h: size * (0.7 + Math.random() * 0.5),
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.1,
      color: palette[index] ?? colors[0],
      shape: Math.random() < 0.5 ? "diamond" : "square",
      life: 0,
      max: 130 + Math.random() * 50,
    });
  }

  let frame = 0;
  let stopped = false;

  function tick() {
    if (stopped) return;
    place();
    context.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
    let alive = 0;

    for (const piece of pieces) {
      piece.life += 1;
      if (piece.life > piece.max) continue;
      alive += 1;
      piece.vx += piece.ax;
      piece.vy += piece.gravity;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rot += piece.spin;
      const fade = piece.life / piece.max;
      context.globalAlpha =
        fade < 0.62 ? 0.95 : 0.95 * (1 - (fade - 0.62) / 0.38);
      context.fillStyle = piece.color;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(
        piece.shape === "diamond" ? piece.rot + Math.PI / 4 : piece.rot,
      );
      context.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      context.restore();
    }

    context.globalAlpha = 1;
    if (alive > 0) frame = requestAnimationFrame(tick);
    else stop();
  }

  function stop() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    canvas.remove();
  }

  frame = requestAnimationFrame(tick);
  return stop;
}
