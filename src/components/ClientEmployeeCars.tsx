import { ArrowLeft, BriefcaseBusiness, Car, UserRound } from "lucide-react";
import { useLocation } from "wouter";
import ClientsInfo from "./ClientsInfo";

export default function ClientEmployeeCars() {
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
      <p className="text-sm mt-2">Seleccione la informacion que quiere ver: </p>
      <ul className="menu menu-horizontal bg-base-300 rounded-box">
        <li>
          <a className="btn btn-ghost tooltip" data-tip="Clientes">
            <UserRound />
          </a>
        </li>
        <li>
          <a className="btn btn-ghost tooltip" data-tip="Empleados">
            <BriefcaseBusiness />
          </a>
        </li>
        <li>
          <a className="btn btn-ghost tooltip" data-tip="Autos">
            <Car />
          </a>
        </li>
      </ul>

      <div className="mt-2">
        <ClientsInfo />
      </div>
      {/* Aca quiero importar la tabla segun corresponda de clientInfo y asi*/}
    </>
  );
}
