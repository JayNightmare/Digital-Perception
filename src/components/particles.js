import React, { useRef, useEffect, useCallback } from "react";
import { useMousePosition } from "../utils/mouse";

export default function Particles({
    className = "",
    quantity = 30,
    staticity = 50,
    ease = 50,
    refresh = false,
}) {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const context = useRef(null);
    const circles = useRef([]);
    const mousePosition = useMousePosition();
    const mouse = useRef({ x: 0, y: 0 });
    const canvasSize = useRef({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

    const circleParams = useCallback(() => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism,
        };
    }, []);

    const drawCircle = useCallback(
        (circle, update = false) => {
            if (context.current) {
                const { x, y, translateX, translateY, size, alpha } = circle;
                context.current.translate(translateX, translateY);
                context.current.beginPath();
                context.current.arc(x, y, size, 0, 2 * Math.PI);
                context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                context.current.fill();
                context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

                if (!update) {
                    circles.current.push(circle);
                }
            }
        },
        [dpr]
    );

    const clearContext = useCallback(() => {
        if (context.current) {
            context.current.clearRect(
                0,
                0,
                canvasSize.current.w,
                canvasSize.current.h
            );
        }
    }, []);

    const drawParticles = useCallback(() => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    }, [quantity, circleParams, drawCircle, clearContext]);

    const resizeCanvas = useCallback(() => {
        if (
            canvasContainerRef.current &&
            canvasRef.current &&
            context.current
        ) {
            circles.current.length = 0;
            canvasSize.current.w = canvasContainerRef.current.offsetWidth;
            canvasSize.current.h = canvasContainerRef.current.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;
            context.current.scale(dpr, dpr);
        }
    }, [dpr]);

    const initCanvas = useCallback(() => {
        resizeCanvas();
        drawParticles();
    }, [resizeCanvas, drawParticles]);

    const onMouseMove = useCallback(() => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const { w, h } = canvasSize.current;
            const x = mousePosition.x - rect.left - w / 2;
            const y = mousePosition.y - rect.top - h / 2;
            const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
            if (inside) {
                mouse.current.x = x;
                mouse.current.y = y;
            }
        }
    }, [mousePosition]);

    const remapValue = useCallback((value, start1, end1, start2, end2) => {
        const remapped =
            ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    }, []);

    const animate = useCallback(() => {
        clearContext();
        circles.current.forEach((circle, i) => {
            const edge = [
                circle.x + circle.translateX - circle.size,
                canvasSize.current.w -
                    circle.x -
                    circle.translateX -
                    circle.size,
                circle.y + circle.translateY - circle.size,
                canvasSize.current.h -
                    circle.y -
                    circle.translateY -
                    circle.size,
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(
                remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
            );

            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) {
                    circle.alpha = circle.targetAlpha;
                }
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }

            circle.x += circle.dx;
            circle.y += circle.dy;
            circle.translateX +=
                (mouse.current.x / (staticity / circle.magnetism) -
                    circle.translateX) /
                ease;
            circle.translateY +=
                (mouse.current.y / (staticity / circle.magnetism) -
                    circle.translateY) /
                ease;

            if (
                circle.x < -circle.size ||
                circle.x > canvasSize.current.w + circle.size ||
                circle.y < -circle.size ||
                circle.y > canvasSize.current.h + circle.size
            ) {
                circles.current.splice(i, 1);
                const newCircle = circleParams();
                drawCircle(newCircle);
            } else {
                drawCircle(
                    {
                        ...circle,
                        x: circle.x,
                        y: circle.y,
                        translateX: circle.translateX,
                        translateY: circle.translateY,
                        alpha: circle.alpha,
                    },
                    true
                );
            }
        });

        window.requestAnimationFrame(animate);
    }, [staticity, ease, clearContext, remapValue, circleParams, drawCircle]);

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
        initCanvas();
        animate();
        window.addEventListener("resize", initCanvas);

        return () => {
            window.removeEventListener("resize", initCanvas);
        };
    }, [initCanvas, animate]);

    useEffect(() => {
        onMouseMove();
    }, [mousePosition, onMouseMove]);

    useEffect(() => {
        initCanvas();
    }, [refresh, initCanvas]);

    return (
        <div className={className} ref={canvasContainerRef} aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
}
