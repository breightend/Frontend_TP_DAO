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

  if (error) {
    return (
      <p className="text-center text-error font-semibold">
        {error}
      </p>
    );
  }

  const totalAlquileres = resumenClientes.reduce(
    (acc, cliente) => acc + cliente.total_general,
    0
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-mono font-semibold text-center mb-4">
          Resumen por cliente
        </h2>

        {resumenClientes.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay datos para los filtros seleccionados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Cliente</th>
                  <th className="text-right">Alquileres</th>
                  <th className="text-right">Monto alquileres</th>
                  <th className="text-right">Sanciones</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {resumenClientes.map((cliente) => (
                  <tr key={cliente.dni}>
                    <td className="font-mono">{cliente.dni}</td>
                    <td>{cliente.nombre} {cliente.apellido}</td>
                    <td className="text-right">
                      {cliente.cantidad_alquileres.toLocaleString("es-AR")}
                    </td>
                    <td className="text-right">
                      ${cliente.total_alquileres.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right">
                      ${cliente.total_sanciones.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right font-semibold">
                      ${cliente.total_general.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="text-right font-semibold">
                    Total facturado
                  </td>
                  <td className="text-right font-bold">
                    ${totalAlquileres.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-mono font-semibold text-center mb-4">
          Detalle de alquileres
        </h2>

        {alquileres.length === 0 ? (
          <p className="text-center text-gray-500">
            No se encontraron alquileres con los filtros actuales.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Vehículo</th>
                  <th>Fechas</th>
                  <th className="text-right">Precio base</th>
                  <th className="text-right">Sanciones</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {alquileres.map((alquiler) => (
                  <tr key={alquiler.id_alquiler}>
                    <td className="font-mono">{alquiler.id_alquiler}</td>
                    <td>
                      <div className="font-semibold">
                        {alquiler.cliente.nombre} {alquiler.cliente.apellido}
                      </div>
                      <div className="text-xs text-gray-500">
                        DNI {alquiler.cliente.dni} · {alquiler.cliente.email}
                      </div>
                    </td>
                    <td>
                      <div>{alquiler.vehiculo.marca} {alquiler.vehiculo.modelo}</div>
                      <div className="text-xs text-gray-500">
                        Patente: {alquiler.vehiculo.patente} · {alquiler.vehiculo.anio}
                      </div>
                    </td>
                    <td>
                      <div className="font-mono text-sm">
                        {alquiler.fecha_inicio} → {alquiler.fecha_fin}
                      </div>
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
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
