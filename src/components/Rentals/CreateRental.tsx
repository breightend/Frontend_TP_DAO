import { useState, useEffect } from "react";
import { getClients } from "../../services/clientService";
import { getAutos } from "../../services/autosService";
import { getEmployees } from "../../services/employeeService";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function CreateRental() {
  const [location, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    cliente: "",
    costo: 0,
    auto: "",
    fechaInicio: "",
    fechaFin: "",
    sancion: 0,
  });

  const [client, setClient] = useState([]);
  const [car, setCar] = useState([]);
  const [employee, setEmployee] = useState([]);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await getClients();
        setClient(clientData);

        const carsData = await getAutos();
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
        <label htmlFor="">
          Selecciona el cliente
          <select className="select select-bordered w-full max-w-xs ml-2">
            {client &&
              client.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre} {client.apellido}
                </option>
              ))}
            {client.length === 0 && (
              <option>No hay clientes registrados</option>
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
          <select className="select select-bordered w-full max-w-xs ml-2">
            {car &&
              car.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.marca} {car.modelo} {car.patente}
                </option>
              ))}
            {car.length === 0 && <option>No hay autos registrados</option>}
          </select>
        </label>

        <label htmlFor="">
          Selecciona empleado:
          <select className="select select-bordered w-full max-w-xs ml-2">
            {employee &&
              employee.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.legajo} {employee.nombre} {employee.apellido}
                </option>
              ))}
            {employee.length === 0 && (
              <option>No hay empleados registrados</option>
            )}
          </select>
        </label>
      </div>

      <div className=""></div>
    </div>
  );
}
