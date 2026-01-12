# TypeScript Backend Implementation

This directory contains the TypeScript implementation of the Tower of Hanoi Lambda handler.

## Overview

**File:** `handler.ts`
- TypeScript implementation with full type safety
- Compiled to JavaScript before deployment
- Production-ready Lambda handler

## Setup

### Install Dependencies
```bash
npm install
```

### Build
```bash
npm run build
```

This compiles `handler.ts` to `dist/handler.js`

### Test Locally
```bash
npm test
```

## Deploy

The backend is automatically deployed via the root-level deployment script:

```bash
# From project root
npm run deploy:dev
```

Or deploy manually with serverless:

```bash
# From project root
serverless deploy
```

## Key Features

### Type Safety
- ✅ Strict TypeScript compilation
- ✅ Interface definitions for all data structures
- ✅ Compile-time error catching
- ✅ Better IDE support and autocomplete

### AWS Lambda Integration
- ✅ First-class Lambda support with @types/aws-lambda
- ✅ Optimized with serverless-esbuild
- ✅ Small bundle size (~5.3 kB)
- ✅ Fast cold starts with Node.js 20.x

### Code Quality
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ CORS configuration
- ✅ Source maps for debugging

## File Structure

```
backend/
├── handler.ts          # TypeScript Lambda handler
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── dist/              # Compiled output (gitignored)
    ├── handler.js
    ├── handler.js.map
    └── handler.d.ts
```

## Development

### TypeScript Configuration
- **Target:** ES2020
- **Module:** CommonJS
- **Strict Mode:** Enabled
- **Source Maps:** Enabled

### Available Scripts
```json
{
  "build": "tsc",              // Compile TypeScript
  "watch": "tsc --watch",      // Watch mode for development
  "test": "node dist/handler.js", // Local testing
  "clean": "rm -rf dist"       // Clean build artifacts
}
```

## Deployment Configuration

The `serverless.yml` in the project root is configured for TypeScript:

```yaml
provider:
  runtime: nodejs20.x

functions:
  hanoiSolver:
    handler: backend/dist/handler.handler

plugins:
  - serverless-esbuild
```

## API Documentation

### Endpoint
`POST /solve`

### Request
```json
{
  "disks": 5,
  "source": "A",      // optional, default: "A"
  "auxiliary": "B",   // optional, default: "B"
  "target": "C"       // optional, default: "C"
}
```

### Response
```json
{
  "total_moves": 31,
  "moves": ["Move disk 1 from A to C", ...],
  "formula": "2^n - 1",
  "n": 5,
  "generated_at": "2026-01-12T10:30:00.000Z"
}
```

For n > 12, moves array will be empty with a message indicating the list is too large.

## Advantages

**TypeScript Benefits:**
- Strong type checking prevents runtime errors
- Better code documentation through types
- Enhanced IDE experience with IntelliSense
- Easier refactoring with confidence

**Node.js Lambda Benefits:**
- Fast cold starts
- Small bundle sizes with esbuild
- Native async/await support
- Large ecosystem of npm packages

