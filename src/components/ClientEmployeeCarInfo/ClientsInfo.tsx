import { getClients } from "../../services/clientService";
import { useEffect, useState } from "react";
import EditClient from "../Modals/EditClient";

export default function ClientsInfo() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clients = await getClients();
      setClients(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleEditSuccess = () => {
    fetchClients();
    setSelectedClient(null);
  };

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
              <th>Fecha Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients &&
              clients.map((client: any, index: number) => (
                <tr key={client.id}>
                  <th>{index + 1}</th>
                  <td>{client.nombre}</td>
                  <td>{client.apellido}</td>
                  <td>{client.dni}</td>
                  <td>{client.email}</td>
                  <td>{client.telefono}</td>
                  <td>{client.fechaNacimiento}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => setSelectedClient(client)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <EditClient client={selectedClient} onSuccess={handleEditSuccess} />
      )}
    </>
  );
}
