import { HanoiVisualizer } from './components/HanoiVisualizer';
import { MovesList } from './components/MovesList';
import { Controls } from './components/Controls';
import { useHanoiStore } from './store/hanoiStore';
import { useEffect } from 'react';

function App() {
  const { error, apiHealthy, checkApiHealth } = useHanoiStore();

  useEffect(() => {
    checkApiHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem'
      }}
    >      
      {/* Header Container - matches Controls/MovesList width */}
      <div style={{
        width: '100%',
        maxWidth: '960px',
        position: 'sticky',
        top: '2rem',
        zIndex: 40
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#00f2ff',
              filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.5))',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Tower of Hanoi
            </h1>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
              fontWeight: '500'
            }}>
              Interactive Recursive Puzzle Solver
            </p>
          </div>
          
          {/* API Health Indicator */}
          <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(42, 42, 42, 0.8)',
              border: `2px solid ${
                apiHealthy === null 
                  ? 'rgba(156, 163, 175, 0.3)' 
                  : apiHealthy 
                  ? 'rgba(34, 197, 94, 0.5)' 
                  : 'rgba(239, 68, 68, 0.5)'
              }`,
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                backgroundColor: apiHealthy === null 
                  ? '#9ca3af' 
                  : apiHealthy 
                  ? '#22c55e' 
                  : '#ef4444',
                boxShadow: apiHealthy === true 
                  ? '0 0 10px rgba(34, 197, 94, 0.8)' 
                  : apiHealthy === false 
                  ? '0 0 10px rgba(239, 68, 68, 0.8)' 
                  : 'none',
                animation: apiHealthy === null ? 'pulse 2s infinite' : 'none'
              }} />
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: apiHealthy === null 
                  ? '#9ca3af' 
                  : apiHealthy 
                  ? '#22c55e' 
                  : '#ef4444',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {apiHealthy === null ? 'Checking...' : apiHealthy ? 'API Healthy' : 'API Down'}
              </span>
              </div>
            </div>
          </div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        maxWidth: '960px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(127, 29, 29, 0.3)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            color: '#fecaca',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(4px)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div>
                <strong style={{
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  color: '#fca5a5'
                }}>Error</strong>
                <p style={{ marginTop: '0.25rem' }}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <Controls />

        {/* Visualizer */}
        <HanoiVisualizer />

        {/* Moves List */}
        <MovesList />
      </div>

      {/* Cyber grid background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.2,
        pointerEvents: 'none',
        zIndex: -10
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        {/* Glowing corner accents */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '50%',
            width: '384px',
            height: '384px',
            background: 'rgba(0, 242, 255, 0.1)',
            filter: 'blur(96px)'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            borderRadius: '50%',
            width: '384px',
            height: '384px',
            background: 'rgba(0, 242, 255, 0.1)',
            filter: 'blur(96px)'
          }}
        />
      </div>
    </div>
  );
}

export default App;
