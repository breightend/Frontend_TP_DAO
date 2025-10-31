import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import AddMaintenance from "../Modals/AddMaintance";

export default function CarMaintenance() {
  const [location, setLocation] = useLocation();
  const handleLocation = () => {
    setLocation("/");
  };

  return (
    <div className="p-2">
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleLocation}
          className="btn  btn-circle tooltip"
          data-tip="Volver"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-bold ">Mantenimiento de Autos</h1>
      </div>
      <p className="text-xl mb-2">
        A continuación se muestra la información de mantenimiento de los autos
        registrados:
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <img src="..\src\images\ToyotaCorolla.jpeg" alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Nombre del auto!</h2>
            <p>Aca me traigo toda la info del auto...</p>
            <p>Info del mantenimiento...</p>
            <progress
              className="progress progress-primary w-56"
              value="40"
              max="100"
            ></progress>
            <div className="card-actions justify-end">
              <AddMaintenance />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
