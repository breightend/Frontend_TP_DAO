import { useState, useEffect } from "react";
import { updateClient } from "../../services/clientService";
import { Edit } from "lucide-react";

interface EditClientProps {
  client?: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
  };
  onSuccess?: () => void;
}

export default function EditClient({ client, onSuccess }: EditClientProps) {
  const [formData, setFormData] = useState({
    nombre: client?.nombre || "",
    apellido: client?.apellido || "",
    dni: client?.dni || "",
    email: client?.email || "",
    telefono: client?.telefono || "",
    fechaNacimiento: client?.fechaNacimiento || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Actualizar formData cuando cambie el cliente
  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || "",
        apellido: client.apellido || "",
        dni: client.dni || "",
        email: client.email || "",
        telefono: client.telefono || "",
        fechaNacimiento: client.fechaNacimiento || "",
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client?.id) {
      setError("No se puede editar el cliente: ID no encontrado");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await updateClient(client.id, formData);

      // Cerrar modal
      const modal = document.getElementById(
        "modal_editar_cliente"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }

      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating client:", error);
      setError(
        "Error al actualizar el cliente. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    const modal = document.getElementById(
      "modal_editar_cliente"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <button
        className="btn btn-neutral btn-circle tooltip"
        data-tip="Editar cliente"
        title="Editar cliente"
        onClick={openModal}
      >
        <Edit />
      </button>
      <dialog id="modal_editar_cliente" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Editar Cliente</h3>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="py-4">
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Apellido</span>
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ingrese el apellido"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">DNI</span>
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ingrese el DNI"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Teléfono</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingrese el teléfono"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Fecha de Nacimiento</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary mr-2"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "modal_editar_cliente"
                  ) as HTMLDialogElement;
                  if (modal) modal.close();
                }}
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
