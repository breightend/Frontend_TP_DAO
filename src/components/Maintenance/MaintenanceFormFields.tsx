interface MaintenanceFormFieldsProps {
  descripcion: string;
  precio: string;
  onDescripcionChange: (value: string) => void;
  onPrecioChange: (value: string) => void;
  descripcionId?: string;
  precioId?: string;
}

export default function MaintenanceFormFields({
  descripcion,
  precio,
  onDescripcionChange,
  onPrecioChange,
  descripcionId = "descripcion",
  precioId = "precio",
}: MaintenanceFormFieldsProps) {
  return (
    <>
      {/* Descripción */}
      <div className="form-control">
        <label className="label" htmlFor={descripcionId}>
          <span className="label-text font-medium">Descripción</span>
          <span className="label-text-alt text-error">*</span>
        </label>
        <textarea
          id={descripcionId}
          className="textarea textarea-bordered h-24 resize-none focus:textarea-primary"
          placeholder="Ej: Cambio de aceite y filtro de motor"
          value={descripcion}
          onChange={(e) => onDescripcionChange(e.target.value)}
          required
        />
      </div>

      {/* Precio */}
      <div className="form-control">
        <label className="label" htmlFor={precioId}>
          <span className="label-text font-medium">Precio</span>
          <span className="label-text-alt text-error">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-base-content z-10">
            $
          </span>
          <input
            id={precioId}
            type="number"
            className="input input-bordered w-full pl-9 focus:input-primary"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={precio}
            onChange={(e) => onPrecioChange(e.target.value)}
            required
          />
        </div>
      </div>
    </>
  );
}
