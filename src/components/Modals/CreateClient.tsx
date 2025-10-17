import { Plus } from "lucide-react";
import { useState } from "react";

export default function createModal() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <button
        className="ml-4 btn btn-neutral btn-circle tooltip transform hover:rotate-180 transition-transform duration-300"
        datatype="Agregar cliente"
        title="Agregar cliente"
        onClick={() => document.getElementById("modal_cliente").showModal()}
      >
        <Plus />
      </button>
      <dialog id="modal_cliente" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Agregar Cliente</h3>

          <form className="py-4">
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
              />
            </div>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary mr-2">Guardar</button>
              <button className="btn">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
