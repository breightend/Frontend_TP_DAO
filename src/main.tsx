import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Navbar from "./components/Navbar.tsx";
import ClientEmployeeCars from "./components/ClientEmployeeCars.tsx";
import { Route, Router } from "wouter";
import CarRentals from "./components/CarRentals.tsx";
import Stadistic from "./components/Stadistic/Stadistic.tsx";
import CreateRental from "./components/Rentals/CreateRental.tsx";
import AddSancion from "./components/Rentals/Sancion.tsx";
import MaintenanceOrders from "./components/Maintenance/MaintenanceOrders.tsx";
import MaintenanceOrderDetail from "./components/Maintenance/MaintenanceOrderDetail.tsx";
import Seguros from "./components/Seguros.tsx";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Navbar />
    <Router>
      <Route path="/" component={App} />
      <Route path="/clients-employees-cars" component={ClientEmployeeCars} />
      <Route path="/car-rentals" component={CarRentals} />
      <Route path="/stadistic" component={Stadistic} />
      <Route path="/add-rental" component={CreateRental} />
      <Route path="/add-sancion" component={AddSancion} />
      <Route path="/car-maintenance" component={MaintenanceOrders} />
      <Route path="/car-maintenance/:id" component={MaintenanceOrderDetail} />
      <Route path="/car-insurance" component={Seguros} />
    </Router>
  </StrictMode>
);
