import { getEmployees } from "../../services/employeeService";
import { useEffect, useState } from "react";

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
  }

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Fecha nacimiento </th>
            </tr>
          </thead>
          <tbody>
            {employees &&
              employees.map((employee: any, index: number) => (
                <tr key={employee.id}>
                  <th>{index + 1}</th>
                  <td>{employee.nombre}</td>
                  <td>{employee.apellido}</td>
                  <td>{employee.dni}</td>
                  <td>{employee.email}</td>
                  <td>{employee.telefono}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
