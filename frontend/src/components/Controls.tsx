import { useHanoiStore } from '../store/hanoiStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward,
  Gauge,
  Loader2
} from 'lucide-react';

export const Controls: React.FC = () => {
  const {
    numDisks,
    isPlaying,
    isLoading,
    currentMoveIndex,
    moves,
    animationSpeed,
    setNumDisks,
    solvePuzzle,
    resetTowers,
    playAnimation,
    pauseAnimation,
    stepForward,
    stepBackward,
    setAnimationSpeed,
  } = useHanoiStore();
  
  const handleDiskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 20) {
      setNumDisks(value);
    }
  };
  
  const speedOptions = [
    { label: 'Slow', value: 1000 },
    { label: 'Normal', value: 500 },
    { label: 'Fast', value: 200 },
    { label: 'Very Fast', value: 50 },
  ];
  
  return (
    <div style={{
      width: '100%',
      backgroundColor: 'rgba(42, 42, 42, 0.8)',
      backdropFilter: 'blur(16px)',
      borderRadius: '0.5rem',
      border: '2px solid rgba(0, 242, 255, 0.2)',
      boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
      overflow: 'hidden'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(to right, rgba(0, 242, 255, 0.1), transparent)',
        padding: '0.375rem 0.5rem',
        borderBottom: '1px solid rgba(0, 242, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: '#00f2ff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Puzzle Controls
          </h2>
          <div style={{ fontSize: '0.625rem', color: 'rgba(0, 242, 255, 0.7)', fontFamily: 'monospace' }}>
            {moves.length > 0 && `${moves.length} moves`}
          </div>
        </div>
      </div>

      <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Input Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              color: '#00f2ff',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Number of Disks
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={numDisks}
              onChange={handleDiskChange}
              style={{
                width: '100%',
                fontSize: '1rem',
                fontFamily: 'monospace',
                padding: '0.375rem',
                borderRadius: '0.25rem',
                border: '2px solid rgba(0, 242, 255, 0.3)',
                backgroundColor: '#2a2a2a',
                color: '#00f2ff',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              disabled={isPlaying}
            />
          </div>
          
          <div>
            <button
              onClick={solvePuzzle}
              disabled={isLoading || isPlaying}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                backgroundColor: '#00f2ff',
                color: '#1a1a1a',
                boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                fontSize: '0.625rem',
                border: 'none',
                cursor: isLoading || isPlaying ? 'not-allowed' : 'pointer',
                opacity: isLoading || isPlaying ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: '0.75rem', height: '0.75rem', animation: 'spin 1s linear infinite' }} />
                  Solving...
                </>
              ) : (
                'Solve Puzzle'
              )}
            </button>
          </div>
        </div>
      
        {/* Playback Controls */}
        {moves.length > 0 && (
          <>
            {/* Main Playback Controls */}
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '0.25rem',
              padding: '0.375rem',
              border: '1px solid rgba(0, 242, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                <button
                  onClick={resetTowers}
                  disabled={isPlaying}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid rgba(0, 242, 255, 0.3)',
                    borderRadius: '0.25rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                    backgroundColor: '#2a2a2a',
                    color: '#00f2ff',
                    boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    opacity: isPlaying ? 0.5 : 1
                  }}
                  title="Reset to initial state"
                >
                  <RotateCcw style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
                
                <button
                  onClick={stepBackward}
                  disabled={isPlaying || currentMoveIndex < 0}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid rgba(0, 242, 255, 0.3)',
                    borderRadius: '0.25rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                    backgroundColor: '#2a2a2a',
                    color: '#00f2ff',
                    boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
                    cursor: (isPlaying || currentMoveIndex < 0) ? 'not-allowed' : 'pointer',
                    opacity: (isPlaying || currentMoveIndex < 0) ? 0.5 : 1
                  }}
                  title="Step backward"
                >
                  <SkipBack style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
                
                {isPlaying ? (
                  <button
                    onClick={pauseAnimation}
                    style={{
                      padding: '0.5rem 1.125rem',
                      borderRadius: '0.25rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      backgroundColor: '#00f2ff',
                      color: '#1a1a1a',
                      boxShadow: '0 0 30px rgba(0, 242, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.625rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Pause style={{ width: '0.875rem', height: '0.875rem' }} />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={playAnimation}
                    disabled={currentMoveIndex >= moves.length - 1}
                    style={{
                      padding: '0.5rem 1.125rem',
                      borderRadius: '0.25rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      backgroundColor: '#00f2ff',
                      color: '#1a1a1a',
                      boxShadow: '0 0 30px rgba(0, 242, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.625rem',
                      border: 'none',
                      cursor: currentMoveIndex >= moves.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: currentMoveIndex >= moves.length - 1 ? 0.5 : 1
                    }}
                  >
                    <Play style={{ width: '0.875rem', height: '0.875rem' }} />
                    {currentMoveIndex >= moves.length - 1 ? 'Finished' : 'Play'}
                  </button>
                )}
                
                <button
                  onClick={stepForward}
                  disabled={isPlaying || currentMoveIndex >= moves.length - 1}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid rgba(0, 242, 255, 0.3)',
                    borderRadius: '0.25rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                    backgroundColor: '#2a2a2a',
                    color: '#00f2ff',
                    boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
                    cursor: (isPlaying || currentMoveIndex >= moves.length - 1) ? 'not-allowed' : 'pointer',
                    opacity: (isPlaying || currentMoveIndex >= moves.length - 1) ? 0.5 : 1
                  }}
                  title="Step forward"
                >
                  <SkipForward style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
              </div>
            </div>
          
          {/* Speed Control */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '0.25rem',
            padding: '0.375rem',
            border: '1px solid rgba(0, 242, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              color: '#00f2ff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Gauge style={{ width: '0.75rem', height: '0.75rem' }} />
              <span>Animation Speed</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.375rem' }}>
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnimationSpeed(option.value)}
                  disabled={isPlaying}
                  style={{
                    position: 'relative',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '0.5rem',
                    overflow: 'hidden',
                    backgroundColor: animationSpeed === option.value ? '#00f2ff' : '#3a3a3a',
                    color: animationSpeed === option.value ? '#1a1a1a' : '#9ca3af',
                    border: animationSpeed === option.value ? '1px solid #00f2ff' : '1px solid rgba(0, 242, 255, 0.2)',
                    boxShadow: animationSpeed === option.value ? '0 0 20px rgba(0, 242, 255, 0.3)' : 'none',
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    opacity: isPlaying ? 0.5 : 1
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 10 }}>{option.label}</span>
                  {animationSpeed === option.value && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)',
                      animation: 'pulse 2s infinite'
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>
          
            {/* Progress Bar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              backgroundColor: '#1a1a1a',
              borderRadius: '0.25rem',
              padding: '0.375rem',
              border: '1px solid rgba(0, 242, 255, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.625rem',
                fontWeight: 'bold',
                color: '#00f2ff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <span>Progress</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{currentMoveIndex + 1} / {moves.length}</span>
              </div>
              <div style={{
                width: '100%',
                height: '0.375rem',
                backgroundColor: '#3a3a3a',
                borderRadius: '9999px',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 242, 255, 0.2)',
                position: 'relative'
              }}>
                <div
                  style={{
                    height: '100%',
                    width: `${((currentMoveIndex + 1) / moves.length) * 100}%`,
                    backgroundColor: '#00f2ff',
                    boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
