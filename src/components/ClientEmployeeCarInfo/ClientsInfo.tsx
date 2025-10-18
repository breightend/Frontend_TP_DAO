import { getClients } from '../../services/clientService'
import { useEffect, useState } from 'react'

export default function ClientsInfo() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clients = await getClients()
      setClients(clients)
    } catch (error) {
      console.error('Error fetching clients:', error);
    }}


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
              {clients && clients.map((client: any, index: number) => (
                <tr key={client.id}>
                  <th>{index + 1}</th>
                  <td>{client.nombre}</td>
                  <td>{client.apellido}</td>
                  <td>{client.dni}</td>
                  <td>{client.email}</td>
                  <td>{client.telefono}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
