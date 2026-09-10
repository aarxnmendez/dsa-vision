export const structures = {
  array: {
    customInputDescription:
      "Los valores se almacenan de izquierda a derecha en memoria contigua.",
    operation: "Operación",
    operationAria: "Operación de array",
    index: "Índice",
    value: "Valor",
    valueToInsert: "Valor a insertar",
    searchTarget: "Objetivo de búsqueda",
    operations: {
      access: "Acceso por índice — O(1)",
      linearSearch: "Búsqueda lineal — O(n)",
      insertStart: "Insertar al inicio — O(n)",
      insertMiddle: "Insertar en el medio — O(n)",
      insertEnd: "Insertar al final — O(1) amortizado",
      deleteStart: "Eliminar al inicio — O(n)",
      deleteMiddle: "Eliminar en el medio — O(n)",
      deleteEnd: "Eliminar al final — O(1)",
    },
  },
  linkedList: {
    customInputDescription:
      "Introduce valores de nodos en orden de recorrido de cabeza a cola.",
    listType: "Tipo de lista",
    operation: "Operación",
    operationAria: "Operación de lista enlazada",
    value: "Valor",
    valueToInsert: "Valor a insertar",
    index: "Índice",
    searchTarget: "Objetivo de búsqueda",
    types: {
      singly: "Simple",
      doubly: "Doble",
      circular: "Circular",
    },
    operations: {
      insertAtHead: "Insertar en cabeza — O(1)",
      insertAtTail: "Insertar en cola — O(1)",
      insertAtIndex: "Insertar en índice — O(n)",
      deleteHead: "Eliminar cabeza — O(1)",
      deleteTail: "Eliminar cola — O(n)",
      deleteValue: "Eliminar por valor — O(n)",
      search: "Búsqueda — O(n)",
      reverse: "Invertir — O(n)",
    },
  },
  stack: {
    initialSize: "Tamaño inicial de la pila",
    customInputDescription:
      "Introduce valores de abajo hacia arriba (máx. {{max}} elementos).",
    stackOperation: "Operación de pila",
    valueToPush: "Valor a apilar",
    capacityLoaded: "Capacidad: {{loaded}} / {{max}} elementos cargados.",
    operation: "Operación",
    value: "Valor",
    operations: {
      push: "Apilar",
      pushDescription: "O(1) — añadir a la cima",
      pop: "Desapilar",
      popDescription: "O(1) — eliminar de la cima",
      peek: "Consultar tope",
      peekDescription: "O(1) — leer la cima",
      clear: "Vaciar",
      clearDescription: "O(n) — vaciar la pila",
    },
  },
  legends: {
    array: {
      active: "Activo / Accedido",
      shift: "Desplazamiento / Reorden",
      success: "Insertado / Éxito",
      vacant: "Vacante / Memoria",
    },
    linkedList: {
      active: "Activo / Recorriendo",
      newNode: "Nodo nuevo (pendiente)",
      relinking: "Reenlace",
      breaking: "Ruptura",
      idleLink: "Enlace inactivo",
    },
    stack: {
      active: "Cima / Activo",
      incoming: "Apilar / Entrante",
      delete: "Desapilar / Error",
    },
  },
  quickSort: {
    pivotStrategy: "Estrategia de pivote",
    pivot: {
      first: "Primero",
      firstDescription: "Sesga a O(n²) con datos preordenados",
      middle: "Medio",
      middleDescription: "Particiones equilibradas con entrada ordenada",
      last: "Último",
      lastDescription: "Sesga con datos en orden inverso",
      random: "Aleatorio",
      randomDescription: "Evita O(n²) con datos preordenados",
    },
  },
  visualizer: {
    array: {
      memoryBlockTitle: "Bloque de memoria contigua",
      capacityHint_one:
        "Capacidad: {{count}} ranura — los índices son direcciones fijas en el bloque",
      capacityHint_other:
        "Capacidad: {{count}} ranuras — los índices son direcciones fijas en el bloque",
    },
    stack: {
      topBadge: "CIMA",
      capacitySummary: "PILA · {{size}} / {{max}} elementos",
      ariaLabel: "Pila con {{size}} de {{max}} elementos",
    },
    linkedList: {
      singlyTitle: "Nodos enlazados simples (valor + next)",
      doublyTitle: "Nodos enlazados dobles (prev + valor + next)",
      circularTitle: "Lista circular (cola → cabeza)",
      circularBackEdgeHint:
        "El arco ortogonal exterior reconecta cola.next de vuelta a cabeza",
      nodeHead: "cabeza",
      nodeTail: "cola",
      nodeNew: "NUEVO",
      portNull: "null",
      portPrev: "prev",
      portNext: "next",
    },
  },
} as const;
