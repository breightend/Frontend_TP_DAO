import { CalendarDays, RotateCcw } from "lucide-react";
import type { Periodicidad } from "../../../types/reportes";

export interface Filters {
  dni: string;
  fechaDesde: string;
  fechaHasta: string;
  periodicidad: Periodicidad;
  incluirSanciones: boolean;
}

interface ReportFiltersProps {
  filters: Filters;
  showDniField: boolean;
  showPeriodicityField: boolean;
  showIncludeSancionesToggle: boolean;
  showDateFilters: boolean;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onResetFilters: () => void;
}

export default function ReportFilters({
  filters,
  showDniField,
  showPeriodicityField,
  showIncludeSancionesToggle,
  showDateFilters,
  onFilterChange,
  onResetFilters,
}: ReportFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-base-content">
          <CalendarDays className="size-5" />
          Filtros
        </h3>
        <button
          className="btn btn-ghost btn-sm gap-2"
          onClick={onResetFilters}
          type="button"
        >
          <RotateCcw className="size-4" />
          Restablecer
        </button>
      </div>

      <div className="space-y-3">
        {showDniField && (
          <div>
            <label className="label">
              <span className="label-text font-medium">DNI del cliente</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Ej: 12345678"
              value={filters.dni}
              onChange={(e) => onFilterChange("dni", e.target.value)}
            />
          </div>
        )}

        {showDateFilters && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">
                <span className="label-text font-medium">Fecha desde</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={filters.fechaDesde}
                onChange={(e) => onFilterChange("fechaDesde", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Fecha hasta</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={filters.fechaHasta}
                onChange={(e) => onFilterChange("fechaHasta", e.target.value)}
              />
            </div>
          </div>
        )}

        {showPeriodicityField && (
          <div>
            <label className="label">
              <span className="label-text font-medium">Periodicidad</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.periodicidad}
              onChange={(e) =>
                onFilterChange("periodicidad", e.target.value as Periodicidad)
              }
            >
              <option value="mes">Mensual</option>
              <option value="trimestre">Trimestral</option>
            </select>
          </div>
        )}

        {showIncludeSancionesToggle && (
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={filters.incluirSanciones}
                onChange={(e) =>
                  onFilterChange("incluirSanciones", e.target.checked)
                }
              />
              <span className="label-text font-medium">
                Incluir sanciones en el cálculo
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
