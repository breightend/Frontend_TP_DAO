import { ArrowLeft, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import type { OrdenMantenimiento, Mantenimiento } from "../../types/mantenimiento";
import {
  fetchOrdenById,
  deleteMantenimiento,
} from "../../services/maintenanceService";
import { mockOrdenesMantenimiento } from "./mockData";
import MaintenanceFormModal from "./MaintenanceFormModal";

export default function MaintenanceOrderDetail() {
  const [, params] = useRoute("/car-maintenance/:id");
  const [, setLocation] = useLocation();
  const ordenId = params?.id ? parseInt(params.id) : null;

  const [orden, setOrden] = useState<OrdenMantenimiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);

  useEffect(() => {
    if (ordenId) {
      loadOrden();
    }
  }, [ordenId]);

  const loadOrden = async () => {
    if (!ordenId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrdenById(ordenId);
      if (data) {
        setOrden(data);
      } else {
        // Fallback to mock data
        const mockOrden = mockOrdenesMantenimiento.find((o) => o.id_orden === ordenId);
        if (mockOrden) {
          setOrden(mockOrden);
          setError("Mostrando datos de ejemplo.");
        } else {
          setError("Orden de mantenimiento no encontrada");
        }
      }
    } catch (err) {
      console.error("Error loading orden:", err);
      const mockOrden = mockOrdenesMantenimiento.find((o) => o.id_orden === ordenId);
      if (mockOrden) {
        setOrden(mockOrden);
        setError("Error al cargar datos. Mostrando datos de ejemplo.");
      } else {
        setError("Error al cargar la orden de mantenimiento");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMantenimiento = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar este mantenimiento?")) {
      return;
    }

    try {
      await deleteMantenimiento(id);
      loadOrden();
    } catch (err) {
      console.error("Error deleting mantenimiento:", err);
      alert("Error al eliminar el mantenimiento");
    }
  };

  const calcularPrecioTotal = (): number => {
    if (!orden?.mantenimientos || orden.mantenimientos.length === 0) return 0;
    return orden.mantenimientos.reduce((sum, m) => sum + m.precio, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center text-base-content/50">
            Cargando orden de mantenimiento...
          </div>
        </div>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-lg">
            <div className="flex flex-col items-center justify-center h-64 text-base-content/50">
              <Wrench className="size-12 mb-4" />
              <p>{error || "Orden de mantenimiento no encontrada"}</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setLocation("/car-maintenance")}
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-base-200 bg-white shadow-xl">
          <div className="px-6 py-8 sm:px-10">
            <div className="flex flex-col gap-6">
              <button
                className="btn btn-ghost w-fit gap-2 text-sm font-medium"
                onClick={() => setLocation("/car-maintenance")}
                type="button"
              >
                <ArrowLeft className="size-4" /> Volver a órdenes
              </button>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-base-content">
                  Orden de Mantenimiento #{orden.id_orden}
                </h1>
                <div className="flex flex-wrap gap-4 text-base-content/70">
                  <div>
                    <span className="font-semibold">Vehículo:</span>{" "}
                    {orden.patente_vehiculo}
                    {orden.vehiculo && (
                      <span className="ml-2">
                        ({orden.vehiculo.marca} {orden.vehiculo.modelo})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Período:</span>{" "}
                    {formatDate(orden.fecha_inicio)} → {formatDate(orden.fecha_fin)}
                  </div>
                  <div>
                    <span className="font-semibold">Total:</span>{" "}
                    <span className="text-primary font-bold">
                      {formatCurrency(calcularPrecioTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="alert alert-warning">
            <Wrench className="size-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-3xl border border-base-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-base-content">
                Mantenimientos realizados
              </h2>
              <p className="mt-1 text-sm text-base-content/70">
                {orden.mantenimientos?.length || 0} mantenimiento(s) registrado(s)
              </p>
            </div>
            <button
              className="btn btn-primary gap-2"
              onClick={() => setShowCreateModal(true)}
              type="button"
            >
              <Plus className="size-4" />
              Agregar mantenimiento
            </button>
          </div>

          {!orden.mantenimientos || orden.mantenimientos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-base-content/50">
              <Wrench className="size-12 mb-4" />
              <p>No hay mantenimientos registrados para esta orden</p>
              <button
                className="btn btn-primary btn-sm mt-4"
                onClick={() => setShowCreateModal(true)}
              >
                Agregar el primero
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th className="text-right">Precio</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orden.mantenimientos.map((mantenimiento) => (
                    <tr key={mantenimiento.id_mantenimiento} className="hover">
                      <td className="font-mono">#{mantenimiento.id_mantenimiento}</td>
                      <td>{mantenimiento.descripcion}</td>
                      <td className="text-right font-semibold">
                        {formatCurrency(mantenimiento.precio)}
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditingMantenimiento(mantenimiento)}
                            title="Editar"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() =>
                              handleDeleteMantenimiento(mantenimiento.id_mantenimiento)
                            }
                            title="Eliminar"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={2} className="text-right">
                      Total:
                    </td>
                    <td className="text-right text-primary">
                      {formatCurrency(calcularPrecioTotal())}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && ordenId && (
        <MaintenanceFormModal
          ordenId={ordenId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadOrden();
          }}
        />
      )}

      {editingMantenimiento && (
        <MaintenanceFormModal
          ordenId={ordenId!}
          mantenimiento={editingMantenimiento}
          onClose={() => setEditingMantenimiento(null)}
          onSuccess={() => {
            setEditingMantenimiento(null);
            loadOrden();
          }}
        />
      )}
    </div>
  );
}
