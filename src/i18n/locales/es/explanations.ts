export const explanations = {
  rows: {
    bestCase: "Mejor caso",
    averageCase: "Caso promedio",
    worstCase: "Peor caso",
    space: "Espacio",
    stability: "Estabilidad",
    accessByIndex: "Acceso por índice",
    linearSearch: "Búsqueda lineal",
    insertDeleteEnd: "Insertar / Eliminar (final)",
    insertDeleteMiddle: "Insertar / Eliminar (medio)",
    push: "Apilar",
    pop: "Desapilar",
    peek: "Consultar tope",
    clear: "Vaciar",
    insertHeadTail: "Insertar en cabeza / cola",
    deleteHead: "Eliminar en cabeza",
    deleteTailSingly: "Eliminar en cola (simple)",
    deleteTailDoubly: "Eliminar en cola (doble)",
    searchAccessIndex: "Búsqueda / Acceso por índice",
    reverseInPlace: "Invertir (sin memoria extra)",
  },
  binarySearch: {
    howItWorks:
      "La búsqueda binaria divide repetidamente un array ordenado a la mitad para localizar un valor objetivo. Comienza con los límites bajo y alto cubriendo todo el array, calcula el punto medio, compara array[medio] con el objetivo, descarta la mitad izquierda o derecha y repite hasta encontrar el valor o vaciar el rango.",
    keyConcepts: [
      "Array ordenado: la búsqueda binaria solo funciona cuando los elementos están en orden ascendente.",
      "Punteros bajo / medio / alto: rastrean el intervalo activo y el candidato central.",
      "Divide y vencerás: cada paso reduce a la mitad el espacio de búsqueda comparando contra el punto medio.",
    ],
    complexityRows: [
      { label: "Mejor caso", value: "O(1)" },
      { label: "Caso promedio", value: "O(log n)" },
      { label: "Peor caso", value: "O(log n)" },
      { label: "Espacio", value: "O(1)" },
    ],
    whenToUse: [
      "Buscar en arrays ordenados con acceso aleatorio O(1), como tablas de consulta estáticas.",
      "Conjuntos de datos grandes donde un escaneo lineal sería demasiado lento y la memoria es limitada.",
      "Búsquedas repetidas sobre la misma colección ordenada (p. ej. diccionarios, índices).",
    ],
  },
  sequentialSearch: {
    howItWorks:
      "La búsqueda secuencial (lineal) recorre el array desde el índice más bajo hacia arriba. En cada posición compara el elemento actual con el objetivo; si coinciden, devuelve ese índice. Si el bucle termina sin coincidencia, el objetivo no está presente.",
    keyConcepts: [
      "Sin requisito de orden: funciona en arrays ordenados o no.",
      "Índice i: recorre 0, 1, 2, … hasta una coincidencia o el final del array.",
      "Salida anticipada: se detiene en cuanto encuentra el objetivo.",
    ],
    complexityRows: [
      { label: "Mejor caso", value: "O(1)" },
      { label: "Caso promedio", value: "O(n)" },
      { label: "Peor caso", value: "O(n)" },
      { label: "Espacio", value: "O(1)" },
    ],
    whenToUse: [
      "Colecciones pequeñas o no ordenadas donde la simplicidad supera el preprocesado.",
      "Búsquedas puntuales cuando ordenar para búsqueda binaria no compensa.",
      "Estructuras enlazadas sin acceso aleatorio donde el recorrido es natural.",
    ],
  },
  selectionSort: {
    howItWorks:
      "La ordenación por selección mantiene un prefijo ordenado a la izquierda y un sufijo no ordenado a la derecha. Cada paso externo busca el mínimo en la región no ordenada y lo intercambia a la siguiente posición ordenada.",
    keyConcepts: [
      "Prefijo ordenado: los índices 0 a i - 1 quedan en orden final tras cada paso.",
      "Índice externo i: marca la frontera entre prefijo ordenado y sufijo no ordenado.",
      "Escaneo del mínimo: minIdx rastrea el valor más pequeño durante el bucle interno.",
      "Intercambios en el propio array: solo se necesita memoria extra constante además del array.",
    ],
    complexityRows: [
      { label: "Mejor caso", value: "O(n²)" },
      { label: "Caso promedio", value: "O(n²)" },
      { label: "Peor caso", value: "O(n²)" },
      { label: "Espacio", value: "O(1)" },
      { label: "Estabilidad", value: "Inestable" },
    ],
    whenToUse: [
      "Arrays pequeños donde la simplicidad importa más que el rendimiento bruto.",
      "Contextos educativos para ilustrar selección directa sobre el array y pasadas de comparación.",
      "Entornos con memoria limitada donde se requiere espacio auxiliar O(1).",
    ],
  },
  insertionSort: {
    howItWorks:
      "La ordenación por inserción construye un prefijo ordenado a la izquierda un elemento a la vez. Cada paso toma una clave del sufijo no ordenado, la compara de derecha a izquierda contra la partición ordenada, desplaza valores mayores una posición a la derecha e inserta la clave en su posición correcta.",
    keyConcepts: [
      "Prefijo ordenado: los índices 0 a i - 1 están en orden final antes de comenzar el paso i.",
      "Elemento clave: el valor en el índice i que se insertará en la partición ordenada.",
      "Escaneo derecha-izquierda: compara la clave con elementos ordenados y desplaza mayores a la derecha.",
      "Inserción en el propio array: solo se necesita memoria extra constante para índices y la clave.",
    ],
    complexityRows: [
      { label: "Mejor caso", value: "O(n)" },
      { label: "Caso promedio", value: "O(n²)" },
      { label: "Peor caso", value: "O(n²)" },
      { label: "Espacio", value: "O(1)" },
      { label: "Estabilidad", value: "Estable" },
    ],
    whenToUse: [
      "Arrays pequeños o casi ordenados donde el mejor caso adaptativo O(n) ayuda.",
      "Contextos educativos para ilustrar ordenación incremental y desplazamientos.",
      "Escenarios de ordenación online donde los elementos llegan uno a uno.",
    ],
  },
  mergeSort: {
    howItWorks:
      "La Ordenación por Fusión divide repetidamente el array por la mitad hasta que cada segmento tiene un elemento, y luego fusiona pares de hermanos de abajo hacia arriba. Cada fusión compara los frentes de dos listas ordenadas y copia el menor al buffer combinado hasta agotar ambas listas.",
    keyConcepts: [
      "Divide: parte rangos por la mitad hasta casos base de longitud uno.",
      "Conquista: fusiona hermanos ordenados con dos punteros, eligiendo siempre el menor frente.",
      "Fusión estable: valores iguales conservan el orden relativo del segmento izquierdo.",
      "Espacio auxiliar: implementaciones típicas copian a buffers temporales durante la fusión.",
    ],
    complexityRows: [
      { label: "Mejor caso", value: "O(n log n)" },
      { label: "Caso promedio", value: "O(n log n)" },
      { label: "Peor caso", value: "O(n log n)" },
      { label: "Espacio", value: "O(n)" },
      { label: "Estabilidad", value: "Estable" },
    ],
    whenToUse: [
      "Listas enlazadas u ordenación externa cuando se requiere O(n log n) estable.",
      "Conjuntos grandes donde el rendimiento log-lineal predecible supera ordenaciones cuadráticas.",
      "Escenarios con estabilidad y memoria auxiliar disponible.",
    ],
  },
  quickSort: {
    howItWorks:
      "La Ordenación Rápida aplica divide y vencerás sobre un array. En cada sub-array activo se elige un pivote según una estrategia, se particiona para que elementos menores o iguales queden a la izquierda y mayores a la derecha, y luego cada lado se ordena recursivamente hasta sub-arrays de un elemento.",
    keyConcepts: [
      "Divide y vencerás: divide en sub-arrays más pequeños, ordénalos independientemente y combina mediante partición.",
      "Selección de pivote: pivotes al inicio o al final con entrada ordenada crean profundidad O(n²); medio o aleatorio mantienen O(n log n) promedio.",
      "Partición: escaneo con índices i y j para reorganizar elementos alrededor del pivote en O(n) por nivel.",
      "Caso base: sub-arrays de cero o un elemento ya están ordenados.",
    ],
    complexityRows: [
      { label: "Mejor caso", value: "O(n log n)" },
      { label: "Caso promedio", value: "O(n log n)" },
      { label: "Peor caso", value: "O(n²)" },
      { label: "Espacio", value: "O(log n) prom., O(n) peor" },
      { label: "Estabilidad", value: "Inestable" },
    ],
    whenToUse: [
      "Ordenación directa sobre el array cuando se requiere O(n log n) promedio.",
      "Conjuntos de datos grandes donde pivotes aleatorios o centrales evitan comportamiento O(n²) patológico.",
      "Sistemas con memoria auxiliar limitada donde una pila de recursión O(log n) es aceptable.",
    ],
  },
  array: {
    howItWorks:
      "Un array almacena elementos en un bloque contiguo de memoria. Cada ranura tiene un índice fijo desde 0, así la máquina salta directamente a cualquier posición con dirección base + desplazamiento. Eso hace la lectura por índice muy rápida, pero insertar o eliminar lejos del final fuerza desplazamientos vecinos.",
    keyConcepts: [
      "Memoria contigua: índices 0, 1, 2... mapean a ranuras adyacentes en RAM.",
      "Acceso O(1) por índice: arr[i] calcula la dirección en un paso sin escaneo.",
      "Desplazamientos O(n): insertar o eliminar en el medio mueve hasta n - 1 elementos.",
      "Búsqueda lineal: sin conocer el índice, hay que inspeccionar elemento por elemento.",
    ],
    complexityRows: [
      { label: "Acceso por índice", value: "O(1)" },
      { label: "Búsqueda lineal", value: "O(n)" },
      { label: "Insertar / Eliminar (final)", value: "O(1)" },
      { label: "Insertar / Eliminar (medio)", value: "O(n)" },
      { label: "Espacio", value: "O(n)" },
    ],
    whenToUse: [
      "Acceso aleatorio frecuente por índice, como tablas de consulta o buffers.",
      "Iteración secuencial cuando importan localidad de caché y densidad de memoria.",
      "Evitar insertar o eliminar con frecuencia en el medio — considerar estructuras enlazadas.",
    ],
  },
  linkedList: {
    howItWorks:
      "Una lista enlazada almacena elementos en nodos dispersos en memoria. Cada nodo guarda un valor y puntero(s) a vecinos en lugar de un bloque contiguo. El puntero a cabeza marca la entrada; el recorrido sigue el enlace siguiente (y anterior en listas dobles) hasta nulo o de vuelta a cabeza en variantes circulares.",
    keyConcepts: [
      "Nodos y punteros: los datos viven en objetos nodo enlazados por referencias.",
      "Simple: cada nodo guarda valor + siguiente — memoria mínima, recorrido solo hacia adelante.",
      "Doble: añade enlace anterior para pasos O(1) hacia atrás a costa de espacio extra.",
      "Circular: el enlace de cola vuelve a cabeza — útil para buffers round-robin e iteradores en anillo.",
      "Sin acceso aleatorio: alcanzar índice i requiere O(i) saltos desde la cabeza.",
    ],
    complexityRows: [
      { label: "Insertar en cabeza / cola", value: "O(1) con punteros a cabeza y cola" },
      { label: "Eliminar en cabeza", value: "O(1)" },
      { label: "Eliminar en cola (simple)", value: "O(n) — encontrar penúltimo nodo" },
      { label: "Eliminar en cola (doble)", value: "O(1) con puntero a cola" },
      { label: "Búsqueda / Acceso por índice", value: "O(n)" },
      { label: "Invertir (sin memoria extra)", value: "O(n) tiempo, O(1) espacio" },
      { label: "Espacio", value: "O(n) nodos + sobrecarga de punteros" },
    ],
    whenToUse: [
      "Insertar o eliminar con frecuencia en cabeza o en referencias de nodo conocidas.",
      "Tamaño desconocido o muy variable donde la reasignación contigua es costosa.",
      "Listas de adyacencia, cachés LRU o secuencias tipo playlist.",
      "Preferir arrays cuando necesitas acceso O(1) por índice, localidad de caché o búsqueda binaria.",
    ],
  },
  stack: {
    howItWorks:
      "Una pila es una estructura lineal LIFO (último en entrar, primero en salir). Los elementos se añaden y eliminan estrictamente desde la cima. Apilar inserta en la cima, desapilar elimina el más reciente y consultar tope accede sin modificar la pila.",
    keyConcepts: [
      "Orden LIFO: el elemento apilado más recientemente se elimina primero.",
      "Puntero de cima: apilar, desapilar y consultar tope referencian el índice superior en O(1).",
      "Capacidad limitada: apilar en pila llena provoca desbordamiento.",
      "Subdesbordamiento: desapilar o consultar tope en pila vacía es inválido y no debe modificar la estructura.",
    ],
    complexityRows: [
      { label: "Apilar", value: "O(1)" },
      { label: "Desapilar", value: "O(1)" },
      { label: "Consultar tope", value: "O(1)" },
      { label: "Vaciar", value: "O(n)" },
      { label: "Espacio", value: "O(n)" },
    ],
    whenToUse: [
      "Mecanismos deshacer/rehacer y navegación del historial del navegador.",
      "Pilas de llamadas en recursión y análisis de expresiones (p. ej. notación postfija).",
      "Algoritmos de backtracking y recorrido DFS en grafos.",
    ],
  },
} as const;
