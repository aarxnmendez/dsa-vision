export const explanations = {
  rows: {
    bestCase: "Best Case",
    averageCase: "Average Case",
    worstCase: "Worst Case",
    space: "Space",
    stability: "Stability",
    accessByIndex: "Access by Index",
    linearSearch: "Linear Search",
    insertDeleteEnd: "Insert / Delete (end)",
    insertDeleteMiddle: "Insert / Delete (middle)",
    push: "Push",
    pop: "Pop",
    peek: "Peek",
    clear: "Clear",
    insertHeadTail: "Insert at Head / Tail",
    deleteHead: "Delete at Head",
    deleteTailSingly: "Delete at Tail (Singly)",
    deleteTailDoubly: "Delete at Tail (Doubly)",
    searchAccessIndex: "Search / Access by Index",
    reverseInPlace: "Reverse (in place)",
  },
  binarySearch: {
    howItWorks:
      "Binary search repeatedly halves a sorted array to locate a target value. Start with low and high covering the full array, compute mid, compare array[mid] with the target, then discard the left or right half and repeat until the target is found or the range becomes empty.",
    keyConcepts: [
      "Sorted array: binary search only works when elements are in ascending order.",
      "Pointers low / mid / high: track the active search interval and the middle candidate.",
      "Divide and conquer: each step halves the search space by comparing against the midpoint.",
    ],
    complexityRows: [
      { label: "Best Case", value: "O(1)" },
      { label: "Average Case", value: "O(log n)" },
      { label: "Worst Case", value: "O(log n)" },
      { label: "Space", value: "O(1)" },
    ],
    whenToUse: [
      "Searching sorted arrays with O(1) random access, such as static lookup tables.",
      "Large datasets where a linear scan would be too slow and memory is limited.",
      "Repeated lookups on the same ordered collection (e.g. dictionaries, indexes).",
    ],
  },
  sequentialSearch: {
    howItWorks:
      "Linear search walks the array from the lowest index upward. At each position it compares the current element with the target; if they match, it returns that index. If the loop finishes without a match, the target is absent.",
    keyConcepts: [
      "No ordering requirement: works on sorted or unsorted arrays.",
      "Index i: scans 0, 1, 2, … until a match or end of array.",
      "Early exit: stops as soon as the target is found.",
    ],
    complexityRows: [
      { label: "Best Case", value: "O(1)" },
      { label: "Average Case", value: "O(n)" },
      { label: "Worst Case", value: "O(n)" },
      { label: "Space", value: "O(1)" },
    ],
    whenToUse: [
      "Small or unsorted collections where simplicity beats preprocessing.",
      "Single lookups when sorting for binary search is not worth the cost.",
      "Linked structures without random access where scanning is natural.",
    ],
  },
  selectionSort: {
    howItWorks:
      "Selection Sort maintains a sorted prefix on the left and an unsorted suffix on the right. Each outer pass scans the unsorted region for the minimum value and swaps it into the next sorted position.",
    keyConcepts: [
      "Sorted prefix: indices 0 through i - 1 are locked in final order after each pass.",
      "Outer index i: marks the boundary between the sorted prefix and unsorted suffix.",
      "Minimum scan: minIdx tracks the smallest value found during the inner loop.",
      "In-place swaps: only a constant amount of extra memory is needed beyond the array.",
    ],
    complexityRows: [
      { label: "Best Case", value: "O(n²)" },
      { label: "Average Case", value: "O(n²)" },
      { label: "Worst Case", value: "O(n²)" },
      { label: "Space", value: "O(1)" },
      { label: "Stability", value: "Unstable" },
    ],
    whenToUse: [
      "Small arrays where simplicity matters more than raw performance.",
      "Educational contexts to illustrate in-place selection and comparison passes.",
      "Memory-constrained environments where O(1) auxiliary space is required.",
    ],
  },
  insertionSort: {
    howItWorks:
      "Insertion Sort builds a sorted prefix on the left one element at a time. Each pass picks a key from the unsorted suffix, compares it right-to-left against the sorted partition, shifts larger values one position to the right, and inserts the key into its correct position.",
    keyConcepts: [
      "Sorted prefix: indices 0 through i - 1 are in final order before pass i begins.",
      "Key element: the value at index i that will be inserted into the sorted partition.",
      "Right-to-left scan: compare the key with sorted elements and shift larger values right.",
      "In-place insertion: only a constant amount of extra memory is needed for indices and the key.",
    ],
    complexityRows: [
      { label: "Best Case", value: "O(n)" },
      { label: "Average Case", value: "O(n²)" },
      { label: "Worst Case", value: "O(n²)" },
      { label: "Space", value: "O(1)" },
      { label: "Stability", value: "Stable" },
    ],
    whenToUse: [
      "Small or nearly sorted arrays where adaptive O(n) best-case performance helps.",
      "Educational contexts to illustrate incremental sorting and shifting.",
      "Online sorting scenarios where elements arrive one at a time.",
    ],
  },
  quickSort: {
    howItWorks:
      "Quicksort applies divide-and-conquer on an array. On each active sub-array, a pivot index is chosen according to a strategy, the array is partitioned so elements less than or equal to the pivot sit on the left and greater elements on the right, then each side is sorted recursively until sub-arrays contain at most one element.",
    keyConcepts: [
      "Divide and conquer: split into smaller sub-arrays, sort them independently, and combine through partitioning.",
      "Pivot selection: first/last pivots on sorted input create O(n²) depth; middle or random pivots keep the expected O(n log n) average.",
      "Partitioning: scan with indices i and j to rearrange elements around the pivot in O(n) time per level.",
      "Base case: sub-arrays with zero or one element are already sorted.",
    ],
    complexityRows: [
      { label: "Best Case", value: "O(n log n)" },
      { label: "Average Case", value: "O(n log n)" },
      { label: "Worst Case", value: "O(n²)" },
      { label: "Space", value: "O(log n) avg, O(n) worst" },
      { label: "Stability", value: "Unstable" },
    ],
    whenToUse: [
      "General-purpose in-place sorting when average O(n log n) performance is required.",
      "Large datasets where randomized or middle pivots avoid pathological O(n²) behavior on nearly sorted input.",
      "Systems with limited auxiliary memory where O(log n) recursion stack is acceptable.",
    ],
  },
  array: {
    howItWorks:
      "An array stores elements in a single contiguous block of memory. Each slot has a fixed index starting at 0, so the machine can jump directly to any position using base address + offset. That makes reading by index extremely fast, but inserting or deleting away from the end forces neighboring elements to shift and make room.",
    keyConcepts: [
      "Contiguous memory: indices 0, 1, 2... map to adjacent slots in RAM.",
      "O(1) index access: arr[i] computes the address in one step without scanning.",
      "O(n) shifts: inserting or deleting in the middle moves up to n - 1 elements.",
      "Linear search: when you do not know the index, you must inspect elements one by one.",
    ],
    complexityRows: [
      { label: "Access by Index", value: "O(1)" },
      { label: "Linear Search", value: "O(n)" },
      { label: "Insert / Delete (end)", value: "O(1)" },
      { label: "Insert / Delete (middle)", value: "O(n)" },
      { label: "Space", value: "O(n)" },
    ],
    whenToUse: [
      "Frequent random access by index, such as lookup tables or buffers.",
      "Sequential iteration when cache locality and memory density matter.",
      "Avoid heavy insert/delete in the middle when performance is critical — consider linked structures instead.",
    ],
  },
  linkedList: {
    howItWorks:
      "A linked list stores elements in nodes scattered across memory. Each node holds a value and pointer(s) to neighbors instead of sitting in one contiguous block. The head pointer marks the entry point; traversal follows next (and prev in doubly lists) until null or back to head in circular variants.",
    keyConcepts: [
      "Nodes & pointers: data lives in node objects linked by address references.",
      "Singly linked: each node stores value + next — minimal memory, forward-only traversal.",
      "Doubly linked: adds prev for O(1) backward steps at the cost of extra pointer space.",
      "Circular: tail.next wraps to head — useful for round-robin buffers and ring iterators.",
      "No random access: reaching index i requires O(i) pointer hops from the head.",
    ],
    complexityRows: [
      { label: "Insert at Head / Tail", value: "O(1) with head & tail pointers" },
      { label: "Delete at Head", value: "O(1)" },
      { label: "Delete at Tail (Singly)", value: "O(n) — find penultimate node" },
      { label: "Delete at Tail (Doubly)", value: "O(1) with tail pointer" },
      { label: "Search / Access by Index", value: "O(n)" },
      { label: "Reverse (in place)", value: "O(n) time, O(1) space" },
      { label: "Space", value: "O(n) nodes + pointer overhead" },
    ],
    whenToUse: [
      "Frequent insert/delete at the head or at known node references.",
      "Unknown or highly variable size where contiguous reallocation is costly.",
      "Implementing adjacency lists, LRU caches, or playlist-style sequences.",
      "Prefer arrays when you need O(1) index access, cache locality, or binary search on sorted data.",
    ],
  },
  stack: {
    howItWorks:
      "A stack is a linear LIFO (Last In, First Out) data structure. Elements are added and removed strictly from the top. Push inserts an element onto the top, pop removes the most recent element, and peek accesses the top element without mutating the stack.",
    keyConcepts: [
      "LIFO order: the most recently pushed element is removed first.",
      "Top pointer: push, pop, and peek all reference the top index in O(1) time.",
      "Bounded capacity: pushing onto a full stack triggers overflow.",
      "Underflow: pop or peek on an empty stack is invalid and must not mutate the structure.",
    ],
    complexityRows: [
      { label: "Push", value: "O(1)" },
      { label: "Pop", value: "O(1)" },
      { label: "Peek", value: "O(1)" },
      { label: "Clear", value: "O(n)" },
      { label: "Space", value: "O(n)" },
    ],
    whenToUse: [
      "Undo / redo mechanisms and browser history navigation.",
      "Function call stacks during recursion and expression parsing (e.g., postfix evaluation).",
      "Backtracking algorithms and Depth-First Search (DFS) graph traversal.",
    ],
  },
} as const;
