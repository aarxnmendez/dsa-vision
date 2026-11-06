import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ALGORITHM_COMPLEXITY,
  STRUCTURE_COMPLEXITY,
  complexityTone,
} from "../../data/complexityTable";
import { isAlgorithmAvailable, type AlgorithmMeta } from "../../types/algorithm";
import { Badge } from "../ui/Badge";

interface CatalogTableProps {
  algorithms: AlgorithmMeta[];
}

const wrapperClass =
  "overflow-x-auto rounded-2xl border-2 border-surface-variant border-b-4 bg-surface-container-lowest";
const headCellClass =
  "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-on-surface-variant whitespace-nowrap";
const cellClass = "px-4 py-3 whitespace-nowrap";

function ComplexityCell({ value }: { value: string }) {
  return (
    <td className={cellClass}>
      <Badge variant={complexityTone(value)}>{value}</Badge>
    </td>
  );
}

function NameCell({ algorithm }: { algorithm: AlgorithmMeta }) {
  const { t } = useTranslation("catalog");
  const title = t(`algorithms.${algorithm.id}.title`, {
    defaultValue: algorithm.title,
  });

  return (
    <th scope="row" className="px-4 py-3 text-left font-bold whitespace-nowrap">
      {isAlgorithmAvailable(algorithm) ? (
        <Link
          to={algorithm.route}
          className="text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {title}
        </Link>
      ) : (
        <span className="text-on-surface-variant">{title}</span>
      )}
    </th>
  );
}

export function CatalogTable({ algorithms }: CatalogTableProps) {
  const { t } = useTranslation("catalog");

  const structures = algorithms.filter(
    (algorithm) => STRUCTURE_COMPLEXITY[algorithm.id] !== undefined,
  );
  const procedures = algorithms.filter(
    (algorithm) => ALGORITHM_COMPLEXITY[algorithm.id] !== undefined,
  );

  if (structures.length === 0 && procedures.length === 0) {
    return (
      <div className="mb-12 py-stack-lg text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {t("emptyResults")}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12 flex flex-col gap-8">
      {structures.length > 0 && (
        <section aria-labelledby="table-structures">
          <h2
            id="table-structures"
            className="mb-4 border-l-4 border-primary pl-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            {t("table.structuresTitle")}
          </h2>
          <div className={wrapperClass}>
            <table className="w-full border-collapse text-sm">
              <thead className="border-b-2 border-surface-variant bg-surface-container-low">
                <tr>
                  <th scope="col" className={headCellClass}>{t("table.name")}</th>
                  <th scope="col" className={headCellClass}>{t("table.access")}</th>
                  <th scope="col" className={headCellClass}>{t("table.search")}</th>
                  <th scope="col" className={headCellClass}>{t("table.insert")}</th>
                  <th scope="col" className={headCellClass}>{t("table.remove")}</th>
                  <th scope="col" className={headCellClass}>{t("table.space")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {structures.map((algorithm) => {
                  const row = STRUCTURE_COMPLEXITY[algorithm.id]!;
                  return (
                    <tr key={algorithm.id} className="hover:bg-surface-bright">
                      <NameCell algorithm={algorithm} />
                      <ComplexityCell value={row.access} />
                      <ComplexityCell value={row.search} />
                      <ComplexityCell value={row.insert} />
                      <ComplexityCell value={row.remove} />
                      <ComplexityCell value={row.space} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-on-surface-variant">
            <li>{t("table.notes.array")}</li>
            <li>{t("table.notes.linkedList")}</li>
            <li>{t("table.notes.stackQueue")}</li>
          </ul>
        </section>
      )}

      {procedures.length > 0 && (
        <section aria-labelledby="table-algorithms">
          <h2
            id="table-algorithms"
            className="mb-4 border-l-4 border-primary pl-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            {t("table.algorithmsTitle")}
          </h2>
          <div className={wrapperClass}>
            <table className="w-full border-collapse text-sm">
              <thead className="border-b-2 border-surface-variant bg-surface-container-low">
                <tr>
                  <th scope="col" className={headCellClass}>{t("table.name")}</th>
                  <th scope="col" className={headCellClass}>{t("table.best")}</th>
                  <th scope="col" className={headCellClass}>{t("table.average")}</th>
                  <th scope="col" className={headCellClass}>{t("table.worst")}</th>
                  <th scope="col" className={headCellClass}>{t("table.space")}</th>
                  <th scope="col" className={headCellClass}>{t("table.stable")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {procedures.map((algorithm) => {
                  const row = ALGORITHM_COMPLEXITY[algorithm.id]!;
                  return (
                    <tr key={algorithm.id} className="hover:bg-surface-bright">
                      <NameCell algorithm={algorithm} />
                      <ComplexityCell value={row.best} />
                      <ComplexityCell value={row.average} />
                      <ComplexityCell value={row.worst} />
                      <ComplexityCell value={row.space} />
                      <td className={[cellClass, "font-semibold"].join(" ")}>
                        {row.stable === null
                          ? t("table.notApplicable")
                          : row.stable
                            ? t("table.yes")
                            : t("table.no")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
