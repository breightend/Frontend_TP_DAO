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
            </tr>
          </thead>
          <tbody>
            {autos &&
              autos.map((auto: any, index: number) => (
                <tr key={auto.id}>
                  <th>{index + 1}</th>
                  <td>{auto.nombre}</td>
                  <td>{auto.apellido}</td>
                  <td>{auto.dni}</td>
                  <td>{auto.email}</td>
                  <td>{auto.telefono}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
