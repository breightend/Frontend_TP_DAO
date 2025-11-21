import { ShieldAlert } from "lucide-react";
import { createInsuranceType } from "../../services/insuranceService";
import { useState } from "react";

export default function AddSancion() {
  const [formData, setFormData] = useState({
    descripcion: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    createInsuranceType(formData.descripcion)
      .then(() => {
        setFormData({ descripcion: "" });
        document.getElementById("modal_type_insurance").close();
      })
      .catch((e) => {
        console.error("Error creating Tipo:", e);
      });
  };

  return (
    <div>
      <div className="flex w-full">
        <div className="justify-end">
          <button
            className="btn btn-secondary"
            onClick={() =>
              document.getElementById("modal_type_insurance").showModal()
            }
          >
            <ShieldAlert />
            Agregar Tipo de Seguro
          </button>
        </div>
      </div>
      <dialog id="modal_type_insurance" className="modal">
        <div className="modal-box">
          <div className="p-4 bg-base-200 rounded-2xl mb-4">
            <h2 className="font-bold text-2xl">Agregar Tipo</h2>
          </div>
          <div className="">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="descripcion"
                type="text"
                placeholder="Nombre del seguro"
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
                  disabled={!formData.descripcion}
                >
                  Guardar Tipo
                </button>
                <button
                  type="button"
                  className="btn btn-neutral"
                  onClick={() =>
                    document.getElementById("modal_type_insurance").close()
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
