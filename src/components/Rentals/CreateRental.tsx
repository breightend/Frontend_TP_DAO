import { useState, useEffect } from "react";
import { getAvailableClients } from "../../services/clientService";
import { getAviableCars } from "../../services/autosService";
import { getEmployees } from "../../services/employeeService";
import { createRental, submitRentalDates } from "../../services/rentalService";
import { useLocation } from "wouter";
import { ArrowLeft, Car } from "lucide-react";

export default function CreateRental() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    cliente: "",
    costo: 0,
    auto: "",
    fechaInicio: "",
    fechaFin: "",
    sancion: 0,
    empleado: "",
  });

  const [client, setClient] = useState([]);
  const [car, setCar] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await getAvailableClients();
        setClient(clientData);

        const carsData = await getAviableCars();
        setCar(carsData);

        const employeesData = await getEmployees();
        setEmployee(employeesData);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchClients();
  }, []);

  const handleVolver = () => {
    setLocation("/car-rentals");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateValidation = async () => {
    if (!formData.fechaInicio || !formData.fechaFin) {
      setError("Por favor, seleccione ambas fechas (inicio y fin)");
      return false;
    }

    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);

    if (fechaInicio >= fechaFin) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin");
      return false;
    }

    try {
      setIsLoading(true);
      setError("");

      await submitRentalDates({
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
      });

      return true;
    } catch (error) {
      console.error("Error validating dates:", error);
      setError("Error al validar las fechas en el servidor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fechasValidas = await handleDateValidation();
    if (!fechasValidas) {
      return;
    }

    try {
      setIsLoading(true);
      await createRental(formData);
      setLocation("/car-rentals");
    } catch (error) {
      console.error("Error creating rental:", error);
      setError("Error al crear el alquiler");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex mt-2 gap-2">
        <button
          className="btn btn-circle btn-neutral tooltip"
          clientData-tip="Volver"
          onClick={handleVolver}
        >
          <ArrowLeft />
        </button>
        <h1 className="font-semibold text-3xl flex justify-center">
          Registra un alquiler
        </h1>
      </div>
      <div className="gap-2 ml-2 mt-4 flex flex-col">
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-4">
          <div className="fl">
            <label htmlFor=""> Ingrese fecha desde:</label>
            <input
              type="date"
              className="input input-bordered w-full max-w-xs ml-2"
              value={formData.fechaInicio}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, fechaInicio: e.target.value })
              }
            />
          </div>
          <div className="">
            <label htmlFor=""> Ingrese fecha hasta:</label>
            <input
              type="date"
              className="input input-bordered w-full max-w-xs ml-2"
              value={formData.fechaFin}
              min={
                formData.fechaInicio || new Date().toISOString().split("T")[0]
              }
              onChange={(e) =>
                setFormData({ ...formData, fechaFin: e.target.value })
              }
            />
          </div>
        </div>
        <label htmlFor="">
          Selecciona el cliente
          <select
            className="select select-bordered w-full max-w-xs ml-2"
            name="cliente"
            value={formData.cliente}
            onChange={handleFormChange}
            disabled={isLoading}
          >
            <option value="">Seleccione un cliente</option>
            {client &&
              client.map((client: any) => (
                <option key={client.id} value={client.id}>
                  {client.nombre} {client.apellido}
                </option>
              ))}
            {client.length === 0 && (
              <option disabled>No hay clientes registrados</option>
            )}
          </select>
        </label>
        <label htmlFor="">
          Costo del alquiler $
          <input
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d*$"
            className="input input-bordered w-full max-w-xs ml-2"
            value={formData.costo}
            disabled={isLoading}
            onKeyDown={(e) => {
              const allowed = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
                "Home",
                "End",
              ];
              if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
              if (e.key === ".") {
                const value = (e.currentTarget as HTMLInputElement).value;
                if (value.includes(".")) e.preventDefault();
                return;
              }
              if (!/^\d$/.test(e.key)) e.preventDefault();
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (!/^\d*\.?\d*$/.test(text)) e.preventDefault();
            }}
            onChange={(e) =>
              setFormData({
                ...formData,
                costo: Number(e.target.value.replace(/[^0-9.]/g, "")),
              })
            }
          />
        </label>

        <label htmlFor="">
          Auto
          <select
            className="select select-bordered w-full max-w-xs ml-2"
            name="auto"
            value={formData.auto}
            onChange={handleFormChange}
            disabled={isLoading}
          >
            <option value="">Seleccione un auto</option>
            {car &&
              car.map((car: any) => (
                <option key={car.id} value={car.id}>
                  {car.marca} {car.modelo} {car.patente}
                </option>
              ))}
            {car.length === 0 && (
              <option disabled>No hay autos registrados</option>
            )}
          </select>
        </label>

        <label htmlFor="">
          Selecciona empleado:
          <select
            className="select select-bordered w-full max-w-xs ml-2"
            name="empleado"
            value={formData.empleado}
            onChange={handleFormChange}
            disabled={isLoading}
          >
            <option value="">Seleccione un empleado</option>
            {employee &&
              employee.map((employee: any) => (
                <option key={employee.id} value={employee.id}>
                  {employee.legajo} {employee.nombre} {employee.apellido}
                </option>
              ))}
            {employee.length === 0 && (
              <option disabled>No hay empleados registrados</option>
            )}
          </select>
        </label>
      </div>

      <div className="flex w-full justify-end mt-4 mr-6">
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <Car />
          {isLoading ? "Validando..." : "Crear Alquiler"}
        </button>
      </div>
    </div>
  );
}
