import { sectionLabelClass } from "../ui/sectionLabel";

const keyConcepts = [
  "Sorted array: binary search only works when elements are in ascending order.",
  "Pointers low / mid / high: track the active search interval and the middle candidate.",
  "Divide and conquer: each step halves the search space by comparing against the midpoint.",
];

const complexityRows = [
  { label: "Best Case", value: "O(1)" },
  { label: "Average Case", value: "O(log n)" },
  { label: "Worst Case", value: "O(log n)" },
  { label: "Space", value: "O(1)" },
];

export function ExplanationPanel() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className={sectionLabelClass}>How it works</h3>
        <p className="mt-2 font-body-md text-body-md text-on-surface leading-relaxed">
          Binary search repeatedly halves a sorted array to locate a target value.
          Start with low and high covering the full array, compute mid, compare
          array[mid] with the target, then discard the left or right half and
          repeat until the target is found or the range becomes empty.
        </p>
      </section>

      <section>
        <h3 className={sectionLabelClass}>Key Concepts</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {keyConcepts.map((concept) => (
            <li
              key={concept}
              className="flex gap-2 font-body-md text-body-md text-on-surface-variant leading-relaxed"
            >
              <span className="text-primary font-bold shrink-0">•</span>
              <span>{concept}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className={sectionLabelClass}>Complexity Summary</h3>
        <div className="mt-2 overflow-hidden rounded-xl border-2 border-surface-variant">
          <table className="w-full text-left">
            <tbody>
              {complexityRows.map((row, index) => (
                <tr
                  key={row.label}
                  className={[
                    index % 2 === 0
                      ? "bg-surface-container-lowest"
                      : "bg-surface-container-low",
                  ].join(" ")}
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-body-md text-body-md text-on-surface-variant font-semibold"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3 font-body-md text-body-md text-primary font-bold text-right">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
