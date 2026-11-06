# DSAVision

**An interactive platform for learning and visualizing data structures and algorithms.**

DSAVision turns abstract pointer logic and algorithm execution into step-by-step visual stories: smooth SVG animations, side-by-side code execution in multiple languages (**Python, JavaScript, Java, Pseudocode**), and interactive playback controls.

Live site: [dsavision.dev](https://www.dsavision.dev/)

---

## Implemented Modules

- **Search**: Binary Search, Linear Search
- **Sorting**: Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **Arrays and memory**: contiguous memory operations
- **Linked lists**: singly, doubly, circular
- **LIFO structures**: Stack
- **FIFO structures**: Queue
- **Theory**: interactive Big-O reference (time and space)

**Merge Sort** and **Quick Sort** use a **recursion tree** on an **infinite canvas** (pan, zoom, fit-to-view, focus mode) so divide-and-conquer calls stay readable as the array changes in place.

The catalog also includes a **complexity comparison table**, a global **quick search** (`⌘K` / `Ctrl K` or `/`) available on every page, and a **continue** shortcut that reopens your last visualizer with its saved data (stored locally in the browser).

---

## Upcoming Algorithms and Structures

- Hash tables
- Graphs (BFS, DFS, Dijkstra)
- Trees (BST, traversals)

---

## Key Features

- **Bilingual UI**: English and Spanish (EN / ES), including step narration and theory panels.
- **Playback controls**: play, pause, step forward and back, reset, and speed slider.
- **Multi-language code panels**: synchronized highlights in Python, JavaScript, Java, and pseudocode.
- **Dataset setup**: random data, custom input, and algorithm-specific options (for example pivot strategy on Quick Sort).
- **Modern stack**: React 19, TypeScript, Vite, Tailwind CSS v4, react-i18next.

