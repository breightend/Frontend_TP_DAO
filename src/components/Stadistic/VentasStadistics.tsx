export type SancionDetalle = {
  id_sancion: number;
  precio: number;
  descripcion: string;
  id_tipo_sancion: number;
};

export type AlquilerDetalle = {
  id_alquiler: number;
  fecha_inicio: string;
  fecha_fin: string;
  precio_base: number;
  total_sanciones: number;
  total_general: number;
  cliente: {
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  vehiculo: {
    patente: string;
    marca: string;
    modelo: string;
    anio: number;
  };
  sanciones: SancionDetalle[];
};

export type ResumenCliente = {
  dni: string;
  nombre: string;
  apellido: string;
  cantidad_alquileres: number;
  total_alquileres: number;
  total_sanciones: number;
  total_general: number;
};

interface VentasStadisticsProps {
  resumenClientes: ResumenCliente[];
  alquileres: AlquilerDetalle[];
  isLoading?: boolean;
  error?: string | null;
}

export default function VentasStadistics({
  resumenClientes,
  alquileres,
  isLoading = false,
  error = null,
}: VentasStadisticsProps) {
  if (isLoading) {
    return <p className="text-center text-gray-500">Cargando información de ventas...</p>;
  }

  const totalGeneral = alquileres.reduce(
    (acc, alquiler) => acc + alquiler.total_general,
    0
  );

  const totalSanciones = alquileres.reduce(
    (acc, alquiler) => acc + alquiler.total_sanciones,
    0
  );

  const clientesUnicos = resumenClientes.length || new Set(alquileres.map((alquiler) => alquiler.cliente.dni)).size;

  return (
    <div className="space-y-8">
      <section className="card border border-base-200 bg-white shadow-lg">
        <div className="card-body space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-base-content">
              Listado detallado de alquileres por cliente
            </h3>
            <p className="text-sm text-base-content/60">
              Cada alquiler con información del cliente, vehículo, fechas y montos asociados.
            </p>
          </div>

          {error ? (
            <div className="alert alert-warning text-sm">
              <span>{error}</span>
            </div>
          ) : null}

          {alquileres.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron alquileres con los filtros actuales.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Vehículo</th>
                    <th>Patente</th>
                    <th>Fechas</th>
                    <th>ID alquiler</th>
                    <th className="text-right">Precio base</th>
                    <th className="text-right">Sanciones</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {alquileres.map((alquiler) => (
                    <tr key={alquiler.id_alquiler} className="align-top">
                      <td className="font-semibold text-base-content">
                        {alquiler.cliente.nombre} {alquiler.cliente.apellido}
                      </td>
                      <td className="font-mono text-sm text-base-content/80">
                        {alquiler.cliente.dni}
                      </td>
                      <td className="text-sm text-base-content/70">
                        {alquiler.cliente.email}
                      </td>
                      <td>
                        <div className="font-medium">
                          {alquiler.vehiculo.marca} {alquiler.vehiculo.modelo}
                        </div>
                        <div className="text-xs text-base-content/60">Año {alquiler.vehiculo.anio}</div>
                      </td>
                      <td className="font-mono text-sm text-base-content/70">
                        {alquiler.vehiculo.patente}
                      </td>
                      <td>
                        <div className="font-mono text-sm">
                          {alquiler.fecha_inicio} → {alquiler.fecha_fin}
                        </div>
                      </td>
                      <td className="font-mono text-sm text-base-content/70">
                        #{alquiler.id_alquiler}
                      </td>
                      <td className="text-right">
                        ${alquiler.precio_base.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-right">
                        ${alquiler.total_sanciones.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                        <div className="text-xs text-gray-500">
                          {alquiler.sanciones.length} sanción(es)
                        </div>
                      </td>
                      <td className="text-right font-semibold">
                        ${alquiler.total_general.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7} className="text-left text-sm font-semibold text-base-content/70">
                      Clientes únicos: {clientesUnicos.toLocaleString("es-AR")}
                    </td>
                    <td className="text-right text-sm font-semibold text-base-content/70">
                      Totales
                    </td>
                    <td className="text-right font-semibold">
                      ${totalSanciones.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right font-bold">
                      ${totalGeneral.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
