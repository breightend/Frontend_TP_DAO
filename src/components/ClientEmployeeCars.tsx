import { ArrowLeft, BriefcaseBusiness, Car, UserRound } from "lucide-react";
import { useLocation } from "wouter";
import ClientsInfo from "./ClientEmployeeCarInfo/ClientsInfo";
import { useState } from "react";
import CreateClient from "./Modals/createClient";

export default function ClientEmployeeCars() {
  const [variante, setVariante] = useState<string>("cliente");
  const [showModal, setShowModal] = useState(false);
  const handleClientClick = () => {
    setVariante("cliente");
  };

  const handleEmployeeClick = () => {
    setVariante("empleado");
  };

  const handleCarClick = () => {
    setVariante("auto");
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const [, setLocation] = useLocation();
  return (
    <>
      <div className="flex gap-2 ">
        <div
          className="btn btn-circle btn-ghost"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft />
        </div>
        <h1 className="text-3xl font-bold ">Clientes, Empleados y Autos</h1>
      </div>
      <p className="text-sm mt-2 ml-2">
        Seleccione la informacion que quiere ver:{" "}
      </p>
      <ul className="menu menu-horizontal bg-base-300 rounded-box ml-2 mb-2">
        <li>
          <a
            className="btn btn-ghost tooltip"
            onClick={handleClientClick}
            data-tip="Clientes"
          >
            <UserRound />
          </a>
        </li>
        <li>
          <a
            className="btn btn-ghost tooltip"
            onClick={handleEmployeeClick}
            data-tip="Empleados"
          >
            <BriefcaseBusiness />
          </a>
        </li>
        <li>
          <a
            className="btn btn-ghost tooltip"
            onClick={handleCarClick}
            data-tip="Autos"
          >
            <Car />
          </a>
        </li>
      </ul>

      {variante === "cliente" && (
          <>
          <div className="flex mt-2 mb-2 ">

          <CreateClient />
          </div>
          <ClientsInfo />
        </>
      )}
      {variante === "empleado" && (
        <>
          <p>Hola!</p>
        </>
      )}
      {variante === "auto" && (
        <>
          <p>Holiwiws!</p>
        </>
      )}

      {/* Aca quiero importar la tabla segun corresponda de clientInfo y asi*/}
    </>
  );
}
