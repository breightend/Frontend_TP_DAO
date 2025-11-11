import { getClients } from "../../services/clientService";
import { useEffect, useState } from "react";
import EditClient from "../Modals/EditClient";
import { Search } from "lucide-react";

export default function ClientsInfo() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clients = await getClients();
      setClients(clients);
      setFilteredClients(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleEditSuccess = () => {
    fetchClients();
    setSelectedClient(null);
  };

  const filterClients = (term: string) => {
    if (!term.trim()) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter((client: any) => {
      const searchLower = term.toLowerCase();
      return (
        client.nombre?.toLowerCase().includes(searchLower) ||
        client.apellido?.toLowerCase().includes(searchLower) ||
        client.dni?.toString().includes(term)
      );
    });

    setFilteredClients(filtered);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    filterClients(searchTerm);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterClients(value);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <div className="flex justify-between p-2">
          <div>
            <h3 className="text-xl font-bold">Información de Clientes</h3>
          </div>
          <div className="join">
            <div>
              <label className="input validator join-item">
                <Search className="mx-2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, apellido o DNI..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
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
            {filteredClients && filteredClients.length > 0 ? (
              filteredClients.map((client: any, index: number) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  {searchTerm
                    ? "No se encontraron clientes con ese criterio de búsqueda"
                    : "No hay clientes disponibles"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <EditClient client={selectedClient} onSuccess={handleEditSuccess} />
      )}
    </>
  );
}
