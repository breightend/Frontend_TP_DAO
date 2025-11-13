export type VehiculoMasAlquilado = {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  cantidad_alquileres: number;
};

interface AutosStadisticsProps {
  vehiculos: VehiculoMasAlquilado[];
  isLoading?: boolean;
  error?: string | null;
}

export default function AutosStadistics({
  vehiculos,
  isLoading = false,
  error = null,
}: AutosStadisticsProps) {
  if (isLoading) {
    return (
      <p className="text-center text-gray-500">
        Cargando ranking de vehículos...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-error font-semibold">
        {error}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {vehiculos.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay registros de alquileres para los filtros seleccionados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Patente</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th className="text-right">Cantidad de alquileres</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo, index) => (
                <tr key={vehiculo.patente}>
                  <td>{index + 1}</td>
                  <td className="font-mono font-semibold">
                    {vehiculo.patente}
                  </td>
                  <td>{vehiculo.marca}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.anio}</td>
                  <td className="text-right font-semibold">
                    {vehiculo.cantidad_alquileres.toLocaleString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
