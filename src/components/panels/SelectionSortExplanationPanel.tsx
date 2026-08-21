import { sectionLabelClass } from "../ui/sectionLabel";

const complexityRows = [
  { label: "Best Case", value: "O(n²)" },
  { label: "Average Case", value: "O(n²)" },
  { label: "Worst Case", value: "O(n²)" },
  { label: "Space", value: "O(1)" },
  { label: "Stability", value: "Unstable" },
];

const whenToUse = [
  "Small arrays where simplicity matters more than raw performance.",
  "Educational contexts to illustrate in-place selection and comparison passes.",
  "Memory-constrained environments where O(1) auxiliary space is required.",
];

export function SelectionSortExplanationPanel() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className={sectionLabelClass}>How it works</h3>
        <p className="mt-2 font-body-md text-body-md leading-relaxed text-slate-800">
          Selection Sort maintains a sorted prefix on the left and an unsorted
          suffix on the right. Each outer pass scans the unsorted region for the
          minimum value and swaps it into the next sorted position.
        </p>
      </section>

      <section>
        <h3 className={sectionLabelClass}>Complexity Breakdown</h3>
        <div className="mt-2 overflow-hidden rounded-xl border-2 border-surface-variant">
          <table className="w-full text-left">
            <tbody>
              {complexityRows.map((row, index) => (
                <tr
                  key={row.label}
                  className={
                    index % 2 === 0
                      ? "bg-surface-container-lowest"
                      : "bg-surface-container-low"
                  }
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-body-md text-body-md font-semibold text-slate-700"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-right font-body-md text-body-md font-bold text-primary">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className={sectionLabelClass}>When to use</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {whenToUse.map((item) => (
            <li
              key={item}
              className="flex gap-2 font-body-md text-body-md leading-relaxed text-slate-700"
            >
              <span className="shrink-0 font-bold text-primary">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
