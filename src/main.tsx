import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Navbar from "./components/Navbar.tsx";
import ClientEmployeeCars from "./components/ClientEmployeeCars.tsx";
import { Route, Router } from "wouter";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Navbar />
    <Router>
      <Route path="/" component={App} />
      <Route path="/clients-employees-cars" component={ClientEmployeeCars} />
    </Router>
  </StrictMode>
);
