import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const SPEED = 100;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const gameOverRef = useRef(false);
  const isPausedRef = useRef(false);

  const spawnFood = (snake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    spawnFood(snakeRef.current);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    gameOverRef.current = false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && gameOverRef.current) {
        resetGame();
        return;
      }

      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused(p => {
          isPausedRef.current = !p;
          return !p;
        });
        return;
      }

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (dir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (dir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (dir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (dir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let animationFrameId: number;

    const drawBlock = (x: number, y: number, color: string, offset = 0) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * CELL_SIZE + offset, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    };

    const update = () => {
      directionRef.current = nextDirectionRef.current;
      const dir = directionRef.current;
      const snake = [...snakeRef.current];
      const head = { ...snake[0] };

      head.x += dir.x;
      head.y += dir.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOverRef.current = true;
        setGameOver(true);
        return;
      }

      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOverRef.current = true;
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const newScore = score + 1;
        setScore(newScore);
        onScoreChange(newScore);
        spawnFood(snake);
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
    };

    const draw = () => {
      // Clear canvas with raw black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid dots
      ctx.fillStyle = '#111111';
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          ctx.fillRect(i * CELL_SIZE + CELL_SIZE/2, j * CELL_SIZE + CELL_SIZE/2, 2, 2);
        }
      }

      // Draw Food (Magenta)
      // Glitch effect on food occasionally
      const glitchOffset = Math.random() > 0.8 ? (Math.random() > 0.5 ? 2 : -2) : 0;
      drawBlock(foodRef.current.x, foodRef.current.y, '#ff00ff', glitchOffset);

      // Draw Snake (Cyan)
      const snake = snakeRef.current;
      snake.forEach((segment, index) => {
        const isHead = index === 0;
        const color = isHead ? '#ffffff' : '#00ffff';
        const sGlitch = Math.random() > 0.95 ? (Math.random() > 0.5 ? 3 : -3) : 0;
        drawBlock(segment.x, segment.y, color, sGlitch);
      });

      if (gameOverRef.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        ctx.fillStyle = '#ff00ff';
        ctx.font = '30px "VT323", monospace';
        ctx.textAlign = 'center';
        // Glitch text effect
        ctx.fillText('CRITICAL_FAILURE', CANVAS_SIZE / 2 - 2, CANVAS_SIZE / 2 - 10);
        ctx.fillStyle = '#00ffff';
        ctx.fillText('CRITICAL_FAILURE', CANVAS_SIZE / 2 + 2, CANVAS_SIZE / 2 - 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('CRITICAL_FAILURE', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 10);
        
        ctx.font = '20px "VT323", monospace';
        ctx.fillText('AWAITING_REBOOT(SPACE)', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
      } else if (isPausedRef.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = '#00ffff';
        ctx.font = '30px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EXECUTION_HALTED', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10);
      }
    };

    const gameLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);

      if (gameOverRef.current || isPausedRef.current) {
        draw();
        return;
      }

      if (time - lastTime < SPEED) {
        // Occasionally draw a tear line
        if (Math.random() > 0.98) {
          ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
          ctx.fillRect(0, Math.random() * CANVAS_SIZE, CANVAS_SIZE, 4);
        }
        return;
      }
      lastTime = time;

      update();
      draw();
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [score, onScoreChange]);

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block w-full max-w-[400px] aspect-square bg-black"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-[#ff00ff] md:hidden">
        [KEYBOARD_REQUIRED_FOR_INPUT]
      </div>
    </div>
  );
}
