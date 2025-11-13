import { Plus } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../services/clientService";

export default function CreateClient() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    DNI: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const numbersOnly = value.replace(/\D/g, "");
      const limitedValue = numbersOnly.slice(0, 14);
      setFormData((prevData) => ({ ...prevData, [name]: limitedValue }));
    } else if (name === "nombre" || name === "apellido") {
      const lettersOnly = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      setFormData((prevData) => ({ ...prevData, [name]: lettersOnly }));
    } else if (name === "DNI") {
      const numbersOnly = value.replace(/\D/g, "");
      const limitedValue = numbersOnly.slice(0, 8);
      setFormData((prevData) => ({ ...prevData, [name]: limitedValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return false;
    }

    if (!formData.apellido.trim()) {
      alert("El apellido es obligatorio");
      return false;
    }

    if (!formData.fechaNacimiento) {
      alert("La fecha de nacimiento es obligatoria");
      return false;
    }

    if (!formData.DNI.trim()) {
      alert("El DNI es obligatorio");
      return false;
    }

    if (!formData.email.trim()) {
      alert("El email es obligatorio");
      return false;
    }

    if (!formData.telefono.trim()) {
      alert("El teléfono es obligatorio");
      return false;
    }
    
    if (!formData.direccion.trim()) {
      alert("La dirección es obligatoria");
      return false;
    }

    if (formData.nombre.trim().length < 2) {
      alert("El nombre debe tener al menos 2 caracteres");
      return false;
    }

    if (formData.apellido.trim().length < 2) {
      alert("El apellido debe tener al menos 2 caracteres");
      return false;
    }
    
    if (formData.direccion.trim().length < 2) {
      alert("La dirección debe tener al menos 2 caracteres");
      return false;
    }

    const birthDate = new Date(formData.fechaNacimiento);
    const today = new Date();

    if (birthDate > today) {
      alert("La fecha de nacimiento no puede ser futura");
      return false;
    }

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const finalAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (finalAge < 18) {
      alert("Debe ser mayor de 18 años");
      return false;
    }

    if (formData.DNI.length < 7 || formData.DNI.length > 8) {
      alert("El DNI debe tener entre 7 y 8 dígitos");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Ingrese un email válido");
      return false;
    }

    if (formData.telefono.length < 10 || formData.telefono.length > 14) {
      alert("El teléfono debe tener entre 10 y 14 dígitos");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      createClient(formData);
      setFormData({
        nombre: "",
        apellido: "",
        DNI: "",
        email: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: "",
      });
      const modal = document.getElementById(
        "modal_cliente"
      ) as HTMLDialogElement;
      modal?.close();
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Error al crear el cliente. Inténtelo nuevamente.");
    }
  };

  return (
    <>
      <button
        className="ml-4 btn btn-neutral btn-circle tooltip transform hover:rotate-180 transition-transform duration-300"
        datatype="Agregar cliente"
        title="Agregar cliente"
        onClick={() => {
          const modal = document.getElementById("modal_cliente") as HTMLDialogElement | null;
          modal?.showModal();
        }}
      >
        <Plus />
      </button>
      <dialog id="modal_cliente" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Agregar Cliente</h3>

          <form className="py-4">
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Nombre *</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Solo letras (mín. 2 caracteres)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Apellido *</span>
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Solo letras (mín. 2 caracteres)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Fecha Nacimiento *</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">DNI *</span>
              </label>
              <input
                type="text"
                name="DNI"
                value={formData.DNI}
                onChange={handleChange}
                placeholder="Solo números (7-8 dígitos)"
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Direccion *</span>
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Solo letras (mín. 2 caracteres)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Email *</span>
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
                <span className="label-text">Teléfono *</span>
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Solo números (10-14 dígitos)"
                className="input input-bordered w-full"
                required
              />
            </div>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary mr-2" onClick={handleSubmit}>
                Guardar
              </button>
              <button className="btn">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
