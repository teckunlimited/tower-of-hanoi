# Tower of Hanoi - Quick Start Guide

## 🚀 5-Minute Setup

### Backend (AWS Lambda with TypeScript)

```bash
# From project root
npm run deploy:dev

# This automatically:
# - Compiles TypeScript
# - Deploys Lambda + API Gateway
# - Creates S3 + CloudFront
# - Builds and uploads frontend
```

### Frontend (React)

Already deployed by the script above! Access via CloudFront URL provided in output.

### Local Development

```bash
cd frontend

# Install
npm install

# Configure API (use URL from deploy output)
echo "VITE_API_URL=YOUR_API_URL_HERE" > .env.local

# Run
npm run dev
```

Visit: http://localhost:3000

## 🎨 Visual Features

The application features a **cyber-themed design**:

- **Color Scheme**: 
  - Primary: Cyan (#00f2ff) with glow effects
  - Background: Charcoal (#1a1a1a to #3a3a3a)
  - Disk Gradient: 17 colors from cyan → blue → violet → magenta
  
- **Layout**: 
  - 960px max-width centered design
  - Compact controls with 0.5rem padding
  - Sticky header with API health indicator

- **API Health Monitor**:
  - Green dot: API is healthy and responding
  - Red dot: API is down or not responding
  - Gray dot: Checking API status
  - Auto-polls every 30 seconds

- **Styling Approach**:
  - 100% inline styles (no CSS frameworks)
  - Zero CSS conflicts or specificity issues
  - Consistent spacing and typography

## 📝 Quick Test

Test backend directly:

```bash
curl -X POST YOUR_API_URL \
  -H "Content-Type: application/json" \
  -d '{"disks": 3}'
```

Expected output:
```json
{
  "total_moves": 7,
  "moves": [
    "Move disk 1 from A to C",
    "Move disk 2 from A to B",
    "Move disk 1 from C to B",
    "Move disk 3 from A to C",
    "Move disk 1 from B to A",
    "Move disk 2 from B to C",
    "Move disk 1 from A to C"
  ],
  "formula": "2^n - 1",
  "n": 3,
  "generated_at": "2026-01-11T12:00:00Z"
}
```

## 🐛 Troubleshooting

**CORS Error?**
- Check API Gateway CORS settings
- Verify Lambda returns CORS headers

**Build Error?**
- Node.js 18+ required
- Run `npm install` again

**Lambda Timeout?**
- Should be < 1 second for any input
- Check CloudWatch logs

## 📚 Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [ARCHITECTURE.md](ARCHITECTURE.md) for deep dive
3. Deploy to production (see README deployment sections)
4. Customize styling in `frontend/src/index.css`

## 💡 Pro Tips

- Use n=3 for quick tests
- Try n=20 to see "count only" mode
- Watch the **green health indicator** to confirm API is ready
- Drag disks manually to play the puzzle (**only top disk** can be moved)
- Click on any move in the list to jump to that state
- Adjust animation speed for better visualization
- Note the **cyber-themed visual design** with cyan glow effects
- Disk colors follow a **17-color gradient** from cyan to magenta
