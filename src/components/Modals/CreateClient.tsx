import { Plus } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../services/clientService";

interface FormErrors {
  nombre?: string;
  apellido?: string;
  DNI?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
}

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const clearError = (fieldName: keyof FormErrors) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Limpiar error del campo cuando el usuario empiece a escribir
    clearError(name as keyof FormErrors);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    // Validar fecha de nacimiento
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    } else {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();

      if (birthDate > today) {
        newErrors.fechaNacimiento =
          "La fecha de nacimiento no puede ser futura";
      } else {
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        const finalAge =
          monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

        if (finalAge < 18) {
          newErrors.fechaNacimiento = "Debe ser mayor de 18 años";
        }
      }
    }

    // Validar DNI
    if (!formData.DNI.trim()) {
      newErrors.DNI = "El DNI es obligatorio";
    } else if (formData.DNI.length < 7 || formData.DNI.length > 8) {
      newErrors.DNI = "El DNI debe tener entre 7 y 8 dígitos";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Ingrese un email válido";
      }
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (formData.telefono.length < 10 || formData.telefono.length > 14) {
      newErrors.telefono = "El teléfono debe tener entre 10 y 14 dígitos";
    }

    // Validar dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
    } else if (formData.direccion.trim().length < 2) {
      newErrors.direccion = "La dirección debe tener al menos 2 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await createClient(formData);

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido: "",
        DNI: "",
        email: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: "",
      });

      // Cerrar modal
      const modal = document.getElementById(
        "modal_cliente"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error: any) {
      console.error("Error creating client:", error);

      // Manejar errores específicos del servidor
      if (error?.response?.data?.message) {
        // Si el backend devuelve un mensaje específico
        if (error.response.data.message.includes("email")) {
          setErrors({ email: "Este email ya está registrado" });
        } else if (error.response.data.message.includes("DNI")) {
          setErrors({ DNI: "Este DNI ya está registrado" });
        } else {
          setErrors({
            nombre: "Error del servidor: " + error.response.data.message,
          });
        }
      } else {
        // Error genérico
        setErrors({
          nombre: "Error al crear el cliente. Inténtelo nuevamente.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("modal_cliente") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <button
        className="ml-4 btn btn-neutral btn-circle tooltip transform hover:rotate-180 transition-transform duration-300"
        data-tip="Agregar cliente"
        title="Agregar cliente"
        onClick={() => {
          const modal = document.getElementById("modal_cliente") as HTMLDialogElement | null;
          modal?.showModal();
        }}
      >
        <Plus />
      </button>
      <dialog id="modal_cliente" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Agregar Cliente</h3>

          <form onSubmit={handleSubmit} className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Nombre *</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Solo letras (mín. 2 caracteres)"
                  className={`input input-bordered w-full ${
                    errors.nombre ? "input-error border-red-500" : ""
                  }`}
                  required
                />
                {errors.nombre && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 text-sm">
                      {errors.nombre}
                    </span>
                  </label>
                )}
              </div>

              {/* Apellido */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Apellido *</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Solo letras (mín. 2 caracteres)"
                  className={`input input-bordered w-full ${
                    errors.apellido ? "input-error border-red-500" : ""
                  }`}
                  required
                />
                {errors.apellido && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 text-sm">
                      {errors.apellido}
                    </span>
                  </label>
                )}
              </div>

              {/* DNI */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">DNI *</span>
                </label>
                <input
                  type="text"
                  name="DNI"
                  value={formData.DNI}
                  onChange={handleChange}
                  placeholder="Solo números (7-8 dígitos)"
                  className={`input input-bordered w-full ${
                    errors.DNI ? "input-error border-red-500" : ""
                  }`}
                  required
                />
                {errors.DNI && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 text-sm">
                      {errors.DNI}
                    </span>
                  </label>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Fecha Nacimiento *
                  </span>
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={`input input-bordered w-full ${
                    errors.fechaNacimiento ? "input-error border-red-500" : ""
                  }`}
                  required
                />
                {errors.fechaNacimiento && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 text-sm">
                      {errors.fechaNacimiento}
                    </span>
                  </label>
                )}
              </div>

              {/* Email */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Email *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className={`input input-bordered w-full ${
                    errors.email ? "input-error border-red-500" : ""
                  }`}
                  required
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 text-sm">
                      {errors.email}
                    </span>
                  </label>
                )}
              </div>

              {/* Teléfono */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Teléfono *</span>
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Solo números (10-14 dígitos)"
                  className={`input input-bordered w-full ${
                    errors.telefono ? "input-error border-red-500" : ""
                  }`}
                  required
                />
                {errors.telefono && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 text-sm">
                      {errors.telefono}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Dirección - Campo completo */}
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text font-medium">Dirección *</span>
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección completa (mín. 2 caracteres)"
                className={`input input-bordered w-full ${
                  errors.direccion ? "input-error border-red-500" : ""
                }`}
                required
              />
              {errors.direccion && (
                <label className="label">
                  <span className="label-text-alt text-red-500 text-sm">
                    {errors.direccion}
                  </span>
                </label>
              )}
            </div>

            <div className="modal-action mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Cliente"
                )}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "modal_cliente"
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
