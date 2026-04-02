<p align="center">
  <a href="https://github.com/diazjhozua/ragebait-kitchen">
    <img width="120px" height="120px" src="public/favicon.svg" alt="Ragebait Kitchen logo">
  </a>
</p>

### Let's Ragebait Gordon Ramsay 🔥

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/diazjhozua/ragebait-kitchen.svg)](https://github.com/diazjhozua/ragebait-kitchen/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/diazjhozua/ragebait-kitchen.svg)](https://github.com/diazjhozua/ragebait-kitchen/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">
  A comedic web game where players submit outrageous recipes to provoke humorous AI chef critiques — powered by your own OpenAI key, stored only in your browser.
  <br>
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Features](#features)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgements](#acknowledgement)

## 🧐 About <a name = "about"></a>

Ragebait Kitchen is a client-side web game that challenges players to submit the most outrageous, horrifying, and culinarily offensive recipes they can imagine — all in the hope of triggering the most brutal critique from an AI Gordon Ramsay.

The game is fully **Bring Your Own Key (BYOK)**: your OpenAI API key never leaves your browser. All data — leaderboard entries, XP progression, and chef profiles — is stored locally in `localStorage`. No backend. No accounts. Just pure culinary chaos.

### ✨ Key Features:

- 🔥 **AI Judge**: Submit recipes and receive Gordon Ramsay-style critiques powered by OpenAI
- 📊 **Rage Score**: Each submission is rated 0–100 — the higher, the more disastrous
- 🏆 **Score Leaderboard**: Local hall of shame ranked by rage score
- ⭐ **XP & Levels**: Earn XP for every submission and level up your chef profile
- 🎭 **GIF Reactions**: Tier-matched Gordon Ramsay GIFs react to your score in real time
- 🔑 **BYOK**: Your API key stays in your browser — supports OpenAI, Azure, Ollama, and any OpenAI-compatible endpoint
- 🛡️ **Anti-Gaming**: Jaccard similarity detection penalises near-duplicate recipe submissions

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

```
Node.js 18.0 or later
npm
Git
```

### Installing

**Step 1: Clone the repository**

```bash
git clone https://github.com/diazjhozua/ragebait-kitchen.git
cd ragebait-kitchen
```

**Step 2: Install dependencies**

```bash
npm install
```

**Step 3: Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Step 4: Build for production**

```bash
npm run build
npm run preview
```

## 🎈 Usage <a name="usage"></a>

### Setting Up Your API Key

1. Open the game and click **Set API Key**
2. Paste your OpenAI API key (`sk-...`)
3. Choose **Save persistently** (localStorage) or **Session only** (memory)
4. For Azure / Ollama / custom providers, expand **Advanced Options** to set a custom endpoint

### Submitting a Recipe

1. Enter your chef name
2. Choose a judge style (Classic Gordon, Hell's Kitchen, MasterChef, etc.)
3. Write the most outrageous recipe title and ingredients/instructions you can think of
4. Hit **Submit** and watch Gordon react

### Maximising Your Rage Score

- Use a microwave when you should use an oven
- Combine cuisines that should never meet
- Replace essential ingredients with absurd substitutes
- Add chocolate or candy to savoury dishes
- Describe terrible food safety practices with full confidence

### API Configuration

| Provider | Endpoint | Key |
|---|---|---|
| OpenAI (default) | *(leave blank)* | `sk-...` |
| Azure OpenAI | `https://your-resource.openai.azure.com` | Azure key |
| Ollama (local) | `http://localhost:11434` | `ollama` |
| Other compatible | Any OpenAI-compatible URL | Provider key |

## ✨ Features <a name="features"></a>

### 🔥 AI Critique Engine

- Gordon Ramsay persona with multiple judge styles
- Structured response: rage score, reaction tags, reasons, and a full rant
- Retry logic with graceful fallback responses
- Safety-first prompting — food/cooking insults only, no personal attacks

### 📊 Scoring & Anti-Gaming

- Rage scores from 0 (Michelin-worthy) to 100 (Hell's Kitchen Disaster)
- Jaccard text similarity detection compares each submission against the full leaderboard
- Duplicate-ish recipes receive automatic score penalties (5–30 points)
- Original score preserved and displayed for transparency

### 🏆 Leaderboards

- **Score Leaderboard**: Sorted by rage score, paginated, with stats (avg, max, min)
- **XP Leaderboard**: Multi-chef profiles ranked by total XP earned
- Export leaderboard data as JSON
- Passcode-protected clear option

### ⭐ Gamification

- XP earned on every submission (bonus for achievements)
- Chef levels with titles (Trainee → Culinary Demon)
- Achievement system with unlockable ingredient badges
- Level-up celebration animation

### 🎭 GIF Reactions

- 48 curated Gordon Ramsay GIFs from GIPHY across 4 rage tiers
- Tier-matched on every submission: mild disappointment → nuclear meltdown
- New random GIF picked on each result

## ⛏️ Built Using <a name = "built_using"></a>

- **[React 18](https://reactjs.org/)** — Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** — Fast build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[React Router](https://reactrouter.com/)** — Client-side routing
- **[Zod](https://zod.dev/)** — Runtime schema validation
- **[OpenAI API](https://platform.openai.com/)** — AI critique engine
- **[GIPHY](https://giphy.com/)** — Gordon Ramsay reaction GIFs

## ✍️ Authors <a name = "authors"></a>

- **@diazjhozua** — [GitHub Profile](https://github.com/diazjhozua) — Creator & Developer

See also the list of [contributors](https://github.com/diazjhozua/ragebait-kitchen/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- **Gordon Ramsay** — for being the internet's favourite culinary rage machine
- **OpenAI** — for making AI critiques possible
- **GIPHY** — for the reaction GIFs that make every verdict hit harder
- **Tailwind CSS Team** — for the utility-first styling that powers the Hell's Kitchen aesthetic
- The open-source community for the libraries that made this possible

---

<div align="center">

**Submit your worst. Gordon is waiting. 🔥**

</div>
