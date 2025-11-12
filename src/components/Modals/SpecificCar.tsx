import { useState, useEffect } from "react";
import {
  Car,
  Calendar,
  Palette,
  DollarSign,
  Hash,
  Factory,
  X,
  Edit2,
  Trash2,
  Shield,
  Activity,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { getCarByPatente } from "../../services/autosService";
import CoveredCarImage from "../../images/CoveredCar.png";

interface SpecificCarProps {
  carId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (carPatente: string) => void;
  onDelete?: (carPatente: string) => void;
}

interface Cliente {
  dni: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface Empleado {
  legajo: number;
  nombre: string;
  apellido: string;
}

interface Alquiler {
  id_alquiler: number;
  precio: number;
  fecha_inicio: string;
  fecha_fin: string;
  cliente: Cliente;
  empleado: Empleado;
  sanciones: any[];
}

interface Mantenimiento {
  id_mantenimiento: number;
  precio: number;
  descripcion: string;
}

interface OrdenMantenimiento {
  id_orden: number;
  fecha_inicio: string;
  fecha_fin: string;
  mantenimientos: Mantenimiento[];
}

interface Estado {
  nombre: string;
  ambito: string;
}

interface Seguro {
  descripcion: string;
  costo: number;
  tipo_descripcion: string;
}

interface CarData {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  costo: number;
  periodicidadMantenimineto: number;
  imagen?: string;
  estado?: Estado | null;
  seguro?: Seguro | null;
  historial_alquileres?: Alquiler[];
  historial_mantenimientos?: OrdenMantenimiento[];
}

export default function SpecificCar({
  carId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: SpecificCarProps) {
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && carId) {
      fetchCar();
    }
  }, [isOpen, carId]);

  const fetchCar = async () => {
    if (!carId) return;

    setLoading(true);
    setError("");

    try {
      const response = await getCarByPatente(carId);
      setCar(response);
    } catch (error) {
      console.error("Error fetching car:", error);
      setError("Error al cargar la información del auto");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (car && onEdit) {
      onEdit(carId!);
    }
  };

  const handleDelete = () => {
    if (car && onDelete) {
      onDelete(carId!);
    }
  };

  const getImageUrl = () => {
    if (car?.imagen) {
      return `data:image/jpeg;base64,${car.imagen}`;
    }

    return CoveredCarImage;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR");
  };

  const getMaintenanceText = (days: number) => {
    if (days >= 365) return `${Math.floor(days / 365)} año(s)`;
    if (days >= 30) return `${Math.floor(days / 30)} mes(es)`;
    return `${days} días`;
  };

  const getEstadoBadgeColor = (estado: string | null | undefined) => {
    if (!estado) return "badge-neutral";

    switch (estado.toLowerCase()) {
      case "disponible":
        return "badge-success";
      case "alquilado":
        return "badge-warning";
      case "mantenimiento":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[95vh] p-0 overflow-hidden">
        {/* Header con botón cerrar */}
        <div className="flex justify-between items-center p-6 border-b bg-base-100  top-0 z-20 shadow-sm">
          <h3 className="font-bold text-xl">Detalles del Auto</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-5rem)]">
          {loading && (
            <div className="flex justify-center items-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {error && (
            <div className="alert alert-error m-6">
              <span>{error}</span>
            </div>
          )}

          {car && (
            <div className="card bg-base-100 shadow-sm">
              {/* Imagen del auto */}
              <figure className="h-90 overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 flex items-center justify-center  top-0 z-10">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-16 h-16 bg-blue-200 rounded-full blur-xl"></div>
                  <div className="absolute bottom-4 right-4 w-20 h-20 bg-purple-200 rounded-full blur-xl"></div>
                  <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-green-200 rounded-full blur-lg"></div>
                </div>

                {/* Sombra sutil debajo del auto */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black opacity-10 rounded-full blur-md"></div>

                <img
                  src={getImageUrl()}
                  alt={`${car.marca} ${car.modelo}`}
                  className="w-[150%] h-[150%] object-contain relative z-10 drop-shadow-lg scale-130"
                />

                {/* Overlay gradient sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
              </figure>

              {/* Información del auto */}
              <div className="card-body p-8">
                <h2 className="card-title text-2xl mb-6">
                  <Car className="w-8 h-8" />
                  {car.marca} {car.modelo}
                </h2>

                {/* Grid de información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Hash className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Patente:
                      </span>
                      <div className="badge badge-outline font-mono text-base">
                        {car.patente}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Año:
                      </span>
                      <div className="text-base font-semibold">{car.anio}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Palette className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Color:
                      </span>
                      <div className="text-base font-semibold capitalize">
                        {car.color}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Costo:
                      </span>
                      <div className="text-base font-semibold text-success">
                        {formatPrice(car.costo)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Factory className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Mantenimiento:
                      </span>
                      <div className="badge badge-info text-sm">
                        Cada {getMaintenanceText(car.periodicidadMantenimineto)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-base-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3 text-lg">
                      <CheckCircle className="w-5 h-5" />
                      Estado
                    </h4>
                    {car.estado ? (
                      <div className="space-y-2">
                        <span
                          className={`badge badge-lg ${getEstadoBadgeColor(
                            car.estado.nombre
                          )}`}
                        >
                          {car.estado.nombre}
                        </span>
                        <p className="text-sm text-gray-600">
                          <strong>Ámbito:</strong> {car.estado.ambito}
                        </p>
                      </div>
                    ) : (
                      <span className="badge badge-neutral badge-lg">
                        No disponible
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3 text-lg">
                      <Shield className="w-5 h-5" />
                      Seguro
                    </h4>
                    {car.seguro ? (
                      <div className="space-y-2">
                        <p className="font-medium text-base">
                          {car.seguro.descripcion}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>{car.seguro.tipo_descripcion}</strong>
                        </p>
                        <p className="text-success font-semibold">
                          {formatPrice(car.seguro.costo)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Sin información de seguro</p>
                    )}
                  </div>
                </div>

                {/* Historial - Colapsible */}
                <div className="collapse collapse-arrow bg-base-200 mb-6 border border-base-300">
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-medium flex items-center gap-3 py-4">
                    <Users className="w-6 h-6" />
                    Historial de Alquileres (
                    {car.historial_alquileres?.length || 0})
                  </div>
                  <div className="collapse-content">
                    {!car.historial_alquileres ||
                    car.historial_alquileres.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        Sin alquileres registrados
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {car.historial_alquileres.map((alquiler) => (
                          <div
                            key={alquiler.id_alquiler}
                            className="border rounded-lg p-3 bg-base-100"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-success">
                                {formatPrice(alquiler.precio)}
                              </span>
                              <span className="text-xs text-gray-500">
                                ID: #{alquiler.id_alquiler}
                              </span>
                            </div>
                            <p className="text-sm flex items-center gap-1 mb-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(alquiler.fecha_inicio)} -{" "}
                              {formatDate(alquiler.fecha_fin)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Cliente:</span>{" "}
                              {alquiler.cliente.nombre}{" "}
                              {alquiler.cliente.apellido}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">DNI:</span>{" "}
                              {alquiler.cliente.dni.toLocaleString()}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Empleado:</span>{" "}
                              {alquiler.empleado.nombre}{" "}
                              {alquiler.empleado.apellido}
                            </p>
                            {alquiler.sanciones.length > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <AlertTriangle className="w-3 h-3 text-warning" />
                                <span className="text-xs text-warning">
                                  {alquiler.sanciones.length} sanción(es)
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Historial de Mantenimientos */}
                <div className="collapse collapse-arrow bg-base-200 mb-6 border border-base-300">
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-medium flex items-center gap-3 py-4">
                    <Activity className="w-6 h-6" />
                    Historial de Mantenimientos (
                    {car.historial_mantenimientos?.length || 0})
                  </div>
                  <div className="collapse-content">
                    {!car.historial_mantenimientos ||
                    car.historial_mantenimientos.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        Sin mantenimientos registrados
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {car.historial_mantenimientos.map((orden) => (
                          <div
                            key={orden.id_orden}
                            className="border rounded-lg p-3 bg-base-100"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Orden #{orden.id_orden}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(orden.fecha_inicio)} -{" "}
                                {formatDate(orden.fecha_fin)}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {orden.mantenimientos.map((mant) => (
                                <div
                                  key={mant.id_mantenimiento}
                                  className="flex justify-between text-sm p-2 bg-base-200 rounded"
                                >
                                  <span>{mant.descripcion}</span>
                                  <span className="font-medium text-success">
                                    {formatPrice(mant.precio)}
                                  </span>
                                </div>
                              ))}
                              <div className="text-right pt-1 border-t">
                                <span className="font-semibold">
                                  Total:{" "}
                                  {formatPrice(
                                    orden.mantenimientos.reduce(
                                      (sum, m) => sum + m.precio,
                                      0
                                    )
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="card-actions justify-between mt-8 pt-6 border-t border-base-300">
                  <div className="flex gap-3">
                    {onEdit && (
                      <button
                        onClick={handleEdit}
                        className="btn btn-outline btn-md"
                      >
                        <Edit2 size={18} />
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        className="btn btn-outline btn-error btn-md"
                      >
                        <Trash2 size={18} />
                        Eliminar
                      </button>
                    )}
                  </div>
                  <button onClick={onClose} className="btn btn-primary btn-md">
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
