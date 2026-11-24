"use client";

import { useEffect, useRef } from "react";
import styles from "./clinic-quiz.module.css";

const COLOR_TOKENS = [
  "--color-accent",
  "--color-panel-accent",
  "--color-badge",
  "--color-card-2",
  "--color-card-3",
  "--color-marker",
] as const;

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  spin: number;
  color: string;
  circle: boolean;
  life: number;
  max: number;
};

function palette() {
  const style = getComputedStyle(document.documentElement);
  return COLOR_TOKENS.map((token) =>
    style.getPropertyValue(token).trim(),
  ).filter((color) => color.length > 0);
}

function burst(
  sparks: Spark[],
  colors: readonly string[],
  x: number,
  y: number,
  count: number,
) {
  const fallback = colors[0];
  if (!fallback) return;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.4;
    const speed = 2.6 + Math.random() * 5.4;
    const size = 5 + Math.random() * 7;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: size * (0.7 + Math.random() * 0.55),
      h: size * (0.32 + Math.random() * 0.4),
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.24,
      color: colors[index % colors.length] ?? fallback,
      circle: Math.random() < 0.2,
      life: 0,
      max: 150 + Math.random() * 36,
    });
  }
}

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const colors = palette();
    if (colors.length === 0) return;
    // Nested callbacks do not keep the narrowing from the checks above.
    const surface = canvas;
    const ctx = context;

    let width = 0;
    let height = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const sparks: Spark[] = [];
    const plan = [
      { at: 0, x: 0.22, y: 0.3, count: 68 },
      { at: 280, x: 0.78, y: 0.24, count: 68 },
      { at: 520, x: 0.5, y: 0.18, count: 82 },
    ];
    const fired = new Set<number>();
    const started = performance.now();
    let frame = 0;
    let stopped = false;

    function tick(now: number) {
      if (stopped) return;
      const elapsed = now - started;
      plan.forEach((item, index) => {
        if (fired.has(index) || elapsed < item.at) return;
        fired.add(index);
        burst(sparks, colors, width * item.x, height * item.y, item.count);
      });

      ctx.clearRect(0, 0, width, height);
      let alive = 0;
      for (const spark of sparks) {
        spark.life += 1;
        if (spark.life > spark.max) continue;
        alive += 1;
        spark.vx *= 0.988;
        spark.vy = spark.vy * 0.988 + 0.06;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.rot += spark.spin;
        const fade = spark.life / spark.max;
        ctx.globalAlpha = fade < 0.68 ? 1 : 1 - (fade - 0.68) / 0.32;
        ctx.fillStyle = spark.color;
        ctx.save();
        ctx.translate(spark.x, spark.y);
        ctx.rotate(spark.rot);
        if (spark.circle) {
          ctx.beginPath();
          ctx.arc(0, 0, spark.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-spark.w / 2, -spark.h / 2, spark.w, spark.h);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      if (alive > 0 || fired.size < plan.length) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.fireworks} aria-hidden="true" />
  );
}
