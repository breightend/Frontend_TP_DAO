// para tipar al usar Stadistic.tsx con un servicio js

import type {
  AlquileresResponse,
  VehiculoMasAlquilado,
  AlquilerPeriodo,
  FacturacionData,
  FetchAlquileresParams,
  FetchVehiculosParams,
  FetchPeriodoParams,
  FetchFacturacionParams,
} from "../types/reportes";

export function fetchAlquileresDetallados(
  params?: FetchAlquileresParams
): Promise<AlquileresResponse>;

export function fetchVehiculosMasAlquilados(
  params?: FetchVehiculosParams
): Promise<VehiculoMasAlquilado[]>;

export function fetchAlquileresPorPeriodo(
  params?: Partial<FetchPeriodoParams>
): Promise<AlquilerPeriodo[]>;

export function fetchFacturacionMensual(
  params?: FetchFacturacionParams
): Promise<FacturacionData>;
