function App() {

  
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-base-100 mt-4 gap-4">
        <h1 className="text-2xl">Polymorph-Rides</h1>
        <h2 className="text-xl"> el mismo auto, pero muchos propositos!</h2>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-2">
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <div className="card-body">
            <h3 className="card-title">Clientes, Vehiculos y Empleados </h3>
            <p className="card-text">Consulta la informacion detallada de cada uno aqui</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <div className="card-body">
            <h3 className="card-title">Registro de alquileres</h3>
            <p className="card-text">Informacion sobre los alquileres realizados.</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <div className="card-body">
            <h3 className="card-title">Control de mantenimiento</h3>
            <p className="card-text">Consulta la informacion sobre el mantenimiento de los vehiculos aqui</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4">
          <div className="card-body">
            <h3 className="card-title">Reportes</h3>
            <p className="card-text">Consulta la informacion sobre los reportes generados aqui</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
