import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getInsurances } from "../services/insuranceService";
import CreateInsurance from "./Modals/CreateInsurance";

export default function Seguros() {
  const [location, setLocation] = useLocation();
  const [seguros, setSeguros] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInsurances();
      setSeguros(data);
    };
    fetchData();
  }, []);

  const handleVolver = () => {
    setLocation("/clients-employees-cars");
  };

  return (
    <>
      <p className="flex">
        <button className="btn btn-circle" onClick={handleVolver}>
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-semibold ml-4">Seguros</h1>
      </p>
      <div className="p-4">
        <CreateInsurance />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Poliza</th>
            <th>Compañia</th>
            <th>Vencimiento</th>
            <th>Tipo de Poliza</th>
            <th>Descripcion</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          {seguros.length > 0 ? (
            seguros.map((seguro: any, index: number) => (
              <tr key={index}>
                <td>{seguro.poliza}</td>
                <td>{seguro.compania}</td>
                <td>{seguro.vencimiento}</td>
                <td>{seguro.tipoPoliza}</td>
                <td>{seguro.descripcion}</td>
                <td>{seguro.costo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-8">
                No se encontraron seguros registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
