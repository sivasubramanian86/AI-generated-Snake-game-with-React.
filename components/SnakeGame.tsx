import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction, GameStatus, Difficulty } from '../types';
import { GRID_SIZE, CELL_SIZE, CANVAS_SIZE, DIFFICULTY_CONFIG } from '../constants';
import { useInterval } from '../hooks/useInterval';
import { Play, Pause, AlertTriangle } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const getRandomPoint = (): Point => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
};

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>(getRandomPoint());
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [nextDirection, setNextDirection] = useState<Direction>(Direction.RIGHT);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [speed, setSpeed] = useState<number>(DIFFICULTY_CONFIG[Difficulty.MEDIUM].speed);
  const [score, setScore] = useState<number>(0);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      if (status !== 'RUNNING') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== Direction.DOWN) setNextDirection(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== Direction.UP) setNextDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== Direction.RIGHT) setNextDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== Direction.LEFT) setNextDirection(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  // Reset Game
  const resetGame = () => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const initialSnake: Point[] = [];
    for (let i = 0; i < config.length; i++) {
      initialSnake.push({ x: 10 - i, y: 10 });
    }

    setSnake(initialSnake);
    setFood(getRandomPoint());
    setDirection(Direction.RIGHT);
    setNextDirection(Direction.RIGHT);
    setScore(0);
    setSpeed(config.speed);
    onScoreChange(0);
    setStatus('RUNNING');
  };

  const togglePause = () => {
    if (status === 'RUNNING') setStatus('PAUSED');
    else if (status === 'PAUSED') setStatus('RUNNING');
    else if (status === 'IDLE' || status === 'GAME_OVER') resetGame();
  };

  // Game Loop
  const gameLoop = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    // Update direction state for rendering
    setDirection(nextDirection);

    switch (nextDirection) {
      case Direction.UP: head.y -= 1; break;
      case Direction.DOWN: head.y += 1; break;
      case Direction.LEFT: head.x -= 1; break;
      case Direction.RIGHT: head.x += 1; break;
    }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setStatus('GAME_OVER');
      return;
    }

    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setStatus('GAME_OVER');
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      const newScore = score + 10;
      setScore(newScore);
      onScoreChange(newScore);
      setFood(getRandomPoint());
      const increment = DIFFICULTY_CONFIG[difficulty].increment;
      setSpeed(prev => Math.max(40, prev - increment));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, nextDirection, food, score, onScoreChange, difficulty]);

  useInterval(gameLoop, status === 'RUNNING' ? speed : null);

  // Drawing Helper Functions
  const drawMouse = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const cx = x + CELL_SIZE / 2;
    const cy = y + CELL_SIZE / 2;
    
    ctx.save();
    
    // Tail
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + 4, cy + 4);
    ctx.quadraticCurveTo(cx + 10, cy + 2, cx + 8, cy - 8);
    ctx.stroke();

    // Body (Grey Oval)
    ctx.fillStyle = '#9ca3af'; 
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears (Pink)
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 2, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy + 7, 1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawSnakeHead = (ctx: CanvasRenderingContext2D, x: number, y: number, dir: Direction) => {
    const cx = x + CELL_SIZE / 2;
    const cy = y + CELL_SIZE / 2;
    
    ctx.save();
    ctx.translate(cx, cy);

    let angle = 0;
    switch(dir) {
      case Direction.UP: angle = -Math.PI / 2; break;
      case Direction.DOWN: angle = Math.PI / 2; break;
      case Direction.LEFT: angle = Math.PI; break;
      case Direction.RIGHT: angle = 0; break;
    }
    ctx.rotate(angle);

    // Tongue
    ctx.strokeStyle = '#ef4444'; // Red
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(19, -3);
    ctx.moveTo(16, 0);
    ctx.lineTo(19, 3);
    ctx.stroke();

    // Head Shape
    // Gradient for 3D look
    const grad = ctx.createRadialGradient(-2, -2, 2, 0, 0, 10);
    grad.addColorStop(0, '#4ade80'); // lighter green
    grad.addColorStop(1, '#15803d'); // darker green
    ctx.fillStyle = grad;
    
    ctx.beginPath();
    // Tapered oval shape
    ctx.ellipse(0, 0, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(3, -4, 2.5, 0, Math.PI * 2);
    ctx.arc(3, 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(4, -4, 1, 0, Math.PI * 2);
    ctx.arc(4, 4, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawSnakeBody = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const cx = x + CELL_SIZE / 2;
    const cy = y + CELL_SIZE / 2;

    const grad = ctx.createRadialGradient(cx - 2, cy - 2, 2, cx, cy, 8);
    grad.addColorStop(0, '#4ade80');
    grad.addColorStop(1, '#166534');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
  };

  // Drawing Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid (Subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]); 
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw Food (Mouse)
    drawMouse(ctx, food.x * CELL_SIZE, food.y * CELL_SIZE);

    // Draw Snake
    // Draw body segments first
    for (let i = snake.length - 1; i > 0; i--) {
      drawSnakeBody(ctx, snake[i].x * CELL_SIZE, snake[i].y * CELL_SIZE);
    }
    // Draw Head last
    if (snake.length > 0) {
      drawSnakeHead(ctx, snake[0].x * CELL_SIZE, snake[0].y * CELL_SIZE, direction);
    }

  }, [snake, food, direction]);

  return (
    <div className="relative group w-full max-w-[400px] mx-auto">
      {/* Outer Glitch Border */}
      <div className="relative border-4 border-glitch-cyan bg-black shadow-[10px_10px_0_#ff00ff]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block w-full h-auto bg-black"
        />

        {/* Overlay */}
        {status !== 'RUNNING' && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-20 p-6">
            
            {status === 'GAME_OVER' && (
              <div className="text-center mb-6">
                <AlertTriangle className="mx-auto text-red-500 mb-2 animate-bounce" size={40} />
                <h2 className="text-4xl font-pixel text-red-500 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <p className="text-xs text-red-400 mt-2 font-mono">SNAKE.EXE HAS STOPPED WORKING</p>
              </div>
            )}

            {status === 'IDLE' && (
              <div className="text-center mb-8">
                 <h2 className="text-3xl font-pixel text-glitch-cyan animate-pulse">INIT_GAME_SEQ</h2>
              </div>
            )}

            {status === 'PAUSED' && (
              <div className="text-center mb-8">
                 <h2 className="text-3xl font-pixel text-glitch-yellow blink">SYSTEM_HALTED</h2>
              </div>
            )}
            
            {(status === 'IDLE' || status === 'GAME_OVER') && (
              <div className="flex gap-4 mb-8">
                {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-4 py-2 font-pixel text-[10px] border-2 transition-all duration-75 ${
                      difficulty === diff
                        ? 'bg-glitch-cyan text-black border-glitch-cyan'
                        : 'bg-transparent text-gray-500 border-gray-700 hover:border-glitch-cyan hover:text-glitch-cyan'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={status === 'PAUSED' ? togglePause : resetGame}
              className="group relative px-8 py-4 bg-transparent border-2 border-glitch-magenta text-glitch-magenta font-pixel text-xs hover:bg-glitch-magenta hover:text-black transition-colors"
            >
              <div className="absolute inset-0 translate-x-1 translate-y-1 border-2 border-glitch-cyan -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
              {status === 'IDLE' || status === 'GAME_OVER' ? ">> EXECUTE_RUN" : (status === 'PAUSED' ? ">> RESUME_PROCESS" : ">> HALT")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;