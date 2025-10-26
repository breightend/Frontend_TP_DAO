import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { getRentals } from "../services/rentalService";

export default function CarRentals() {
  const [locations, setLocations] = useLocation();
  const [rentals, setRentals] = useState([]);
  const [showInfoRental, setShowInfoRental] = useState(false);

  const handleBackButton = () => {
    setLocations("/");
  };

  const handleShowInfoRental = () => {
    setShowInfoRental(!showInfoRental);
  };

  const handleAddRental = () => {
    setLocations("/add-rental");
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await getRentals();
        setRentals(data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold gap-2">
        <div
          className="btn btn-neutral btn-circle btn-ghost mr-2"
          onClick={handleBackButton}
        >
          <ArrowLeft />
        </div>
        Registro de Alquiler de Autos
      </h1>

      <p className="ml-2">
        Aqui podras ver todos los alquileres de autos registrados en el sistema.
      </p>
      <div className="overflow-x-auto mt-4">
        <button className="btn btn-primary ml-2" onClick={handleShowInfoRental}>
          {showInfoRental ? "Ocultar Información" : "Mostrar Información"}
        </button>

        <button className="btn btn-success ml-2" onClick={handleAddRental}>
          Agregar Nuevo Alquiler
        </button>

        {showInfoRental && (
          <table className="table ">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID Alquiler</th>
                <th className="px-4 py-2 border">Cliente</th>
                <th className="px-4 py-2 border">Costo</th>
                <th className="px-4 py-2 border">Auto</th>
                <th className="px-4 py-2 border">Fecha de Inicio</th>
                <th className="px-4 py-2 border">Fecha de Fin</th>
                <th className="px-4 py-2 border">Sanción</th>
              </tr>
            </thead>
            <tbody>
              {rentals &&
                rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td className="px-4 py-2 border">{rental.id}</td>
                    <td className="px-4 py-2 border">{rental.cliente}</td>
                    <td className="px-4 py-2 border">{rental.costo}</td>
                    <td className="px-4 py-2 border">{rental.auto}</td>
                    <td className="px-4 py-2 border">{rental.fechaInicio}</td>
                    <td className="px-4 py-2 border">{rental.fechaFin}</td>
                    <td className="px-4 py-2 border">{rental.sancion}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
