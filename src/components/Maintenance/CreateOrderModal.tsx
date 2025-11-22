import { X } from "lucide-react";
import { useState } from "react";
import type { VehiculoBasico, CreateOrdenMantenimientoData } from "../../types/mantenimiento";
import { createOrdenMantenimiento } from "../../services/maintenanceService";
import MaintenanceFormFields from "./MaintenanceFormFields";

interface CreateOrderModalProps {
  vehiculos: VehiculoBasico[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({
  vehiculos,
  onClose,
  onSuccess,
}: Readonly<CreateOrderModalProps>) {
  const [formData, setFormData] = useState({
    patente_vehiculo: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const [incluirPrimerMantenimiento, setIncluirPrimerMantenimiento] = useState(false);
  const [primerMantenimiento, setPrimerMantenimiento] = useState({
    descripcion: "",
    precio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!formData.patente_vehiculo) {
      setError("Debe seleccionar un vehículo");
      return;
    }

    if (!formData.fecha_inicio || !formData.fecha_fin) {
      setError("Debe ingresar las fechas de inicio y fin");
      return;
    }

    if (formData.fecha_fin < formData.fecha_inicio) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    if (incluirPrimerMantenimiento) {
      if (!primerMantenimiento.descripcion || !primerMantenimiento.precio) {
        setError("Complete los datos del primer mantenimiento");
        return;
      }

      if (Number(primerMantenimiento.precio) <= 0) {
        setError("El precio debe ser mayor a 0");
        return;
      }
    }

    setLoading(true);

    try {
      const data: CreateOrdenMantenimientoData = {
        patente_vehiculo: formData.patente_vehiculo,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
      };

      if (incluirPrimerMantenimiento) {
        data.primer_mantenimiento = {
          descripcion: primerMantenimiento.descripcion,
          precio: Number(primerMantenimiento.precio),
        };
      }

      await createOrdenMantenimiento(data);
      onSuccess();
    } catch (err) {
      console.error("Error creating orden:", err);
      setError("Error al crear la orden de mantenimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Nueva orden de mantenimiento</h3>
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Vehículo *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.patente_vehiculo}
              onChange={(e) =>
                setFormData({ ...formData, patente_vehiculo: e.target.value })
              }
              required
            >
              <option value="">Seleccione un vehículo</option>
              {vehiculos.map((vehiculo) => (
                <option key={vehiculo.patente} value={vehiculo.patente}>
                  {vehiculo.patente} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Fecha inicio *</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Fecha fin *</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={formData.fecha_fin}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox"
                checked={incluirPrimerMantenimiento}
                onChange={(e) => setIncluirPrimerMantenimiento(e.target.checked)}
              />
              <span className="label-text">Agregar primer mantenimiento ahora</span>
            </label>
          </div>

          {incluirPrimerMantenimiento && (
            <div className="space-y-4 pl-4 border-l-2 border-base-300">
              <MaintenanceFormFields
                descripcion={primerMantenimiento.descripcion}
                precio={primerMantenimiento.precio}
                onDescripcionChange={(value) =>
                  setPrimerMantenimiento({
                    ...primerMantenimiento,
                    descripcion: value,
                  })
                }
                onPrecioChange={(value) =>
                  setPrimerMantenimiento({
                    ...primerMantenimiento,
                    precio: value,
                  })
                }
                descripcionId="primer-descripcion"
                precioId="primer-precio"
              />
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creando..." : "Crear Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
