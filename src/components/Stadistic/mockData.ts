import type {
  AlquilerDetalle,
  AlquileresResponse,
  AlquilerPeriodo,
  FacturacionData,
  FacturacionPeriodo,
  ResumenCliente,
  VehiculoMasAlquilado,
} from "../../types/reportes";

const resumenClientes: ResumenCliente[] = [
  {
    dni: "30256987",
    nombre: "Martina",
    apellido: "Rossi",
    cantidad_alquileres: 3,
    total_alquileres: 1250000,
    total_sanciones: 50000,
    total_general: 1300000,
  },
  {
    dni: "27458963",
    nombre: "Nicolás",
    apellido: "Pereyra",
    cantidad_alquileres: 2,
    total_alquileres: 880000,
    total_sanciones: 0,
    total_general: 880000,
  },
  {
    dni: "34123654",
    nombre: "Sofía",
    apellido: "Almada",
    cantidad_alquileres: 4,
    total_alquileres: 1640000,
    total_sanciones: 120000,
    total_general: 1760000,
  },
];

const detalleAlquileres: AlquilerDetalle[] = [
  {
    id_alquiler: 1042,
    fecha_inicio: "2024-07-03",
    fecha_fin: "2024-07-10",
    precio_base: 420000,
    total_sanciones: 0,
    total_general: 420000,
    cliente: {
      dni: "27458963",
      nombre: "Nicolás",
      apellido: "Pereyra",
      email: "npereyra@example.com",
    },
    vehiculo: {
      patente: "AC234KD",
      marca: "Toyota",
      modelo: "Corolla",
      anio: 2022,
    },
    sanciones: [],
  },
  {
    id_alquiler: 1054,
    fecha_inicio: "2024-08-15",
    fecha_fin: "2024-08-22",
    precio_base: 380000,
    total_sanciones: 30000,
    total_general: 410000,
    cliente: {
      dni: "30256987",
      nombre: "Martina",
      apellido: "Rossi",
      email: "mrossi@example.com",
    },
    vehiculo: {
      patente: "AE890LP",
      marca: "Honda",
      modelo: "HR-V",
      anio: 2023,
    },
    sanciones: [
      {
        id_sancion: 31,
        descripcion: "Limpieza extraordinaria",
        precio: 30000,
        id_tipo_sancion: 4,
      },
    ],
  },
  {
    id_alquiler: 1061,
    fecha_inicio: "2024-09-05",
    fecha_fin: "2024-09-13",
    precio_base: 520000,
    total_sanciones: 40000,
    total_general: 560000,
    cliente: {
      dni: "34123654",
      nombre: "Sofía",
      apellido: "Almada",
      email: "salmada@example.com",
    },
    vehiculo: {
      patente: "AG456QP",
      marca: "Peugeot",
      modelo: "3008",
      anio: 2021,
    },
    sanciones: [
      {
        id_sancion: 37,
        descripcion: "Entrega con tanque incompleto",
        precio: 40000,
        id_tipo_sancion: 6,
      },
    ],
  },
  {
    id_alquiler: 1082,
    fecha_inicio: "2024-10-01",
    fecha_fin: "2024-10-09",
    precio_base: 610000,
    total_sanciones: 50000,
    total_general: 660000,
    cliente: {
      dni: "34123654",
      nombre: "Sofía",
      apellido: "Almada",
      email: "salmada@example.com",
    },
    vehiculo: {
      patente: "AF672MD",
      marca: "Jeep",
      modelo: "Compass",
      anio: 2024,
    },
    sanciones: [
      {
        id_sancion: 45,
        descripcion: "Daños leves en paragolpes",
        precio: 50000,
        id_tipo_sancion: 2,
      },
    ],
  },
];

export const mockAlquileresResponse: AlquileresResponse = {
  resumen_clientes: resumenClientes,
  alquileres: detalleAlquileres,
};

export const mockVehiculosMasAlquilados: VehiculoMasAlquilado[] = [
  {
    patente: "AE890LP",
    marca: "Honda",
    modelo: "HR-V",
    anio: 2023,
    cantidad_alquileres: 18,
  },
  {
    patente: "AG456QP",
    marca: "Peugeot",
    modelo: "3008",
    anio: 2021,
    cantidad_alquileres: 15,
  },
  {
    patente: "AC234KD",
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2022,
    cantidad_alquileres: 14,
  },
  {
    patente: "AF672MD",
    marca: "Jeep",
    modelo: "Compass",
    anio: 2024,
    cantidad_alquileres: 11,
  },
  {
    patente: "AE221RT",
    marca: "Volkswagen",
    modelo: "Nivus",
    anio: 2023,
    cantidad_alquileres: 9,
  },
];

export const mockAlquileresPorPeriodo: AlquilerPeriodo[] = [
  {
    periodo: "2024-07",
    cantidad_alquileres: 8,
    total_alquileres: 920000,
  },
  {
    periodo: "2024-08",
    cantidad_alquileres: 11,
    total_alquileres: 1320000,
  },
  {
    periodo: "2024-09",
    cantidad_alquileres: 14,
    total_alquileres: 1740000,
  },
  {
    periodo: "2024-10",
    cantidad_alquileres: 10,
    total_alquileres: 1560000,
  },
];

const facturacionPeriodos: FacturacionPeriodo[] = [
  {
    periodo: "2024-07",
    total_alquileres: 920000,
    total_sanciones: 40000,
    total_general: 960000,
  },
  {
    periodo: "2024-08",
    total_alquileres: 1320000,
    total_sanciones: 55000,
    total_general: 1375000,
  },
  {
    periodo: "2024-09",
    total_alquileres: 1740000,
    total_sanciones: 70000,
    total_general: 1810000,
  },
  {
    periodo: "2024-10",
    total_alquileres: 1560000,
    total_sanciones: 85000,
    total_general: 1645000,
  },
];

export const mockFacturacionData: FacturacionData = {
  periodos: facturacionPeriodos,
  acumulado: facturacionPeriodos.reduce(
    (acc, periodo) => ({
      total_alquileres: acc.total_alquileres + periodo.total_alquileres,
      total_sanciones: acc.total_sanciones + periodo.total_sanciones,
      total_general: acc.total_general + periodo.total_general,
    }),
    {
      total_alquileres: 0,
      total_sanciones: 0,
      total_general: 0,
    }
  ),
  incluir_sanciones: true,
};
