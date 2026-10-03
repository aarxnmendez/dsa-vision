export const bigO = {
  backToVisualizer: "Volver al visualizador",
  title: "Notación Big-O",
  subtitle:
    "Big-O describe cómo escalan los requisitos de tiempo o espacio de un algoritmo cuando crece el tamaño de la entrada. Te ayuda a comparar soluciones, predecir rendimiento y elegir la herramienta adecuada para problemas reales.",
  dimensionTabsAria: "Dimensión de complejidad",
  time: {
    label: "Complejidad temporal",
    intro:
      "La complejidad temporal mide cómo crece el número de operaciones cuando aumenta el tamaño de la entrada. Responde: ¿cuánto más tardará este algoritmo si duplicamos los datos?",
    chartTitle: "Comparación de crecimiento temporal",
    chartDescription:
      "A medida que crece la entrada, algunas clases de complejidad temporal explotan mientras otras siguen siendo manejables. Curvas más bajas significan algoritmos más rápidos a escala.",
    tableTitle: "Referencia de complejidad temporal",
    rows: [
      {
        notation: "O(1)",
        name: "Constante",
        description: "El tiempo se mantiene estable sin importar el tamaño de la entrada.",
        examples: "Búsqueda en tabla hash, acceso por índice en array",
      },
      {
        notation: "O(log n)",
        name: "Logarítmica",
        description: "Cada paso elimina una gran fracción del trabajo restante.",
        examples: "Búsqueda binaria en un array ordenado",
      },
      {
        notation: "O(n)",
        name: "Lineal",
        description: "El tiempo crece en proporción directa al tamaño de la entrada.",
        examples: "Búsqueda lineal en un array no ordenado",
      },
      {
        notation: "O(n log n)",
        name: "Linealítmica",
        description: "Ligeramente peor que lineal, pero aún escalable para datos grandes.",
        examples: "Merge sort, Quicksort (promedio), heap sort",
      },
      {
        notation: "O(n²)",
        name: "Cuadrática",
        description: "Duplicar la entrada puede cuadruplicar el tiempo de ejecución.",
        examples: "Bubble sort, selection sort, bucles anidados",
      },
    ],
  },
  space: {
    label: "Complejidad espacial",
    intro:
      "La complejidad espacial mide cuánta memoria extra necesita un algoritmo además de la entrada. Responde: ¿cuánta RAM adicional se requiere cuando crecen los datos?",
    chartTitle: "Comparación de crecimiento espacial",
    chartDescription:
      "La memoria extra puede venir de la profundidad de recursión o de estructuras auxiliares. Los algoritmos que trabajan sobre el propio dato de entrada mantienen la menor huella de memoria.",
    tableTitle: "Referencia de complejidad espacial",
    auxiliaryTitle: "¿Qué usa memoria auxiliar?",
    auxiliaryIntro:
      "La complejidad espacial cuenta memoria más allá de la propia entrada. Dos fuentes habituales son la pila de llamadas por recursión y estructuras de datos temporales asignadas durante la ejecución.",
    auxiliaryPoints: [
      {
        title: "Pila de llamadas (recursión)",
        detail:
          "Cada llamada recursiva añade un frame a la pila. La profundidad suele ser O(log n) en algoritmos divide y vencerás como la búsqueda binaria recursiva.",
      },
      {
        title: "Estructuras de datos auxiliares",
        detail:
          "Arrays temporales, mapas hash, colas o buffers de salida asignados durante la ejecución. Merge sort necesita O(n) de espacio extra para fusionar.",
      },
      {
        title: "Algoritmos sin espacio auxiliar",
        detail:
          "Los algoritmos que reordenan los datos dentro de la propia entrada usan O(1) de espacio extra además de unas pocas variables — la búsqueda binaria iterativa y el bubble sort son ejemplos habituales.",
      },
    ],
    rows: [
      {
        notation: "O(1)",
        name: "Constante",
        description: "Usa una cantidad fija de memoria extra sin importar el tamaño de la entrada.",
        examples: "Búsqueda binaria iterativa, bubble sort sobre el propio array",
      },
      {
        notation: "O(log n)",
        name: "Logarítmica",
        description: "La memoria extra crece con la profundidad de recursión, no directamente con la entrada.",
        examples: "Pila de llamadas recursivas (p. ej. búsqueda binaria recursiva)",
      },
      {
        notation: "O(n)",
        name: "Lineal",
        description: "Requiere estructuras auxiliares que escalan con el tamaño de la entrada.",
        examples: "Arrays auxiliares, mapas hash, buffer de Ordenación por Fusión",
      },
    ],
  },
  table: {
    notation: "Notación",
    class: "Clase",
    behavior: "Comportamiento",
    examples: "Ejemplos",
  },
} as const;
