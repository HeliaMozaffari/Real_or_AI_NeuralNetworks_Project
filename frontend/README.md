# Real or AI? - Frontend

React 19 frontend for the Real vs AI-Generated Face Classification system.

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

For development with Vite's proxy (recommended), leave `VITE_API_BASE_URL` empty.
For production, set it to your backend URL.

## Development Mode

The app includes mock API functions for development without the backend.
To use real API endpoints, set `USE_MOCKS = false` in:
- `src/routes/ClassifyView.jsx`
- `src/routes/GenAIView.jsx`
- `src/routes/MetricsView.jsx`

## Project Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ConfusionMatrix.jsx
│   │   ├── GenAIChat.jsx
│   │   ├── ImageUploadForm.jsx
│   │   ├── LayoutNavbar.jsx
│   │   ├── MetricsCharts.jsx
│   │   └── PredictionResult.jsx
│   ├── routes/              # Page views
│   │   ├── AboutView.jsx
│   │   ├── ClassifyView.jsx
│   │   ├── GenAIView.jsx
│   │   └── MetricsView.jsx
│   ├── services/            # API layer
│   │   └── api.js
│   ├── styles/              # CSS
│   │   └── global.css
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Endpoints

The frontend expects these backend endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/predict` | POST | Image classification |
| `/api/gen/summary` | POST | Generate AI summary |
| `/api/chat` | POST | Chat with AI assistant |
| `/api/metrics` | GET | Fetch training metrics |
| `/api/health` | GET | Health check |

## Tech Stack

- React 19
- Vite
- React Bootstrap
- React Router DOM
- Recharts (for charts)
- Axios (for HTTP requests)