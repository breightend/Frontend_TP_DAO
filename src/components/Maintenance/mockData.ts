import type { OrdenMantenimiento, Mantenimiento, VehiculoBasico } from "../../types/mantenimiento";

export const mockVehiculos: VehiculoBasico[] = [
  { patente: "ABC123", marca: "Toyota", modelo: "Corolla", anio: 2020 },
  { patente: "XYZ789", marca: "Ford", modelo: "Focus", anio: 2019 },
  { patente: "DEF456", marca: "Chevrolet", modelo: "Cruze", anio: 2021 },
  { patente: "GHI789", marca: "Honda", modelo: "Civic", anio: 2022 },
  { patente: "JKL012", marca: "Volkswagen", modelo: "Golf", anio: 2020 },
];

export const mockMantenimientos: Mantenimiento[] = [
  {
    id_mantenimiento: 1,
    id_orden_mantenimiento: 1,
    descripcion: "Cambio de aceite y filtro",
    precio: 8500,
  },
  {
    id_mantenimiento: 2,
    id_orden_mantenimiento: 1,
    descripcion: "Rotación de neumáticos",
    precio: 4200,
  },
  {
    id_mantenimiento: 3,
    id_orden_mantenimiento: 2,
    descripcion: "Cambio de pastillas de freno",
    precio: 15000,
  },
  {
    id_mantenimiento: 4,
    id_orden_mantenimiento: 2,
    descripcion: "Alineación y balanceo",
    precio: 6800,
  },
  {
    id_mantenimiento: 5,
    id_orden_mantenimiento: 3,
    descripcion: "Revisión general de motor",
    precio: 25000,
  },
  {
    id_mantenimiento: 6,
    id_orden_mantenimiento: 4,
    descripcion: "Cambio de batería",
    precio: 12000,
  },
  {
    id_mantenimiento: 7,
    id_orden_mantenimiento: 5,
    descripcion: "Cambio de correa de distribución",
    precio: 18500,
  },
  {
    id_mantenimiento: 8,
    id_orden_mantenimiento: 5,
    descripcion: "Cambio de líquido refrigerante",
    precio: 3500,
  },
];

export const mockOrdenesMantenimiento: OrdenMantenimiento[] = [
  {
    id_orden: 1,
    patente_vehiculo: "ABC123",
    fecha_inicio: "2024-01-15",
    fecha_fin: "2024-01-16",
    vehiculo: mockVehiculos[0],
    mantenimientos: mockMantenimientos.filter((m) => m.id_orden_mantenimiento === 1),
  },
  {
    id_orden: 2,
    patente_vehiculo: "XYZ789",
    fecha_inicio: "2024-02-10",
    fecha_fin: "2024-02-12",
    vehiculo: mockVehiculos[1],
    mantenimientos: mockMantenimientos.filter((m) => m.id_orden_mantenimiento === 2),
  },
  {
    id_orden: 3,
    patente_vehiculo: "DEF456",
    fecha_inicio: "2024-03-05",
    fecha_fin: "2024-03-07",
    vehiculo: mockVehiculos[2],
    mantenimientos: mockMantenimientos.filter((m) => m.id_orden_mantenimiento === 3),
  },
  {
    id_orden: 4,
    patente_vehiculo: "GHI789",
    fecha_inicio: "2024-04-20",
    fecha_fin: "2024-04-21",
    vehiculo: mockVehiculos[3],
    mantenimientos: mockMantenimientos.filter((m) => m.id_orden_mantenimiento === 4),
  },
  {
    id_orden: 5,
    patente_vehiculo: "JKL012",
    fecha_inicio: "2024-05-15",
    fecha_fin: "2024-05-18",
    vehiculo: mockVehiculos[4],
    mantenimientos: mockMantenimientos.filter((m) => m.id_orden_mantenimiento === 5),
  },
];
