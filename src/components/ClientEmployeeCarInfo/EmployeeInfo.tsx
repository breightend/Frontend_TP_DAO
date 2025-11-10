import { Search } from "lucide-react";
import { getEmployees } from "../../services/employeeService";
import { useEffect, useState } from "react";

interface Employee {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  DNI: string;
  email: string;
  telefono: string;
  direccion: string;
  puesto: string;
  salario: string;
  fechaInicioActividad: string;
}
export default function EmployeeInfo() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employees = await getEmployees();
      setEmployees(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here
  };
  
  console.log(employees)

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <div className="flex justify-between p-2">
          <div>
            <h3 className="text-xl font-bold">Información de Empleados</h3>
          </div>
          <div className="join">
            <div>
              <label className="input validator join-item">
                <Search className="mx-2" />
                <input type="text" placeholder="4348..." required />
              </label>
              <div className="validator-hint hidden">
                Ingrese parametro de busqueda
              </div>
            </div>
            <button
              className="btn btn-neutral join-item"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Fecha de Nacimiento</th>
              <th>Dirección</th>
              <th>Puesto</th>
              <th>Salario</th>
              <th>Fecha de Inicio de Actividad</th>
            </tr>
          </thead>
          <tbody>
            {employees &&employees.map((employee: Employee, index: number) => (
              <tr key={employee.DNI}>
                <th>{index + 1}</th>
                <td>{employee.nombre}</td>
                <td>{employee.apellido}</td>
                <td>{employee.DNI}</td>
                <td>{employee.email}</td>
                <td>{employee.telefono}</td>
                <td>{employee.fechaNacimiento}</td>
                <td>{employee.direccion}</td>
                <td>{employee.puesto}</td>
                <td>{employee.salario}</td>
                <td>{employee.fechaInicioActividad}</td>
              </tr>
            ))}
            </tbody>
        </table>
      </div>
    </>
  );
}
