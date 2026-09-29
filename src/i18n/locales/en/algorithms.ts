export const algorithms = {
  binarySearch: {
    notFound: {
      statusTitle: "Target {{target}} not found in the array",
      statusDetail: "The element does not exist in this sorted array.",
      stepExplanation:
        "The search space is empty. No element matches the target.",
    },
    initial: {
      statusTitle: "Initializing search range",
      statusDetail: "low = {{low}}, high = {{high}}",
      stepExplanation:
        "Set low to the first index and high to the last index of the array.",
    },
    calculateMid: {
      statusTitle: "Calculate mid",
      statusDetail: "mid = ({{low}} + {{high}}) // 2 = {{mid}}",
      stepExplanation:
        "Calculate the middle index to divide the search space in half.",
      stepFormula: "mid = ({{low}} + {{high}}) // 2 = {{mid}}",
    },
    compare: {
      statusTitle: "{{arrayValue}} == {{target}}?",
      statusDetail: {
        equal: "Yes! {{arrayValue}} equals {{target}}.",
        less: "No. {{arrayValue}} is less than {{target}}.",
        greater: "No. {{arrayValue}} is greater than {{target}}.",
      },
      stepExplanation: "Compare the middle element with the target value.",
    },
    found: {
      statusTitle: "{{arrayValue}} == {{target}}?",
      statusDetail: "Found {{target}} at index {{mid}}.",
      pointerMovement: "Target confirmed at index {{mid}}.",
      stepExplanation:
        "The middle element matches the target. Search complete.",
      stepFormula: "return {{mid}}",
    },
    moveLowPointer: {
      statusTitle: "Move low pointer",
      statusDetail:
        "Discard the left half. Search continues from index {{low}} to {{high}}.",
      pointerMovement:
        "low moves from index {{previousLow}} to index {{low}}.",
      stepExplanation:
        "The middle value is smaller than the target, so search the right half.",
    },
    moveHighPointer: {
      statusTitle: "Move high pointer",
      statusDetail:
        "Discard the right half. Search continues from index {{low}} to {{high}}.",
      pointerMovement:
        "high moves from index {{previousHigh}} to index {{high}}.",
      stepExplanation:
        "The middle value is larger than the target, so search the left half.",
    },
  },
  sequentialSearch: {
    intro: {
      statusTitle: "Search for target {{target}}",
      statusDetail:
        "Scan {{length}} elements from index 0 to {{length}} - 1 left to right.",
      stepExplanation:
        "Linear search checks each array slot in order until the target appears or the scan finishes.",
    },
    compare: {
      statusTitle: "Compare arr[{{index}}] with {{target}}",
      statusDetail: {
        match: "{{arrayValue}} equals {{target}}.",
        noMatch: "{{arrayValue}} is not equal to {{target}}. Move to the next index.",
      },
      stepExplanation:
        "At index {{index}}, compare arr[{{index}}] ({{arrayValue}}) with the target {{target}}.",
    },
    found: {
      statusTitle: "Found {{target}} at index {{index}}",
      statusDetail: "arr[{{index}}] = {{arrayValue}} matches the target.",
      pointerMovement: "Target located at index {{index}}.",
      stepExplanation:
        "A match at index {{index}} ends the search successfully.",
    },
    complete: {
      statusTitle: "Search complete",
      statusDetail: "Returned index {{index}} for target {{target}}.",
      stepExplanation:
        "Linear search finished: target {{target}} found at index {{index}}.",
    },
    notFound: {
      statusTitle: "Target {{target}} not found",
      statusDetail: "The value {{target}} is not in the array.",
      stepExplanation:
        "Every index was checked and none equals {{target}}. The search returns -1.",
    },
  },
  selectionSort: {
    complete: {
      statusTitle: "Sorting complete",
      statusDetail: "The array is fully sorted in ascending order.",
      stepExplanation: "Array completely sorted!",
    },
    init: {
      statusTitle: "Initializing",
      statusDetail:
        "{{n}}-element unsorted array. Sorted boundary at index 0.",
      stepExplanation:
        "Initialize: no elements are locked in their final position yet.",
    },
    startPass: {
      statusTitle: "Starting pass {{pass}}",
      statusDetail: "Initial minimum: {{value}} at index {{index}}.",
      stepExplanation:
        "Starting pass {{pass}}: search for the minimum from index {{index}}. Set minIdx = {{index}} (value {{value}}).",
    },
    comparing: {
      statusTitle: "Comparing {{current}} and {{minimum}}",
      statusDetail: {
        less:
          "{{current}} < {{minimum}}. A smaller value was found at index {{comparingIdx}}.",
        greater:
          "{{current}} > {{minimum}}. The current minimum remains {{minimum}} at index {{minIdx}}.",
        equal:
          "{{current}} == {{minimum}}. The current minimum remains {{minimum}} at index {{minIdx}}.",
      },
      stepExplanation: {
        less:
          "Scanning index {{j}} (value: {{current}}). Value {{current}} is less than current minimum {{minimum}}.",
        notLess:
          "Scanning index {{j}} (value: {{current}}). Value {{current}} is not less than current minimum {{minimum}}. minIdx stays at {{minIdx}}.",
      },
    },
    newMinimum: {
      statusTitle: "New minimum found",
      statusDetail:
        "{{current}} < {{previousMinimum}}. Updated current minimum to {{current}} at index {{j}}.",
      stepExplanation:
        "New minimum found at index {{j}} (value: {{current}}). minIdx updates to {{j}}.",
    },
    placingMinimum: {
      statusTitle: "Placing minimum",
      statusDetail:
        "Swapping {{minimumValue}} with {{valueAtOuterIndex}} to fix position [{{i}}].",
      stepExplanation:
        "Swapping index {{i}} (value {{valueAtOuterIndex}}) and minimum index {{minIdx}} (value {{minimumValue}}). Place {{minimumValue}} at index {{i}}.",
    },
    passComplete: {
      statusTitle: "Pass {{pass}} complete",
      statusDetail: {
        swap:
          "Position [{{i}}] fixed with {{sortedValue}}. Indices 0..{{i}} are sorted.",
        noSwap:
          "{{sortedValue}} was already at index {{i}}. Indices 0..{{i}} are sorted.",
      },
      stepExplanation: {
        swap:
          "Swap complete. Sub-array [0..{{i}}] is sorted. Indices 0 through {{i}} now hold the {{count}} smallest elements in order.",
        noSwap:
          "Minimum was already at index {{i}}. Sub-array [0..{{i}}] is sorted.",
      },
    },
  },
  insertionSort: {
    complete: {
      statusTitle: "Sorting complete",
      statusDetail: "The array is fully sorted in ascending order.",
      stepExplanation: "Array completely sorted!",
    },
    init: {
      statusTitle: "Initializing",
      statusDetail:
        "{{n}}-element array. Index 0 is the initial sorted partition.",
      stepExplanation:
        "Initialize: the left partition [0] is sorted. The unsorted partition starts at index 1.",
    },
    selectKey: {
      statusTitle: "Selecting key {{key}}",
      statusDetail:
        "Key {{key}} at index {{i}}. Sorted partition: indices 0..{{lastSorted}}.",
      stepExplanation:
        "Pass {{i}}: select key {{key}} at index {{i}} and insert it into the sorted partition on the left.",
    },
    comparing: {
      statusTitle: "Comparing {{compareValue}} with key {{key}}",
      statusDetail: {
        shift: "{{compareValue}} > {{key}} at index {{j}}.",
        stop:
          "{{compareValue}} <= {{key}} at index {{j}}. Target index {{insertIndex}}.",
      },
      stepExplanation: {
        shift: "{{compareValue}} > {{key}} at index {{j}}.",
        stop:
          "{{compareValue}} <= {{key}} at index {{j}}. Target index {{insertIndex}}.",
      },
    },
    extractKey: {
      statusTitle: "Extracting key {{key}}",
      statusDetail:
        "Remove key {{key}} from index {{i}}. Destination after shifts: index {{targetIndex}}.",
      stepExplanation:
        "Phase 2 — extract key {{key}} from index {{i}}, leaving an empty slot before shifting elements right.",
    },
    shifting: {
      statusTitle: "Shifting {{compareValue}} to the right",
      statusDetail:
        "Phase 3 — move {{compareValue}} from index {{j}} to index {{jPlusOne}}.",
      stepExplanation:
        "Phase 3 — shift {{compareValue}} one slot right (from {{j}} to {{jPlusOne}}) to slide the hole left.",
    },
    inserting: {
      statusTitle: "Inserting key {{key}} at index {{targetIndex}}",
      statusDetail: "Phase 4 — place key {{key}} at index {{targetIndex}}.",
      stepExplanation:
        "Phase 4 — insert key {{key}} into the open slot at index {{targetIndex}}.",
    },
    insertingInPlace: {
      statusTitle: "Keeping key {{key}} at index {{i}}",
      statusDetail:
        "Key {{key}} is already greater than the elements to its left. It stays at index {{i}}.",
      stepExplanation:
        "No shifts were needed. Key {{key}} remains at index {{i}} in the sorted partition.",
    },
    passComplete: {
      statusTitle: "Pass {{i}} complete",
      statusDetail:
        "Indices 0..{{i}} are sorted. Unsorted partition starts at index {{nextIndex}}.",
      stepExplanation:
        "Pass {{i}} complete. Sorted partition now covers indices 0 through {{i}}.",
    },
  },
  quickSort: {
    complete: {
      statusTitle: "Sorting complete",
      statusDetail: "The array is fully sorted in ascending order.",
      stepExplanation: "All partitions resolved. The array is completely sorted.",
    },
    singleElement: {
      statusTitle: "Sorting complete",
      statusDetail: "Single-element array is already sorted.",
      stepExplanation: "Base case: arrays with one element are already sorted.",
    },
    init: {
      statusTitle: "Initializing",
      statusDetail:
        "{{n}}-element array. Quicksort will partition recursively using the {{strategy}} pivot strategy.",
      first:
        "Initialize quicksort with first-element pivots on a {{size}}-element array. Watch recursion deepen on sorted input.",
      last:
        "Initialize quicksort with last-element pivots on a {{size}}-element array. Partitions may skew on reverse-sorted input.",
      middle:
        "Initialize quicksort with middle pivots on a {{size}}-element array. Expect relatively balanced partitions.",
      random:
        "Initialize randomized quicksort on a {{size}}-element array. Each partition picks a random pivot within the active sub-array.",
    },
    pivot: {
      first: {
        statusTitle: "Choose first pivot",
        statusDetail:
          "Sub-array {{range}}. Index {{pivotPick}} (first element) selects pivot {{pivotValue}}.",
        stepExplanation:
          "First-element pivot always uses index {{low}}. On already sorted data this creates maximally unbalanced partitions and O(n²) recursion depth.",
      },
      last: {
        statusTitle: "Choose last pivot",
        statusDetail:
          "Sub-array {{range}}. Index {{pivotPick}} (last element) selects pivot {{pivotValue}}.",
        stepExplanation:
          "Last-element pivot always uses index {{high}}. On reverse-sorted data this skews partitions and can degrade to O(n²).",
      },
      middle: {
        statusTitle: "Choose middle pivot",
        statusDetail:
          "Sub-array {{range}}. Middle index {{pivotPick}} selects pivot {{pivotValue}}.",
        stepExplanation:
          "Middle pivot at index {{pivotPick}} tends to split {{range}} evenly on sorted or uniform input, keeping average depth near O(log n).",
      },
      random: {
        statusTitle: "Choose random pivot",
        statusDetail:
          "Sub-array {{range}}. Random index {{pivotPick}} selects pivot {{pivotValue}}.",
        stepExplanation:
          "Random pivot in {{range}} (here: index {{pivotPick}}) makes highly unbalanced splits unlikely on average, preserving expected O(n log n) time.",
      },
    },
    movePivotToEnd: {
      statusTitle: "Move pivot to end",
      statusDetail:
        "Swap index {{pivotPick}} with {{high}} so the pivot sits at the partition boundary.",
      stepExplanation:
        "Move the pivot candidate to index {{high}} before scanning the sub-array.",
    },
    initPartition: {
      statusTitle: "Initialize partition",
      statusDetail:
        "Pivot = {{pivotValue}} at index {{high}}. Set i = {{i}}.",
      stepExplanation:
        "Pivot value is {{pivotValue}}. Initialize i = {{i}} to mark the end of the \"less than or equal\" region.",
    },
    compare: {
      statusTitle: "Compare index {{j}}",
      statusDetail: {
        left:
          "{{currentValue}} <= {{pivotValue}}. Element belongs on the left side of the pivot.",
        right:
          "{{currentValue}} > {{pivotValue}}. Element stays on the right side of the pivot.",
      },
      stepExplanation: {
        left:
          "Scan index j = {{j}} (value {{currentValue}}). It is less than or equal to pivot {{pivotValue}}, so it belongs in the left partition.",
        right:
          "Scan index j = {{j}} (value {{currentValue}}). It is greater than pivot {{pivotValue}}, so i does not advance.",
      },
    },
    swapIntoLeft: {
      statusTitle: "Swap into left partition",
      statusDetail: "Increment i to {{i}}, then swap index {{i}} with {{j}}.",
      stepExplanation:
        "Advance i to {{i}} and swap arr[{{i}}] with arr[{{j}}] to grow the left partition.",
    },
    advanceBoundary: {
      statusTitle: "Advance partition boundary",
      statusDetail:
        "Increment i to {{i}}. Index {{j}} is already in the left partition.",
      stepExplanation: "i advances to {{i}}. No swap needed because j already equals i.",
    },
    placePivot: {
      statusTitle: "Place pivot",
      statusDetail:
        "Swap pivot at index {{high}} with index {{pivotIndex}}. Pivot locks into final position.",
      stepExplanation:
        "Swap arr[{{pivotIndex}}] with arr[{{high}}] so the pivot rests at its sorted index {{pivotIndex}}.",
    },
    partitionComplete: {
      statusTitle: "Partition complete",
      statusDetail:
        "Pivot {{pivotValue}} is fixed at index {{pivotIndex}}. Recurse on [{{low}}..{{leftHigh}}] and [{{rightLow}}..{{high}}].",
      stepExplanation:
        "Partition complete. Index {{pivotIndex}} is in its final sorted position. Elements left of it are <= pivot; elements right are > pivot.",
    },
    baseCase: {
      statusTitle: "Base case",
      statusDetail: "Single element at index {{low}} is already sorted.",
      stepExplanation:
        "Recursive base case: a sub-array of one element requires no further partitioning.",
    },
    recursiveCall: {
      statusTitle: "Recursive call",
      statusDetail:
        "Sort sub-array [{{low}}..{{high}}] ({{count}} elements).",
      stepExplanation:
        "Divide: quicksort is called on sub-array indices {{low}} through {{high}}.",
    },
    recurseLeft: {
      statusTitle: "Recurse left",
      statusDetail:
        "Left partition [{{low}}..{{high}}] contains elements <= pivot.",
      stepExplanation:
        "Conquer left: recursively sort indices {{low}} to {{high}}.",
    },
    recurseRight: {
      statusTitle: "Recurse right",
      statusDetail:
        "Right partition [{{low}}..{{high}}] contains elements > pivot.",
      stepExplanation:
        "Conquer right: recursively sort indices {{low}} to {{high}}.",
    },
  },
  arrayOperations: {
    operations: {
      access: "Index Access",
      "linear-search": "Linear Search",
      "insert-start": "Insert at Start",
      "insert-middle": "Insert at Middle",
      "insert-end": "Insert at End",
      "delete-start": "Delete at Start",
      "delete-middle": "Delete at Middle",
      "delete-end": "Delete at End",
    },
    access: {
      empty: {
        statusTitle: "Empty array",
        statusDetail: "There are no elements to access.",
        stepExplanation: "Index access requires at least one stored element.",
      },
      intro: {
        statusTitle: "Direct index access",
        statusDetail: "Requesting element at index {{index}}.",
        stepExplanation:
          "Arrays store elements in contiguous memory. The CPU jumps directly to base + index.",
      },
      read: {
        statusTitle: "arr[{{index}}] = {{value}}",
        statusDetail: "O(1) time — no scanning or shifting required.",
        pointerMovement: "Memory address = base + {{index}}",
        stepExplanation:
          "Reading arr[{{index}}] takes constant time because the offset is computed in one step.",
      },
      complete: {
        statusTitle: "Access complete",
        statusDetail: "Value {{value}} retrieved from index {{index}}.",
        stepExplanation:
          "Index access is the main reason arrays are fast for lookups by position.",
      },
    },
    linearSearch: {
      empty: {
        statusTitle: "Target {{target}} not found",
        statusDetail: "The array is empty.",
        stepExplanation:
          "Linear search checks each index until a match appears or the array ends.",
      },
      intro: {
        statusTitle: "Linear search begins",
        statusDetail: "Looking for target value {{target}}.",
        stepExplanation:
          "Unlike index access, search must inspect elements one by one from left to right.",
      },
      compare: {
        statusTitle: "Compare arr[{{index}}] with target",
        statusDetail: "arr[{{index}}] = {{value}}{{matchSuffix}}",
        matchSuffix: " — match!",
        pointerMovement: "i = {{index}}",
        stepExplanation: {
          match: "Match found at index {{index}}.",
          noMatch: "No match yet. Advance i to the next index.",
        },
      },
      found: {
        statusTitle: "Target found at index {{index}}",
        statusDetail:
          "Found {{target}} at index {{index}} after {{comparisons}} comparison{{comparisonSuffix}}.",
        comparisonSuffix: "s",
        stepExplanation:
          "Linear search is simple but scales linearly because every element may need to be checked.",
      },
      notFound: {
        statusTitle: "Target {{target}} not found",
        statusDetail: "Every index was inspected.",
        stepExplanation:
          "When the target is absent, linear search always visits all n elements.",
      },
    },
    insert: {
      intro: {
        statusDetail: "Insert {{value}} at index {{index}}.",
        stepExplanation: {
          end: "Appending at the end avoids shifting existing elements.",
          middle:
            "Elements from index {{index}} onward must shift one slot to the right.",
        },
      },
      writeEnd: {
        statusTitle: "Inserted {{value}} at index {{index}}",
        statusDetail: "O(1) when the array has spare capacity at the end.",
        stepExplanation:
          "The new value is written directly into the next contiguous slot.",
      },
      completeEnd: {
        statusTitle: "Insert complete",
        statusDetail: "Array length is now {{length}}.",
        stepExplanation: "End insertion is fast because no elements need to move.",
      },
      shift: {
        statusTitle: "Shift element right",
        statusDetail:
          "Move arr[{{sourceIndex}}] ({{value}}) to index {{targetIndex}}.",
        pointerMovement: "j = {{sourceIndex}}",
        stepExplanation:
          "Each shift copies one value one slot to the right to free space at the insert position.",
      },
      write: {
        statusTitle: "Write {{value}} at index {{index}}",
        statusDetail: "The vacant slot is now filled.",
        stepExplanation:
          "After shifting, the new value is placed at the target index.",
      },
      complete: {
        statusTitle: "Insert complete",
        statusDetail: "Array length is now {{length}}.",
        stepExplanation:
          "Inserting away from the end costs O(n) because up to n elements must shift.",
      },
    },
    delete: {
      empty: {
        statusTitle: "Nothing to delete",
        statusDetail: "The array is already empty.",
        stepExplanation: "Deletion requires at least one element.",
      },
      intro: {
        statusDetail: "Remove value {{value}} at index {{index}}.",
        stepExplanation: {
          end: "Deleting the last element avoids shifting.",
          middle:
            "Elements to the right must shift one slot left to close the gap.",
        },
      },
      completeEnd: {
        statusTitle: "Delete complete",
        statusDetail: "Array length is now {{length}}.",
        stepExplanation:
          "Removing the tail element is O(1) because no shifting is required.",
      },
      shift: {
        statusTitle: "Shift element left",
        statusDetail:
          "Move arr[{{sourceIndex}}] ({{value}}) to index {{targetIndex}}.",
        pointerMovement: "j = {{sourceIndex}}",
        stepExplanation:
          "Each left shift closes the gap by copying the next element one slot to the left.",
      },
      complete: {
        statusTitle: "Delete complete",
        statusDetail: "Removed {{value}}. Length is now {{length}}.",
        stepExplanation:
          "Deleting away from the end costs O(n) because remaining elements must shift left.",
      },
    },
  },
  stackOperations: {
    operations: {
      push: "Push",
      pop: "Pop",
      peek: "Peek",
      clear: "Clear",
    },
    push: {
      intro: {
        statusTitle: "Push {{value}} onto the stack",
        statusDetail: "Place the new element on top of the current stack.",
        stepExplanation:
          "Preparing to push value {{value}}. Stacks always insert new elements at the top.",
      },
      overflow: {
        statusTitle: "Stack overflow!",
        statusDetail:
          "Stack overflow! Maximum capacity of {{maxCapacity}} elements reached. Push operation rejected.",
        stepExplanation:
          "Push rejected in O(1): the bounded stack already holds {{maxCapacity}} elements at maximum capacity. No slot remains above TOP for a new write.",
      },
      incoming: {
        statusTitle: "Incoming element",
        statusDetail: "Place {{value}} on TOP.",
        stepMessage: "Incoming value {{value}} placed at TOP.",
        stepExplanation:
          "Value {{value}} pushed to index {{topIndex}}. The top pointer advances to track the new uppermost element.",
      },
      complete: {
        statusTitle: "Push complete",
        statusDetail:
          "Push complete: Element '{{value}}' added to TOP. Stack updated in O(1) time (TOP index: {{topIndex}}).",
        stepExplanation:
          "Push complete. Accessing or removing this element next maintains the LIFO order.",
      },
    },
    pop: {
      intro: {
        statusTitle: "Pop the top element",
        statusDetail: "Remove and return the most recently pushed value.",
        stepExplanation: {
          withTop:
            "Preparing to pop from the stack. The operation targets index {{topIndex}} (the current top).",
          empty:
            "Preparing to pop from the stack. The operation targets the current top index.",
        },
      },
      underflow: {
        statusTitle: "Stack underflow!",
        statusDetail:
          "Stack underflow! Cannot execute pop or peek on an empty stack.",
        stepExplanation:
          "Pop rejected in O(1): the stack is empty — there is no top index to remove.",
      },
      lift: {
        statusTitle: "Lift TOP element",
        statusDetail: "TOP = {{value}}",
        stepMessage: "Highlight {{value}} before removal.",
        stepExplanation: {
          withNewTop:
            "Targeting TOP element {{value}} at index {{topIndex}} before executing stack.pop(). After removal, the top pointer will move to index {{newTopIndex}}.",
          emptyAfter:
            "Targeting TOP element {{value}} at index {{topIndex}} before executing stack.pop(). After removal, the stack becomes empty.",
        },
      },
      complete: {
        statusTitle: "Pop complete",
        statusDetail:
          "Pop complete: Element '{{value}}' removed from TOP in O(1) time.",
        stepExplanation: {
          withNewTop:
            "Element {{value}} removed from top. The top pointer moves down to index {{newTopIndex}}. Pop completes in O(1) without shifting remaining elements.",
          emptyAfter:
            "Element {{value}} removed from top. The stack is now empty. Pop completes in O(1) without shifting remaining elements.",
        },
      },
    },
    peek: {
      intro: {
        statusTitle: "Peek at TOP",
        statusDetail: "Inspect the top element without removing it.",
        stepExplanation: {
          withTop:
            "Reading top element at index {{topIndex}} (value: {{value}}). Peek inspects top without mutating the stack.",
          empty: "Preparing to peek at the top element without mutating the stack.",
        },
      },
      underflow: {
        statusTitle: "Stack underflow!",
        statusDetail:
          "Stack underflow! Cannot execute pop or peek on an empty stack.",
        stepExplanation:
          "Peek rejected in O(1): the stack is empty — there is no top index to read.",
      },
      read: {
        statusTitle: "Read TOP",
        statusDetail: "TOP = {{value}}",
        stepMessage: "Observe {{value}} — stack size unchanged.",
        stepExplanation:
          "Reading top element at index {{topIndex}} (value: {{value}}). Peek inspects top without mutating the stack.",
      },
      complete: {
        statusTitle: "Peek complete",
        statusDetail: "Value {{value}} at TOP. Size still {{size}}.",
        stepMessage: "No elements were removed.",
        stepExplanation:
          "Peek complete. Stack size and LIFO order are unchanged — only the top value was inspected.",
      },
    },
    clear: {
      intro: {
        statusTitle: "Clear the stack",
        statusDetail: "Remove every element until the structure is empty.",
        stepExplanation: {
          withElements:
            "Preparing to clear the stack. {{count}} stored element(s) will be dropped from TOP down to the base.",
          empty: "Preparing to clear the stack. No elements are currently stored.",
        },
      },
      alreadyEmpty: {
        statusTitle: "Already empty",
        statusDetail: "Nothing to remove.",
        stepMessage: "Clear on an empty stack is a no-op.",
        stepExplanation:
          "Clear on an empty stack completes in O(1) — no elements require removal.",
      },
      discard: {
        statusTitle: "Discard all elements",
        statusDetail: "Removing {{count}} element(s).",
        stepMessage: "Every slot from TOP down to the base is cleared.",
        stepExplanation:
          "Clearing all {{count}} elements from memory sequentially (O(n)).",
      },
      complete: {
        statusTitle: "Stack cleared",
        statusDetail: "Stack cleared: All elements removed in O(n) time.",
        stepExplanation:
          "Clear complete. Every slot was emptied in O(n) time — push can resume from an empty stack in O(1).",
      },
    },
  },
  linkedListOperations: {
    operations: {
      "insert-at-head": "Insert at Head",
      "insert-at-tail": "Insert at Tail",
      "insert-at-index": "Insert at Index",
      "delete-head": "Delete Head",
      "delete-tail": "Delete Tail",
      "delete-value": "Delete by Value",
      search: "Search",
      reverse: "Reverse",
    },
    insertAtHead: {
      intro: {
        statusDetail: "Insert {{value}} before the current head.",
        stepExplanation:
          "Creating a new node and pointing it to the former head takes O(1) time.",
      },
      allocate: {
        statusTitle: "Allocate new node",
        statusDetail: "Created node({{value}}) in memory.",
        stepMessage:
          "New node ({{value}}) sits inline before the current head — not linked yet.",
        stepExplanation:
          "Node allocation is O(1). Pointers are assigned in the next step.",
      },
      link: {
        statusTitle: "Link new node",
        statusDetail: "node.next = formerHead",
        stepMessage: "Connect {{value}} → {{formerHeadValue}}.",
        stepExplanation:
          "The new node points to the previous head. Head pointer updates next.",
      },
      complete: {
        statusTitle: "Update head pointer",
        statusDetail: "Head pointer updated. Operation finished in O(1).",
        stepMessage: "{{value}} is now the head of the list.",
        stepExplanation:
          "Head insertion is constant time for all three list variants.",
      },
    },
    insertAtTail: {
      intro: {
        statusDetail: "Append {{value}} after the current tail.",
        stepExplanation: {
          circular:
            "Tail pointer gives O(1) access — append, then reconnect tail.next to head.",
          default:
            "An explicit tail pointer makes append O(1) without walking from head.",
        },
      },
      allocate: {
        statusTitle: "Allocate new node",
        statusDetail: "Created node({{value}}) in memory.",
        stepMessage:
          "New node ({{value}}) sits inline to the right of the tail — not linked yet.",
        stepExplanation:
          "Node allocation is O(1). The tail pointer targets the current last node directly.",
      },
      link: {
        statusTitle: "Link new node",
        statusDetail: "tail.next = newNode",
        stepMessage: "Connect {{tailValue}} → {{value}}.",
        stepExplanation:
          "Only the tail's next pointer changes — still O(1), no traversal.",
      },
      complete: {
        statusTitle: "Update tail pointer",
        statusDetail: "Tail pointer now references the new last node.",
        stepMessage: {
          circular: "{{value}} is the new tail — next reconnects to head.",
          default: "{{value}} is the new tail — next is null.",
        },
        stepExplanation: {
          circular:
            "Circular lists set newTail.next = head after advancing the tail pointer.",
          default: "null on the new tail's next port marks the end of the list.",
        },
      },
    },
    insertAtIndex: {
      intro: {
        statusDetail: "Insert {{value}} at index {{index}}.",
        stepExplanation:
          "Walk to the node before the insertion point, then relink pointers.",
      },
      traverse: {
        statusTitle: "Traverse to index {{index}}",
        statusDetail: "curr at node with value {{value}}.",
      },
      reachPredecessor: {
        statusTitle: "Reach predecessor at index {{index}}",
        statusDetail: "curr at node with value {{value}}.",
      },
      traverseMessage:
        "Advance until the insertion gap is found.",
      traverseExplanation:
        "Insertion at index i requires i pointer hops from the head.",
      splice: {
        statusTitle: "Splice new node",
        statusDetail: "prev.next = newNode; newNode.next = next",
        stepMessage:
          "Inserted {{value}} between {{prevValue}} and the successor.",
        stepExplanation:
          "Two or three pointer updates splice the node in O(1) after traversal.",
      },
      complete: {
        statusTitle: "Insert complete",
        statusDetail: "Value {{value}} now sits at index {{index}}.",
        stepMessage: "Middle insertion finished.",
        stepExplanation:
          "Overall time is O(n) due to traversal to the index.",
      },
    },
    deleteHead: {
      empty: {
        statusTitle: "List is empty",
        statusDetail: "Nothing to delete.",
        stepMessage: "Head deletion requires at least one node.",
        stepExplanation: "Head deletion requires at least one node.",
      },
      intro: {
        statusDetail: "Remove head node ({{value}}).",
        stepExplanation:
          "Advance head to head.next and discard the old node.",
      },
      unlink: {
        statusTitle: "Unlink head",
        statusDetail: {
          circularSingle:
            "Break the self-loop — head and tail become null.",
          default: "head = head.next",
        },
        stepMessage: {
          circularSingle: "Breaking the circular self-link on {{value}}.",
          default: "Breaking link from {{value}} to the successor.",
        },
        stepExplanation: {
          circularSingle:
            "A one-node circular list clears both head and tail when the loop breaks.",
          circular:
            "Advance head first, then reconnect tail.next to the new head.",
          default: "Head deletion is O(1) once the next pointer is read.",
        },
      },
      relinkTail: {
        statusTitle: "Relink tail → head",
        statusDetail:
          "tail.next must target the new head in a circular list.",
        stepMessage:
          "Point tail ({{tailValue}}) to new head ({{headValue}}).",
        stepExplanation:
          "Without this update, tail.next would still reference the removed head node.",
      },
      complete: {
        statusTitle: "Delete complete",
        statusDetail: {
          circularSingle: "Removed {{value}}. List is now empty.",
          default: "Removed {{value}}. Head advanced in O(1).",
        },
        stepMessage: {
          circularSingle: "Head and tail are null — circular list cleared.",
          circular: "Head advanced and tail.next points to the new head.",
          doubly: "New head prev is null — forward link intact.",
          default: "Head advanced to the next node.",
        },
        stepExplanation: {
          circularSingle:
            "Single-node circular lists require clearing both entry points.",
          circular:
            "Tail.next must follow the head pointer after every head removal.",
          doubly:
            "Doubly lists also clear the new head's prev pointer to null.",
          default: "Only pointer updates — no traversal required.",
        },
      },
    },
    deleteTail: {
      doublyIntro: {
        statusDetail: "Remove the last node using tail.prev — O(1).",
        stepExplanation:
          "Doubly linked lists expose the predecessor directly from the tail node.",
      },
      singlyIntro: {
        statusDetail: {
          circular: "Remove the last node in the circular chain.",
          default: "Remove the last node in the chain.",
        },
        stepExplanation:
          "Singly linked lists must walk from head to the penultimate node — O(n) time.",
      },
      accessTail: {
        statusTitle: "Access tail and predecessor",
        statusDetail: "tail.prev points to {{value}}.",
        stepMessage:
          "No traversal needed — jump to tail and follow prev in O(1).",
        stepExplanation:
          "No traversal needed — jump to tail and follow prev in O(1).",
      },
      walk: {
        statusTitle: "Walk from head",
        statusDetail: "curr at node {{value}}.",
        stepExplanation:
          "Each hop costs O(1), but finding the penultimate node requires O(n) hops.",
      },
      penultimate: {
        statusTitle: "Penultimate node reached",
        statusDetail: "Node {{value}} is before the tail.",
        stepMessage: "Stop here — this is the node whose next pointer must be updated.",
        stepExplanation:
          "Singly lists cannot delete the tail in O(1) without a tail pointer and backward links.",
      },
      walkMessage: "Advance curr toward the tail one node at a time.",
      breakLink: {
        statusTitle: "Break tail link",
        statusDetail: {
          doubly: "Set penultimate.next = null.",
          circular: "Set penultimate.next = head.",
          default: "Set penultimate.next = null.",
        },
        stepMessage: {
          doubly: "Unlink {{tailValue}} — penultimate.next becomes null.",
          circular:
            "Unlink {{tailValue}} — penultimate.next points to head.",
          default: "Unlink {{tailValue}} — penultimate.next becomes null.",
        },
        stepExplanation: {
          circular:
            "Circular singly lists reconnect the penultimate node to head instead of null.",
          default:
            "The last node is removed when its predecessor's next pointer becomes null.",
        },
      },
      complete: {
        statusTitle: "Delete complete",
        statusDetail: {
          doubly: "Tail removed in O(1) time.",
          default: "Tail removed and predecessor relinked.",
        },
        stepMessage: {
          doubly: "Penultimate.next is null — tail node freed.",
          circular: "Penultimate now points to head — tail node freed.",
          default: "Penultimate.next is null — tail node freed.",
        },
        stepExplanation: {
          doubly:
            "Doubly linked tail deletion avoids the O(n) walk required in singly lists.",
          circular:
            "Circular lists reconnect the penultimate node to head.",
          default:
            "null on the penultimate next port marks the new list termination.",
        },
      },
    },
    deleteValue: {
      intro: {
        statusDetail: "Delete the first node with value {{target}}.",
        stepExplanation:
          "Traverse while tracking prev to splice out the matching node.",
      },
      empty: {
        statusTitle: "Value not found",
        statusDetail: "Empty list.",
        stepMessage: "Cannot delete {{target}} from an empty list.",
        stepExplanation: "Search and delete require at least one node.",
      },
      scanning: {
        statusTitle: "Scanning nodes",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Advance curr (and prev) until the target appears.",
        stepExplanation:
          "Deletion by value requires O(n) search in the worst case.",
      },
      match: {
        statusTitle: "Match found",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Splice out node with value {{target}}.",
        stepExplanation: "Rewire prev.next to skip the deleted node.",
      },
      complete: {
        statusTitle: "Delete complete",
        statusDetail: "Removed first occurrence of {{target}}.",
        stepMessage: "Pointers rewired around the deleted node.",
        stepExplanation: "Time is O(n) for search plus O(1) splice.",
      },
      notFound: {
        statusTitle: "Value not found",
        statusDetail: "No node stores {{target}}.",
        stepMessage: "Traversal finished without a match.",
        stepExplanation: "Every node was inspected — target absent.",
      },
    },
    search: {
      intro: {
        statusDetail: "Search for value {{target}}.",
        stepExplanation:
          "Walk node by node — there is no random access by index.",
      },
      compare: {
        statusTitle: "Compare at node {{index}}",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Advance curr along next pointers.",
        stepExplanation: "Linear scan — O(n) worst case.",
      },
      found: {
        statusTitle: "Target found",
        statusDetail: "curr.value = {{value}}",
        stepMessage: "Match at node index {{index}}.",
        stepExplanation: "Search stops at the first matching node.",
      },
      notFound: {
        statusTitle: "Target not found",
        statusDetail: "{{target}} is not in the list.",
        stepMessage: "Every node was visited.",
        stepExplanation: "Search cost is O(n) when the value is absent.",
      },
    },
    reverse: {
      intro: {
        statusDetail: {
          trivial: "Reverse pointer direction for every node.",
          default: "Reverse the linked list in place.",
        },
        stepExplanation: {
          trivial: "Lists with zero or one node are already reversed.",
          default:
            "Track prev, curr, and temp while flipping each next pointer one node at a time.",
        },
      },
      trivialComplete: {
        statusTitle: "Nothing to reverse",
        statusDetail: "List unchanged.",
        stepMessage: "Reversal complete trivially.",
        stepExplanation: "Iterate only when at least two nodes exist.",
      },
      breakLink: {
        statusTitle: "Step {{step}}: break curr → next",
        statusDetail: {
          withPrev:
            "Disconnect {{value}} from its successor — next becomes null.",
          head: "Disconnect head from its successor — next becomes null.",
        },
        stepMessage:
          "curr at {{value}}. The forward link is severed before relinking to prev.",
        stepExplanation:
          "Explicit null marks termination while the old forward edge breaks.",
      },
      relink: {
        statusTitle: "Step {{step}}: relink {{value}} backward",
        statusDetail: {
          withPrev:
            "curr.next now targets {{prevValue}}.",
          head: "Head now points to null — former first link reversed.",
        },
        stepMessage: "Forward edge removed; backward edge established.",
        stepExplanation:
          "Advance prev ← curr and curr ← temp after each flip.",
      },
      complete: {
        statusTitle: "Reverse complete",
        statusDetail: {
          circular:
            "Visual order flipped — head → successor and tail → head restored.",
          default: "Visual order flipped — new head at the start.",
        },
        stepMessage: {
          circular:
            "Every node links forward; the tail closes the loop back to head.",
          default:
            "Nodes reorder left-to-right to match the reversed pointer chain.",
        },
        stepExplanation: {
          circular:
            "Circular lists never terminate in null — tail.next must target the new head.",
          default:
            "The old tail becomes head; the grid now reflects natural traversal order.",
        },
      },
    },
  },
} as const;
