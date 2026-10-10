"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!canvasElement) {
      return;
    }

    const drawingContext = canvasElement.getContext("2d");

    if (!drawingContext) {
      return;
    }

    const canvas = canvasElement;
    const context = drawingContext;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let time = 0;

    const mouse = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function handlePointerMove(event: PointerEvent) {
      mouse.targetX = event.clientX / width;
      mouse.targetY = event.clientY / height;
    }

    function handlePointerLeave() {
      mouse.targetX = 0.5;
      mouse.targetY = 0.5;
    }

    function drawBlob(
      x: number,
      y: number,
      radius: number,
      color: string,
      alpha: number
    ) {
      const gradient = context.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radius
      );

      gradient.addColorStop(
        0,
        `${color}${Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`
      );

      gradient.addColorStop(0.35, `${color}45`);
      gradient.addColorStop(0.7, `${color}18`);
      gradient.addColorStop(1, `${color}00`);

      context.fillStyle = gradient;

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    function drawFlow(
      offset: number,
      amplitude: number,
      frequency: number,
      thickness: number,
      color: string
    ) {
      context.beginPath();

      for (let x = -100; x <= width + 100; x += 8) {
        const normalizedX = x / width;

        const wave =
          Math.sin(normalizedX * frequency + time * 0.45 + offset) *
          amplitude;

        const secondaryWave =
          Math.sin(
            normalizedX * frequency * 1.8 - time * 0.25 + offset
          ) *
          amplitude *
          0.35;

        const mouseInfluence =
          (mouse.x - 0.5) *
          Math.sin(normalizedX * Math.PI) *
          width *
          0.12;

        const y =
          height * 0.5 +
          wave +
          secondaryWave +
          mouseInfluence +
          (mouse.y - 0.5) * height * 0.15;

        if (x === -100) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.lineWidth = thickness;

      const gradient = context.createLinearGradient(
        0,
        0,
        width,
        height
      );

      gradient.addColorStop(0, `${color}00`);
      gradient.addColorStop(0.25, `${color}12`);
      gradient.addColorStop(0.5, `${color}35`);
      gradient.addColorStop(0.75, `${color}12`);
      gradient.addColorStop(1, `${color}00`);

      context.strokeStyle = gradient;
      context.stroke();
    }

    function draw() {
      time += prefersReducedMotion ? 0.001 : 0.008;

      mouse.x += (mouse.targetX - mouse.x) * 0.025;
      mouse.y += (mouse.targetY - mouse.y) * 0.025;

      context.clearRect(0, 0, width, height);

      // Warm cream base
      const background = context.createLinearGradient(
        0,
        0,
        width,
        height
      );

      background.addColorStop(0, "#fffdf8");
      background.addColorStop(0.45, "#faf7f0");
      background.addColorStop(1, "#f5f0e8");

      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      // Soft pastel light fields
      const blobOneX =
        width * (0.2 + Math.sin(time * 0.42) * 0.15) +
        (mouse.x - 0.5) * 120;

      const blobOneY =
        height * (0.25 + Math.cos(time * 0.34) * 0.14) +
        (mouse.y - 0.5) * 100;

      const blobTwoX =
        width * (0.78 + Math.cos(time * 0.31) * 0.14) +
        (mouse.x - 0.5) * -120;

      const blobTwoY =
        height * (0.55 + Math.sin(time * 0.37) * 0.15) +
        (mouse.y - 0.5) * -80;

      const blobThreeX =
        width * (0.5 + Math.sin(time * 0.22) * 0.2);

      const blobThreeY =
        height * (0.82 + Math.cos(time * 0.28) * 0.1);

      drawBlob(
        blobOneX,
        blobOneY,
        width * 0.42,
        "#c4b5fd",
        0.34
      );

      drawBlob(
        blobTwoX,
        blobTwoY,
        width * 0.38,
        "#93c5fd",
        0.28
      );

      drawBlob(
        blobThreeX,
        blobThreeY,
        width * 0.42,
        "#f9a8d4",
        0.18
      );

      // Soft flowing ribbons
      context.globalCompositeOperation = "multiply";

      drawFlow(
        0,
        height * 0.14,
        5.2,
        65,
        "#a78bfa"
      );

      drawFlow(
        1.8,
        height * 0.11,
        4.4,
        50,
        "#7dd3fc"
      );

      drawFlow(
        3.5,
        height * 0.08,
        6.5,
        40,
        "#f0abfc"
      );

      context.globalCompositeOperation = "source-over";

      // Gentle center glow
      const centerGradient = context.createRadialGradient(
        width * (0.5 + (mouse.x - 0.5) * 0.08),
        height * (0.48 + (mouse.y - 0.5) * 0.08),
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.55
      );

      centerGradient.addColorStop(
        0,
        "rgba(255,255,255,0.35)"
      );

      centerGradient.addColorStop(
        0.5,
        "rgba(255,255,255,0.08)"
      );

      centerGradient.addColorStop(
        1,
        "rgba(245,240,232,0)"
      );

      context.fillStyle = centerGradient;
      context.fillRect(0, 0, width, height);

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}