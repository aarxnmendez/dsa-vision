import { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  withComplexityRowColors,
  type ComplexityDimension,
  type ComplexityReferenceRow,
} from "../../data/bigOReference";
import { Icon } from "../ui/Icon";
import { sectionLabelClass } from "../ui/sectionLabel";
import { ComplexityGrowthChart } from "./ComplexityGrowthChart";

function ComplexityReferenceTable({
  rows,
  headers,
}: {
  rows: ComplexityReferenceRow[];
  headers: {
    notation: string;
    class: string;
    behavior: string;
    examples: string;
  };
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-surface-variant border-b-4">
      <table className="w-full table-fixed text-left align-middle">
        <thead className="bg-surface-container">
          <tr>
            <th className="w-32 min-w-[120px] px-4 py-3 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap align-middle">
              {headers.notation}
            </th>
            <th className="w-36 px-4 py-3 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap align-middle">
              {headers.class}
            </th>
            <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell align-middle">
              {headers.behavior}
            </th>
            <th className="w-48 px-4 py-3 font-label-caps text-label-caps text-on-surface-variant align-middle">
              {headers.examples}
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

type BigONavigationState = {
  from?: string;
};

export function BigOView() {
  const { t } = useTranslation("bigO");
  const location = useLocation();
  const navigate = useNavigate();
  const [dimension, setDimension] = useState<ComplexityDimension>("time");
  const tabListId = useId();
  const timeTabId = `${tabListId}-time-tab`;
  const spaceTabId = `${tabListId}-space-tab`;
  const timePanelId = `${tabListId}-time-panel`;
  const spacePanelId = `${tabListId}-space-panel`;

  const timeRows = useMemo(
    () =>
      withComplexityRowColors(
        t("time.rows", { returnObjects: true }) as unknown as Omit<
          ComplexityReferenceRow,
          "color"
        >[],
      ),
    [t],
  );
  const spaceRows = useMemo(
    () =>
      withComplexityRowColors(
        t("space.rows", { returnObjects: true }) as unknown as Omit<
          ComplexityReferenceRow,
          "color"
        >[],
      ),
    [t],
  );
  const auxiliaryPoints = t("space.auxiliaryPoints", {
    returnObjects: true,
  }) as unknown as { title: string; detail: string }[];

  const activeConfig =
    dimension === "time"
      ? {
          intro: t("time.intro"),
          chartTitle: t("time.chartTitle"),
          chartDescription: t("time.chartDescription"),
          tableTitle: t("time.tableTitle"),
          rows: timeRows,
        }
      : {
          intro: t("space.intro"),
          chartTitle: t("space.chartTitle"),
          chartDescription: t("space.chartDescription"),
          tableTitle: t("space.tableTitle"),
          rows: spaceRows,
        };

  const tableHeaders = {
    notation: t("table.notation"),
    class: t("table.class"),
    behavior: t("table.behavior"),
    examples: t("table.examples"),
  };

  const handleBack = () => {
    const from = (location.state as BigONavigationState | null)?.from;
    if (from) {
      navigate(from);
      return;
    }

    navigate(-1);
  };

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
      <button
        type="button"
        onClick={handleBack}
        className="self-start inline-flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors bg-surface-container-lowest px-4 py-2 rounded-xl border-b-4 border-surface-variant btn-3d cursor-pointer"
      >
        <Icon name="arrow_back" className="text-[20px]" />
        {t("backToVisualizer")}
      </button>

      <header className="text-center flex flex-col gap-stack-md items-center">
        <h1 className="font-display text-display text-primary max-w-3xl">
          {t("title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>
      </header>

      <div
        role="tablist"
        aria-label={t("dimensionTabsAria")}
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
          {t("time.label")}
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
          {t("space.label")}
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
            <h2 className={sectionLabelClass}>{t("space.auxiliaryTitle")}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {t("space.auxiliaryIntro")}
            </p>
            <ul className="flex flex-col gap-4">
              {auxiliaryPoints.map((point) => (
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
          <ComplexityReferenceTable
            rows={activeConfig.rows}
            headers={tableHeaders}
          />
        </section>
      </div>
    </div>
  );
}
