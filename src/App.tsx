import { useLocation } from "wouter";

function App() {
  const [, setLocation] = useLocation();

  const handleClientEmployeeCarsClick = () => {
    setLocation("/clients-employees-cars");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-base-100 mt-4 gap-4">
        <h1 className="text-2xl">Polymorph-Rides</h1>
        <h2 className="text-xl"> el mismo auto, para muchos propositos!</h2>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-2">
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl"
              src="./src/images/clients_employee_cars.jpg"
              alt="Clientes, Vehiculos y Empleados"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title">Clientes, Vehiculos y Empleados </h3>
            <p className="card-text">
              Consulta la informacion detallada de cada uno aqui
            </p>
            <div
              className="btn btn-secondary"
              onClick={handleClientEmployeeCarsClick}
            >
              Click aqui
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl"
              src="./src/images/Car-Rentals.jpg"
              alt="Registro de alquileres"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title">Registro de alquileres</h3>
            <p className="card-text">
              Informacion sobre los alquileres realizados.
            </p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl"
              src="./src/images/mechanic-working.jpg"
              alt="Control de mantenimiento"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title">Control de mantenimiento</h3>
            <p className="card-text">
              Consulta la informacion sobre el mantenimiento de los vehiculos
              aqui
            </p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl"
              src="./src/images/reports2.jpg"
              alt="Reportes"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title">Reportes</h3>
            <p className="card-text">
              Consulta la informacion sobre los reportes generados aqui
            </p>
            <div className="btn btn-secondary">clic aqui</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
