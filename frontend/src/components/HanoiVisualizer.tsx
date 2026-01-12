import { motion } from 'framer-motion';
import { useHanoiStore, Rod } from '../store/hanoiStore';

const DISK_COLORS = [
  '#00f2ff', // cyber-cyan (primary)
  '#00d4ff', // bright cyan
  '#00b8ff', // deep cyan
  '#009cff', // cyan-blue
  '#0080ff', // bright blue
  '#0066ff', // royal blue
  '#0050ff', // deep blue
  '#3d00ff', // blue-violet
  '#5500ff', // violet
  '#6b00ff', // deep violet
  '#8000ff', // purple-violet
  '#9500ff', // bright purple
  '#aa00ff', // magenta-purple
  '#bf00ff', // light magenta
  '#d400ff', // magenta
  '#e900ff', // bright magenta
  '#ff00ea', // pink-magenta
];

interface DiskProps {
  size: number;
  totalDisks: number;
  rod: Rod;
  position: number;
  isSelected: boolean;
  isTopDisk: boolean;
  style: React.CSSProperties;
}

const Disk: React.FC<DiskProps> = ({ size, totalDisks, rod, isSelected, isTopDisk, style }) => {
  const { selectDisk, deselectDisk, moveDisk } = useHanoiStore();
  
  const minWidth = 40;
  const maxWidth = 200;
  const width = minWidth + ((size / totalDisks) * (maxWidth - minWidth));
  const height = 20;
  
  const color = DISK_COLORS[(size - 1) % DISK_COLORS.length];
  
  const handleDragEnd = (_: any, info: any) => {
    // Get the actual drop position
    const dropX = info.point.x;
    const dropY = info.point.y;
    
    // Find all tower elements to check if drop is over a tower
    const towers = document.querySelectorAll('[data-rod]');
    let targetRod: Rod | null = null;
    
    towers.forEach((tower) => {
      const rect = tower.getBoundingClientRect();
      const towerRod = tower.getAttribute('data-rod');
      
      // Check if drop position is within tower bounds
      if (
        dropX >= rect.left &&
        dropX <= rect.right &&
        dropY >= rect.top &&
        dropY <= rect.bottom
      ) {
        targetRod = towerRod as Rod;
      }
    });
    
    if (!targetRod) {
      deselectDisk();
      return;
    }
    
    if (targetRod === rod) {
      deselectDisk();
      return;
    }
    
    // Attempt the move
    moveDisk(rod, targetRod);
    
    // Always deselect after move attempt
    deselectDisk();
  };
  
  return (
    <motion.div
      key={`${rod}-${size}`}
      drag={isTopDisk ? "x" : false}
      dragElastic={0.2}
      dragMomentum={false}
      dragSnapToOrigin={true}
      onDragStart={() => isTopDisk && selectDisk(size, rod)}
      onDragEnd={handleDragEnd}
      whileHover={isTopDisk ? { scale: 1.05, cursor: 'grab' } : { cursor: 'not-allowed' }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 50 }}
      animate={{
        y: isSelected ? -10 : 0,
        x: 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: color,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isSelected 
          ? '0 4px 15px rgba(0,0,0,0.6)' 
          : '0 2px 8px rgba(0,0,0,0.4)',
        border: `2px solid ${color}`,
        marginTop: '4px',
        zIndex: 100 - size,
        opacity: isTopDisk ? 1 : 0.7,
        ...style
      }}
      className="select-none font-bold text-black text-sm backdrop-blur-sm"
    >
      {size}
    </motion.div>
  );
};

interface TowerProps {
  rod: Rod;
  disks: number[];
  totalDisks: number;
  style?: React.CSSProperties;
}

const Tower: React.FC<TowerProps> = ({ rod, disks, totalDisks, style }) => {
  const { selectedDisk, selectedRod, moveDisk, deselectDisk } = useHanoiStore();
  
  const handleRodClick = () => {
    if (selectedDisk && selectedRod && selectedRod !== rod) {
      const success = moveDisk(selectedRod, rod);
      if (success) {
        deselectDisk();
      }
    }
  };
  
  const poleHeight = Math.max(200, totalDisks * 24 + 50);
  
  return (
    <div 
      data-rod={rod}
      className="relative flex flex-col items-center justify-end cursor-pointer hover:bg-charcoal/40 transition-colors rounded-2xl"
      style={{ 
        height: `${poleHeight + 60}px`, 
        minHeight: '280px', 
        width: '300px',
        flexShrink: 0,
        padding: '20px',
        margin: '10px',
        position: 'relative',
        // border: '2px dashed rgba(0, 242, 255, 0.3)',
        // boxShadow: '0 0 20px rgba(0, 242, 255, 0.1)',
        ...style
      }}
      onClick={handleRodClick}
    >
      {/* Rod label */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl font-bold text-cyber-cyan uppercase tracking-wider z-10"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2.25rem', // text-4xl
          fontWeight: 'bold',
          color: '#00f2ff', // cyber-cyan
          textTransform: 'uppercase',
          letterSpacing: '0.1em', // tracking-wider
          zIndex: 10,
        }}>
        {rod}
      </div>
      
      {/* Pole */}
      <div
        style={{
          width: '20px',
          height: `${poleHeight}px`,
          background: 'linear-gradient(90deg, #1a1a1a 0%, #3a3a3a 50%, #1a1a1a 100%)',
          borderRadius: '10px',
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          border: '2px solid rgba(0, 242, 255, 0.3)',
          boxShadow: '0 0 10px rgba(0, 242, 255, 0.2)',
        }}
      />
      
      {/* Base */}
      <div
        style={{
          width: '280px',
          height: '30px',
          background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)',
          borderRadius: '15px',
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          border: '2px solid rgba(0, 242, 255, 0.3)',
          boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)',
        }}
      />
      
      {/* Disks */}
      <div style={{
        position: 'relative',
        left: 150,
        bottom: -65
        }}>
        <div 
          className="absolute" 
          style={{ 
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: `${poleHeight}px`,
            // backgroundColor: 'red',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >
          {[...disks].reverse().map((disk, reverseIndex) => {
            const index = disks.length - 1 - reverseIndex;
            const diskHeight = 24;
            return (
              <div key={`container-${rod}-${disk}`} style={{ width: '100%', height: `${diskHeight}px`, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Disk
                  key={`${rod}-${disk}`}
                  size={disk}
                  totalDisks={totalDisks}
                  rod={rod}
                  position={index}
                  isSelected={selectedDisk === disk && selectedRod === rod}
                  isTopDisk={index === disks.length - 1}
                  style={{}}
                />
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export const HanoiVisualizer: React.FC = () => {
  const { towers, numDisks } = useHanoiStore();
  
  return (
    <div className="w-full" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <div className="flex flex-row justify-center items-end gap-8 min-w-fit mx-auto" style={{ display: 'flex', gap: '5rem', }}>
        <Tower rod="A" disks={towers.A} totalDisks={numDisks} />
        <Tower rod="B" disks={towers.B} totalDisks={numDisks} />
        <Tower rod="C" disks={towers.C} totalDisks={numDisks} />
      </div>
    </div>
  );
};
