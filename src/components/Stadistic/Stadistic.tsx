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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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

type ExportPayload = {
  prefix: string;
  title: string;
  subtitle: string;
  columns: string[];
  rows: string[][];
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

const formatPeriodo = (periodo: string) => {
  const match = periodo.match(/^(\d{4})-Q(\d)$/);
  if (match) {
    const [, year, quarter] = match;
    return `${year} - Trimestre ${quarter}`;
  }
  return periodo;
};

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  helper?: string;
  variant?: number;
}

const gradientVariants = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-purple-500 to-purple-600",
];

const MetricCard = ({ icon: Icon, title, value, helper, variant = 0 }: MetricCardProps) => (
  <article
    className={`flex min-h-[130px] flex-col justify-between rounded-2xl bg-gradient-to-r px-5 py-6 text-white shadow-lg shadow-black/10 transition hover:shadow-xl ${
      gradientVariants[variant % gradientVariants.length]
    }`}
  >
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-white/80">
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white">
        <Icon className="size-5" />
      </span>
      {title}
    </div>
    <div className="text-3xl font-semibold leading-tight">{value}</div>
    {helper ? <p className="text-sm text-white/80">{helper}</p> : null}
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

const buildFileName = (prefix: string, extension: "pdf") => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
};

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
        const value = alquileresResult.value;
        const isEmptyResponse =
          !value?.alquileres?.length && !value?.resumen_clientes?.length;

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

        if (rows.length) {
          const totalPrecioBase = ventasData.alquileres.reduce(
            (accumulator, alquiler) => accumulator + alquiler.precio_base,
            0
          );
          const totalSanciones = ventasData.alquileres.reduce(
            (accumulator, alquiler) => accumulator + alquiler.total_sanciones,
            0
          );
          const totalGeneral = ventasData.alquileres.reduce(
            (accumulator, alquiler) => accumulator + alquiler.total_general,
            0
          );

          rows.push([
            "Totales",
            "",
            "",
            "",
            "",
            "",
            "",
            formatCurrency(totalPrecioBase),
            formatCurrency(totalSanciones),
            formatCurrency(totalGeneral),
          ]);
        }

        return {
          prefix: "alquileres-por-cliente",
          title,
          subtitle,
          columns,
          rows,
        };
      }
      case "vehiculos": {
        const title = "Vehículos más alquilados";
        const columns = ["Ranking", "Marca", "Modelo", "Año", "Patente", "Alquileres"];
        const rows = vehiculosData.map((vehiculo, index) => [
          `${index + 1}`,
          vehiculo.marca,
          vehiculo.modelo,
          String(vehiculo.anio ?? "-"),
          vehiculo.patente ?? "-",
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
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Colors
      const primaryColor = [67, 56, 202]; // Indigo-700
      const secondaryColor = [14, 165, 233]; // Sky-500
      const accentColor = [34, 197, 94]; // Green-500
      const textColor = [31, 41, 55]; // Gray-800
      const lightGray = [243, 244, 246]; // Gray-100
      
      // Header with gradient effect
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 120, "F");
      
      // Company logo area (decorative circle)
      doc.setFillColor(255, 255, 255);
      doc.circle(40, 40, 20, "F");
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.circle(40, 40, 15, "F");
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text(exportData.title, 40, 90);
      
      // Subtitle bar
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(0, 120, pageWidth, 60, "F");
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const generatedDate = new Date().toLocaleString("es-AR", {
        dateStyle: "long",
        timeStyle: "short",
      });
      doc.text(`Generado: ${generatedDate}`, 40, 145);
      doc.text(exportData.subtitle, 40, 165);
      
      // Decorative line
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setLineWidth(3);
      doc.line(40, 190, pageWidth - 40, 190);
      
      // Table with autoTable
      autoTable(doc, {
        startY: 210,
        head: [exportData.columns],
        body: exportData.rows,
        theme: "grid",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: "bold",
          halign: "center",
          cellPadding: 8,
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 6,
          textColor: textColor,
        },
        alternateRowStyles: {
          fillColor: lightGray,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
        },
        styles: {
          lineColor: [209, 213, 219],
          lineWidth: 0.5,
        },
        margin: { left: 40, right: 40 },
        didDrawPage: () => {
          // Footer
          const footerY = pageHeight - 30;
          doc.setFontSize(9);
          doc.setTextColor(107, 114, 128);
          doc.setFont("helvetica", "normal");
          
          // Page number
          const pageNum = `Página ${doc.getCurrentPageInfo().pageNumber}`;
          doc.text(pageNum, pageWidth - 40, footerY, { align: "right" });
          
          // Company name or watermark
          doc.text("Sistema de Gestión de Alquileres", 40, footerY);
          
          // Decorative footer line
          doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.setLineWidth(1);
          doc.line(40, footerY - 10, pageWidth - 40, footerY - 10);
        },
      });
      
      // Add summary statistics if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalY = (doc as any).lastAutoTable.finalY || 210;
      
      if (selectedReport === "facturacion" && facturacionData.acumulado) {
        const summaryY = finalY + 30;
        
        // Summary box
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.roundedRect(40, summaryY, pageWidth - 80, 80, 5, 5, "F");
        
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.rect(40, summaryY, 5, 80, "F");
        
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Resumen Total", 55, summaryY + 25);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const summary = [
          `Alquileres: ${formatCurrency(facturacionData.acumulado.total_alquileres)}`,
          `Sanciones: ${formatCurrency(facturacionData.acumulado.total_sanciones)}`,
          `Total General: ${formatCurrency(facturacionData.acumulado.total_general)}`,
        ];
        
        summary.forEach((line, index) => {
          doc.text(line, 55, summaryY + 45 + index * 15);
        });
      }

      doc.save(buildFileName(exportData.prefix, "pdf"));
    } catch (error) {
      console.error("Error exporting report:", error);
      window.alert("Ocurrió un error al exportar el reporte.");
    }
  };

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

        <section className="space-y-3 rounded-3xl bg-white p-4 shadow-lg">
          <nav className="flex flex-wrap items-center gap-3">
            {reportOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`btn btn-circle border-none shadow-sm transition ${
                  selectedReport === option.key
                    ? "btn-primary text-base-100"
                    : "btn-ghost bg-base-100 text-base-content/70 hover:bg-base-200 hover:text-base-content"
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

        <section className="rounded-3xl border border-base-200 bg-white shadow-lg">
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

        {headerMetrics.length ? (
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {headerMetrics.map((metric, index) => (
                <MetricCard key={metric.title} variant={index} {...metric} />
              ))}
            </div>
          </section>
        ) : null}

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

        <div className="flex justify-end">
          <button
            className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/40"
            type="button"
            onClick={handleExportReport}
          >
            <Printer className="size-5" /> Exportar reporte en PDF
          </button>
        </div>
      </div>
    </div>
  );
}
