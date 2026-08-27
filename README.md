# DSAVision

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm&logoColor=white)

**An interactive, didactic-professional platform for learning data structures and algorithms.**

DSAVision turns abstract pointer logic and complexity analysis into **step-by-step visual stories**: watch nodes highlight, edges relink, and code lines activate in sync — with explanations in **four languages** and live Big-O context for every operation.

---

## Study Plan Progress

| Chapter | Topics | Status |
| :-- | :-- | :-- |
| **1** | Binary Search · Big-O Notation (time & space reference) | ✅ Complete |
| **2** | Selection Sort · Array (contiguous memory ops) · Linked List (Singly, Doubly, Circular — O(1) head/tail ops) | ✅ Complete |
| **3** | Stacks & Queues | ⏳ Coming soon |
| **4** | Merge Sort · Graph algorithms (Dijkstra) | ⏳ Planned |

---

## Key Features

| | |
| :-- | :-- |
| 🎯 **Step-by-step engine** | Pure TypeScript step generators drive every animation frame — no guesswork, fully reproducible. |
| 🗺️ **SVG multi-row visualizers** | Dynamic pointer labels, Manhattan orthogonal routing, circular back-edges, and smooth transitions. |
| 🌐 **Multi-language code panels** | Side-by-side implementations in **Python**, **JavaScript**, **Java**, and **Pseudocode** with active line tracking. |
| ⏯️ **Playback controls** | Play, pause, step forward/backward, speed slider, and random or custom dataset input. |
| 📐 **Complexity in context** | Inline time/space badges and expandable breakdowns (O(1), O(log n), O(n), O(n²), …). |
| 📚 **Theory panels** | Data-driven explanations: how it works, key concepts, complexity table, and when to use. |
| 🧩 **Consistent architecture** | Shared layout shell, player hook, dataset setup, and visualizer families (arrays, sort bars, linked nodes). |

---

## Available Visualizers

| Route | Module |
| :-- | :-- |
| `/` | Algorithm catalog with search & filters |
| `/binary-search` | Binary search on sorted arrays |
| `/big-o-notation` | Big-O time & space reference |
| `/selection-sort` | Selection sort bar visualizer |
| `/array` | Array insert, delete, shift & access operations |
| `/linked-list` | Singly · Doubly · Circular — 8 operations (insert, delete, search, reverse) |

---

## Tech Stack

- **React 19** + **TypeScript** — UI and type-safe step models
- **Vite** — dev server and production bundling
- **Tailwind CSS v4** — design tokens, responsive layout, dark-ready surfaces
- **React Router v7** — client-side routing
- **Lucide React** — icon system
- **Nunito Sans** — typography via `@fontsource`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

### Installation

```bash
git clone https://github.com/aarxnmendez/dsa-vision.git
cd dsa-vision
pnpm install
```

### Development

```bash
pnpm dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

### Production build

```bash
pnpm build
pnpm preview   # optional — serve the dist/ folder locally
```

### Lint

```bash
pnpm lint
```

---

## Project Structure

```
src/
├── algorithms/          # Pure step engines (linkedListOperations, binarySearch, …)
├── components/
│   ├── visualizers/     # SVG / DOM visualizers by data family
│   ├── panels/          # Code, explanation, status, complexity badges
│   ├── controls/        # Player, dataset setup, custom input
│   └── layout/          # VisualizerLayout, AlgorithmPageShell, catalog
├── data/                # Code snippets, explanations, catalog metadata
├── hooks/               # use*Visualizer + usePlayerControls
├── pages/               # Route-level page composition
└── constants/           # Routes, copy, visualizer tokens, player speed
```

Architecture conventions live in [`.cursor/rules/dsa-architecture.mdc`](.cursor/rules/dsa-architecture.mdc).

---

## Linked List Highlights

The linked list module is the most complete structure visualizer in the catalog:

- **Variants:** singly linked, doubly linked, circular
- **Operations:** insert at head/tail/index, delete head/tail/by value, search, in-place reverse
- **Pedagogy:** explicit `null` pointer ports, O(1) vs O(n) tail deletion, circular tail → head relinking
- **Layout:** multi-row wrap without horizontal scroll; orthogonal edge routing

---

## Roadmap

- [ ] Stacks & Queues visualizer
- [ ] Merge Sort
- [ ] Graph visualizer (BFS, DFS, Dijkstra)
- [ ] Tree structures (BST, traversals)

---

## Author

Built by **Aaron Mendez** — interactive CS education tooling with production-grade UX.

---

<p align="center">
  <sub>If this project helps your learning or interview prep, consider starring the repo.</sub>
</p>
