# Changelog

All notable changes to the Tower of Hanoi project.

## [3.0.0] - 2026-01-12

### Backend Migration to TypeScript

#### Changed
- **Complete backend rewrite**: Migrated from Python 3.12 to TypeScript 5.3
  - Eliminated Python handler (`handler.py` and `requirements.txt`)
  - Created new TypeScript handler (`handler.ts`)
  - Added TypeScript configuration (`tsconfig.json`)
  - Added Node.js dependencies (`package.json`)

- **Runtime change**: Python 3.12 → Node.js 20.x
  - Faster cold starts
  - Smaller bundle size (5.3 kB)
  - Full type safety with TypeScript

- **Deployment tooling**:
  - AWS SAM → Serverless Framework with serverless-esbuild
  - Automated build pipeline with TypeScript compilation
  - Integrated deployment script handles entire stack

#### Added
- **TypeScript features**:
  - Interface definitions for all data structures
  - `LambdaEvent`, `LambdaContext`, `LambdaResponse` types
  - `SolutionResponse` and `SolveRequest` interfaces
  - Strict type checking with `strict: true`
  - Source maps for debugging

- **Backend package management**:
  - npm scripts for build, watch, test, clean
  - @types/aws-lambda for Lambda type definitions
  - @types/node for Node.js types
  - TypeScript compiler configuration

#### Technical Details
- Handler path changed: `backend/handler.lambda_handler` → `backend/dist/handler.handler`
- Bundle size: ~5.3 kB (compiled JavaScript)
- Build output: `backend/dist/` (gitignored)
- Identical API behavior and responses
- Same recursive algorithm implementation
- Compatible with existing frontend without changes

### Benefits of TypeScript Migration
- ✅ Full type safety and compile-time error catching
- ✅ Better IDE support with IntelliSense
- ✅ Consistent language across full stack (TypeScript everywhere)
- ✅ Faster Lambda cold starts with Node.js runtime
- ✅ Smaller bundle size with esbuild optimization
- ✅ Enhanced code maintainability and refactoring support

---

## [2.0.0] - 2026-01-11

### Major UI Overhaul

#### Changed
- **Complete styling refactor**: Migrated from Tailwind CSS to 100% inline styles (CSS-in-JS approach)
  - Eliminated all `className` attributes across all components
  - Zero CSS framework dependencies
  - No CSS conflicts or specificity issues
  - Better type safety with TypeScript style objects

- **Cyber-themed visual design**:
  - Primary color: Cyan (#00f2ff) with glow effects
  - Background: Charcoal gradients (#1a1a1a to #3a3a3a)
  - Tower poles and bases: Charcoal with cyan borders and glow effects
  - Grid background pattern for depth

- **Disk color system**:
  - Implemented 17-color gradient from cyan to magenta
  - Colors: #00f2ff → #00d4ff → #00b8ff → #009cff → #0080ff → #0066ff → #0050ff → #3d00ff → #5500ff → #6b00ff → #8000ff → #9500ff → #aa00ff → #bf00ff → #d400ff → #e900ff → #ff00ea
  - Smooth visual progression across disks

- **Layout optimization**:
  - Consistent 960px max-width across all sections
  - Compact design with 0.5rem padding throughout
  - Header with sticky positioning
  - Centered, responsive layout

#### Added
- **API Health Monitoring**:
  - Visual health indicator in header (green/red/gray dot)
  - Auto-polling every 30 seconds
  - GET request to `/solve` endpoint
  - Shows "API Healthy" or "API Down" status
  - Provides confidence that backend is operational

- **State Management Enhancement**:
  - Added `apiHealthy` state (boolean | null)
  - Added `checkApiHealth()` action to Zustand store
  - Health check runs on component mount and periodically

#### Removed
- **Toast notification system**: 
  - Removed success toast notifications
  - Cleaned up `showSuccessToast` state
  - Removed auto-hide setTimeout logic
  - Simplified win detection

- **Debug logging**:
  - Removed all `console.log` statements from HanoiVisualizer.tsx
  - Cleaner production code

#### Fixed
- **Drag-and-drop functionality**:
  - Restored `moveDisk()` call in `handleDragEnd`
  - Disks now properly move when dragged to valid targets
  - Only top disk can be dragged (enforced)

- **Visual consistency**:
  - MovesList header matches Controls header exactly
  - All sections use same padding (0.5rem)
  - Font sizes consistent (0.75rem headers, 0.625rem buttons)
  - Border colors and gradients unified

- **JSX syntax**:
  - Fixed missing comment causing parser error
  - Proper structure for conditional rendering

### Technical Details

#### Components Updated
- `App.tsx` (210 lines)
  - Added API health indicator
  - Converted to inline styles
  - 960px max-width layout
  - Sticky header positioning

- `Controls.tsx` (398 lines)
  - Fully inline styled
  - Compact vertical layout
  - Consistent spacing

- `MovesList.tsx` (286 lines)
  - Matches Controls design
  - Inline styles only
  - Three display states (empty, message, list)

- `HanoiVisualizer.tsx` (276 lines)
  - Cyber theme implementation
  - 17-color disk gradient
  - Charcoal towers with cyan glow
  - No console logging
  - Fixed drag-and-drop

- `hanoiStore.ts` (321 lines)
  - Added API health check logic
  - Removed toast functionality
  - Clean state management

#### Files Not Changed
- `handler.py` - Backend Lambda function (stable)
- `Controls.tsx` - Already inline styled in v1.5

### Performance
- Zero CSS bundle (no Tailwind processing)
- Smaller bundle size
- No CSS-in-JS runtime overhead (just inline objects)
- Faster initial render

### Compatibility
- React 18+
- TypeScript 5+
- Modern browsers (ES2020+)
- Mobile responsive

---

## [1.0.0] - 2026-01-10

### Initial Release
- AWS Lambda backend with Python 3.12
- React 18 frontend with TypeScript
- Tailwind CSS styling
- Framer Motion animations
- Zustand state management
- Drag-and-drop puzzle interface
- Step-by-step animation playback
- Variable speed controls
- SAM deployment configuration
