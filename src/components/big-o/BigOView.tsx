import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import {
  auxiliaryMemoryPoints,
  spaceComplexityIntro,
  spaceComplexityRows,
  timeComplexityIntro,
  timeComplexityRows,
  type ComplexityDimension,
  type ComplexityReferenceRow,
} from "../../data/bigOReference";
import { Icon } from "../ui/Icon";
import { sectionLabelClass } from "../ui/sectionLabel";
import { ComplexityGrowthChart } from "./ComplexityGrowthChart";

const dimensionConfig: Record<
  ComplexityDimension,
  {
    label: string;
    chartTitle: string;
    chartDescription: string;
    tableTitle: string;
    rows: ComplexityReferenceRow[];
    intro: string;
  }
> = {
  time: {
    label: "Time Complexity",
    chartTitle: "Time Growth Comparison",
    chartDescription:
      "As input size increases, some time complexity classes explode while others stay manageable. Lower curves mean faster algorithms at scale.",
    tableTitle: "Time Complexity Reference",
    rows: timeComplexityRows,
    intro: timeComplexityIntro,
  },
  space: {
    label: "Space Complexity",
    chartTitle: "Space Growth Comparison",
    chartDescription:
      "Extra memory can come from recursion depth or auxiliary structures. In-place algorithms keep the lowest space footprint.",
    tableTitle: "Space Complexity Reference",
    rows: spaceComplexityRows,
    intro: spaceComplexityIntro,
  },
};

function ComplexityReferenceTable({ rows }: { rows: ComplexityReferenceRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-surface-variant border-b-4">
      <table className="w-full table-fixed text-left align-middle">
        <thead className="bg-surface-container">
          <tr>
            <th className="w-32 min-w-[120px] px-4 py-3 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap align-middle">
              Notation
            </th>
            <th className="w-36 px-4 py-3 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap align-middle">
              Class
            </th>
            <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell align-middle">
              Behavior
            </th>
            <th className="w-48 px-4 py-3 font-label-caps text-label-caps text-on-surface-variant align-middle">
              Examples
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.notation}
              className={
                index % 2 === 0
                  ? "bg-surface-container-lowest"
                  : "bg-surface-container-low"
              }
            >
              <td
                className={`w-32 min-w-[120px] px-4 py-4 font-headline-md text-headline-md font-bold whitespace-nowrap align-middle ${row.color}`}
              >
                {row.notation}
              </td>
              <td className="w-36 px-4 py-4 font-body-md text-body-md text-on-surface font-semibold whitespace-nowrap align-middle">
                {row.name}
              </td>
              <td className="px-4 py-4 font-body-md text-body-md text-on-surface-variant hidden md:table-cell align-middle">
                {row.description}
              </td>
              <td className="w-48 px-4 py-4 font-body-md text-body-md text-on-surface align-middle">
                {row.examples}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BigOView() {
  const [dimension, setDimension] = useState<ComplexityDimension>("time");
  const tabListId = useId();
  const timeTabId = `${tabListId}-time-tab`;
  const spaceTabId = `${tabListId}-space-tab`;
  const timePanelId = `${tabListId}-time-panel`;
  const spacePanelId = `${tabListId}-space-panel`;

  const activeConfig = dimensionConfig[dimension];

  const tabButtonBase =
    "px-6 py-3 font-bold rounded-t-xl border-2 border-b-0 transition-colors cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none";

  const tabButtonClass = (tab: ComplexityDimension) =>
    [
      tabButtonBase,
      dimension === tab
        ? "bg-surface-container-lowest text-primary border-surface-variant"
        : "text-on-surface-variant hover:bg-surface-variant border-transparent",
    ].join(" ");

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        to={APP_ROUTES.binarySearch}
        className="self-start inline-flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors bg-surface-container-lowest px-4 py-2 rounded-xl border-b-4 border-surface-variant btn-3d cursor-pointer"
      >
        <Icon name="arrow_back" className="text-[20px]" />
        Back to Visualizer
      </Link>

      <header className="text-center flex flex-col gap-stack-md items-center">
        <h1 className="font-display text-display text-primary max-w-3xl">
          Big-O Notation
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Big-O describes how an algorithm&apos;s time or space requirements
          scale as input size grows. It helps you compare solutions, predict
          performance, and choose the right tool for real-world software
          problems.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Complexity dimension"
        className="flex border-b-2 border-surface-variant bg-surface-container pt-2 px-2 gap-2 shrink-0 rounded-t-2xl"
      >
        <button
          type="button"
          role="tab"
          id={timeTabId}
          aria-selected={dimension === "time"}
          aria-controls={timePanelId}
          onClick={() => setDimension("time")}
          className={tabButtonClass("time")}
        >
          Time Complexity
        </button>
        <button
          type="button"
          role="tab"
          id={spaceTabId}
          aria-selected={dimension === "space"}
          aria-controls={spacePanelId}
          onClick={() => setDimension("space")}
          className={tabButtonClass("space")}
        >
          Space Complexity
        </button>
      </div>

      <div
        id={dimension === "time" ? timePanelId : spacePanelId}
        role="tabpanel"
        aria-labelledby={dimension === "time" ? timeTabId : spaceTabId}
        className="flex flex-col gap-stack-lg"
      >
        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
          {activeConfig.intro}
        </p>

        <section className="bg-surface-container-lowest rounded-2xl border-2 border-surface-variant border-b-4 p-6 md:p-8 flex flex-col gap-6">
          <div>
            <h2 className={sectionLabelClass}>{activeConfig.chartTitle}</h2>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              {activeConfig.chartDescription}
            </p>
          </div>
          <ComplexityGrowthChart dimension={dimension} />
        </section>

        {dimension === "space" && (
          <section className="bg-surface-container-low rounded-2xl border-2 border-surface-variant border-b-4 p-6 md:p-8 flex flex-col gap-4">
            <h2 className={sectionLabelClass}>What Uses Auxiliary Memory?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Space complexity counts memory beyond the input itself. Two common
              sources are the recursion call stack and temporary data structures
              allocated during execution.
            </p>
            <ul className="flex flex-col gap-4">
              {auxiliaryMemoryPoints.map((point) => (
                <li
                  key={point.title}
                  className="bg-surface-container-lowest rounded-xl border-2 border-surface-variant p-4 flex flex-col gap-1"
                >
                  <h3 className="font-body-md text-body-md text-primary font-bold">
                    {point.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {point.detail}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className={sectionLabelClass}>{activeConfig.tableTitle}</h2>
          <ComplexityReferenceTable rows={activeConfig.rows} />
        </section>
      </div>
    </div>
  );
}
