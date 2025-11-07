import { Search } from "lucide-react";
import { getAutos } from "../../services/autosService";
import { useEffect, useState } from "react";

export default function CarsInfo() {
  const [autos, setAutos] = useState([]);

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const autos = await getAutos();
      setAutos(autos);
    } catch (error) {
      console.error("Error fetching autos:", error);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here
  };

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <div className="flex justify-between p-2">
          <div>
            <h3 className="text-xl font-bold">Información de Autos</h3>
          </div>
          <div className="join">
            <div>
              <label className="input validator join-item">
                <Search className="mx-2" />
                <input type="text" placeholder="AG056EX" required />
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
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Color</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {autos &&
              autos.map((auto: any, index: number) => (
                <tr key={auto.id}>
                  <th>{index + 1}</th>
                  <td>{auto.marca}</td>
                  <td>{auto.modelo}</td>
                  <td>{auto.año}</td>
                  <td>{auto.color}</td>
                  <td>{auto.precio}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
