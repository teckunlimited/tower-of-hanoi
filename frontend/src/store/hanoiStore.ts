import { create } from 'zustand';

export type Rod = 'A' | 'B' | 'C';

export interface Move {
  disk: number;
  from: Rod;
  to: Rod;
  description: string;
}

export interface Tower {
  [key: string]: number[];
}

interface HanoiState {
  // Configuration
  numDisks: number;
  apiUrl: string;
  
  // Solution data
  moves: Move[];
  totalMoves: number;
  formula: string;
  message: string;
  
  // Visual state
  towers: Tower;
  currentMoveIndex: number;
  isPlaying: boolean;
  animationSpeed: number; // milliseconds per move
  
  // Drag & drop state
  selectedDisk: number | null;
  selectedRod: Rod | null;
  isDragging: boolean;
  
  // Loading & errors
  isLoading: boolean;
  error: string | null;
  
  // Health check
  apiHealthy: boolean | null; // null = not checked yet, true = healthy, false = unhealthy
  checkApiHealth: () => Promise<void>;
  
  // Actions
  setNumDisks: (n: number) => void;
  setApiUrl: (url: string) => void;
  solvePuzzle: () => Promise<void>;
  resetTowers: () => void;
  playAnimation: () => void;
  pauseAnimation: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setAnimationSpeed: (speed: number) => void;
  moveDisk: (from: Rod, to: Rod) => boolean;
  selectDisk: (disk: number, rod: Rod) => void;
  deselectDisk: () => void;
  jumpToMove: (index: number) => void;
}

const initialTowers = (n: number): Tower => ({
  A: Array.from({ length: n }, (_, i) => n - i),
  B: [],
  C: [],
});

export const useHanoiStore = create<HanoiState>((set, get) => ({
  // Initial state
  numDisks: 3,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/solve',
  moves: [],
  totalMoves: 0,
  formula: '2^n - 1',
  message: '',
  towers: initialTowers(3),
  currentMoveIndex: -1,
  isPlaying: false,
  animationSpeed: 500,
  selectedDisk: null,
  selectedRod: null,
  isDragging: false,
  isLoading: false,
  error: null,
  apiHealthy: null,

  checkApiHealth: async () => {
    const { apiUrl } = get();
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        set({ apiHealthy: true, error: null });
      } else {
        set({ apiHealthy: false, error: 'API is not responding correctly' });
      }
    } catch (error) {
      set({ apiHealthy: false, error: 'Cannot connect to API' });
    }
  },

  setNumDisks: (n: number) => {
    set({
      numDisks: n,
      towers: initialTowers(n),
      currentMoveIndex: -1,
      moves: [],
      totalMoves: 0,
      error: null,
    });
  },

  setApiUrl: (url: string) => set({ apiUrl: url }),

  solvePuzzle: async () => {
    const { numDisks, apiUrl } = get();
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disks: numDisks,
          source: 'A',
          auxiliary: 'B',
          target: 'C',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse moves from string format
      const parsedMoves: Move[] = (data.moves || []).map((moveStr: string) => {
        const match = moveStr.match(/Move disk (\d+) from (\w+) to (\w+)/);
        if (match) {
          return {
            disk: parseInt(match[1]),
            from: match[2] as Rod,
            to: match[3] as Rod,
            description: moveStr,
          };
        }
        return null;
      }).filter(Boolean);

      set({
        moves: parsedMoves,
        totalMoves: data.total_moves,
        formula: data.formula,
        message: data.message || '',
        currentMoveIndex: -1,
        towers: initialTowers(numDisks),
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to solve puzzle',
        isLoading: false,
      });
    }
  },

  resetTowers: () => {
    const { numDisks } = get();
    set({
      towers: initialTowers(numDisks),
      currentMoveIndex: -1,
      isPlaying: false,
      selectedDisk: null,
      selectedRod: null,
    });
  },

  playAnimation: () => {
    const state = get();
    if (state.isPlaying) return;
    
    set({ isPlaying: true });
    
    const animate = () => {
      const currentState = get();
      
      if (!currentState.isPlaying) return;
      
      if (currentState.currentMoveIndex < currentState.moves.length - 1) {
        get().stepForward();
        setTimeout(animate, currentState.animationSpeed);
      } else {
        set({ isPlaying: false });
        // Check if puzzle is complete after animation finishes
        const finalState = get();
        if (finalState.towers.C.length === finalState.numDisks) {
          set({ 
            message: 'Congratulations! You solved the puzzle!'
          });
        }
      }
    };
    
    setTimeout(animate, state.animationSpeed);
  },

  pauseAnimation: () => set({ isPlaying: false }),

  stepForward: () => {
    const { currentMoveIndex, moves, towers, numDisks } = get();
    
    if (currentMoveIndex >= moves.length - 1) return;
    
    const nextIndex = currentMoveIndex + 1;
    const move = moves[nextIndex];
    
    const newTowers = { ...towers };
    const disk = newTowers[move.from].pop();
    if (disk !== undefined) {
      newTowers[move.to].push(disk);
    }
    
    set({
      currentMoveIndex: nextIndex,
      towers: newTowers,
    });
    
    // Check if puzzle is complete after manual step
    if (nextIndex === moves.length - 1 && newTowers.C.length === numDisks) {
      set({ 
        message: 'Congratulations! You solved the puzzle!'
      });
    }
  },

  stepBackward: () => {
    const { currentMoveIndex, moves, towers } = get();
    
    if (currentMoveIndex < 0) return;
    
    const move = moves[currentMoveIndex];
    
    const newTowers = { ...towers };
    const disk = newTowers[move.to].pop();
    if (disk !== undefined) {
      newTowers[move.from].push(disk);
    }
    
    set({
      currentMoveIndex: currentMoveIndex - 1,
      towers: newTowers,
    });
  },

  setAnimationSpeed: (speed: number) => set({ animationSpeed: speed }),

  moveDisk: (from: Rod, to: Rod): boolean => {
    const { towers, numDisks } = get();
    
    if (from === to) return false;
    
    const fromTower = towers[from];
    const toTower = towers[to];
    
    if (fromTower.length === 0) return false;
    
    const disk = fromTower[fromTower.length - 1];
    
    // Check if move is valid (can't place larger disk on smaller)
    if (toTower.length > 0 && disk > toTower[toTower.length - 1]) {
      return false;
    }
    
    // Make the move
    const newTowers = { ...towers };
    newTowers[from] = [...fromTower.slice(0, -1)];
    newTowers[to] = [...toTower, disk];
    
    // Check for win condition (all disks on tower C)
    const hasWon = newTowers.C.length === numDisks;
    
    if (hasWon) {
      set({ 
        towers: newTowers,
        message: 'Congratulations! You solved the puzzle!'
      });
    } else {
      set({ towers: newTowers });
    }
    
    return true;
  },

  selectDisk: (disk: number, rod: Rod) => {
    set({
      selectedDisk: disk,
      selectedRod: rod,
      isDragging: true,
    });
  },

  deselectDisk: () => {
    set({
      selectedDisk: null,
      selectedRod: null,
      isDragging: false,
    });
  },

  jumpToMove: (index: number) => {
    const { numDisks, moves } = get();
    
    // Reset to initial state
    const newTowers = initialTowers(numDisks);
    
    // Apply moves up to index
    for (let i = 0; i <= index; i++) {
      const move = moves[i];
      const disk = newTowers[move.from].pop();
      if (disk !== undefined) {
        newTowers[move.to].push(disk);
      }
    }
    
    set({
      currentMoveIndex: index,
      towers: newTowers,
      isPlaying: false,
    });
  },
}));
