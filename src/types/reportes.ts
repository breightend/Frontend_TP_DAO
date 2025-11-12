export interface ClienteResumen {
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
}

export interface SancionDetalle {
  id_sancion: number;
  precio: number;
  descripcion: string;
  id_tipo_sancion: number;
}

export interface VehiculoDatos {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
}

export interface AlquilerDetalle {
  id_alquiler: number;
  fecha_inicio: string;
  fecha_fin: string;
  precio_base: number;
  total_sanciones: number;
  total_general: number;
  cliente: ClienteResumen & { email: string };
  vehiculo: VehiculoDatos;
  sanciones: SancionDetalle[];
}

export interface ResumenCliente {
  dni: string;
  nombre: string;
  apellido: string;
  cantidad_alquileres: number;
  total_alquileres: number;
  total_sanciones: number;
  total_general: number;
}

export interface VehiculoMasAlquilado extends VehiculoDatos {
  cantidad_alquileres: number;
}

export interface AlquileresResponse {
  alquileres: AlquilerDetalle[];
  resumen_clientes: ResumenCliente[];
}

export type Periodicidad = "mes" | "trimestre";

export interface AlquilerPeriodo {
  periodo: string;
  cantidad_alquileres: number;
  total_alquileres: number;
}

export interface FacturacionPeriodo {
  periodo: string;
  total_alquileres: number;
  total_sanciones: number;
  total_descuentos: number;
  total_general: number;
}

export interface FacturacionAcumulado {
  total_alquileres: number;
  total_sanciones: number;
  total_descuentos: number;
  total_general: number;
}

export interface FacturacionData {
  periodos: FacturacionPeriodo[];
  acumulado: FacturacionAcumulado;
  incluir_sanciones: boolean;
}

export interface FetchAlquileresParams {
  dni?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface FetchVehiculosParams {
  fechaDesde?: string;
  fechaHasta?: string;
  limit?: number;
}

export interface FetchPeriodoParams {
  periodicidad: Periodicidad;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface FetchFacturacionParams {
  fechaDesde?: string;
  fechaHasta?: string;
  incluirSanciones?: boolean;
}
