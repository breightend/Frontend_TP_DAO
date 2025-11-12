import { ArrowLeft, BriefcaseBusiness, Car, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import type { CarsInfoRef } from "./ClientEmployeeCarInfo/CarsInfo";
import CarsInfo from "./ClientEmployeeCarInfo/CarsInfo";
import ClientsInfo from "./ClientEmployeeCarInfo/ClientsInfo";
import EmployeeInfo from "./ClientEmployeeCarInfo/EmployeeInfo";
import CreateCar from "./Modals/CreateCar";
import CreateClient from "./Modals/CreateClient";
import CreateEmployeeModal from "./Modals/CreateEmployee";

export default function ClientEmployeeCars() {
  const [variante, setVariante] = useState<string>("cliente");
  const carsInfoRef = useRef<CarsInfoRef>(null);

  const handleCarCreated = () => {
    if (carsInfoRef.current && carsInfoRef.current.fetchAutos) {
      carsInfoRef.current.fetchAutos();
    }
  };

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
          </div>
          <ClientsInfo />
        </>
      )}
      {variante === "empleado" && (
        <>
          <div className="flex mt-2 mb-2">
            <CreateEmployeeModal />
          </div>
          <EmployeeInfo />
        </>
      )}
      {variante === "auto" && (
        <>
          <div className="flex mt-2 mb-2">
            <CreateCar onSuccess={handleCarCreated} />
          </div>
          <CarsInfo ref={carsInfoRef} />
        </>
      )}
    </>
  );
}
