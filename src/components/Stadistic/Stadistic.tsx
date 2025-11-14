import { ArrowLeft, BarChart3, Printer, ShoppingCart, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AutosStadistics from "./AutosStadistics";
import VentasStadistics from "./VentasStadistics";
import MetricCard from "./components/MetricCard";
import ReportFilters, { type Filters } from "./components/ReportFilters";

import {
  fetchAlquileresDetallados,
  fetchAlquileresPorPeriodo,
  fetchFacturacionMensual,
  fetchVehiculosMasAlquilados,
} from "../../services/reportService";

import type {
  AlquileresResponse,
  AlquilerPeriodo,
  FacturacionData,
  VehiculoMasAlquilado,
} from "../../types/reportes";

import {
  mockAlquileresPorPeriodo,
  mockAlquileresResponse,
  mockFacturacionData,
  mockVehiculosMasAlquilados,
} from "./mockData";

import { reportOptions, type ReportKey } from "./constants/reportOptions";
import {
  clone,
  extractErrorMessage,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPeriodo,
} from "./utils/formatters";
import { exportToPDF, buildFileName, type ExportPayload } from "./utils/pdfExporter";

const defaultFilters: Filters = {
  dni: "",
  fechaDesde: "",
  fechaHasta: "",
  periodicidad: "mes",
  incluirSanciones: true,
};

const buildMockFacturacion = (includeSanciones: boolean): FacturacionData => ({
  ...mockFacturacionData,
  incluir_sanciones: includeSanciones,
  acumulado: { ...mockFacturacionData.acumulado },
  periodos: mockFacturacionData.periodos.map((periodo) => ({ ...periodo })),
});

export default function Stadistic() {
  const [, setLocation] = useLocation();
  const [selectedReport, setSelectedReport] = useState<ReportKey>("facturacion");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Data states
  const [ventasData, setVentasData] = useState<AlquileresResponse>(clone(mockAlquileresResponse));
  const [vehiculosData, setVehiculosData] = useState<VehiculoMasAlquilado[]>(clone(mockVehiculosMasAlquilados));
  const [facturacionData, setFacturacionData] = useState<FacturacionData>(buildMockFacturacion(true));
  const [alquileresPeriodo, setAlquileresPeriodo] = useState<AlquilerPeriodo[]>(clone(mockAlquileresPorPeriodo));

  // Loading states
  const [ventasLoading, setVentasLoading] = useState(false);
  const [autosLoading, setAutosLoading] = useState(false);
  const [facturacionLoading, setFacturacionLoading] = useState(false);
  const [periodoLoading, setPeriodoLoading] = useState(false);

  // Error states
  const [ventasError, setVentasError] = useState<string | null>(null);
  const [autosError, setAutosError] = useState<string | null>(null);
  const [facturacionError, setFacturacionError] = useState<string | null>(null);
  const [periodoError, setPeriodoError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setVentasLoading(true);
      setAutosLoading(true);
      setFacturacionLoading(true);
      setPeriodoLoading(true);

      setVentasError(null);
      setAutosError(null);
      setFacturacionError(null);
      setPeriodoError(null);

      const [alquileresResult, vehiculosResult, facturacionResult, periodoResult] =
        await Promise.allSettled([
          fetchAlquileresDetallados({
            dni: filters.dni || undefined,
            fechaDesde: filters.fechaDesde || undefined,
            fechaHasta: filters.fechaHasta || undefined,
          }),
          fetchVehiculosMasAlquilados({
            fechaDesde: filters.fechaDesde || undefined,
            fechaHasta: filters.fechaHasta || undefined,
            limit: 10,
          }),
          fetchFacturacionMensual({
            fechaDesde: filters.fechaDesde || undefined,
            fechaHasta: filters.fechaHasta || undefined,
            incluirSanciones: filters.incluirSanciones,
          }),
          fetchAlquileresPorPeriodo({
            periodicidad: filters.periodicidad,
            fechaDesde: filters.fechaDesde || undefined,
            fechaHasta: filters.fechaHasta || undefined,
          }),
        ]);

      if (!active) return;

      let refreshedAny = false;

      // Handle alquileres
      if (alquileresResult.status === "fulfilled") {
        const value = alquileresResult.value;
        const isEmptyResponse = !value?.alquileres?.length && !value?.resumen_clientes?.length;

        if (isEmptyResponse) {
          setVentasData(clone(mockAlquileresResponse));
          setVentasError("Mostrando datos de referencia. No hay alquileres registrados para los filtros actuales.");
        } else {
          setVentasData(value);
          refreshedAny = true;
        }
      } else {
        setVentasData(clone(mockAlquileresResponse));
        setVentasError(
          "Mostrando datos de referencia. No se pudieron cargar los alquileres por cliente: " +
            extractErrorMessage(alquileresResult.reason)
        );
      }
      setVentasLoading(false);

      // Handle vehiculos
      if (vehiculosResult.status === "fulfilled") {
        const value = vehiculosResult.value;
        const isEmptyResponse = !value?.length;

        if (isEmptyResponse) {
          setVehiculosData(clone(mockVehiculosMasAlquilados));
          setAutosError("Mostrando datos de referencia. No hay vehículos con alquileres en el período seleccionado.");
        } else {
          setVehiculosData(value);
          refreshedAny = true;
        }
      } else {
        setVehiculosData(clone(mockVehiculosMasAlquilados));
        setAutosError(
          "Mostrando datos de referencia. No se pudo obtener el ranking de vehículos: " +
            extractErrorMessage(vehiculosResult.reason)
        );
      }
      setAutosLoading(false);

      // Handle facturacion
      if (facturacionResult.status === "fulfilled") {
        const value = facturacionResult.value;
        const isEmptyResponse = !value?.periodos?.length;

        if (isEmptyResponse) {
          setFacturacionData(buildMockFacturacion(filters.incluirSanciones));
          setFacturacionError("Mostrando datos de referencia. No hay movimientos de facturación para los filtros elegidos.");
        } else {
          setFacturacionData(value);
          refreshedAny = true;
        }
      } else {
        setFacturacionData(buildMockFacturacion(filters.incluirSanciones));
        setFacturacionError(
          "Mostrando datos de referencia. No se pudo obtener la facturación mensual: " +
            extractErrorMessage(facturacionResult.reason)
        );
      }
      setFacturacionLoading(false);

      // Handle periodo
      if (periodoResult.status === "fulfilled") {
        const value = periodoResult.value;
        const isEmptyResponse = !value?.length;

        if (isEmptyResponse) {
          setAlquileresPeriodo(clone(mockAlquileresPorPeriodo));
          setPeriodoError("Mostrando datos de referencia. No hay agrupamientos disponibles para los filtros aplicados.");
        } else {
          setAlquileresPeriodo(value);
          refreshedAny = true;
        }
      } else {
        setAlquileresPeriodo(clone(mockAlquileresPorPeriodo));
        setPeriodoError(
          "Mostrando datos de referencia. No se pudo obtener el agrupamiento por período: " +
            extractErrorMessage(periodoResult.reason)
        );
      }
      setPeriodoLoading(false);

      if (refreshedAny) {
        setLastUpdate(new Date());
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [filters]);

  const facturacionChartData = useMemo(() => {
    return facturacionData.periodos.map((periodo) => ({
      periodo: periodo.periodo,
      alquileres: periodo.total_alquileres,
      sanciones: periodo.total_sanciones,
      total: periodo.total_general,
    }));
  }, [facturacionData]);

  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  const handleBackArrow = () => setLocation("/");

  const buildExportData = (): ExportPayload => {
    const filterParts: string[] = [];
    if (filters.dni) {
      filterParts.push(`DNI ${filters.dni}`);
    }
    if (filters.fechaDesde || filters.fechaHasta) {
      const desde = filters.fechaDesde ? formatDate(filters.fechaDesde) : "Inicio";
      const hasta = filters.fechaHasta ? formatDate(filters.fechaHasta) : "Actualidad";
      filterParts.push(`${desde} → ${hasta}`);
    }
    filterParts.push(filters.incluirSanciones ? "Incluye sanciones" : "Sin sanciones");
    const subtitle = filterParts.filter(Boolean).join(" • ") || "Sin filtros adicionales";

    switch (selectedReport) {
      case "alquileres": {
        const title = "Listado detallado de alquileres por cliente";
        const columns = [
          "Cliente",
          "DNI",
          "Email",
          "Vehículo",
          "Patente",
          "Fechas",
          "ID",
          "Precio base",
          "Sanciones",
          "Total",
        ];

        const rows = ventasData.alquileres.map((alquiler) => [
          `${alquiler.cliente?.nombre ?? ""} ${alquiler.cliente?.apellido ?? ""}`.trim() || "-",
          alquiler.cliente?.dni ?? "-",
          alquiler.cliente?.email ?? "-",
          `${alquiler.vehiculo?.marca ?? ""} ${alquiler.vehiculo?.modelo ?? ""}`.trim() || "-",
          alquiler.vehiculo?.patente ?? "-",
          `${alquiler.fecha_inicio} → ${alquiler.fecha_fin}`,
          `#${alquiler.id_alquiler}`,
          formatCurrency(alquiler.precio_base),
          formatCurrency(alquiler.total_sanciones),
          formatCurrency(alquiler.total_general),
        ]);

        return {
          prefix: "alquileres-detallados",
          title,
          subtitle,
          columns,
          rows,
        };
      }
      case "vehiculos": {
        const title = "Vehículos más alquilados";
        const columns = ["Patente", "Marca", "Modelo", "Año", "Cantidad de alquileres"];
        const rows = vehiculosData.map((vehiculo) => [
          vehiculo.patente,
          vehiculo.marca,
          vehiculo.modelo,
          vehiculo.anio.toString(),
          formatNumber(vehiculo.cantidad_alquileres),
        ]);

        return {
          prefix: "vehiculos-mas-alquilados",
          title,
          subtitle,
          columns,
          rows,
        };
      }
      case "periodos": {
        const title = `Alquileres agrupados por ${filters.periodicidad === "mes" ? "mes" : "trimestre"}`;
        const columns = ["Período", "Cantidad", "Total alquileres"];
        const rows = alquileresPeriodo.map((registro) => [
          formatPeriodo(registro.periodo),
          formatNumber(registro.cantidad_alquileres),
          formatCurrency(registro.total_alquileres),
        ]);

        if (rows.length) {
          const totalCantidad = alquileresPeriodo.reduce(
            (accumulator, registro) => accumulator + registro.cantidad_alquileres,
            0
          );
          const totalMonto = alquileresPeriodo.reduce(
            (accumulator, registro) => accumulator + registro.total_alquileres,
            0
          );
          rows.push([
            "Totales",
            formatNumber(totalCantidad),
            formatCurrency(totalMonto),
          ]);
        }

        return {
          prefix: `alquileres-por-${filters.periodicidad}`,
          title,
          subtitle,
          columns,
          rows,
        };
      }
      case "facturacion":
      default: {
        const title = "Estadística de facturación mensual";
        const columns = ["Período", "Alquileres", "Sanciones", "Total"];
        const rows = facturacionData.periodos.map((periodo) => [
          periodo.periodo,
          formatCurrency(periodo.total_alquileres),
          formatCurrency(periodo.total_sanciones),
          formatCurrency(periodo.total_general),
        ]);

        if (rows.length) {
          rows.push([
            "Acumulado",
            formatCurrency(facturacionData.acumulado.total_alquileres),
            formatCurrency(facturacionData.acumulado.total_sanciones),
            formatCurrency(facturacionData.acumulado.total_general),
          ]);
        }

        return {
          prefix: "facturacion-mensual",
          title,
          subtitle,
          columns,
          rows,
        };
      }
    }
  };

  const handleExportReport = () => {
    const exportData = buildExportData();

    if (!exportData.rows.length) {
      window.alert("No hay datos disponibles para exportar en este reporte.");
      return;
    }

    try {
      const doc = exportToPDF({
        exportData,
        selectedReport,
        facturacionData: selectedReport === "facturacion" ? facturacionData : undefined,
        formatCurrency,
      });

      doc.save(buildFileName(exportData.prefix, "pdf"));
    } catch (error) {
      console.error("Error exporting report:", error);
      window.alert("Ocurrió un error al exportar el reporte.");
    }
  };

  const activeReport = reportOptions.find((option) => option.key === selectedReport);
  const showDniField = selectedReport === "alquileres";
  const showPeriodicityField = selectedReport === "periodos";
  const showIncludeSancionesToggle = selectedReport === "facturacion";
  const showDateFilters = true;

  // Metric cards for header
  const headerMetrics = useMemo(() => {
    if (selectedReport === "facturacion") {
      return [
        {
          icon: BarChart3,
          title: "Facturación por alquileres",
          value: formatCurrency(facturacionData.acumulado.total_alquileres),
          helper: "Subtotal sin sanciones",
        },
        {
          icon: ShoppingCart,
          title: "Ingresos por sanciones",
          value: formatCurrency(facturacionData.acumulado.total_sanciones),
          helper: filters.incluirSanciones ? "Incluyendo sanciones" : "No incluidas",
        },
        {
          icon: Users,
          title: "Total general",
          value: formatCurrency(facturacionData.acumulado.total_general),
          helper: "Alquileres + sanciones",
        },
      ];
    }
    return [];
  }, [selectedReport, facturacionData, filters.incluirSanciones]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-base-200 bg-white shadow-xl">
          <div className="px-6 py-8 sm:px-10">
            <div className="flex flex-col gap-6">
              <button
                className="btn btn-ghost w-fit gap-2 text-sm font-medium"
                onClick={handleBackArrow}
                type="button"
              >
                <ArrowLeft className="size-4" /> Volver al inicio
              </button>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-base-content">
                    Gestión de reportes
                  </h1>
                  <p className="text-base text-base-content/70 max-w-2xl">
                    Explorá el rendimiento del negocio, analizá la facturación y anticipá decisiones clave para tu flota.
                  </p>
                </div>
                <div className="text-sm text-base-content/70">
                  <span className="block text-xs uppercase tracking-wide">Última actualización</span>
                  <span className="font-semibold text-base-content">
                    {lastUpdate
                      ? lastUpdate.toLocaleString("es-AR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Datos de demostración"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-base-content">
                Tipo de reporte
              </h2>
              <div className="space-y-2">
                {reportOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`btn w-full justify-start gap-3 ${
                      selectedReport === option.key
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                    onClick={() => setSelectedReport(option.key)}
                    type="button"
                  >
                    <option.icon className="size-5" />
                    <span className="text-left text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-lg">
              <ReportFilters
                filters={filters}
                showDniField={showDniField}
                showPeriodicityField={showPeriodicityField}
                showIncludeSancionesToggle={showIncludeSancionesToggle}
                showDateFilters={showDateFilters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          </aside>

          <main className="space-y-6">
            {activeReport && (
              <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-base-content">
                      {activeReport.label}
                    </h2>
                    <p className="mt-1 text-sm text-base-content/70">
                      {activeReport.description}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary gap-2"
                    onClick={handleExportReport}
                    type="button"
                  >
                    <Printer className="size-4" />
                    Exportar PDF
                  </button>
                </div>
              </div>
            )}

            {headerMetrics.length > 0 && (
              <section className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {headerMetrics.map((metric, index) => (
                    <MetricCard key={metric.title} variant={index} {...metric} />
                  ))}
                </div>
              </section>
            )}

            <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                {selectedReport === "alquileres" && (
                  <VentasStadistics
                    resumenClientes={ventasData.resumen_clientes}
                    alquileres={ventasData.alquileres}
                    isLoading={ventasLoading}
                    error={ventasError}
                  />
                )}

                {selectedReport === "vehiculos" && (
                  <AutosStadistics
                    vehiculos={vehiculosData}
                    isLoading={autosLoading}
                    error={autosError}
                  />
                )}

                {selectedReport === "periodos" && (
                  <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-lg">
                    <header className="mb-6">
                      <h3 className="text-xl font-semibold text-base-content">
                        Alquileres por {filters.periodicidad}
                      </h3>
                    </header>

                    {periodoError && (
                      <div className="alert alert-warning text-sm mb-4">
                        <span>{periodoError}</span>
                      </div>
                    )}

                    {periodoLoading ? (
                      <div className="flex h-64 items-center justify-center text-base-content/50">
                        Cargando datos...
                      </div>
                    ) : alquileresPeriodo.length === 0 ? (
                      <div className="flex h-64 items-center justify-center text-base-content/50">
                        No hay datos para mostrar.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Período</th>
                              <th className="text-right">Cantidad</th>
                              <th className="text-right">Total alquileres</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alquileresPeriodo.map((item) => (
                              <tr key={item.periodo}>
                                <td className="font-mono text-sm">{formatPeriodo(item.periodo)}</td>
                                <td className="text-right">{formatNumber(item.cantidad_alquileres)}</td>
                                <td className="text-right">{formatCurrency(item.total_alquileres)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {selectedReport === "facturacion" && (
                  <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-lg">
                    <header className="mb-6 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-base-content">
                        Facturación mensual
                      </h3>
                    </header>

                    {facturacionError && (
                      <div className="alert alert-warning text-sm mb-4">
                        <span>{facturacionError}</span>
                      </div>
                    )}

                    <div className="mt-4 h-[320px]">
                      {facturacionLoading ? (
                        <div className="flex h-full items-center justify-center text-base-content/50">
                          Cargando facturación...
                        </div>
                      ) : facturacionChartData.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-base-content/50">
                          No hay datos para los filtros seleccionados.
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={facturacionChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="periodo" tickMargin={8} />
                            <YAxis
                              tickFormatter={(value) =>
                                formatCurrency(value).replace("ARS", "").trim()
                              }
                            />
                            <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="alquileres" fill="#4338ca" name="Alquileres" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="sanciones" fill="#0ea5e9" name="Sanciones" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="total" fill="#22c55e" name="Total" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
