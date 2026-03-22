# Let's Ragebait Gordon Ramsay 🍳

A comedic web game where players submit outrageous recipes to provoke humorous AI chef critiques.

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **OpenAI API** (BYOK - Bring Your Own Key)
- **Zod** for validation

## Development

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

## Features

- 🎮 Submit recipes and get AI-powered Gordon Ramsay critiques
- 📊 Local leaderboard with rage scoring (0-100)
- 🔑 BYOK OpenAI integration (your key stays local)
- 🛡️ Safety-first AI responses (food-only insults)
- 💾 Client-side storage (localStorage)

## Project Structure

```
src/
├── components/     # React components by feature
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── services/       # API integrations
├── types/          # TypeScript definitions
└── utils/          # Utilities and validation
```

## Game Rules

1. Submit your most ridiculous recipe
2. Get judged by AI Gordon Ramsay
3. Earn rage points (higher = worse recipe)
4. Climb the leaderboard of culinary disasters!

Built with ❤️ and lots of culinary chaos.