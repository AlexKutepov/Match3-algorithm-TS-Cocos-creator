<h1 align="center">
  <br>
   <a href="https://alexkutepov.github.io/Match3-algorithm-TS-Cocos-creator/"><img src="https://sun9-64.userapi.com/impg/oWoasmHHURTs52ra6VPKGf4Os6Wi80pBv9n_aQ/9jeO3ZnVEMs.jpg?size=124x121&quality=95&sign=0ffaeba0c59d11ff75a8f890c5058a6a&type=album" alt="Match3 game" width="200"></a>
  <br>
    Match-3 Game Engine
  <br>
</h1>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#installation">Installation</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#api">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Cocos%20Creator-3.8.8-blue?style=flat-square" alt="Cocos Creator 3.8.8">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## About

A fully-featured **Match-3 puzzle game engine** built with **Cocos Creator 3.8.8** and **TypeScript**.

Clean, modular architecture with optimized algorithms, smooth animations, and configurable game board.

🎮 **[Play Demo](https://alexkutepov.github.io/Match3-algorithm-TS-Cocos-creator/)**

---

## Features

### Core Mechanics
- ✅ **Match Detection** — O(n²) optimized algorithm, single pass
- ✅ **Gravity System** — Vertical + diagonal chip falling
- ✅ **Cascade Animations** — Smooth waterfall-style chip spawning
- ✅ **Auto-Shuffle** — Automatic reshuffle when no moves available

### Bonuses
- ⚡ **Line Horizontal** — Clears entire row (4 in a row)
- ⚡ **Line Vertical** — Clears entire column (4 in a row)
- 🌈 **Rainbow** — Clears all chips of same color (5 in a row)
- 💣 **Bomb** — Clears cross pattern (L/T shape)

### Performance
- 🔄 **Object Pooling** — Reusable chip instances (zero GC spikes)
- 📦 **State Machine** — Clean game state management
- 📡 **Event-Driven** — Decoupled component communication

### Customization
- 🗺️ **Configurable Board** — Custom size, blocked cells, void areas
- 🎲 **Random Void Cells** — Procedural map generation
- ⚙️ **Animation Timing** — Adjustable speeds for all animations

---

## Architecture

```
assets/Script/Game/
├── Enums.ts              # ChipType, ChipColor, CellType, GameState
├── Types.ts              # Interfaces & game constants
├── index.ts              # Module exports
│
├── Utils/
│   └── BoardUtils.ts     # Position helpers, coordinate conversion
│
├── Components/
│   ├── Chip.ts           # Chip with animations & bonus visuals
│   └── Cell.ts           # Cell with touch handling
│
├── Core/
│   └── Board.ts          # Logical board representation
│
├── Systems/
│   ├── MatchDetector.ts  # Match finding & valid moves check
│   ├── BoardPhysics.ts   # Gravity, falling & diagonal moves
│   ├── ChipFactory.ts    # Object pool for chips
│   └── BonusExecutor.ts  # Bonus effects execution
│
└── Controllers/
    ├── GameController.ts # Main game loop, state & input
    └── UIController.ts   # Score, moves, win/lose panels
```

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| **SRP** | Each class has single responsibility |
| **DI** | Systems receive Board via constructor |
| **Composition** | Components over inheritance |
| **Pooling** | ChipFactory recycles destroyed chips |
| **Events** | GameEvents for decoupled communication |

---

## Installation

### Requirements

- Cocos Creator 3.8.8+
- Node.js 16+

### Quick Start

```bash
# Clone repository
git clone https://github.com/AlexKutepov/Match3-algorithm-TS-Cocos-creator.git

# Open in Cocos Creator 3.8.8
# Open scene: assets/Scene/main.scene
# Press Play
```

### Creating Prefabs

#### Cell.prefab
1. Create Node → Add `Sprite`, `Cell` script
2. Set UITransform size: 62×62
3. Assign white/gray sprite for checkerboard pattern
4. Save as `assets/prefabs/Cell.prefab`

#### Chip.prefab
1. Create Node → Add `Sprite`, `Chip` script  
2. Set UITransform size: 47×47
3. Assign color sprites to `Chip.colorSprites[]` (6 colors)
4. Assign bonus prefabs to `Chip.bonusPrefabs[]` (optional)
5. Save as `assets/prefabs/Chip.prefab`

---

## Configuration

### GameController Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rows` | number | 8 | Board height |
| `cols` | number | 8 | Board width |
| `cellSize` | number | 62 | Cell size in pixels |
| `maxMoves` | number | 20 | Maximum moves allowed |
| `targetScore` | number | 1000 | Score to win |
| `needRandomVoidCell` | boolean | false | Enable random void cells |
| `chanceForVoidCell` | number | 25 | Void cell chance (1/N) |
| `blockedCells` | string[] | [] | Individual blocked cells: `"row,col"` |
| `blockedAreas` | string[] | [] | Blocked rectangles: `"r1,c1,r2,c2"` |

### Examples

**Block corners:**
```
blockedCells: ["0,0", "0,7", "7,0", "7,7"]
```

**Block top-right quadrant:**
```
blockedAreas: ["0,4,4,8"]
```

**Random 4% void cells:**
```
needRandomVoidCell: true
chanceForVoidCell: 25
```

---

## API

### Events

```typescript
import { GameEvents, GameEventTypes } from './Script/Game';

// Score updates
GameEvents.on(GameEventTypes.SCORE_CHANGED, (score: number) => {
    console.log('Score:', score);
});

// Moves updates
GameEvents.on(GameEventTypes.MOVES_CHANGED, (movesLeft: number) => {
    console.log('Moves left:', movesLeft);
});

// Win/Lose
GameEvents.on(GameEventTypes.GAME_WON, () => console.log('Victory!'));
GameEvents.on(GameEventTypes.GAME_OVER, () => console.log('Game Over'));

// State changes
GameEvents.on(GameEventTypes.STATE_CHANGED, (state: GameState) => {
    console.log('State:', GameState[state]);
});
```

### GameController Methods

```typescript
// Restart game
gameController.restart();

// Use power-up on specific cell
gameController.useBuster({ row: 3, col: 4 });

// Read state
console.log(gameController.score);      // Current score
console.log(gameController.movesLeft);  // Remaining moves
console.log(gameController.state);      // Current GameState
```

### Game States

```typescript
enum GameState {
    Idle = 0,      // Waiting for input
    Input = 1,     // Processing input
    Swapping = 2,  // Swap animation
    Matching = 3,  // Finding matches
    Falling = 4,   // Gravity animation
    Refilling = 5  // Spawning new chips
}
```

---

## Animation Constants

Edit `assets/Script/Game/Types.ts`:

```typescript
export const GameConstants = {
    SWAP_DURATION: 0.15,    // Swap animation time
    FALL_DURATION: 0.15,    // Base fall time (×√distance)
    DESTROY_DURATION: 0.12, // Destroy animation time
    SPAWN_DELAY: 0.03,      // Delay between column spawns
    MIN_MATCH_LENGTH: 3,    // Minimum match length
    BONUS_4_LENGTH: 4,      // Length for line bonus
    BONUS_5_LENGTH: 5       // Length for rainbow bonus
};
```

---

## Download

📦 [Latest Release](https://github.com/AlexKutepov/Match3-algorithm-TS-Cocos-creator/releases/)

---

## License

MIT License © 2024 Alex Kutepov
