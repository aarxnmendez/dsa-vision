export const catalog = {
  hero: {
    title: "Explora y visualiza algoritmos",
    subtitle:
      "Domina estructuras de datos y algoritmos con visualizadores interactivos y gamificados. Aprendizaje táctil.",
    bigOLink: "¿Nuevo en Big-O? Lee la guía de notación",
  },
  search: {
    placeholder: "Buscar algoritmos (ej. Búsqueda binaria)...",
    ariaLabel: "Buscar algoritmos",
  },
  filters: {
    all: "Todos",
    dataStructures: "Estructuras de datos",
    arrays: "Arrays",
    searching: "Búsqueda",
    sorting: "Ordenación",
    trees: "Árboles",
    graphs: "Grafos",
    ariaLabel: "Filtrar por categoría",
  },
  sections: {
    dataStructures: { title: "Estructuras de datos" },
    searching: { title: "Algoritmos de búsqueda" },
    sorting: { title: "Algoritmos de ordenación" },
  },
  upcoming: {
    title: "Próximamente",
    items: {
      hashTables: {
        title: "Tablas hash",
        description: "Funciones hash, colisiones y búsquedas O(1) en promedio.",
      },
      trees: {
        title: "Árboles",
        description: "Árboles binarios de búsqueda y recorridos.",
      },
      graphs: {
        title: "Grafos",
        description: "BFS, DFS y caminos mínimos de Dijkstra.",
      },
    },
  },
  view: {
    ariaLabel: "Vista del catálogo",
    cards: "Tarjetas",
    table: "Tabla comparativa",
  },
  table: {
    structuresTitle: "Estructuras de datos",
    algorithmsTitle: "Algoritmos de búsqueda y ordenación",
    name: "Nombre",
    access: "Acceso",
    search: "Búsqueda",
    insert: "Inserción",
    remove: "Eliminación",
    space: "Espacio",
    best: "Mejor",
    average: "Promedio",
    worst: "Peor",
    stable: "Estable",
    yes: "Sí",
    no: "No",
    notApplicable: "N/A",
    notes: {
      array: "Array: insertar y eliminar al final es O(1); en medio hay que desplazar elementos, O(n).",
      linkedList: "Lista enlazada: insertar y eliminar es O(1) en la cabeza. Llegar a cualquier otra posición es O(n).",
      stackQueue: "Pila y cola: solo el tope o el frente son accesibles directamente (consultar es O(1)); leer un elemento cualquiera es O(n).",
    },
  },
  emptyResults: "Ningún algoritmo coincide con tu búsqueda.",
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
    queue: {
      title: "Cola",
      description:
        "Cola FIFO con encolar, desencolar y consultar frente en O(1). Base conceptual para búsqueda en anchura.",
      complexity: "O(1)",
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
      complexity: "O(n log n)",
    },
  },
} as const;
