import { ArrowLeft, Car, Printer, ShoppingCart, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import VentasStadistics from "./VentasStadistics";
import AutosStadistics from "./AutosStadistics";

export default function Stadistic() {
  const [, setLocation] = useLocation();
  const [verStadisticas, setVerStadisticas] = useState<string>("general");

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const handleBackArrow = () => {
    setLocation("/");
  };

  const handleMenu = (ver: string) => {
    setVerStadisticas(ver);
  };

  return (
    <div>
      <div className=" gap-2 flex items-center mb-4">
        <ArrowLeft
          className="btn btn-circle btn-ghost"
          onClick={handleBackArrow}
        />
        <h1 className=" text-3xl font-mono font-semibold">
          Registro y estadísticas
        </h1>
      </div>

      <ul className="menu bg-base-200 lg:menu-horizontal rounded-box">
        <li>
          <a
            className={verStadisticas === "estadisticas-ventas" ? "active" : ""}
            onClick={() => handleMenu("estadisticas-ventas")}
          >
            <ShoppingCart />
            Ventas
          </a>
        </li>
        <li>
          <a
            className={verStadisticas === "estadisticas-autos" ? "active" : ""}
            onClick={() => handleMenu("estadisticas-autos")}
          >
            <Car />
            Autos
          </a>
        </li>
        <li>
          <a
            className={verStadisticas === "general" ? "active" : ""}
            onClick={() => handleMenu("general")}
          >
            <BarChart3 />
            General
            <span className="badge badge-xs badge-info"></span>
          </a>
        </li>
      </ul>

      {/* Conditional rendering based on selected menu */}
      {verStadisticas === "general" && (
        <div>
          <h2 className="text-2xl font-mono font-semibold mb-4">
            Estadísticas Generales
          </h2>
          <LineChart
            style={{
              width: "100%",
              maxWidth: "700px",
              maxHeight: "70vh",
              aspectRatio: 1.618,
            }}
            responsive
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </div>
      )}

      {verStadisticas === "estadisticas-ventas" && <VentasStadistics />}

      {verStadisticas === "estadisticas-autos" && <AutosStadistics />}
      <div className="flex justify-end mr-2 mt-4">
        <button className="btn btn-neutral tooltip" data-tip="Generar Reporte">
          <Printer className="mr-2" /> Imprimir
        </button>
      </div>
    </div>
  );
}
