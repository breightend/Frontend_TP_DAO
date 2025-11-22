import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Mantenimiento, CreateMantenimientoData } from "../../types/mantenimiento";
import {
  createMantenimiento,
  updateMantenimiento,
} from "../../services/maintenanceService";
import MaintenanceFormFields from "./MaintenanceFormFields";

interface MaintenanceFormModalProps {
  ordenId: number;
  mantenimiento?: Mantenimiento;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MaintenanceFormModal({
  ordenId,
  mantenimiento,
  onClose,
  onSuccess,
}: MaintenanceFormModalProps) {
  const isEditing = !!mantenimiento;

  const [formData, setFormData] = useState({
    descripcion: "",
    precio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mantenimiento) {
      setFormData({
        descripcion: mantenimiento.descripcion,
        precio: mantenimiento.precio.toString(),
      });
    }
  }, [mantenimiento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    setLoading(true);

    try {
      const data: CreateMantenimientoData = {
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
      };

      if (isEditing && mantenimiento) {
        await updateMantenimiento(mantenimiento.id_mantenimiento, data);
      } else {
        await createMantenimiento(ordenId, data);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving mantenimiento:", err);
      setError(
        isEditing
          ? "Error al actualizar el mantenimiento"
          : "Error al crear el mantenimiento"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-base-200">
          <h3 className="text-xl font-bold text-base-content">
            {isEditing ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
          </h3>
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
            type="button"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <MaintenanceFormFields
            descripcion={formData.descripcion}
            precio={formData.precio}
            onDescripcionChange={(value) =>
              setFormData({ ...formData, descripcion: value })
            }
            onPrecioChange={(value) =>
              setFormData({ ...formData, precio: value })
            }
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {isEditing ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                isEditing ? "Actualizar" : "Crear Mantenimiento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
