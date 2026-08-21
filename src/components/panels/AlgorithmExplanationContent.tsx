import { sectionLabelClass } from "../ui/sectionLabel";

export interface ComplexityRow {
  label: string;
  value: string;
}

export interface AlgorithmExplanationData {
  howItWorks: string;
  keyConcepts: string[];
  complexityRows: ComplexityRow[];
  whenToUse: string[];
}

type AlgorithmExplanationContentProps = AlgorithmExplanationData;

export function AlgorithmExplanationContent({
  howItWorks,
  keyConcepts,
  complexityRows,
  whenToUse,
}: AlgorithmExplanationContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className={sectionLabelClass}>How it works</h3>
        <p className="mt-2 font-body-md text-body-md text-on-surface leading-relaxed">
          {howItWorks}
        </p>
      </section>

      <section>
        <h3 className={sectionLabelClass}>Key concepts</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {keyConcepts.map((concept) => (
            <li
              key={concept}
              className="flex gap-2 font-body-md text-body-md text-on-surface-variant leading-relaxed"
            >
              <span className="shrink-0 font-bold text-primary">•</span>
              <span>{concept}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className={sectionLabelClass}>Complexity breakdown</h3>
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
                    className="px-4 py-3 font-body-md text-body-md font-semibold text-on-surface-variant"
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
              className="flex gap-2 font-body-md text-body-md text-on-surface-variant leading-relaxed"
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
