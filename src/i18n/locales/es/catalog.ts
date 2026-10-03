export const catalog = {
  hero: {
    title: "Explora y visualiza algoritmos",
    subtitle:
      "Domina estructuras de datos y algoritmos con visualizadores interactivos y gamificados. Aprendizaje táctil.",
  },
  search: {
    placeholder: "Buscar algoritmos (ej. Búsqueda binaria)...",
  },
  filters: {
    all: "Todos",
    dataStructures: "Estructuras de datos",
    arrays: "Arrays",
    searching: "Búsqueda",
    sorting: "Ordenación",
    trees: "Árboles",
    graphs: "Grafos",
  },
  sections: {
    dataStructures: { title: "Estructuras de datos" },
    searching: { title: "Algoritmos de búsqueda" },
    sorting: { title: "Algoritmos de ordenación" },
  },
  emptyResults: "Ningún algoritmo coincide con tu búsqueda.",
  categories: {
    array: "Array",
    "data-structures": "Estructura de datos",
    searching: "Búsqueda",
    sorting: "Ordenación",
    trees: "Árboles",
    graphs: "Grafos",
  },
  algorithms: {
    array: {
      title: "Array",
      description:
        "Bloque de memoria contigua con acceso O(1) por índice y desplazamientos O(n) al insertar/eliminar.",
      complexity: "O(1)–O(n)",
    },
    "linked-list": {
      title: "Lista enlazada",
      description:
        "Nodos con punteros que soportan variantes simple, doble y circular con operaciones O(1) en la cabeza.",
      complexity: "O(1)–O(n)",
    },
    stack: {
      title: "Pila",
      description:
        "Pila LIFO con apilar, desapilar y consultar tope en O(1). Capacidad limitada provoca desbordamiento.",
      complexity: "O(1)–O(n)",
    },
    "binary-search": {
      title: "Búsqueda binaria",
      description:
        "Encuentra un elemento en un array ordenado dividiendo repetidamente el intervalo de búsqueda.",
      complexity: "O(log n)",
    },
    "sequential-search": {
      title: "Búsqueda secuencial",
      description:
        "Recorre desde el primer índice hasta el último hasta encontrar el objetivo o agotar el array.",
      complexity: "O(n)",
    },
    "selection-sort": {
      title: "Ordenación por selección",
      description:
        "Selecciona repetidamente el menor de la porción no ordenada y lo intercambia a su posición.",
      complexity: "O(n²)",
    },
    "insertion-sort": {
      title: "Ordenación por inserción",
      description:
        "Construye un prefijo ordenado insertando cada elemento en su posición con desplazamientos hacia la derecha.",
      complexity: "O(n²)",
    },
    "merge-sort": {
      title: "Ordenación por Fusión",
      description:
        "Divide el array de forma recursiva y fusiona mitades ordenadas con una fusión estable.",
      complexity: "O(n log n)",
    },
    "quick-sort": {
      title: "Ordenación Rápida",
      description:
        "Particiona alrededor de un pivote y ordena sub-arrays recursivamente con divide y vencerás.",
      complexity: "O(n log n) prom.",
    },
  },
} as const;
