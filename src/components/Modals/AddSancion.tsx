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
        alert("Sanción creada con éxito");
      })
      .catch((e) => {
        console.error("Error creating sancion:", e);
      });
  };

  return (
    <div>
      <div className="flex w-full">
        <div className="justify-end">
          <button
            className="btn btn-secondary"
            onClick={() => document.getElementById("modal_sancion").showModal()}
          >
            <Plus />
            Agregar Sanción
          </button>
        </div>
      </div>
      <dialog id="modal_sancion" className="modal">
        <div className="modal-box">
          <div className="p-4 bg-base-200 rounded-2xl mb-4">
            <h2 className="font-bold text-2xl">Agregar Sanción</h2>
          </div>
          <div className="">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="motivo"
                type="text"
                placeholder="Motivo de la sanción"
                className="input"
                value={formData.motivo}
                onChange={(e) =>
                  setFormData({ ...formData, motivo: e.target.value })
                }
              />
              <input
                name="monto"
                type="text"
                inputMode="numeric"
                placeholder="Monto de la sanción (solo números)"
                className="input"
                value={formData.monto}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monto: e.target.value.replace(/\D/g, ""),
                  })
                }
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <input
                name="descripcion"
                type="text"
                placeholder="Descripción de la sanción"
                className="input"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
              <div className="modal_actions gap-2 mt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!formData.monto || !/^\d+$/.test(formData.monto)}
                >
                  Guardar Sanción
                </button>
                <button
                  type="button"
                  className="btn btn-neutral"
                  onClick={() =>
                    document.getElementById("modal_sancion").close()
                  }
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
