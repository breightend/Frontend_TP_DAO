import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/reportes";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchAlquileresDetallados = async ({
  dni,
  fechaDesde,
  fechaHasta,
} = {}) => {
  const response = await api.get("/alquileres", {
    params: {
      dni: dni || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
    },
  });

  return response.data;
};

export const fetchVehiculosMasAlquilados = async ({
  fechaDesde,
  fechaHasta,
  limit,
} = {}) => {
  const response = await api.get("/vehiculos-mas-alquilados", {
    params: {
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
      limit: limit ?? undefined,
    },
  });

  return response.data;
};

export const fetchAlquileresPorPeriodo = async ({
  periodicidad,
  fechaDesde,
  fechaHasta,
} = {}) => {
  const response = await api.get("/alquileres-por-periodo", {
    params: {
      periodicidad: periodicidad || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
    },
  });

  return response.data;
};

export const fetchFacturacionMensual = async ({
  fechaDesde,
  fechaHasta,
  incluirSanciones = true,
} = {}) => {
  const response = await api.get("/facturacion-mensual", {
    params: {
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
      incluir_sanciones: incluirSanciones,
    },
  });

  return response.data;
};
