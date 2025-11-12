import { ArrowLeft, Car, Printer, ShoppingCart, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import VentasStadistics from "./VentasStadistics";
import AutosStadistics from "./AutosStadistics";
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

type TabKey = "general" | "estadisticas-ventas" | "estadisticas-autos";

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

const emptyFacturacion: FacturacionData = {
  periodos: [],
  acumulado: {
    total_alquileres: 0,
    total_sanciones: 0,
    total_descuentos: 0,
    total_general: 0,
  },
  incluir_sanciones: true,
};

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

export default function Stadistic() {
  const [, setLocation] = useLocation();
  const [verStadisticas, setVerStadisticas] = useState<TabKey>("general");
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });

  const [ventasData, setVentasData] = useState<AlquileresResponse>({
    alquileres: [],
    resumen_clientes: [],
  });
  const [vehiculosData, setVehiculosData] = useState<VehiculoMasAlquilado[]>([]);
  const [facturacionData, setFacturacionData] = useState<FacturacionData>(
    emptyFacturacion
  );
  const [alquileresPeriodo, setAlquileresPeriodo] = useState<AlquilerPeriodo[]>([]);

  const [ventasLoading, setVentasLoading] = useState<boolean>(false);
  const [ventasError, setVentasError] = useState<string | null>(null);
  const [autosLoading, setAutosLoading] = useState<boolean>(false);
  const [autosError, setAutosError] = useState<string | null>(null);
  const [facturacionLoading, setFacturacionLoading] = useState<boolean>(false);
  const [facturacionError, setFacturacionError] = useState<string | null>(null);
  const [periodoLoading, setPeriodoLoading] = useState<boolean>(false);
  const [periodoError, setPeriodoError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

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

      if (canceled) {
        return;
      }

      if (alquileresResult.status === "fulfilled") {
        setVentasData(alquileresResult.value);
      } else {
        setVentasData({ alquileres: [], resumen_clientes: [] });
        setVentasError(
          "No se pudieron cargar los alquileres por cliente. " +
            extractErrorMessage(alquileresResult.reason)
        );
      }
      setVentasLoading(false);

      if (vehiculosResult.status === "fulfilled") {
        setVehiculosData(vehiculosResult.value);
      } else {
        setVehiculosData([]);
        setAutosError(
          "No se pudo obtener el ranking de vehículos. " +
            extractErrorMessage(vehiculosResult.reason)
        );
      }
      setAutosLoading(false);

      if (facturacionResult.status === "fulfilled") {
        setFacturacionData(facturacionResult.value);
      } else {
        setFacturacionData({
          ...emptyFacturacion,
          incluir_sanciones: filters.incluirSanciones,
        });
        setFacturacionError(
          "No se pudo obtener la facturación mensual. " +
            extractErrorMessage(facturacionResult.reason)
        );
      }
      setFacturacionLoading(false);

      if (periodoResult.status === "fulfilled") {
        setAlquileresPeriodo(periodoResult.value);
      } else {
        setAlquileresPeriodo([]);
        setPeriodoError(
          "No se pudo obtener el agrupamiento por período. " +
            extractErrorMessage(periodoResult.reason)
        );
      }
      setPeriodoLoading(false);
    };

    loadData();

    return () => {
      canceled = true;
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

  const handleBackArrow = () => {
    setLocation("/");
  };

  const handleMenu = (ver: TabKey) => {
    setVerStadisticas(ver);
  };

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  const handleFilterChange = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="gap-2 flex items-center mb-4">
        <ArrowLeft
          className="btn btn-circle btn-ghost"
          onClick={handleBackArrow}
        />
        <h1 className="text-3xl font-mono font-semibold">
          Registro y estadísticas
        </h1>
      </div>

      <div className="bg-base-200 rounded-box p-4 mb-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
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

          <label className="form-control">
            <span className="label-text">Fecha desde</span>
            <input
              type="date"
              className="input input-bordered"
              value={filters.fechaDesde}
              onChange={(event) => handleFilterChange("fechaDesde", event.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Fecha hasta</span>
            <input
              type="date"
              className="input input-bordered"
              value={filters.fechaHasta}
              onChange={(event) => handleFilterChange("fechaHasta", event.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text">Periodicidad</span>
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
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="label cursor-pointer gap-3">
            <span className="label-text">Incluir sanciones en facturación</span>
            <input
              type="checkbox"
              className="toggle"
              checked={filters.incluirSanciones}
              onChange={(event) => handleFilterChange("incluirSanciones", event.target.checked)}
            />
          </label>

          <button className="btn btn-ghost btn-sm" onClick={handleResetFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <ul className="menu bg-base-200 lg:menu-horizontal rounded-box">
        <li>
          <a
            className={verStadisticas === "estadisticas-ventas" ? "active" : ""}
            onClick={() => handleMenu("estadisticas-ventas")}
          >
            <ShoppingCart />
            Ventas
          </a>
        </li>
        <li>
          <a
            className={verStadisticas === "estadisticas-autos" ? "active" : ""}
            onClick={() => handleMenu("estadisticas-autos")}
          >
            <Car />
            Autos
          </a>
        </li>
        <li>
          <a
            className={verStadisticas === "general" ? "active" : ""}
            onClick={() => handleMenu("general")}
          >
            <BarChart3 />
            General
            <span className="badge badge-xs badge-info" />
          </a>
        </li>
      </ul>

      {verStadisticas === "general" && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-mono font-semibold mb-2">
            Estadísticas generales
          </h2>

          {facturacionLoading ? (
            <p className="text-center text-gray-500">Cargando facturación...</p>
          ) : facturacionError ? (
            <p className="text-center text-error font-semibold">{facturacionError}</p>
          ) : facturacionChartData.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay datos de facturación para los filtros seleccionados.
            </p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="stat bg-base-200 shadow">
                  <div className="stat-title">Facturación por alquileres</div>
                  <div className="stat-value text-primary">
                    {formatCurrency(facturacionData.acumulado.total_alquileres)}
                  </div>
                </div>
                <div className="stat bg-base-200 shadow">
                  <div className="stat-title">Ingresos por sanciones</div>
                  <div className="stat-value text-secondary">
                    {formatCurrency(facturacionData.acumulado.total_sanciones)}
                  </div>
                </div>
                <div className="stat bg-base-200 shadow">
                  <div className="stat-title">Descuentos aplicados</div>
                  <div className="stat-value text-info">
                    {formatCurrency(facturacionData.acumulado.total_descuentos)}
                  </div>
                </div>
                <div className="stat bg-base-200 shadow">
                  <div className="stat-title">Total</div>
                  <div className="stat-value text-success">
                    {formatCurrency(facturacionData.acumulado.total_general)}
                  </div>
                </div>
              </div>

              <div className="bg-base-200 rounded-box p-4">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={facturacionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Bar dataKey="alquileres" fill="#4f46e5" name="Alquileres" />
                    <Bar dataKey="sanciones" fill="#0ea5e9" name="Sanciones" />
                    <Bar dataKey="total" fill="#22c55e" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Alquileres por {filters.periodicidad === "mes" ? "mes" : "trimestre"}
            </h3>
            {periodoLoading ? (
              <p className="text-center text-gray-500">
                Cargando agrupamiento por período...
              </p>
            ) : periodoError ? (
              <p className="text-center text-error font-semibold">{periodoError}</p>
            ) : alquileresPeriodo.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay alquileres para los filtros actuales.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
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
                        <td className="font-mono">{item.periodo}</td>
                        <td className="text-right">
                          {item.cantidad_alquileres.toLocaleString("es-AR")}
                        </td>
                        <td className="text-right">
                          {formatCurrency(item.total_alquileres)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {verStadisticas === "estadisticas-ventas" && (
        <div className="mt-6">
          <VentasStadistics
            resumenClientes={ventasData.resumen_clientes}
            alquileres={ventasData.alquileres}
            isLoading={ventasLoading}
            error={ventasError}
          />
        </div>
      )}

      {verStadisticas === "estadisticas-autos" && (
        <div className="mt-6">
          <AutosStadistics
            vehiculos={vehiculosData}
            isLoading={autosLoading}
            error={autosError}
          />
        </div>
      )}

      <div className="flex justify-end mr-2 mt-6">
        <button className="btn btn-neutral tooltip" data-tip="Generar Reporte">
          <Printer className="mr-2" /> Imprimir
        </button>
      </div>
    </div>
  );
}
