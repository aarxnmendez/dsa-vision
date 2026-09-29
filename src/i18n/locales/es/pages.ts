export const pages = {
  binarySearch: {
    title: "Búsqueda binaria",
    description:
      "Búsqueda divide y vencerás en un array ordenado que divide el intervalo activo a cada paso.",
    customInputHint:
      "Los valores se ordenan automáticamente para la búsqueda binaria.",
    complexity: {
      time: {
        title: "Tiempo logarítmico",
        text: "El tiempo de ejecución crece logarítmicamente respecto al tamaño de entrada. Al dividir el espacio de búsqueda a cada paso, sigue siendo extremadamente rápido incluso con conjuntos de datos masivos.",
      },
      space: {
        title: "Espacio constante",
        text: "El algoritmo usa una cantidad fija de memoria adicional (solo punteros), independientemente del tamaño del array.",
      },
    },
  },
  sequentialSearch: {
    title: "Búsqueda secuencial",
    description:
      "Recorre el array desde el primer índice hasta el último comparando cada elemento con el objetivo.",
    customInputHint:
      "Introduce valores en cualquier orden. El array no se ordena para la búsqueda lineal.",
    complexity: {
      time: {
        title: "Tiempo lineal",
        text: "En el peor caso se inspecciona cada elemento una vez, así que el tiempo crece proporcionalmente a la longitud: O(n).",
      },
      space: {
        title: "Espacio constante",
        text: "Solo hace falta el índice del bucle y unas pocas variables: O(1) de espacio auxiliar.",
      },
    },
  },
  selectionSort: {
    title: "Ordenación por selección",
    description:
      "Ordenación que selecciona el mínimo en cada paso y lo intercambia hacia adelante, trabajando directamente sobre el array.",
    customInputHint:
      "Introduce valores en cualquier orden. La ordenación por selección los ordenará en el propio array.",
    complexity: {
      time: {
        title: "Tiempo cuadrático",
        text: "La ordenación por selección compara elementos en bucles anidados, resultando en tiempo O(n²) en casos típicos.",
      },
      space: {
        title: "Espacio constante",
        text: "El algoritmo ordena directamente sobre el array, usando solo memoria extra constante para índices e intercambios.",
      },
    },
  },
  insertionSort: {
    title: "Ordenación por inserción",
    description:
      "Ordenación que inserta cada elemento en el prefijo ordenado creciente a la izquierda, sin copias adicionales del array.",
    customInputHint:
      "Introduce valores en cualquier orden. La ordenación por inserción los ordenará en el propio array.",
    complexity: {
      time: {
        title: "Tiempo cuadrático adaptativo",
        text: "La ordenación por inserción corre en O(n) con entrada ya ordenada y O(n²) en casos promedio y peor por comparaciones y desplazamientos anidados.",
      },
      space: {
        title: "Espacio constante",
        text: "El algoritmo ordena directamente sobre el array, usando solo memoria extra constante para la clave e índices del bucle.",
      },
    },
  },
  quickSort: {
    title: "Quicksort",
    description:
      "Ordenación divide y vencerás que particiona alrededor de un pivote y ordena subarrays recursivamente.",
    customInputHint:
      "Introduce valores en cualquier orden. Quicksort los ordenará en el propio array.",
    complexity: {
      time: {
        title: "Tiempo logarítmico promedio",
        text: "Quicksort con pivote aleatorio elige un pivote aleatorio en cada partición, manteniendo profundidad de recursión esperada O(log n). Los casos promedio y mejor corren en O(n log n); una secuencia de pivotes desafortunada puede llegar a O(n²).",
      },
      space: {
        title: "Pila de recursión logarítmica",
        text: "La partición trabaja sobre el propio array con memoria auxiliar O(1), pero las llamadas recursivas consumen espacio de pila O(log n) en promedio y O(n) en el peor caso.",
      },
    },
  },
  array: {
    title: "Array",
    description:
      "Estructura de memoria contigua con acceso O(1) por índice y desplazamientos O(n) en inserciones y eliminaciones.",
    complexity: {
      time: {
        title: "Complejidad mixta",
        text: "El acceso por índice es O(1), pero inserciones y eliminaciones lejos del final pueden desplazar hasta n elementos, costando O(n).",
      },
      space: {
        title: "Almacenamiento contiguo",
        text: "Los elementos se guardan en ranuras de memoria adyacentes. La estructura usa espacio O(n) para n valores más capacidad reservada.",
      },
    },
  },
  linkedList: {
    title: "Lista enlazada",
    description:
      "Nodos con punteros en variantes simple, doble y circular con operaciones O(1) en la cabeza.",
    complexity: {
      time: {
        title: "Complejidad basada en punteros",
        text: "Con punteros a cabeza y cola, insertar en cabeza y cola es O(1). Eliminar en cabeza también es O(1). Eliminar en cola sigue siendo O(n) en listas simples; las dobles logran O(1). Búsqueda, acceso por índice e invertir siguen siendo O(n).",
      },
      space: {
        title: "Sobrecarga de nodos",
        text: "Cada nodo almacena un valor más puntero(s). Las listas dobles usan espacio extra para enlaces previos pero permiten recorrido O(1) hacia atrás.",
      },
    },
  },
  stack: {
    title: "Pila",
    description:
      "Estructura LIFO con apilar, desapilar y consultar tope en O(1). Capacidad limitada provoca desbordamiento al apilar.",
    complexity: {
      time: {
        title: "Operaciones en tiempo constante",
        text: "Apilar, desapilar y consultar tope acceden solo al puntero de cima en O(1) sin importar la cantidad de elementos. Operaciones que recorren toda la estructura, como vaciar, corren en O(n).",
      },
      space: {
        title: "Espacio auxiliar lineal",
        text: "La complejidad espacial es O(n) proporcional al máximo de elementos almacenados, más O(1) para el puntero de cima.",
      },
    },
  },
  codeLanguages: {
    python: "Python",
    javascript: "JavaScript",
    java: "Java",
    pseudocode: "Pseudocódigo",
  },
} as const;
