import { ShieldPlus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  createInsurance,
  getInsurancesTypes,
} from "../../services/insuranceService";

interface FormErrors {
  poliza?: string;
  compañia?: string;
  fechaVencimiento?: string;
  tipoPoliza?: string;
  descripcion?: string;
  costo?: string;
}

export default function CreateInsurance() {
  const [formData, setFormData] = useState({
    poliza: "",
    compañia: "",
    fechaVencimiento: "",
    tipoPoliza: "",
    descripcion: "",
    costo: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [tiposSeguro, setTiposSeguro] = useState([]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Lógica para permitir SOLO NÚMEROS en Poliza y Costo
    if (name === "poliza" || name === "costo") {
      // Regex: ^\d*$ significa "inicio a fin solo dígitos"
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      // Para el resto de campos (texto, fecha, etc.)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    clearError(name as keyof FormErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Validar Poliza (Solo números ya garantizado por handleChange, validamos longitud)
    if (!formData.poliza.trim()) {
      newErrors.poliza = "La poliza es obligatoria";
    }

    // 2. Validar Compañia
    if (!formData.compañia.trim()) {
      newErrors.compañia = "La compañia es obligatoria";
    } else if (formData.compañia.trim().length < 2) {
      newErrors.compañia = "El nombre de la compañia es muy corto";
    }

    // 3. Validar Fecha de Vencimiento (POSTERIOR A HOY)
    if (!formData.fechaVencimiento) {
      newErrors.fechaVencimiento = "La fecha de vencimiento es obligatoria";
    } else {
      const inputDate = new Date(formData.fechaVencimiento);
      // Crear fecha de hoy y resetear horas para comparar solo días
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Ajustamos la fecha input para compensar zona horaria al comparar (opcional, depende del navegador)
      // Para asegurar comparación estricta:
      const inputDateMidnight = new Date(inputDate);
      inputDateMidnight.setHours(24, 0, 0, 0); // Forzamos al final del día seleccionado o manejo UTC

      if (inputDate <= today) {
        newErrors.fechaVencimiento =
          "La fecha debe ser posterior al día de hoy";
      }
    }

    // 4. Validar Tipo Poliza
    if (!formData.tipoPoliza.trim()) {
      newErrors.tipoPoliza = "El tipo del seguro es obligatorio";
    }

    // 5. Validar Descripcion
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    // 6. Validar Costo
    if (!formData.costo.trim()) {
      newErrors.costo = "El costo es obligatorio";
    }

    setErrors(newErrors);
    // Retorna true si no hay errores (longitud de keys es 0)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validamos antes de enviar
    if (!validatdfdsfsdfeForm()) {
      console.warn("Formulario inválido", errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // --- AQUÍ MOSTRAMOS LOS DATOS POR CONSOLA COMO PEDISTE ---
      console.log("Form data:", formData);

      // Simulamos una petición asíncrona (espera 1 seg)
      const response = await createInsurance(formData);
      // Limpiar formulario
      setFormData({
        poliza: "",
        compañia: "",
        fechaVencimiento: "",
        tipoPoliza: "",
        descripcion: "",
        costo: "",
      });

      // Cerrar modal
      const modal = document.getElementById(
        "modal_insurance",
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error: any) {
      console.error("Error:", error);
      setErrors({
        poliza: "Ocurrió un error inesperado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = () => { 
    getInsurancesTypes().then((data) => {
      setTiposSeguro(data);
    });
  }

  return (
    <div>
      <div className="flex w-full">
        <div className="justify-end">
          <button
            className="btn btn-circle btn-neutral"
            title="Crear Seguro"
            onClick={() => {
              fetchData();
              const modal = document.getElementById(
                "modal_insurance",
              ) as HTMLDialogElement;
              modal.showModal();
            }}
          >
            <ShieldPlus />
          </button>
        </div>
      </div>

      <div>
        <dialog id="modal_insurance" className="modal">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Agregar Seguro</h3>

            <form onSubmit={handleSubmit} className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Poliza */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Poliza *</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="poliza"
                    value={formData.poliza}
                    onChange={handleChange}
                    placeholder="Solo números"
                    className={`input input-bordered w-full ${
                      errors.poliza ? "input-error border-red-500" : ""
                    }`}
                  />
                  {errors.poliza && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 text-sm">
                        {errors.poliza}
                      </span>
                    </label>
                  )}
                </div>

                {/* Compañia */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Compañia *</span>
                  </label>
                  <input
                    type="text"
                    name="compañia"
                    value={formData.compañia}
                    onChange={handleChange}
                    placeholder="Nombre de la aseguradora"
                    className={`input input-bordered w-full ${
                      errors.compañia ? "input-error border-red-500" : ""
                    }`}
                  />
                  {errors.compañia && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 text-sm">
                        {errors.compañia}
                      </span>
                    </label>
                  )}
                </div>

                {/* Tipo de poliza */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      Tipo Poliza *
                    </span>
                  </label>
                  {/* Convertido a Select como sugería tu label original, o input simple */}
                  <select
                    name="tipoPoliza"
                    value={formData.tipoPoliza}
                    onChange={handleChange}
                    className={`select select-bordered w-full ${
                      errors.tipoPoliza ? "select-error border-red-500" : ""
                    }`}
                  >
                    {/* Agrega esta opción inicial para evitar problemas con valor inicial vacío */}
                    <option value="" disabled>
                      Seleccione un Tipo de Póliza
                    </option>

                    {/* APLICACIÓN DEL MAPEO CORREGIDO */}
                    {tiposSeguro.map((tipoSeguro: any) => (
                      <option
                        key={tipoSeguro.id_tipo_seguro} // Usamos la ID correcta de tu objeto
                        value={tipoSeguro.id_tipo_seguro} // Usamos la ID correcta como valor
                      >
                        {tipoSeguro.descripcion}{" "}
                        {/* 👈 MUESTRA SOLO LA PROPIEDAD DE TEXTO */}
                      </option>
                    ))}
                  </select>

                  {errors.tipoPoliza && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 text-sm">
                        {errors.tipoPoliza}
                      </span>
                    </label>
                  )}
                </div>

                {/* Fecha de Vencimiento */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      Fecha De Vencimiento *
                    </span>
                  </label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleChange}
                    // Sugerencia: min={tomorrow} podría usarse aquí también en HTML
                    className={`input input-bordered w-full ${
                      errors.fechaVencimiento
                        ? "input-error border-red-500"
                        : ""
                    }`}
                  />
                  {errors.fechaVencimiento && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 text-sm">
                        {errors.fechaVencimiento}
                      </span>
                    </label>
                  )}
                </div>

                {/* Descripcion */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      Descripción *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="descripcion" // Corregido (antes descripcion minúscula)
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Detalle breve"
                    className={`input input-bordered w-full ${
                      errors.descripcion ? "input-error border-red-500" : ""
                    }`}
                  />
                  {errors.descripcion && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 text-sm">
                        {errors.descripcion}
                      </span>
                    </label>
                  )}
                </div>

                {/* Costo */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Costo *</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="costo" // Corregido (antes telefono)
                    value={formData.costo}
                    onChange={handleChange}
                    placeholder="Valor en números"
                    className={`input input-bordered w-full ${
                      errors.costo ? "input-error border-red-500" : ""
                    }`}
                  />
                  {errors.costo && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 text-sm">
                        {errors.costo}
                      </span>
                    </label>
                  )}
                </div>
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
                      Validando...
                    </>
                  ) : (
                    "Guardar Seguro"
                  )}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    const modal = document.getElementById(
                      "modal_insurance",
                    ) as HTMLDialogElement;
                    if (modal) modal.close();
                  }}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
          {/* Cierra modal al hacer click fuera */}
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}
