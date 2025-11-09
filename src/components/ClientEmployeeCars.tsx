import { ArrowLeft, BriefcaseBusiness, Car, UserRound } from "lucide-react";
import { useLocation } from "wouter";
import ClientsInfo from "./ClientEmployeeCarInfo/ClientsInfo";
import { useState } from "react";
import CreateClient from "./Modals/createClient";
import EmployeeInfo from "./ClientEmployeeCarInfo/EmployeeInfo";
import CarsInfo from "./ClientEmployeeCarInfo/CarsInfo";
import CreateEmployeeModal from "./Modals/CreateEmployee";
import CreateCar from "./Modals/CreateCar";
import EditClient from "./Modals/EditClient";
import EditCar from "./Modals/EditCar";
import EditEmployee from "./Modals/EditEmployee";


export default function ClientEmployeeCars() {
  const [variante, setVariante] = useState<string>("cliente");
  const handleClientClick = () => {
    setVariante("cliente");
  };

  const handleEmployeeClick = () => {
    setVariante("empleado");
  };

  const handleCarClick = () => {
    setVariante("auto");
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
          <div className="flex mt-2 mb-2 gap-2 ">
            <CreateClient />
            <EditClient />
          </div>
          <ClientsInfo />
        </>
      )}
      {variante === "empleado" && (
        <>
          <div className="flex mt-2 mb-2">
            <CreateEmployeeModal />
            <EditEmployee />
          </div>
          <EmployeeInfo />
        </>
      )}
      {variante === "auto" && (
        <>
          <div className="flex mt-2 mb-2">
            <CreateCar />
            <EditCar />
          </div>
          <CarsInfo />
        </>
      )}

      {/* Aca quiero importar la tabla segun corresponda de clientInfo y asi*/}
    </>
  );
}
