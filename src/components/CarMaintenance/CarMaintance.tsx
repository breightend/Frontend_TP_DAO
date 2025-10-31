import { useLocation } from "wouter";

export default function CarMaintenance() {
  const [location, setLocation] = useLocation();
  const handleLocation = () => {
    setLocation("/");
  };

  return (
    <div className="p-2">
      <button onClick={handleLocation} className="btn btn-neutral">
        Volver
      </button>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img src="..\src\images\ToyotaCorolla.jpeg" alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Nombre del auto!</h2>
          <p>Aca me traigo toda la info del auto...</p>
          <p>Info del mantenimiento...</p>
          <progress className="progress progress-primary w-56" value="40" max="100"></progress>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Hacer mantenimiento</button>
          </div>
        </div>
      </div>
    </div>
  );
}
