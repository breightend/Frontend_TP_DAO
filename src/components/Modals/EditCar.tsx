import { useState, useEffect } from "react";
import { updateCar } from "../../services/autosService";
import { Edit } from "lucide-react";

interface EditCarProps {
  car?: {
    id: number;
    marca: string;
    modelo: string;
    anio: string;
    color: string;
    patente: string;
  };
  onSuccess?: () => void;
}

export default function EditCar({ car, onSuccess }: EditCarProps) {
  const [formData, setFormData] = useState({
    marca: car?.marca || "",
    modelo: car?.modelo || "",
    anio: car?.anio || "",
    color: car?.color || "",
    patente: car?.patente || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (car) {
      setFormData({
        marca: car.marca || "",
        modelo: car.modelo || "",
        anio: car.anio || "",
        color: car.color || "",
        patente: car.patente || "",
      });
    }
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!car?.id) {
      setError("No se puede editar el auto: ID no encontrado");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await updateCar(car.id, formData);

      const modal = document.getElementById(
        "modal_editar_auto"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating car:", error);
      setError("Error al actualizar el auto. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    const modal = document.getElementById(
      "modal_editar_auto"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <button
        className="btn btn-neutral btn-circle tooltip ml-2"
        data-tip="Editar auto"
        title="Editar auto"
        onClick={openModal}
      >
        <Edit />
      </button>
      <dialog id="modal_editar_auto" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Editar Auto</h3>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="py-4">
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Marca</span>
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Ingrese la marca"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Modelo</span>
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ingrese el modelo"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Año</span>
              </label>
              <input
                type="text"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                placeholder="Ingrese el año"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ingrese el color"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Patente</span>
              </label>
              <input
                type="text"
                name="patente"
                value={formData.patente}
                onChange={handleChange}
                placeholder="Ingrese la patente"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="modal-action ">
              <form method="dialog" className="">
                <button
                  type="submit"
                  className="btn btn-primary mr-2 "
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
              </form>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
