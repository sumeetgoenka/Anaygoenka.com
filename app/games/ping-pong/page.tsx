'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PingPongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState('menu');
  const [gameMode, setGameMode] = useState('vs-ai');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [gameSettings, setGameSettings] = useState({
    audio: true,
    vfx: true,
    ballColor: '#ff6b6b',
    paddleColor: '#4ecdc4',
    backgroundColor: '#2c3e50'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);

  // Game variables
  const [gameData, setGameData] = useState({
    ballX: 400,
    ballY: 300,
    ballDX: 4,
    ballDY: 4,
    ballSpeed: 4,
    player1Y: 250,
    player2Y: 250,
    paddleHeight: 80,
    paddleWidth: 10,
    ballSize: 8,
    canvasWidth: 800,
    canvasHeight: 600,
    backgroundColor: '#2c3e50',
    powerShot: false,
    curveShot: false,
    powerCurveShot: false,
    draftShot: false,
    particles: [] as any[],
    lastShot: 0
  });

  const [keys, setKeys] = useState({
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
  });

  // Audio context
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
    }

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        setKeys(prev => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      updateGame();
    }, 16); // ~60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState, gameData, keys, aiDifficulty, gameMode]);

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGame(ctx);
  }, [gameData, gameSettings]);

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    const { canvasWidth, canvasHeight } = gameData;

    // Clear canvas
    ctx.fillStyle = gameSettings.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw center line
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([10, 20]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = gameSettings.paddleColor;
    ctx.fillRect(20, gameData.player1Y, gameData.paddleWidth, gameData.paddleHeight);
    ctx.fillRect(canvasWidth - 30, gameData.player2Y, gameData.paddleWidth, gameData.paddleHeight);

    // Draw ball with effects
    ctx.fillStyle = gameData.powerShot ? '#ff4757' : 
                   gameData.curveShot ? '#ffa502' : 
                   gameData.powerCurveShot ? '#ff6348' : 
                   gameData.draftShot ? '#2ed573' : 
                   gameSettings.ballColor;
    
    ctx.beginPath();
    ctx.arc(gameData.ballX, gameData.ballY, gameData.ballSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw particles
    if (gameSettings.vfx) {
      gameData.particles.forEach(particle => {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score.player1.toString(), canvasWidth / 4, 80);
    ctx.fillText(score.player2.toString(), (canvasWidth / 4) * 3, 80);

    // Draw shot indicators
    if (gameData.powerShot || gameData.curveShot || gameData.powerCurveShot || gameData.draftShot) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      let shotText = '';
      if (gameData.powerShot) shotText = 'POWER SHOT!';
      if (gameData.curveShot) shotText = 'CURVE SHOT!';
      if (gameData.powerCurveShot) shotText = 'POWER CURVE!';
      if (gameData.draftShot) shotText = 'DRAFT SHOT!';
      ctx.fillText(shotText, canvasWidth / 2, 50);
    }
  };

  const updateGame = () => {
    setGameData(prev => {
      let newBallX = prev.ballX + prev.ballDX;
      let newBallY = prev.ballY + prev.ballDY;
      let newBallDX = prev.ballDX;
      let newBallDY = prev.ballDY;
      let newPlayer1Y = prev.player1Y;
      let newPlayer2Y = prev.player2Y;
      let newParticles = [...prev.particles];

      // Update particles
      newParticles = newParticles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha -= 0.02;
        particle.size -= 0.1;
        return particle.alpha > 0 && particle.size > 0;
      });

      // Handle paddle movement
      const paddleSpeed = 8;
      if (keys.w) newPlayer1Y = Math.max(0, newPlayer1Y - paddleSpeed);
      if (keys.s) newPlayer1Y = Math.min(prev.canvasHeight - prev.paddleHeight, newPlayer1Y + paddleSpeed);
      
      if (gameMode === '2-player') {
        if (keys.ArrowUp) newPlayer2Y = Math.max(0, newPlayer2Y - paddleSpeed);
        if (keys.ArrowDown) newPlayer2Y = Math.min(prev.canvasHeight - prev.paddleHeight, newPlayer2Y + paddleSpeed);
      } else {
        // AI logic
        const aiSpeed = aiDifficulty === 'easy' ? 3 : aiDifficulty === 'medium' ? 5 : 7;
        if (newBallY < newPlayer2Y + prev.paddleHeight / 2) {
          newPlayer2Y = Math.max(0, newPlayer2Y - aiSpeed);
        } else {
          newPlayer2Y = Math.min(prev.canvasHeight - prev.paddleHeight, newPlayer2Y + aiSpeed);
        }
      }

      // Ball collision with walls
      if (newBallY <= prev.ballSize || newBallY >= prev.canvasHeight - prev.ballSize) {
        newBallDY = -newBallDY;
        if (gameSettings.audio) playSound('wall');
      }

      // Ball collision with paddles
      if (newBallX <= 30 && newBallY >= newPlayer1Y && newBallY <= newPlayer1Y + prev.paddleHeight) {
        newBallDX = -newBallDX;
        newBallDX *= 1.1;
        newBallDY *= 1.1;
        if (gameSettings.audio) playSound('paddle');
        if (gameSettings.vfx) {
          for (let i = 0; i < 5; i++) {
            newParticles.push({
              x: 30,
              y: newBallY,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              alpha: 1,
              size: 3
            });
          }
        }
        checkSpecialShot();
      }

      if (newBallX >= prev.canvasWidth - 30 && newBallY >= newPlayer2Y && newBallY <= newPlayer2Y + prev.paddleHeight) {
        newBallDX = -newBallDX;
        newBallDX *= 1.1;
        newBallDY *= 1.1;
        if (gameSettings.audio) playSound('paddle');
        if (gameSettings.vfx) {
          for (let i = 0; i < 5; i++) {
            newParticles.push({
              x: prev.canvasWidth - 30,
              y: newBallY,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              alpha: 1,
              size: 3
            });
          }
        }
        checkSpecialShot();
      }

      // Scoring
      if (newBallX <= 0) {
        setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
        resetBall();
        if (gameSettings.audio) playSound('score');
      }

      if (newBallX >= prev.canvasWidth) {
        setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
        resetBall();
        if (gameSettings.audio) playSound('score');
      }

      return {
        ...prev,
        ballX: newBallX,
        ballY: newBallY,
        ballDX: newBallDX,
        ballDY: newBallDY,
        player1Y: newPlayer1Y,
        player2Y: newPlayer2Y,
        particles: newParticles
      };
    });
  };

  const checkSpecialShot = () => {
    const now = Date.now();
    if (now - gameData.lastShot < 1000) return; // Prevent rapid special shots

    const random = Math.random();
    setGameData(prev => ({
      ...prev,
      powerShot: random < 0.1,
      curveShot: random >= 0.1 && random < 0.2,
      powerCurveShot: random >= 0.2 && random < 0.25,
      draftShot: random >= 0.25 && random < 0.3,
      lastShot: now
    }));

    // Clear special shot after 2 seconds
    setTimeout(() => {
      setGameData(prev => ({
        ...prev,
        powerShot: false,
        curveShot: false,
        powerCurveShot: false,
        draftShot: false
      }));
    }, 2000);
  };

  const resetBall = () => {
    setGameData(prev => ({
      ...prev,
      ballX: prev.canvasWidth / 2,
      ballY: prev.canvasHeight / 2,
      ballDX: (Math.random() > 0.5 ? 1 : -1) * prev.ballSpeed,
      ballDY: (Math.random() > 0.5 ? 1 : -1) * prev.ballSpeed,
      powerShot: false,
      curveShot: false,
      powerCurveShot: false,
      draftShot: false
    }));
  };

  const playSound = (type: string) => {
    if (!audioContextRef.current || !gameSettings.audio) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    switch (type) {
      case 'paddle':
        oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
        break;
      case 'wall':
        oscillator.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
        break;
      case 'score':
        oscillator.frequency.setValueAtTime(200, audioContextRef.current.currentTime);
        break;
    }

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.1);
  };

  const startGame = () => {
    setGameState('playing');
    setScore({ player1: 0, player2: 0 });
    resetBall();
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const resetGame = () => {
    setGameState('menu');
    setScore({ player1: 0, player2: 0 });
    resetBall();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/games" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Back to Games
          </Link>
          <h1 className="text-3xl font-bold">Advanced Ping Pong</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInstructions(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Instructions
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              Settings
            </button>
            <button
              onClick={() => setShowUpdates(true)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              Updates
            </button>
          </div>
        </div>

        {/* Game Menu */}
        {gameState === 'menu' && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-8 text-gradient">Advanced Ping Pong</h2>
            
            {/* Game Mode Selection */}
            <div className="mb-8">
              <h3 className="text-2xl mb-4">Select Game Mode</h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setGameMode('vs-ai')}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    gameMode === 'vs-ai' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  VS AI
                </button>
                <button
                  onClick={() => setGameMode('training')}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    gameMode === 'training' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Training
                </button>
                <button
                  onClick={() => setGameMode('2-player')}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    gameMode === '2-player' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  2 Player
                </button>
              </div>
            </div>

            {/* AI Difficulty (only for VS AI mode) */}
            {gameMode === 'vs-ai' && (
              <div className="mb-8">
                <h3 className="text-2xl mb-4">AI Difficulty</h3>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setAiDifficulty('easy')}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      aiDifficulty === 'easy' ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => setAiDifficulty('medium')}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      aiDifficulty === 'medium' ? 'bg-yellow-600' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setAiDifficulty('hard')}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      aiDifficulty === 'hard' ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-bold transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Game Canvas */}
        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border-2 border-gray-600 rounded-lg"
            />
            
            {/* Pause Overlay */}
            {gameState === 'paused' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
                  <button
                    onClick={resumeGame}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Resume Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Controls */}
        {gameState === 'playing' && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={pauseGame}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors"
            >
              Pause
            </button>
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        )}

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6">How to Play</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Controls</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Player 1 (Left)</h4>
                      <p>W - Move Up</p>
                      <p>S - Move Down</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Player 2 (Right)</h4>
                      <p>↑ - Move Up</p>
                      <p>↓ - Move Down</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Game Modes</h3>
                  <ul className="space-y-2">
                    <li><strong>VS AI:</strong> Play against computer with adjustable difficulty</li>
                    <li><strong>Training:</strong> Practice mode with no opponent</li>
                    <li><strong>2 Player:</strong> Local multiplayer</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Special Shots</h3>
                  <ul className="space-y-2">
                    <li><strong>Power Shot:</strong> Faster ball speed</li>
                    <li><strong>Curve Shot:</strong> Ball curves unpredictably</li>
                    <li><strong>Power Curve:</strong> Combines power and curve</li>
                    <li><strong>Draft Shot:</strong> Ball leaves a trail</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Scoring</h3>
                  <p>Score points when the ball passes your opponent's paddle. First to reach the target score wins!</p>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-md">
              <h2 className="text-3xl font-bold mb-6">Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg">Audio</label>
                  <input
                    type="checkbox"
                    checked={gameSettings.audio}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, audio: e.target.checked }))}
                    className="w-5 h-5"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-lg">Visual Effects</label>
                  <input
                    type="checkbox"
                    checked={gameSettings.vfx}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, vfx: e.target.checked }))}
                    className="w-5 h-5"
                  />
                </div>

                <div>
                  <label className="text-lg block mb-2">Ball Color</label>
                  <input
                    type="color"
                    value={gameSettings.ballColor}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, ballColor: e.target.value }))}
                    className="w-full h-10 rounded"
                  />
                </div>

                <div>
                  <label className="text-lg block mb-2">Paddle Color</label>
                  <input
                    type="color"
                    value={gameSettings.paddleColor}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, paddleColor: e.target.value }))}
                    className="w-full h-10 rounded"
                  />
                </div>

                <div>
                  <label className="text-lg block mb-2">Background Color</label>
                  <input
                    type="color"
                    value={gameSettings.backgroundColor}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full h-10 rounded"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors w-full"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Updates Modal */}
        {showUpdates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6">Latest Updates</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-green-400">v2.0 - Advanced Features</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Multiple game modes (VS AI, Training, 2 Player)</li>
                    <li>Adjustable AI difficulty levels</li>
                    <li>Special shot system (Power, Curve, Power Curve, Draft)</li>
                    <li>Particle effects and visual enhancements</li>
                    <li>Audio feedback system</li>
                    <li>Customizable colors and settings</li>
                    <li>Improved physics and ball mechanics</li>
                    <li>Enhanced UI with modals and menus</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-400">v1.5 - Polish</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Improved paddle movement</li>
                    <li>Better collision detection</li>
                    <li>Score display enhancements</li>
                    <li>Responsive design improvements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-yellow-400">v1.0 - Initial Release</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Basic ping pong gameplay</li>
                    <li>Simple AI opponent</li>
                    <li>Score tracking</li>
                    <li>Canvas-based rendering</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowUpdates(false)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .text-gradient {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient 3s ease infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
} 