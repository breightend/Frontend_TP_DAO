import { Plus } from "lucide-react";
import { createSancion } from "../../services/rentalService";
import { useState } from "react";

export default function AddSancion() {
    const [formData, setFormData] = useState({
    motivo: "",
    monto: "",
    descripcion: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const sancionData = {
      motivo: formData.motivo,
      monto: formData.monto,
      descripcion: formData.descripcion,
    };
    createSancion(sancionData)
      .then(() => {
        alert("Sanción creada con éxito");})
      .catch((e) => {
        console.error("Error creating sancion:", e);
      });
  };

  return (
    <div>
      <div className="flex w-full">
        <div className="justify-end">
          <button
            className="btn btn-info "
            onClick={() =>
              document.getElementById("modal-sancion")?.showModal()
            }
          >
            <Plus />
            Agregar Sanción
          </button>
        </div>
      </div>
      <dialog id="modal-sancion" className="modal">
        <div className="modal-box">
          <h2>Agregar Sanción</h2>
        </div>
        <form method="dialog">
          <input
            type="text"
            placeholder="Motivo de la sanción"
            className="input"
          />
          <input
            type="number"
            placeholder="Monto de la sanción"
            className="input"
          />
          <input
            type="text"
            placeholder="Descripción de la sanción"
            className="input"
          />
          <div className="modal_actions">
            <button className="btn btn-primary">Guardar Sanción</button>
          </div>
          <button className="btn">Cerrar</button>
        </form>
      </dialog>
    </div>
  );
}
