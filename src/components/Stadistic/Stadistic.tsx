import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Car,
  Medal,
  Printer,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  Periodicidad,
  VehiculoMasAlquilado,
} from "../../types/reportes";
import {
  mockAlquileresPorPeriodo,
  mockAlquileresResponse,
  mockFacturacionData,
  mockVehiculosMasAlquilados,
} from "./mockData";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const buildMockFacturacion = (includeSanciones: boolean): FacturacionData => ({
  ...mockFacturacionData,
  incluir_sanciones: includeSanciones,
  acumulado: { ...mockFacturacionData.acumulado },
  periodos: mockFacturacionData.periodos.map((periodo) => ({ ...periodo })),
});

type Filters = {
  dni: string;
  fechaDesde: string;
  fechaHasta: string;
  periodicidad: Periodicidad;
  incluirSanciones: boolean;
};

const defaultFilters: Filters = {
  dni: "",
  fechaDesde: "",
  fechaHasta: "",
  periodicidad: "mes",
  incluirSanciones: true,
};

type ReportKey = "alquileres" | "vehiculos" | "periodos" | "facturacion";

const reportOptions: {
  key: ReportKey;
  icon: LucideIcon;
  label: string;
  description: string;
}[] = [
  {
    key: "alquileres",
    icon: ShoppingCart,
    label: "Listado detallado de alquileres por cliente",
    description:
      "Analizá cada alquiler, totales por cliente y sanciones asociadas para entender el comportamiento individual.",
  },
  {
    key: "vehiculos",
    icon: Car,
    label: "Vehículos más alquilados",
    description:
      "Identificá los modelos con mayor demanda y planificá la rotación de tu flota con datos consolidados.",
  },
  {
    key: "periodos",
    icon: CalendarDays,
    label: "Alquileres por período (mes, trimestre)",
    description:
      "Observá cómo evolucionan los alquileres según la granularidad temporal elegida y detectá estacionalidades.",
  },
  {
    key: "facturacion",
    icon: BarChart3,
    label: "Estadística de facturación mensual",
    description:
      "Revisá los ingresos mes a mes (alquileres y sanciones) y proyectá objetivos con el gráfico de barras.",
  },
];

const extractErrorMessage = (reason: unknown) => {
  if (reason instanceof Error) {
    return reason.message;
  }
  if (typeof reason === "string") {
    return reason;
  }
  return "Revise la consola para más detalles.";
};

const formatCurrency = (value: number) =>
  Number.isFinite(value)
    ? value.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      })
    : "-";

const formatNumber = (value: number) => value.toLocaleString("es-AR");

const formatDate = (value: string) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  helper?: string;
}

const MetricCard = ({ icon: Icon, title, value, helper }: MetricCardProps) => (
  <article className="flex min-h-[130px] flex-col justify-between rounded-2xl border border-base-200 bg-base-100 px-5 py-6 shadow-sm">
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      {title}
    </div>
    <div className="text-3xl font-semibold leading-tight text-base-content">{value}</div>
    {helper ? <p className="text-sm text-base-content/60">{helper}</p> : null}
  </article>
);

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  highlight: string;
  description: string;
}

const InsightCard = ({ icon: Icon, title, highlight, description }: InsightCardProps) => (
  <article className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">{title}</h3>
        <p className="text-lg font-semibold text-base-content">{highlight}</p>
      </div>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-base-content/70">{description}</p>
  </article>
);

