import { ShieldPlus } from "lucide-react";

export default function CreateInsurance() {
  return (
    <>
      <button
        className="btn btn-circle btn-neutral"
        title="Crear Seguro"
        onClick={() => {
          const modal = document.getElementById(
            "modal_insurance"
          ) as HTMLDialogElement;
          modal.showModal();
        }}
      >
        <ShieldPlus />
      </button>
      <div>
        <dialog id="modal_insurance" className="modal">
          <form method="dialog" className="modal-box">
            <h3
              className="font-bold text-lg tooltip"
              datatype="Agregar nuevo seguro"
            >
              Crear Nuevo Seguro
            </h3>
          </form>
        </dialog>
      </div>
    </>
  );
}
