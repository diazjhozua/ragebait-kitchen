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

## 🔥 Sample Rage-Inducing Recipes

Want to maximize Gordon's fury? Try these guaranteed disaster recipes:

### **"Gourmet" Microwave Steak (Rage Score: 95+)**
```
Title: Five-Star Microwave Ribeye

Ingredients:
- 1 expensive ribeye steak
- Ketchup (for "glaze")
- Instant coffee granules
- Mayonnaise

Instructions:
1. Place the ribeye in a plastic container with some water
2. Microwave on high for 8 minutes until well-done and gray
3. Mix ketchup with instant coffee for a "reduction sauce"
4. Slather the steak with mayonnaise while it's still hot
5. Serve on a paper plate for that "rustic" feel
6. Garnish with more ketchup if desired
```

### **Fusion Pizza Nightmare (Rage Score: 88+)**
```
Title: Sushi Pizza Taco Supreme

Ingredients:
- Frozen pizza base
- Canned tuna
- Instant ramen seasoning packets
- Pineapple chunks
- Hot dog slices
- Chocolate sauce
- Pickles

Instructions:
1. Don't defrost the pizza base - Gordon loves a frozen center
2. Spread chocolate sauce instead of tomato sauce
3. Sprinkle 3 different ramen seasoning packets for "depth"
4. Top with cold canned tuna straight from the can
5. Add pineapple, hot dog slices, and pickles randomly
6. Bake at 500°F for exactly 4 minutes
7. Serve immediately while still frozen in the middle
```

### **"Healthy" Salad Disaster (Rage Score: 82+)**
```
Title: Wellness Guru's Dream Salad

Ingredients:
- Iceberg lettuce (for maximum nutrition loss)
- Ranch dressing (entire bottle)
- Gummy bears
- Crushed potato chips
- Canned corn (don't drain)
- Instant pudding mix
- Energy drink

Instructions:
1. Shred the iceberg lettuce with your bare hands
2. Drown everything in ranch dressing
3. Sprinkle instant pudding mix for "protein powder"
4. Add gummy bears for "antioxidants"
5. Top with crushed chips for "healthy carbs"
6. Pour energy drink over everything as "dressing"
7. Mix with the same hands you used for the lettuce
```

### **Breakfast of Champions (Rage Score: 91+)**
```
Title: Continental Breakfast Casserole

Ingredients:
- Leftover pizza (3 days old)
- Energy drinks
- Instant mashed potatoes
- Gummy vitamins
- Hot sauce packets
- Whipped cream
- Cereal (any kind)

Instructions:
1. Cut up the old pizza into small pieces (ignore the mold)
2. Make instant mashed potatoes with energy drink instead of water
3. Layer pizza pieces in the potato mixture
4. Top with crushed gummy vitamins for "nutrients"
5. Drown everything in hot sauce packets
6. Top with whipped cream and dry cereal
7. Microwave for 3 minutes and serve lukewarm
```

### **Pro Tips for Maximum Rage:**

🎯 **Technique Disasters:**
- Always use a microwave when you should use an oven
- Mix savory and sweet inappropriately
- Mention "healthy substitutions" that aren't healthy
- Use expired ingredients confidently
- Describe terrible food safety practices

🎯 **Ingredient Chaos:**
- Combine cuisines that should never meet
- Use condiments as main ingredients
- Replace essential ingredients with random substitutes
- Add chocolate or candy to savory dishes

🎯 **Presentation Failures:**
- Serve on paper plates for "fine dining"
- Use plastic utensils for everything
- Mix foods that should be separate
- Mention Instagram-worthy plating while describing disasters

🎯 **Confidence is Key:**
- Act like your disasters are innovations
- Mention "secret family recipes"
- Claim restaurant-quality results
- Compare your cooking to famous chefs

## API Configuration

### Default OpenAI
Just enter your OpenAI API key - that's it!

### Custom Endpoints
For advanced users, click "Advanced Options" to configure:

**Azure OpenAI:**
```
Endpoint: https://your-resource.openai.azure.com
Key: your-azure-api-key
```

**Local Ollama:**
```
Endpoint: http://localhost:11434
Key: ollama
```

**Other Providers:**
Any OpenAI-compatible API endpoint works!

Built with ❤️ and lots of culinary chaos.