export default function Stadistic() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const [selectedReport, setSelectedReport] = useState<ReportKey>("facturacion");

  const [ventasData, setVentasData] = useState<AlquileresResponse>(() => clone(mockAlquileresResponse));
  const [vehiculosData, setVehiculosData] = useState<VehiculoMasAlquilado[]>(
    () => clone(mockVehiculosMasAlquilados)
  );
  const [facturacionData, setFacturacionData] = useState<FacturacionData>(() =>
    buildMockFacturacion(defaultFilters.incluirSanciones)
  );
  const [alquileresPeriodo, setAlquileresPeriodo] = useState<AlquilerPeriodo[]>(
    () => clone(mockAlquileresPorPeriodo)
  );

  const [ventasLoading, setVentasLoading] = useState<boolean>(false);
  const [autosLoading, setAutosLoading] = useState<boolean>(false);
  const [facturacionLoading, setFacturacionLoading] = useState<boolean>(false);
  const [periodoLoading, setPeriodoLoading] = useState<boolean>(false);

  const [ventasError, setVentasError] = useState<string | null>(null);
  const [autosError, setAutosError] = useState<string | null>(null);
  const [facturacionError, setFacturacionError] = useState<string | null>(null);
  const [periodoError, setPeriodoError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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

      if (!active) {
        return;
      }

      let refreshedAny = false;

      if (alquileresResult.status === "fulfilled") {
        setVentasData(alquileresResult.value);
        refreshedAny = true;
      } else {
        setVentasData(clone(mockAlquileresResponse));
        setVentasError(
          "Mostrando datos de referencia. No se pudieron cargar los alquileres por cliente: " +
            extractErrorMessage(alquileresResult.reason)
        );
      }
      setVentasLoading(false);

      if (vehiculosResult.status === "fulfilled") {
        setVehiculosData(vehiculosResult.value);
        refreshedAny = true;
      } else {
        setVehiculosData(clone(mockVehiculosMasAlquilados));
        setAutosError(
          "Mostrando datos de referencia. No se pudo obtener el ranking de vehículos: " +
            extractErrorMessage(vehiculosResult.reason)
        );
      }
      setAutosLoading(false);

      if (facturacionResult.status === "fulfilled") {
        setFacturacionData(facturacionResult.value);
        refreshedAny = true;
      } else {
        setFacturacionData(buildMockFacturacion(filters.incluirSanciones));
        setFacturacionError(
          "Mostrando datos de referencia. No se pudo obtener la facturación mensual: " +
            extractErrorMessage(facturacionResult.reason)
        );
      }
      setFacturacionLoading(false);

      if (periodoResult.status === "fulfilled") {
        setAlquileresPeriodo(periodoResult.value);
        refreshedAny = true;
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

  const facturacionChartData = useMemo(
    () =>
      facturacionData.periodos.map((periodo) => ({
        periodo: periodo.periodo,
        alquileres: periodo.total_alquileres,
        sanciones: periodo.total_sanciones,
        total: periodo.total_general,
      })),
    [facturacionData.periodos]
  );

  const totalGeneralClientes = useMemo(
    () =>
      ventasData.resumen_clientes.reduce(
        (accumulator, cliente) => accumulator + cliente.total_general,
        0
      ),
    [ventasData.resumen_clientes]
  );

  const totalAlquileresClientes = useMemo(
    () =>
      ventasData.resumen_clientes.reduce(
        (accumulator, cliente) => accumulator + cliente.cantidad_alquileres,
        0
      ),
    [ventasData.resumen_clientes]
  );

  const totalSancionesClientes = useMemo(
    () =>
      ventasData.resumen_clientes.reduce(
        (accumulator, cliente) => accumulator + cliente.total_sanciones,
        0
      ),
    [ventasData.resumen_clientes]
  );

  const totalAlquileresVehiculos = useMemo(
    () =>
      vehiculosData.reduce(
        (accumulator, vehiculo) => accumulator + vehiculo.cantidad_alquileres,
        0
      ),
    [vehiculosData]
  );

  const totalAlquileresPorPeriodo = useMemo(
    () =>
      alquileresPeriodo.reduce(
        (accumulator, registro) => accumulator + registro.cantidad_alquileres,
        0
      ),
    [alquileresPeriodo]
  );

  const totalFacturacionPorPeriodo = useMemo(
    () =>
      alquileresPeriodo.reduce(
        (accumulator, registro) => accumulator + registro.total_alquileres,
        0
      ),
    [alquileresPeriodo]
  );

  const promedioFacturacionPorPeriodo = alquileresPeriodo.length
    ? totalFacturacionPorPeriodo / alquileresPeriodo.length
    : 0;

  const mejorAgrupacion = useMemo(() => {
    if (!alquileresPeriodo.length) {
      return null;
    }
    return [...alquileresPeriodo].sort((a, b) => b.total_alquileres - a.total_alquileres)[0];
  }, [alquileresPeriodo]);

  const mejorPeriodoFacturacion = useMemo(() => {
    if (!facturacionData.periodos.length) {
      return null;
    }
    return [...facturacionData.periodos].sort((a, b) => b.total_general - a.total_general)[0];
  }, [facturacionData.periodos]);

  const topCliente = useMemo(() => {
    if (!ventasData.resumen_clientes.length) {
      return null;
    }
    return [...ventasData.resumen_clientes].sort((a, b) => b.total_general - a.total_general)[0];
  }, [ventasData.resumen_clientes]);

  const topVehiculo = useMemo(() => {
    if (!vehiculosData.length) {
      return null;
    }
    return [...vehiculosData].sort((a, b) => b.cantidad_alquileres - a.cantidad_alquileres)[0];
  }, [vehiculosData]);

  const periodRangeLabel = useMemo(() => {
    if (filters.fechaDesde || filters.fechaHasta) {
      const desde = filters.fechaDesde ? formatDate(filters.fechaDesde) : "Inicio";
      const hasta = filters.fechaHasta ? formatDate(filters.fechaHasta) : "Actualidad";
      return `${desde} → ${hasta}`;
    }

    const todasLasFechas = [
      ...facturacionData.periodos.map((periodo) => periodo.periodo),
      ...alquileresPeriodo.map((periodo) => periodo.periodo),
    ];

    if (todasLasFechas.length > 0) {
      const sorted = [...new Set(todasLasFechas)].sort((a, b) => a.localeCompare(b));
      const primero = sorted.at(0) ?? "";
      const ultimo = sorted.at(-1) ?? "";
      return `${primero} → ${ultimo}`;
    }

    return "Sin filtros activos";
  }, [facturacionData.periodos, alquileresPeriodo, filters.fechaDesde, filters.fechaHasta]);

  const headerMetrics = useMemo(() => {
    switch (selectedReport) {
      case "alquileres":
        return [
          {
            icon: TrendingUp,
            title: "Total facturado",
            value: formatCurrency(totalGeneralClientes),
            helper: `Incluye sanciones (${formatCurrency(totalSancionesClientes)})`,
          },
          {
            icon: ShoppingCart,
            title: "Alquileres registrados",
            value: formatNumber(ventasData.alquileres.length),
            helper: `${formatNumber(totalAlquileresClientes)} alquileres acumulados`,
          },
          {
            icon: Users,
            title: "Clientes con actividad",
            value: formatNumber(ventasData.resumen_clientes.length),
            helper: "Resumen consolidado por cliente",
          },
          {
            icon: CalendarDays,
            title: "Rango de datos",
            value: periodRangeLabel,
            helper: filters.fechaDesde || filters.fechaHasta ? "Rango filtrado" : "Rango disponible",
          },
        ];
      case "vehiculos":
        return [
          {
            icon: Car,
            title: "Vehículos rankeados",
            value: formatNumber(vehiculosData.length),
            helper: "Resultados según filtros de fecha",
          },
          {
            icon: BarChart3,
            title: "Alquileres acumulados",
            value: formatNumber(totalAlquileresVehiculos),
            helper: "Suma de alquileres en el período",
          },
          {
            icon: Medal,
            title: "Vehículo líder",
            value: topVehiculo ? `${topVehiculo.marca} ${topVehiculo.modelo}` : "Sin datos",
            helper: topVehiculo ? `${formatNumber(topVehiculo.cantidad_alquileres)} alquileres` : "Actualizá los filtros",
          },
          {
            icon: CalendarDays,
            title: "Rango de datos",
            value: periodRangeLabel,
            helper: "Fechas aplicadas al ranking",
          },
        ];
      case "periodos":
        return [
          {
            icon: CalendarDays,
            title: "Períodos analizados",
            value: formatNumber(alquileresPeriodo.length),
            helper: filters.periodicidad === "mes" ? "Agrupación mensual" : "Agrupación trimestral",
          },
          {
            icon: ShoppingCart,
            title: "Alquileres totales",
            value: formatNumber(totalAlquileresPorPeriodo),
            helper: "Volumen de operaciones",
          },
          {
            icon: TrendingUp,
            title: "Facturación acumulada",
            value: formatCurrency(totalFacturacionPorPeriodo),
            helper: "Sin sanciones (detalle en facturación)",
          },
          {
            icon: BarChart3,
            title: "Promedio por período",
            value: formatCurrency(promedioFacturacionPorPeriodo || 0),
            helper: "Referencia de ingresos",
          },
        ];
      case "facturacion":
      default:
        return [
          {
            icon: TrendingUp,
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
            icon: BarChart3,
            title: "Descuentos",
            value: formatCurrency(facturacionData.acumulado.total_descuentos),
            helper: "Datos registrados en el período",
          },
          {
            icon: Users,
            title: "Total general",
            value: formatCurrency(facturacionData.acumulado.total_general),
            helper: "Alquileres + sanciones",
          },
        ];
    }
  }, [
    selectedReport,
    ventasData,
    vehiculosData,
    facturacionData,
    alquileresPeriodo,
    totalGeneralClientes,
    totalAlquileresClientes,
    totalSancionesClientes,
    totalAlquileresVehiculos,
    totalAlquileresPorPeriodo,
    totalFacturacionPorPeriodo,
    promedioFacturacionPorPeriodo,
    periodRangeLabel,
    filters.incluirSanciones,
    filters.periodicidad,
    filters.fechaDesde,
    filters.fechaHasta,
    topVehiculo,
  ]);

  const insights = useMemo(() => {
    const items: InsightCardProps[] = [];

    switch (selectedReport) {
      case "alquileres":
        items.push({
          icon: Users,
          title: "Cliente destacado",
          highlight: topCliente ? `${topCliente.nombre} ${topCliente.apellido}` : "Sin datos",
          description: topCliente
            ? `${formatCurrency(topCliente.total_general)} facturados en ${formatNumber(topCliente.cantidad_alquileres)} alquileres.`
            : "Ajustá los filtros para identificar a tus mejores clientes.",
        });
        items.push({
          icon: ShoppingCart,
          title: "Alquiler con mayor importe",
          highlight: ventasData.alquileres.length
            ? formatCurrency(
                Math.max(...ventasData.alquileres.map((alquiler) => alquiler.total_general))
              )
            : "Sin datos",
          description:
            ventasData.alquileres.length > 0
              ? "Revisá el detalle del alquiler para conocer al cliente, vehículo y sanciones."
              : "No hay alquileres en el rango seleccionado.",
        });
        break;
      case "vehiculos":
        items.push({
          icon: Car,
          title: "Vehículo líder",
          highlight: topVehiculo
            ? `${topVehiculo.marca} ${topVehiculo.modelo} · ${topVehiculo.anio}`
            : "Sin datos",
          description: topVehiculo
            ? `${formatNumber(topVehiculo.cantidad_alquileres)} alquileres en el período seleccionado.`
            : "Probá ampliando el rango para ver resultados.",
        });
        items.push({
          icon: BarChart3,
          title: "Ranking consolidado",
          highlight: formatNumber(totalAlquileresVehiculos),
          description: "Suma de alquileres entre todos los vehículos rankeados.",
        });
        break;
      case "periodos":
        items.push({
          icon: CalendarDays,
          title: "Período con mayor ingresos",
          highlight: mejorAgrupacion ? mejorAgrupacion.periodo : "Sin datos",
          description: mejorAgrupacion
            ? `${formatCurrency(mejorAgrupacion.total_alquileres)} facturados con ${formatNumber(mejorAgrupacion.cantidad_alquileres)} alquileres.`
            : "Seleccioná otro rango o granularidad para ver tendencias.",
        });
        items.push({
          icon: TrendingUp,
          title: "Promedio por período",
          highlight: formatCurrency(promedioFacturacionPorPeriodo || 0),
          description: "Referencia útil para metas y proyecciones de demanda.",
        });
        break;
      case "facturacion":
      default:
        items.push({
          icon: Medal,
          title: "Período más rentable",
          highlight: mejorPeriodoFacturacion ? mejorPeriodoFacturacion.periodo : "Sin datos",
          description: mejorPeriodoFacturacion
            ? `${formatCurrency(mejorPeriodoFacturacion.total_general)} entre alquileres y sanciones.`
            : "Ajustá los filtros para identificar picos de facturación.",
        });
        items.push({
          icon: ShoppingCart,
          title: "Ingresos por sanciones",
          highlight: formatCurrency(facturacionData.acumulado.total_sanciones),
          description: filters.incluirSanciones
            ? "Se incluyen sanciones dentro del total general."
            : "Activá la opción de sanciones para incluir este monto.",
        });
        break;
    }

    return items;
  }, [
    selectedReport,
    topCliente,
    topVehiculo,
    mejorAgrupacion,
    mejorPeriodoFacturacion,
    ventasData.alquileres,
    totalAlquileresVehiculos,
    facturacionData,
    filters.incluirSanciones,
    promedioFacturacionPorPeriodo,
  ]);

  const renderReportContent = () => {
    switch (selectedReport) {
      case "alquileres":
        return (
          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">Detalle de alquileres por cliente</h2>
              <p className="text-sm text-base-content/60">
                Revisá la tabla consolidada con totales por cliente y el detalle de cada alquiler.
              </p>
              <div className="mt-6">
                <VentasStadistics
                  resumenClientes={ventasData.resumen_clientes}
                  alquileres={ventasData.alquileres}
                  isLoading={ventasLoading}
                  error={ventasError}
                />
              </div>
            </div>
          </div>
        );
      case "vehiculos":
        return (
          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">Vehículos más alquilados</h2>
              <p className="text-sm text-base-content/60">
                Ordená tus decisiones de flota con el ranking actualizado de alquileres por vehículo.
              </p>
              <div className="mt-6">
                <AutosStadistics
                  vehiculos={vehiculosData}
                  isLoading={autosLoading}
                  error={autosError}
                />
              </div>
            </div>
          </div>
        );
      case "periodos":
        return (
          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">
                Alquileres agrupados por {filters.periodicidad === "mes" ? "mes" : "trimestre"}
              </h2>
              <p className="text-sm text-base-content/60">
                Observá el comportamiento temporal de la demanda con totales por período.
              </p>
              <div className="mt-6">
                {periodoLoading ? (
                  <p className="text-center text-base-content/50">Cargando agrupamientos...</p>
                ) : periodoError ? (
                  <div className="alert alert-warning text-sm">
                    <span>{periodoError}</span>
                  </div>
                ) : alquileresPeriodo.length === 0 ? (
                  <p className="text-center text-base-content/50">
                    No se registraron alquileres para los filtros seleccionados.
                  </p>
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
                            <td className="font-mono text-sm">{item.periodo}</td>
                            <td className="text-right">{formatNumber(item.cantidad_alquileres)}</td>
                            <td className="text-right">{formatCurrency(item.total_alquileres)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "facturacion":
      default:
        return (
          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body space-y-6">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="card-title text-lg font-semibold">Estadística de facturación mensual</h2>
                  <p className="text-sm text-base-content/60">
                    Evaluá el desempeño financiero mes a mes entre alquileres y sanciones.
                  </p>
                </div>
                {facturacionLoading ? (
                  <span className="badge badge-outline badge-info">Actualizando datos...</span>
                ) : null}
              </header>

              {facturacionError ? (
                <div className="alert alert-warning text-sm">
                  <span>{facturacionError}</span>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="stat rounded-2xl border border-base-200 bg-base-100">
                  <div className="stat-title">Facturación por alquileres</div>
                  <div className="stat-value text-primary">
                    {formatCurrency(facturacionData.acumulado.total_alquileres)}
                  </div>
                  <div className="stat-desc">Subtotal sin sanciones</div>
                </div>
                <div className="stat rounded-2xl border border-base-200 bg-base-100">
                  <div className="stat-title">Ingresos por sanciones</div>
                  <div className="stat-value text-secondary">
                    {formatCurrency(facturacionData.acumulado.total_sanciones)}
                  </div>
                  <div className="stat-desc">Se actualiza según el toggle</div>
                </div>
                <div className="stat rounded-2xl border border-base-200 bg-base-100">
                  <div className="stat-title">Descuentos aplicados</div>
                  <div className="stat-value text-info">
                    {formatCurrency(facturacionData.acumulado.total_descuentos)}
                  </div>
                  <div className="stat-desc">Actualmente sin registros</div>
                </div>
                <div className="stat rounded-2xl border border-base-200 bg-base-100">
                  <div className="stat-title">Total general</div>
                  <div className="stat-value text-success">
                    {formatCurrency(facturacionData.acumulado.total_general)}
                  </div>
                  <div className="stat-desc">Alquileres + sanciones</div>
                </div>
              </div>

              <div className="rounded-2xl border border-base-200 bg-base-100 p-5">
                <h3 className="text-base font-semibold">Evolución por período</h3>
                <p className="text-sm text-base-content/60">
                  Compará alquileres, sanciones y total facturado en cada intervalo.
                </p>
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
            </div>
          </div>
        );
    }
  };

  const activeReport = reportOptions.find((option) => option.key === selectedReport);

  const showDniField = selectedReport === "alquileres";
  const showPeriodicityField = selectedReport === "periodos";
  const showIncludeSancionesToggle = selectedReport === "facturacion";
  const showDateFilters = true;

  const handleBackArrow = () => setLocation("/");

  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="rounded-3xl border border-base-200 bg-base-100 shadow-lg">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-6">
            <button
              className="inline-flex size-11 items-center justify-center rounded-full border border-base-300 text-base-content/60 transition hover:border-base-400 hover:text-base-content"
              onClick={handleBackArrow}
              type="button"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Panel de insights
                </span>
                <h1 className="text-3xl font-semibold leading-tight text-base-content sm:text-4xl">
                  Reportes de alquileres y facturación
                </h1>
                <p className="text-sm text-base-content/70 sm:text-base">
                  Explorá el rendimiento del negocio y detectá tendencias en cuestión de segundos.
                </p>
              </div>
              <div className="text-sm text-base-content/70">
                <span className="block text-xs uppercase tracking-wide">Actualizado</span>
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

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {headerMetrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </div>
          </div>
        </div>
      </header>
      <div className="space-y-8 px-4 sm:px-6 lg:px-10">
        <section className="space-y-3">
          <nav className="menu menu-horizontal rounded-box bg-base-200 p-2">
            {reportOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`btn btn-circle tooltip transition ${
                  selectedReport === option.key
                    ? "btn-primary text-base-100"
                    : "btn-ghost text-base-content/70 hover:text-base-content"
                }`}
                data-tip={option.label}
                aria-pressed={selectedReport === option.key}
                onClick={() => setSelectedReport(option.key)}
              >
                <option.icon className="size-5" />
              </button>
            ))}
          </nav>
          {activeReport ? (
            <p className="text-sm text-base-content/60">
              {activeReport.description}
            </p>
          ) : null}
        </section>

        <section className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body space-y-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="card-title text-lg font-semibold">Configurá los filtros</h2>
                <p className="text-sm text-base-content/60">
                  Personalizá los parámetros para el reporte seleccionado.
                </p>
              </div>
              <button className="btn btn-link btn-sm" type="button" onClick={handleResetFilters}>
                Restablecer
              </button>
            </header>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {showDniField ? (
                <label className="form-control">
                  <span className="label-text">DNI del cliente</span>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Ej: 12345678"
                    value={filters.dni}
                    onChange={(event) => handleFilterChange("dni", event.target.value)}
                  />
                </label>
              ) : null}

              {showDateFilters ? (
                <label className="form-control">
                  <span className="label-text">Fecha desde</span>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={filters.fechaDesde}
                    onChange={(event) => handleFilterChange("fechaDesde", event.target.value)}
                  />
                </label>
              ) : null}

              {showDateFilters ? (
                <label className="form-control">
                  <span className="label-text">Fecha hasta</span>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={filters.fechaHasta}
                    onChange={(event) => handleFilterChange("fechaHasta", event.target.value)}
                  />
                </label>
              ) : null}

              {showPeriodicityField ? (
                <label className="form-control">
                  <span className="label-text">Agrupación por período</span>
                  <select
                    className="select select-bordered"
                    value={filters.periodicidad}
                    onChange={(event) =>
                      handleFilterChange(
                        "periodicidad",
                        event.target.value as Filters["periodicidad"]
                      )
                    }
                  >
                    <option value="mes">Mensual</option>
                    <option value="trimestre">Trimestral</option>
                  </select>
                </label>
              ) : null}
            </div>

            {showIncludeSancionesToggle ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-base-200/60 p-4">
                <label className="label cursor-pointer gap-3">
                  <span className="label-text">Incluir sanciones en la facturación</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={filters.incluirSanciones}
                    onChange={(event) => handleFilterChange("incluirSanciones", event.target.checked)}
                  />
                </label>
                <p className="text-xs text-base-content/60">
                  Las sanciones se suman al total general y se reflejan en el gráfico.
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
          <div className="space-y-6">{renderReportContent()}</div>
          {insights.length ? (
            <aside className="space-y-6">
              {insights.map((insight) => (
                <InsightCard key={insight.title} {...insight} />
              ))}
            </aside>
          ) : null}
        </section>

        <div className="flex items-center justify-end">
          <button className="btn btn-outline btn-primary" type="button">
            <Printer className="mr-2" /> Exportar reporte
          </button>
        </div>
      </div>
    </div>
  );
}
