import { useHanoiStore } from '../store/hanoiStore';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const MovesList: React.FC = () => {
  const { moves, currentMoveIndex, totalMoves, message, jumpToMove } = useHanoiStore();
  
  if (moves.length === 0 && !message) {
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
              Solution Steps
            </h2>
          </div>
        </div>
        
        {/* Content Section */}
        <div style={{
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 242, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0, 242, 255, 0.3)'
          }}>
            <div style={{
              width: '1.25rem',
              height: '1.25rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 242, 255, 0.3)',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>
          <p style={{
            color: '#9ca3af',
            textAlign: 'center',
            fontSize: '0.75rem'
          }}>
            Enter number of disks and click "Solve" to see the solution
          </p>
        </div>
      </div>
    );
  }
  
  if (message) {
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
              Solution
            </h2>
            <div style={{ fontSize: '0.625rem', color: 'rgba(0, 242, 255, 0.7)', fontFamily: 'monospace' }}>
              {totalMoves.toLocaleString()} moves
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{
          padding: '0.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(0, 242, 255, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)'
          }}>
            <p style={{
              fontSize: '0.625rem',
              fontWeight: 'bold',
              color: '#9ca3af',
              marginBottom: '0.125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Total Moves Required</p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#00f2ff',
              filter: 'drop-shadow(0 0 15px rgba(0, 242, 255, 0.8))'
            }}>
              {totalMoves.toLocaleString()}
            </p>
          </div>
          <p style={{
            color: '#d1d5db',
            fontSize: '0.75rem'
          }}>{message}</p>
          <p style={{
            color: '#6b7280',
            fontSize: '0.625rem',
            fontFamily: 'monospace'
          }}>
            Formula: 2<sup>n</sup> - 1
          </p>
        </div>
      </div>
    );
  }
  
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
            Solution Steps
          </h2>
          <div style={{ fontSize: '0.625rem', color: 'rgba(0, 242, 255, 0.7)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {moves.length} moves
            {currentMoveIndex === moves.length - 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem', color: '#4ade80' }} />
          </motion.div>
        )}
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div style={{ padding: '0.5rem' }}>
      <div style={{
        maxHeight: '16rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        paddingRight: '0.25rem'
      }}>
        {moves.map((move, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => jumpToMove(index)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: '1px solid',
              backgroundColor: index === currentMoveIndex 
                ? 'rgba(0, 242, 255, 0.2)' 
                : index < currentMoveIndex
                ? '#3a3a3a'
                : 'rgba(26, 26, 26, 0.8)',
              color: index === currentMoveIndex 
                ? '#ffffff' 
                : index < currentMoveIndex
                ? '#d1d5db'
                : '#9ca3af',
              borderColor: index === currentMoveIndex 
                ? '#00f2ff' 
                : index < currentMoveIndex
                ? 'rgba(0, 242, 255, 0.2)'
                : 'rgba(0, 242, 255, 0.1)',
              boxShadow: index === currentMoveIndex 
                ? '0 0 20px rgba(0, 242, 255, 0.3)' 
                : 'none',
              transform: index === currentMoveIndex ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.625rem',
                fontWeight: 'bold',
                minWidth: '2.5rem',
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: index === currentMoveIndex
                  ? '#00f2ff'
                  : index < currentMoveIndex
                  ? '#3a3a3a'
                  : '#2a2a2a',
                color: index === currentMoveIndex
                  ? '#1a1a1a'
                  : index < currentMoveIndex
                  ? '#00f2ff'
                  : '#6b7280',
                border: index === currentMoveIndex
                  ? 'none'
                  : index < currentMoveIndex
                  ? '1px solid rgba(0, 242, 255, 0.3)'
                  : '1px solid #4b5563'
              }}>
                #{index + 1}: 
              </span>
              <span style={{
                flex: 1,
                fontWeight: '500',
                fontSize: '0.75rem'
              }}>{move.description}</span>
              {index === currentMoveIndex && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    width: '0.375rem',
                    height: '0.375rem',
                    backgroundColor: '#00f2ff',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)'
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
};
