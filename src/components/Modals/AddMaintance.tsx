import { Wrench } from "lucide-react";

export default function AddMaintenance() {
  return (
    <>
      <button
        className="btn btn-primary mt-2"
        onClick={() =>
          document.getElementById("modal_add_maintenance").showModal()
        }
      >
        <Wrench /> Agregar Mantenimiento
      </button>
      <dialog id="modal_add_maintenance" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl p-4 bg-base-300 rounded-2xl justify-center">
            Agregar Mantenimiento
          </h3>
          <form className="py-4">
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Nombre del Auto: </span>
              </label>
              <p>Aca va a ir el nombre fetcheado</p>
            </div>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Fecha de Mantenimiento</span>
              </label>
              <input type="date" className="input input-bordered" />
            </div>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Descripción: </span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                rows={3}
              ></textarea>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn">
                Agregar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("modal_add_maintenance").close()
                }
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
