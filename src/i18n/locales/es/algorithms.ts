export const algorithms = {
  binarySearch: {
    notFound: {
      statusTitle: "Objetivo {{target}} no encontrado en el array",
      statusDetail: "El elemento no existe en este array ordenado.",
      stepExplanation:
        "El espacio de búsqueda está vacío. Ningún elemento coincide con el objetivo.",
    },
    initial: {
      statusTitle: "Inicializando rango de búsqueda",
      statusDetail: "low = {{low}}, high = {{high}}",
      stepExplanation:
        "Establece low en el primer índice y high en el último índice del array.",
    },
    calculateMid: {
      statusTitle: "Calcular mid",
      statusDetail: "mid = ({{low}} + {{high}}) // 2 = {{mid}}",
      stepExplanation:
        "Calcula el índice medio para dividir el espacio de búsqueda en dos.",
      stepFormula: "mid = ({{low}} + {{high}}) // 2 = {{mid}}",
    },
    compare: {
      statusTitle: "{{arrayValue}} == {{target}}?",
      statusDetail: {
        equal: "¡Sí! {{arrayValue}} es igual a {{target}}.",
        less: "No. {{arrayValue}} es menor que {{target}}.",
        greater: "No. {{arrayValue}} es mayor que {{target}}.",
      },
      stepExplanation: "Compara el elemento del medio con el valor objetivo.",
    },
    found: {
      statusTitle: "{{arrayValue}} == {{target}}?",
      statusDetail: "Se encontró {{target}} en el índice {{mid}}.",
      pointerMovement: "Objetivo confirmado en el índice {{mid}}.",
      stepExplanation:
        "El elemento del medio coincide con el objetivo. Búsqueda completada.",
      stepFormula: "return {{mid}}",
    },
    moveLowPointer: {
      statusTitle: "Mover puntero low",
      statusDetail:
        "Descarta la mitad izquierda. La búsqueda continúa desde el índice {{low}} hasta {{high}}.",
      pointerMovement:
        "low se mueve del índice {{previousLow}} al índice {{low}}.",
      stepExplanation:
        "El valor del medio es menor que el objetivo, así que busca en la mitad derecha.",
    },
    moveHighPointer: {
      statusTitle: "Mover puntero high",
      statusDetail:
        "Descarta la mitad derecha. La búsqueda continúa desde el índice {{low}} hasta {{high}}.",
      pointerMovement:
        "high se mueve del índice {{previousHigh}} al índice {{high}}.",
      stepExplanation:
        "El valor del medio es mayor que el objetivo, así que busca en la mitad izquierda.",
    },
  },
  selectionSort: {
    complete: {
      statusTitle: "Ordenación completada",
      statusDetail: "El array está completamente ordenado en orden ascendente.",
      stepExplanation: "¡Array completamente ordenado!",
    },
    init: {
      statusTitle: "Inicializando",
      statusDetail:
        "Array sin ordenar de {{n}} elementos. Frontera ordenada en el índice 0.",
      stepExplanation:
        "Inicialización: ningún elemento está fijado en su posición final todavía.",
    },
    startPass: {
      statusTitle: "Iniciando pasada {{pass}}",
      statusDetail: "Mínimo inicial: {{value}} en el índice {{index}}.",
      stepExplanation:
        "Iniciando pasada {{pass}}: busca el mínimo desde el índice {{index}}. Establece minIdx = {{index}} (valor {{value}}).",
    },
    comparing: {
      statusTitle: "Comparando {{current}} y {{minimum}}",
      statusDetail: {
        less:
          "{{current}} < {{minimum}}. Se encontró un valor menor en el índice {{comparingIdx}}.",
        greater:
          "{{current}} > {{minimum}}. El mínimo actual sigue siendo {{minimum}} en el índice {{minIdx}}.",
        equal:
          "{{current}} == {{minimum}}. El mínimo actual sigue siendo {{minimum}} en el índice {{minIdx}}.",
      },
      stepExplanation: {
        less:
          "Escaneando índice {{j}} (valor: {{current}}). El valor {{current}} es menor que el mínimo actual {{minimum}}.",
        notLess:
          "Escaneando índice {{j}} (valor: {{current}}). El valor {{current}} no es menor que el mínimo actual {{minimum}}. minIdx permanece en {{minIdx}}.",
      },
    },
    newMinimum: {
      statusTitle: "Nuevo mínimo encontrado",
      statusDetail:
        "{{current}} < {{previousMinimum}}. Mínimo actual actualizado a {{current}} en el índice {{j}}.",
      stepExplanation:
        "Nuevo mínimo encontrado en el índice {{j}} (valor: {{current}}). minIdx se actualiza a {{j}}.",
    },
    placingMinimum: {
      statusTitle: "Colocando el mínimo",
      statusDetail:
        "Intercambiando {{minimumValue}} con {{valueAtOuterIndex}} para fijar la posición [{{i}}].",
      stepExplanation:
        "Intercambiando índice {{i}} (valor {{valueAtOuterIndex}}) e índice mínimo {{minIdx}} (valor {{minimumValue}}). Coloca {{minimumValue}} en el índice {{i}}.",
    },
    passComplete: {
      statusTitle: "Pasada {{pass}} completada",
      statusDetail: {
        swap:
          "Posición [{{i}}] fijada con {{sortedValue}}. Los índices 0..{{i}} están ordenados.",
        noSwap:
          "{{sortedValue}} ya estaba en el índice {{i}}. Los índices 0..{{i}} están ordenados.",
      },
      stepExplanation: {
        swap:
          "Intercambio completado. El subarray [0..{{i}}] está ordenado. Los índices 0 a {{i}} contienen ahora los {{count}} elementos más pequeños en orden.",
        noSwap:
          "El mínimo ya estaba en el índice {{i}}. El subarray [0..{{i}}] está ordenado.",
      },
    },
  },
  insertionSort: {
    complete: {
      statusTitle: "Ordenación completada",
      statusDetail: "El array está completamente ordenado en orden ascendente.",
      stepExplanation: "¡Array completamente ordenado!",
    },
    init: {
      statusTitle: "Inicializando",
      statusDetail:
        "Array de {{n}} elementos. El índice 0 es la partición ordenada inicial.",
      stepExplanation:
        "Inicialización: la partición izquierda [0] está ordenada. La partición sin ordenar comienza en el índice 1.",
    },
    selectKey: {
      statusTitle: "Seleccionando clave {{key}}",
      statusDetail:
        "Clave {{key}} en el índice {{i}}. Partición ordenada: índices 0..{{lastSorted}}.",
      stepExplanation:
        "Pasada {{i}}: selecciona la clave {{key}} en el índice {{i}} e insértala en la partición ordenada de la izquierda.",
    },
    comparing: {
      statusTitle: "Comparando {{compareValue}} con la clave {{key}}",
      statusDetail: {
        shift:
          "{{compareValue}} > {{key}}. Desplaza {{compareValue}} una posición a la derecha.",
        stop:
          "{{compareValue}} <= {{key}}. Detén el desplazamiento e inserta la clave en el índice {{insertIndex}}.",
      },
      stepExplanation: {
        shift:
          "Compara la clave {{key}} con {{compareValue}} en el índice {{j}}. {{compareValue}} es mayor, así que se desplazará a la derecha.",
        stop:
          "Compara la clave {{key}} con {{compareValue}} en el índice {{j}}. {{compareValue}} no es mayor, así que la clave pertenece al índice {{insertIndex}}.",
      },
    },
    shifting: {
      statusTitle: "Desplazando {{compareValue}} a la derecha",
      statusDetail:
        "Mueve {{compareValue}} del índice {{j}} al índice {{jPlusOne}}.",
      stepExplanation:
        "Desplaza {{compareValue}} del índice {{j}} al índice {{jPlusOne}} para hacer espacio a la clave {{key}}.",
    },
    inserting: {
      statusTitle: "Insertando clave {{key}}",
      statusDetail: "Coloca la clave {{key}} en el índice {{targetIndex}}.",
      stepExplanation: "Inserta la clave {{key}} en el índice {{targetIndex}}.",
    },
    passComplete: {
      statusTitle: "Pasada {{i}} completada",
      statusDetail:
        "Los índices 0..{{i}} están ordenados. La partición sin ordenar comienza en el índice {{nextIndex}}.",
      stepExplanation:
        "Pasada {{i}} completada. La partición ordenada cubre ahora los índices 0 a {{i}}.",
    },
  },
  quickSort: {
    complete: {
      statusTitle: "Ordenación completada",
      statusDetail: "El array está completamente ordenado en orden ascendente.",
      stepExplanation: "Todas las particiones resueltas. El array está completamente ordenado.",
    },
    singleElement: {
      statusTitle: "Ordenación completada",
      statusDetail: "Un array de un elemento ya está ordenado.",
      stepExplanation: "Caso base: los arrays con un elemento ya están ordenados.",
    },
    init: {
      statusTitle: "Inicializando",
      statusDetail:
        "Array de {{n}} elementos. Quicksort particionará de forma recursiva usando la estrategia de pivote {{strategy}}.",
      first:
        "Inicializa quicksort con pivotes del primer elemento en un array de {{size}} elementos. Observa cómo la recursión se profundiza en entrada ya ordenada.",
      last:
        "Inicializa quicksort con pivotes del último elemento en un array de {{size}} elementos. Las particiones pueden sesgarse en entrada ordenada en reversa.",
      middle:
        "Inicializa quicksort con pivotes del medio en un array de {{size}} elementos. Espera particiones relativamente equilibradas.",
      random:
        "Inicializa quicksort aleatorizado en un array de {{size}} elementos. Cada partición elige un pivote aleatorio dentro del subarray activo.",
    },
    pivot: {
      first: {
        statusTitle: "Elegir pivote del primero",
        statusDetail:
          "Subarray {{range}}. El índice {{pivotPick}} (primer elemento) selecciona el pivote {{pivotValue}}.",
        stepExplanation:
          "El pivote del primer elemento siempre usa el índice {{low}}. En datos ya ordenados esto crea particiones máximamente desequilibradas y profundidad de recursión O(n²).",
      },
      last: {
        statusTitle: "Elegir pivote del último",
        statusDetail:
          "Subarray {{range}}. El índice {{pivotPick}} (último elemento) selecciona el pivote {{pivotValue}}.",
        stepExplanation:
          "El pivote del último elemento siempre usa el índice {{high}}. En datos ordenados en reversa esto sesga las particiones y puede degradarse a O(n²).",
      },
      middle: {
        statusTitle: "Elegir pivote del medio",
        statusDetail:
          "Subarray {{range}}. El índice medio {{pivotPick}} selecciona el pivote {{pivotValue}}.",
        stepExplanation:
          "El pivote del medio en el índice {{pivotPick}} tiende a dividir {{range}} por la mitad en entrada ordenada o uniforme, manteniendo la profundidad media cerca de O(log n).",
      },
      random: {
        statusTitle: "Elegir pivote aleatorio",
        statusDetail:
          "Subarray {{range}}. El índice aleatorio {{pivotPick}} selecciona el pivote {{pivotValue}}.",
        stepExplanation:
          "Un pivote aleatorio en {{range}} (aquí: índice {{pivotPick}}) hace improbables los cortes muy desequilibrados en promedio, preservando un tiempo esperado de O(n log n).",
      },
    },
    movePivotToEnd: {
      statusTitle: "Mover pivote al final",
      statusDetail:
        "Intercambia el índice {{pivotPick}} con {{high}} para que el pivote quede en el límite de la partición.",
      stepExplanation:
        "Mueve el candidato a pivote al índice {{high}} antes de escanear el subarray.",
    },
    initPartition: {
      statusTitle: "Inicializar partición",
      statusDetail:
        "Pivote = {{pivotValue}} en el índice {{high}}. Establece i = {{i}}.",
      stepExplanation:
        "El valor del pivote es {{pivotValue}}. Inicializa i = {{i}} para marcar el final de la región \"menor o igual\".",
    },
    compare: {
      statusTitle: "Comparar índice {{j}}",
      statusDetail: {
        left:
          "{{currentValue}} <= {{pivotValue}}. El elemento pertenece al lado izquierdo del pivote.",
        right:
          "{{currentValue}} > {{pivotValue}}. El elemento permanece al lado derecho del pivote.",
      },
      stepExplanation: {
        left:
          "Escanea el índice j = {{j}} (valor {{currentValue}}). Es menor o igual que el pivote {{pivotValue}}, así que pertenece a la partición izquierda.",
        right:
          "Escanea el índice j = {{j}} (valor {{currentValue}}). Es mayor que el pivote {{pivotValue}}, así que i no avanza.",
      },
    },
    swapIntoLeft: {
      statusTitle: "Intercambiar a la partición izquierda",
      statusDetail: "Incrementa i a {{i}}, luego intercambia el índice {{i}} con {{j}}.",
      stepExplanation:
        "Avanza i a {{i}} e intercambia arr[{{i}}] con arr[{{j}}] para ampliar la partición izquierda.",
    },
    advanceBoundary: {
      statusTitle: "Avanzar límite de partición",
      statusDetail:
        "Incrementa i a {{i}}. El índice {{j}} ya está en la partición izquierda.",
      stepExplanation: "i avanza a {{i}}. No se necesita intercambio porque j ya es igual a i.",
    },
    placePivot: {
      statusTitle: "Colocar pivote",
      statusDetail:
        "Intercambia el pivote en el índice {{high}} con el índice {{pivotIndex}}. El pivote queda fijado en su posición final.",
      stepExplanation:
        "Intercambia arr[{{pivotIndex}}] con arr[{{high}}] para que el pivote quede en su índice ordenado {{pivotIndex}}.",
    },
    partitionComplete: {
      statusTitle: "Partición completada",
      statusDetail:
        "El pivote {{pivotValue}} queda fijado en el índice {{pivotIndex}}. Recurre en [{{low}}..{{leftHigh}}] y [{{rightLow}}..{{high}}].",
      stepExplanation:
        "Partición completada. El índice {{pivotIndex}} está en su posición final ordenada. Los elementos a su izquierda son <= pivote; los de la derecha son > pivote.",
    },
    baseCase: {
      statusTitle: "Caso base",
      statusDetail: "El elemento único en el índice {{low}} ya está ordenado.",
      stepExplanation:
        "Caso base recursivo: un subarray de un elemento no requiere más particiones.",
    },
    recursiveCall: {
      statusTitle: "Llamada recursiva",
      statusDetail:
        "Ordena el subarray [{{low}}..{{high}}] ({{count}} elementos).",
      stepExplanation:
        "Divide: se llama a quicksort sobre los índices {{low}} a {{high}}.",
    },
    recurseLeft: {
      statusTitle: "Recursión izquierda",
      statusDetail:
        "La partición izquierda [{{low}}..{{high}}] contiene elementos <= pivote.",
      stepExplanation:
        "Conquista izquierda: ordena recursivamente los índices {{low}} a {{high}}.",
    },
    recurseRight: {
      statusTitle: "Recursión derecha",
      statusDetail:
        "La partición derecha [{{low}}..{{high}}] contiene elementos > pivote.",
      stepExplanation:
        "Conquista derecha: ordena recursivamente los índices {{low}} a {{high}}.",
    },
  },
  arrayOperations: {
    operations: {
      access: "Acceso por índice",
      "linear-search": "Búsqueda lineal",
      "insert-start": "Insertar al inicio",
      "insert-middle": "Insertar en el medio",
      "insert-end": "Insertar al final",
      "delete-start": "Eliminar al inicio",
      "delete-middle": "Eliminar en el medio",
      "delete-end": "Eliminar al final",
    },
    access: {
      empty: {
        statusTitle: "Array vacío",
        statusDetail: "No hay elementos a los que acceder.",
        stepExplanation: "El acceso por índice requiere al menos un elemento almacenado.",
      },
      intro: {
        statusTitle: "Acceso directo por índice",
        statusDetail: "Solicitando elemento en el índice {{index}}.",
        stepExplanation:
          "Los arrays almacenan elementos en memoria contigua. La CPU salta directamente a base + índice.",
      },
      read: {
        statusTitle: "arr[{{index}}] = {{value}}",
        statusDetail: "Tiempo O(1) — no requiere escaneo ni desplazamiento.",
        pointerMovement: "Dirección de memoria = base + {{index}}",
        stepExplanation:
          "Leer arr[{{index}}] toma tiempo constante porque el desplazamiento se calcula en un paso.",
      },
      complete: {
        statusTitle: "Acceso completado",
        statusDetail: "Valor {{value}} obtenido del índice {{index}}.",
        stepExplanation:
          "El acceso por índice es la razón principal por la que los arrays son rápidos para búsquedas por posición.",
      },
    },
    linearSearch: {
      empty: {
        statusTitle: "Objetivo {{target}} no encontrado",
        statusDetail: "El array está vacío.",
        stepExplanation:
          "La búsqueda lineal comprueba cada índice hasta encontrar una coincidencia o llegar al final del array.",
      },
      intro: {
        statusTitle: "Comienza la búsqueda lineal",
        statusDetail: "Buscando el valor objetivo {{target}}.",
        stepExplanation:
          "A diferencia del acceso por índice, la búsqueda debe inspeccionar los elementos uno por uno de izquierda a derecha.",
      },
      compare: {
        statusTitle: "Comparar arr[{{index}}] con el objetivo",
        statusDetail: "arr[{{index}}] = {{value}}{{matchSuffix}}",
        matchSuffix: " — ¡coincidencia!",
        pointerMovement: "i = {{index}}",
        stepExplanation: {
          match: "Coincidencia encontrada en el índice {{index}}.",
          noMatch: "Aún no hay coincidencia. Avanza i al siguiente índice.",
        },
      },
      found: {
        statusTitle: "Objetivo encontrado en el índice {{index}}",
        statusDetail:
          "Se encontró {{target}} en el índice {{index}} tras {{comparisons}} comparación{{comparisonSuffix}}.",
        comparisonSuffix: "es",
        stepExplanation:
          "La búsqueda lineal es simple pero escala linealmente porque puede ser necesario revisar cada elemento.",
      },
      notFound: {
        statusTitle: "Objetivo {{target}} no encontrado",
        statusDetail: "Se inspeccionó cada índice.",
        stepExplanation:
          "Cuando el objetivo está ausente, la búsqueda lineal siempre visita los n elementos.",
      },
    },
    insert: {
      intro: {
        statusDetail: "Insertar {{value}} en el índice {{index}}.",
        stepExplanation: {
          end: "Añadir al final evita desplazar los elementos existentes.",
          middle:
            "Los elementos desde el índice {{index}} en adelante deben desplazarse un espacio a la derecha.",
        },
      },
      writeEnd: {
        statusTitle: "Insertado {{value}} en el índice {{index}}",
        statusDetail: "O(1) cuando el array tiene capacidad libre al final.",
        stepExplanation:
          "El nuevo valor se escribe directamente en la siguiente ranura contigua.",
      },
      completeEnd: {
        statusTitle: "Inserción completada",
        statusDetail: "La longitud del array es ahora {{length}}.",
        stepExplanation: "La inserción al final es rápida porque ningún elemento necesita moverse.",
      },
      shift: {
        statusTitle: "Desplazar elemento a la derecha",
        statusDetail:
          "Mueve arr[{{sourceIndex}}] ({{value}}) al índice {{targetIndex}}.",
        pointerMovement: "j = {{sourceIndex}}",
        stepExplanation:
          "Cada desplazamiento copia un valor una ranura a la derecha para liberar espacio en la posición de inserción.",
      },
      write: {
        statusTitle: "Escribir {{value}} en el índice {{index}}",
        statusDetail: "La ranura vacante queda ocupada.",
        stepExplanation:
          "Tras el desplazamiento, el nuevo valor se coloca en el índice objetivo.",
      },
      complete: {
        statusTitle: "Inserción completada",
        statusDetail: "La longitud del array es ahora {{length}}.",
        stepExplanation:
          "Insertar lejos del final cuesta O(n) porque hasta n elementos pueden tener que desplazarse.",
      },
    },
    delete: {
      empty: {
        statusTitle: "Nada que eliminar",
        statusDetail: "El array ya está vacío.",
        stepExplanation: "La eliminación requiere al menos un elemento.",
      },
      intro: {
        statusDetail: "Eliminar el valor {{value}} en el índice {{index}}.",
        stepExplanation: {
          end: "Eliminar el último elemento evita desplazamientos.",
          middle:
            "Los elementos a la derecha deben desplazarse un espacio a la izquierda para cerrar el hueco.",
        },
      },
      completeEnd: {
        statusTitle: "Eliminación completada",
        statusDetail: "La longitud del array es ahora {{length}}.",
        stepExplanation:
          "Eliminar el último elemento es O(1) porque no se requiere desplazamiento.",
      },
      shift: {
        statusTitle: "Desplazar elemento a la izquierda",
        statusDetail:
          "Mueve arr[{{sourceIndex}}] ({{value}}) al índice {{targetIndex}}.",
        pointerMovement: "j = {{sourceIndex}}",
        stepExplanation:
          "Cada desplazamiento a la izquierda cierra el hueco copiando el siguiente elemento una ranura a la izquierda.",
      },
      complete: {
        statusTitle: "Eliminación completada",
        statusDetail: "Eliminado {{value}}. La longitud es ahora {{length}}.",
        stepExplanation:
          "Eliminar lejos del final cuesta O(n) porque los elementos restantes deben desplazarse a la izquierda.",
      },
    },
  },
  stackOperations: {
    operations: {
      push: "Apilar",
      pop: "Desapilar",
      peek: "Consultar tope",
      clear: "Vaciar",
    },
    push: {
      intro: {
        statusTitle: "Apilar {{value}} en la pila",
        statusDetail: "Coloca el nuevo elemento encima de la pila actual.",
        stepExplanation:
          "Preparando apilar del valor {{value}}. Las pilas siempre insertan nuevos elementos en cima.",
      },
      overflow: {
        statusTitle: "¡Desbordamiento de pila!",
        statusDetail:
          "¡Desbordamiento de pila! Se alcanzó la capacidad máxima de {{maxCapacity}} elementos. Operación apilar rechazada.",
        stepExplanation:
          "Apilar rechazado en O(1): la pila acotada ya contiene {{maxCapacity}} elementos en capacidad máxima. No queda ranura por encima de cima para una nueva escritura.",
      },
      incoming: {
        statusTitle: "Elemento entrante",
        statusDetail: "Coloca {{value}} en cima.",
        stepMessage: "Valor entrante {{value}} colocado en cima.",
        stepExplanation:
          "Valor {{value}} insertado en el índice {{topIndex}}. El puntero superior avanza para rastrear el nuevo elemento más alto.",
      },
      complete: {
        statusTitle: "Apilar completado",
        statusDetail:
          "Apilar completado: elemento '{{value}}' añadido a cima. Pila actualizada en tiempo O(1) (índice cima: {{topIndex}}).",
        stepExplanation:
          "Apilar completado. Acceder o eliminar este elemento a continuación mantiene el orden LIFO.",
      },
    },
    pop: {
      intro: {
        statusTitle: "Desapilar del elemento superior",
        statusDetail: "Elimina y devuelve el valor insertado más recientemente.",
        stepExplanation: {
          withTop:
            "Preparando pop de la pila. La operación apunta al índice {{topIndex}} (el tope actual).",
          empty:
            "Preparando pop de la pila. La operación apunta al índice superior actual.",
        },
      },
      underflow: {
        statusTitle: "¡Subdesbordamiento de pila!",
        statusDetail:
          "¡Subdesbordamiento de pila! No se puede ejecutar pop o peek en una pila vacía.",
        stepExplanation:
          "Desapilar rechazado en O(1): la pila está vacía — no hay índice superior que eliminar.",
      },
      lift: {
        statusTitle: "Levantar elemento cima",
        statusDetail: "cima = {{value}}",
        stepMessage: "Resalta {{value}} antes de la eliminación.",
        stepExplanation: {
          withNewTop:
            "Apuntando al elemento cima {{value}} en el índice {{topIndex}} antes de ejecutar stack.pop(). Tras la eliminación, el puntero superior se moverá al índice {{newTopIndex}}.",
          emptyAfter:
            "Apuntando al elemento cima {{value}} en el índice {{topIndex}} antes de ejecutar stack.pop(). Tras la eliminación, la pila queda vacía.",
        },
      },
      complete: {
        statusTitle: "Desapilar completado",
        statusDetail:
          "Desapilar completado: elemento '{{value}}' eliminado de cima en tiempo O(1).",
        stepExplanation: {
          withNewTop:
            "Elemento {{value}} eliminado del tope. El puntero superior baja al índice {{newTopIndex}}. Desapilar se completa en O(1) sin desplazar los elementos restantes.",
          emptyAfter:
            "Elemento {{value}} eliminado del tope. La pila queda vacía. Desapilar se completa en O(1) sin desplazar los elementos restantes.",
        },
      },
    },
    peek: {
      intro: {
        statusTitle: "Consultar tope en cima",
        statusDetail: "Inspecciona el elemento superior sin eliminarlo.",
        stepExplanation: {
          withTop:
            "Leyendo el elemento superior en el índice {{topIndex}} (valor: {{value}}). Consultar tope inspecciona el tope sin modificar la pila.",
          empty: "Preparando peek del elemento superior sin modificar la pila.",
        },
      },
      underflow: {
        statusTitle: "¡Subdesbordamiento de pila!",
        statusDetail:
          "¡Subdesbordamiento de pila! No se puede ejecutar pop o peek en una pila vacía.",
        stepExplanation:
          "Consultar tope rechazado en O(1): la pila está vacía — no hay índice superior que leer.",
      },
      read: {
        statusTitle: "Leer cima",
        statusDetail: "cima = {{value}}",
        stepMessage: "Observa {{value}} — el tamaño de la pila no cambia.",
        stepExplanation:
          "Leyendo el elemento superior en el índice {{topIndex}} (valor: {{value}}). Consultar tope inspecciona el tope sin modificar la pila.",
      },
      complete: {
        statusTitle: "Consultar tope completado",
        statusDetail: "Valor {{value}} en cima. Tamaño sigue siendo {{size}}.",
        stepMessage: "No se eliminó ningún elemento.",
        stepExplanation:
          "Consultar tope completado. El tamaño de la pila y el orden LIFO no cambian — solo se inspeccionó el valor superior.",
      },
    },
    clear: {
      intro: {
        statusTitle: "Limpiar la pila",
        statusDetail: "Elimina cada elemento hasta que la estructura quede vacía.",
        stepExplanation: {
          withElements:
            "Preparando limpieza de la pila. Se descartarán {{count}} elemento(s) almacenado(s) desde cima hasta la base.",
          empty: "Preparando limpieza de la pila. No hay elementos almacenados actualmente.",
        },
      },
      alreadyEmpty: {
        statusTitle: "Ya está vacía",
        statusDetail: "Nada que eliminar.",
        stepMessage: "Limpiar una pila vacía no tiene efecto.",
        stepExplanation:
          "Limpiar una pila vacía se completa en O(1) — no hay elementos que eliminar.",
      },
      discard: {
        statusTitle: "Descartar todos los elementos",
        statusDetail: "Eliminando {{count}} elemento(s).",
        stepMessage: "Cada ranura desde cima hasta la base queda vacía.",
        stepExplanation:
          "Liberando secuencialmente los {{count}} elementos de la memoria (O(n)).",
      },
      complete: {
        statusTitle: "Pila limpiada",
        statusDetail: "Pila limpiada: todos los elementos eliminados en tiempo O(n).",
        stepExplanation:
          "Limpieza completada. Cada ranura quedó vacía en tiempo O(n) — apilar puede reanudarse desde una pila vacía en O(1).",
      },
    },
  },
  linkedListOperations: {
    operations: {
      "insert-at-head": "Insertar al inicio",
      "insert-at-tail": "Insertar al final",
      "insert-at-index": "Insertar en índice",
      "delete-head": "Eliminar cabeza",
      "delete-tail": "Eliminar cola",
      "delete-value": "Eliminar por valor",
      search: "Búsqueda",
      reverse: "Invertir",
    },
    insertAtHead: {
      intro: {
        statusDetail: "Insertar {{value}} antes de la cabeza actual.",
        stepExplanation:
          "Crear un nuevo nodo y apuntarlo a la antigua cabeza toma tiempo O(1).",
      },
      allocate: {
        statusTitle: "Asignar nuevo nodo",
        statusDetail: "Nodo node({{value}}) creado en memoria.",
        stepMessage:
          "El nuevo nodo ({{value}}) queda en línea antes de la cabeza actual — aún sin enlazar.",
        stepExplanation:
          "La asignación del nodo es O(1). Los punteros se asignan en el siguiente paso.",
      },
      link: {
        statusTitle: "Enlazar nuevo nodo",
        statusDetail: "node.next = formerHead",
        stepMessage: "Conectar {{value}} → {{formerHeadValue}}.",
        stepExplanation:
          "El nuevo nodo apunta a la cabeza anterior. El puntero head se actualiza a continuación.",
      },
      complete: {
        statusTitle: "Actualizar puntero head",
        statusDetail: "Puntero head actualizado. Operación finalizada en O(1).",
        stepMessage: "{{value}} es ahora la cabeza de la lista.",
        stepExplanation:
          "La inserción en la cabeza es de tiempo constante para las tres variantes de lista.",
      },
    },
    insertAtTail: {
      intro: {
        statusDetail: "Añadir {{value}} después de la cola actual.",
        stepExplanation: {
          circular:
            "El puntero tail da acceso O(1) — añade y luego reconecta tail.next a head.",
          default:
            "Un puntero tail explícito hace el append O(1) sin recorrer desde head.",
        },
      },
      allocate: {
        statusTitle: "Asignar nuevo nodo",
        statusDetail: "Nodo node({{value}}) creado en memoria.",
        stepMessage:
          "El nuevo nodo ({{value}}) queda en línea a la derecha de tail — aún sin enlazar.",
        stepExplanation:
          "La asignación del nodo es O(1). El puntero tail apunta directamente al último nodo actual.",
      },
      link: {
        statusTitle: "Enlazar nuevo nodo",
        statusDetail: "tail.next = newNode",
        stepMessage: "Conectar {{tailValue}} → {{value}}.",
        stepExplanation:
          "Solo cambia el puntero next de tail — sigue siendo O(1), sin recorrido.",
      },
      complete: {
        statusTitle: "Actualizar puntero tail",
        statusDetail: "El puntero tail ahora referencia el nuevo último nodo.",
        stepMessage: {
          circular: "{{value}} es el nuevo tail — next se reconecta a head.",
          default: "{{value}} es el nuevo tail — next es null.",
        },
        stepExplanation: {
          circular:
            "Las listas circulares establecen newTail.next = head tras avanzar el puntero tail.",
          default: "null en el puerto next del nuevo tail marca el final de la lista.",
        },
      },
    },
    insertAtIndex: {
      intro: {
        statusDetail: "Insertar {{value}} en el índice {{index}}.",
        stepExplanation:
          "Recorre hasta el nodo anterior al punto de inserción, luego reenlaza los punteros.",
      },
      traverse: {
        statusTitle: "Recorrer hasta el índice {{index}}",
        statusDetail: "curr en el nodo con valor {{value}}.",
      },
      reachPredecessor: {
        statusTitle: "Alcanzar predecesor en el índice {{index}}",
        statusDetail: "curr en el nodo con valor {{value}}.",
      },
      traverseMessage:
        "Avanza hasta encontrar el hueco de inserción.",
      traverseExplanation:
        "La inserción en el índice i requiere i saltos de puntero desde head.",
      splice: {
        statusTitle: "Empalmar nuevo nodo",
        statusDetail: "prev.next = newNode; newNode.next = next",
        stepMessage:
          "Insertado {{value}} entre {{prevValue}} y el sucesor.",
        stepExplanation:
          "Dos o tres actualizaciones de punteros empalman el nodo en O(1) tras el recorrido.",
      },
      complete: {
        statusTitle: "Inserción completada",
        statusDetail: "El valor {{value}} queda ahora en el índice {{index}}.",
        stepMessage: "Inserción intermedia finalizada.",
        stepExplanation:
          "El tiempo total es O(n) debido al recorrido hasta el índice.",
      },
    },
    deleteHead: {
      empty: {
        statusTitle: "La lista está vacía",
        statusDetail: "Nada que eliminar.",
        stepMessage: "La eliminación de la cabeza requiere al menos un nodo.",
        stepExplanation: "La eliminación de la cabeza requiere al menos un nodo.",
      },
      intro: {
        statusDetail: "Eliminar nodo cabeza ({{value}}).",
        stepExplanation:
          "Avanza head a head.next y descarta el nodo antiguo.",
      },
      unlink: {
        statusTitle: "Desenlazar cabeza",
        statusDetail: {
          circularSingle:
            "Rompe el bucle propio — head y tail pasan a null.",
          default: "head = head.next",
        },
        stepMessage: {
          circularSingle: "Rompiendo el autoenlace circular en {{value}}.",
          default: "Rompiendo el enlace de {{value}} al sucesor.",
        },
        stepExplanation: {
          circularSingle:
            "Una lista circular de un nodo limpia head y tail cuando se rompe el bucle.",
          circular:
            "Avanza head primero, luego reconecta tail.next al nuevo head.",
          default: "La eliminación de la cabeza es O(1) una vez leído el puntero next.",
        },
      },
      relinkTail: {
        statusTitle: "Reenlazar tail → head",
        statusDetail:
          "tail.next debe apuntar al nuevo head en una lista circular.",
        stepMessage:
          "Apuntar tail ({{tailValue}}) al nuevo head ({{headValue}}).",
        stepExplanation:
          "Sin esta actualización, tail.next seguiría referenciando el nodo head eliminado.",
      },
      complete: {
        statusTitle: "Eliminación completada",
        statusDetail: {
          circularSingle: "Eliminado {{value}}. La lista queda vacía.",
          default: "Eliminado {{value}}. Head avanzó en O(1).",
        },
        stepMessage: {
          circularSingle: "Head y tail son null — lista circular vaciada.",
          circular: "Head avanzó y tail.next apunta al nuevo head.",
          doubly: "El nuevo head tiene prev null — enlace forward intacto.",
          default: "Head avanzó al siguiente nodo.",
        },
        stepExplanation: {
          circularSingle:
            "Las listas circulares de un solo nodo requieren limpiar ambos puntos de entrada.",
          circular:
            "tail.next debe seguir al puntero head tras cada eliminación de cabeza.",
          doubly:
            "Las listas dobles también limpian el puntero prev del nuevo head a null.",
          default: "Solo actualizaciones de punteros — no se requiere recorrido.",
        },
      },
    },
    deleteTail: {
      doublyIntro: {
        statusDetail: "Elimina el último nodo usando tail.prev — O(1).",
        stepExplanation:
          "Las listas doblemente enlazadas exponen el predecesor directamente desde el nodo tail.",
      },
      singlyIntro: {
        statusDetail: {
          circular: "Elimina el último nodo en la cadena circular.",
          default: "Elimina el último nodo en la cadena.",
        },
        stepExplanation:
          "Las listas simplemente enlazadas deben recorrer desde head hasta el penúltimo nodo — tiempo O(n).",
      },
      accessTail: {
        statusTitle: "Acceder a tail y predecesor",
        statusDetail: "tail.prev apunta a {{value}}.",
        stepMessage:
          "No se necesita recorrido — salta a tail y sigue prev en O(1).",
        stepExplanation:
          "No se necesita recorrido — salta a tail y sigue prev en O(1).",
      },
      walk: {
        statusTitle: "Recorrer desde head",
        statusDetail: "curr en el nodo {{value}}.",
        stepExplanation:
          "Cada salto cuesta O(1), pero encontrar el penúltimo nodo requiere O(n) saltos.",
      },
      penultimate: {
        statusTitle: "Penúltimo nodo alcanzado",
        statusDetail: "El nodo {{value}} está antes de tail.",
        stepMessage: "Detente aquí — este es el nodo cuyo puntero next debe actualizarse.",
        stepExplanation:
          "Las listas simples no pueden eliminar tail en O(1) sin puntero tail y enlaces hacia atrás.",
      },
      walkMessage: "Avanza curr hacia tail un nodo a la vez.",
      breakLink: {
        statusTitle: "Romper enlace de tail",
        statusDetail: {
          doubly: "Establece penultimate.next = null.",
          circular: "Establece penultimate.next = head.",
          default: "Establece penultimate.next = null.",
        },
        stepMessage: {
          doubly: "Desenlazar {{tailValue}} — penultimate.next pasa a null.",
          circular:
            "Desenlazar {{tailValue}} — penultimate.next apunta a head.",
          default: "Desenlazar {{tailValue}} — penultimate.next pasa a null.",
        },
        stepExplanation: {
          circular:
            "Las listas circulares simples reconectan el penúltimo nodo a head en lugar de null.",
          default:
            "El último nodo se elimina cuando el puntero next de su predecesor pasa a null.",
        },
      },
      complete: {
        statusTitle: "Eliminación completada",
        statusDetail: {
          doubly: "Tail eliminado en tiempo O(1).",
          default: "Tail eliminado y predecesor reenlazado.",
        },
        stepMessage: {
          doubly: "penultimate.next es null — nodo tail liberado.",
          circular: "El penúltimo ahora apunta a head — nodo tail liberado.",
          default: "penultimate.next es null — nodo tail liberado.",
        },
        stepExplanation: {
          doubly:
            "La eliminación de tail en listas dobles evita el recorrido O(n) requerido en listas simples.",
          circular:
            "Las listas circulares reconectan el penúltimo nodo a head.",
          default:
            "null en el puerto next del penúltimo marca la nueva terminación de la lista.",
        },
      },
    },
    deleteValue: {
      intro: {
        statusDetail: "Elimina el primer nodo con valor {{target}}.",
        stepExplanation:
          "Recorre mientras rastreas prev para empalmar y extraer el nodo coincidente.",
      },
      empty: {
        statusTitle: "Valor no encontrado",
        statusDetail: "Lista vacía.",
        stepMessage: "No se puede eliminar {{target}} de una lista vacía.",
        stepExplanation: "La búsqueda y eliminación requieren al menos un nodo.",
      },
      scanning: {
        statusTitle: "Escaneando nodos",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Avanza curr (y prev) hasta que aparezca el objetivo.",
        stepExplanation:
          "La eliminación por valor requiere búsqueda O(n) en el peor caso.",
      },
      match: {
        statusTitle: "Coincidencia encontrada",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Empalmar y extraer el nodo con valor {{target}}.",
        stepExplanation: "Reconecta prev.next para saltar el nodo eliminado.",
      },
      complete: {
        statusTitle: "Eliminación completada",
        statusDetail: "Eliminada la primera ocurrencia de {{target}}.",
        stepMessage: "Punteros reenlazados alrededor del nodo eliminado.",
        stepExplanation: "El tiempo es O(n) por la búsqueda más O(1) por el empalme.",
      },
      notFound: {
        statusTitle: "Valor no encontrado",
        statusDetail: "Ningún nodo almacena {{target}}.",
        stepMessage: "Recorrido finalizado sin coincidencia.",
        stepExplanation: "Se inspeccionó cada nodo — objetivo ausente.",
      },
    },
    search: {
      intro: {
        statusDetail: "Buscar el valor {{target}}.",
        stepExplanation:
          "Recorre nodo a nodo — no hay acceso aleatorio por índice.",
      },
      compare: {
        statusTitle: "Comparar en el nodo {{index}}",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Avanza curr a lo largo de los punteros next.",
        stepExplanation: "Escaneo lineal — peor caso O(n).",
      },
      found: {
        statusTitle: "Objetivo encontrado",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Coincidencia en el índice de nodo {{index}}.",
        stepExplanation: "La búsqueda se detiene en el primer nodo coincidente.",
      },
      notFound: {
        statusTitle: "Objetivo no encontrado",
        statusDetail: "{{target}} no está en la lista.",
        stepMessage: "Se visitó cada nodo.",
        stepExplanation: "El coste de búsqueda es O(n) cuando el valor está ausente.",
      },
    },
    reverse: {
      intro: {
        statusDetail: {
          trivial: "Invierte la dirección del puntero de cada nodo.",
          default: "Invierte la lista enlazada en el lugar.",
        },
        stepExplanation: {
          trivial: "Las listas con cero o un nodo ya están invertidas.",
          default:
            "Rastrea prev, curr y temp mientras inviertes cada puntero next un nodo a la vez.",
        },
      },
      trivialComplete: {
        statusTitle: "Nada que invertir",
        statusDetail: "Lista sin cambios.",
        stepMessage: "Inversión completada trivialmente.",
        stepExplanation: "Itera solo cuando existen al menos dos nodos.",
      },
      breakLink: {
        statusTitle: "Paso {{step}}: romper curr → next",
        statusDetail: {
          withPrev:
            "Desconecta {{value}} de su sucesor — next pasa a null.",
          head: "Desconecta head de su sucesor — next pasa a null.",
        },
        stepMessage:
          "curr en {{value}}. El enlace hacia adelante se corta antes de reenlazar a prev.",
        stepExplanation:
          "Un null explícito marca la terminación mientras se rompe el enlace hacia adelante anterior.",
      },
      relink: {
        statusTitle: "Paso {{step}}: reenlazar {{value}} hacia atrás",
        statusDetail: {
          withPrev:
            "curr.next apunta ahora a {{prevValue}}.",
          head: "Head apunta ahora a null — el antiguo primer enlace quedó invertido.",
        },
        stepMessage: "Enlace hacia adelante eliminado; enlace hacia atrás establecido.",
        stepExplanation:
          "Avanza prev ← curr y curr ← temp tras cada inversión.",
      },
      complete: {
        statusTitle: "Inversión completada",
        statusDetail: {
          circular:
            "Orden visual invertido — head → sucesor y tail → head restaurados.",
          default: "Orden visual invertido — nuevo head al inicio.",
        },
        stepMessage: {
          circular:
            "Cada nodo enlaza hacia adelante; tail cierra el bucle de vuelta a head.",
          default:
            "Los nodos se reordenan de izquierda a derecha según la cadena de punteros invertida.",
        },
        stepExplanation: {
          circular:
            "Las listas circulares nunca terminan en null — tail.next debe apuntar al nuevo head.",
          default:
            "La antigua cola pasa a ser head; la cuadrícula refleja ahora el orden natural de recorrido.",
        },
      },
    },
  },
} as const;
