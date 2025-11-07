import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import CarAnimation from "./components/AnimandoAndo/CarAnimation";
import ParticleBackground from "./components/ParticleBackground";
import logo from "./images/logo.png";

// Register the plugin
gsap.registerPlugin(MotionPathPlugin);

function App() {
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animación de entrada del hero
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        }
      );
    }

    // Animación de entrada de las tarjetas con delay
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        {
          opacity: 0,
          y: 100,
          rotationX: -15,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 1.5,
          ease: "back.out(1.7)",
        }
      );
    }

    // Timeout para mostrar contenido después de la animación de entrada
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  const handleClientEmployeeCarsClick = () => {
    setLocation("/clients-employees-cars");
  };

  const handleCarRentalsClick = () => {
    setLocation("/car-rentals");
  };

  const handleStadisticClick = () => {
    setLocation("/stadistic");
  };

  const handleMaintenanceClick = () => {
    setLocation("/car-maintenance");
  };

  return (
    <>
      {/* Overlay de bienvenida */}
      {showWelcome && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center">
          <div className="text-center space-y-6 animate-pulse">
            <div className="relative">
              <img
                src={logo}
                alt="Polymorph-Rides Logo"
                className="w-32 h-32 mx-auto object-contain filter drop-shadow-2xl animate-spin-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Polymorph-Rides
            </h1>
            <p className="text-xl text-gray-300 animate-fade-in">
              Cargando experiencia de movilidad...
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Fondo de partículas animadas */}
      <ParticleBackground />

      {/* Contenido principal */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative z-10">
        {/* Hero Section integrada con animación */}
        <div ref={heroRef} className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>

          <div className="relative z-10 flex flex-col items-center justify-center pt-8 pb-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img
                  src={logo}
                  alt="Polymorph-Rides Logo"
                  className="w-16 h-16 object-contain filter drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Polymorph-Rides
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  🚗 El mismo auto, para muchos propósitos
                </p>
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-purple-200/50">
              <CarAnimation />
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg text-gray-700 mb-2">
                Gestiona tu flota con estilo y eficiencia
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Sistema activo</span>
                </span>
                <span>•</span>
                <span>Última actualización: Hoy</span>
                <span>•</span>
                <span>Versión 2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section mejorada */}
        <div className="px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Explora nuestros servicios
            </h2>

            <div
              ref={cardsRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Card 1 - Clientes, Vehículos y Empleados */}
              <div
                className="group cursor-pointer"
                onClick={handleClientEmployeeCarsClick}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-blue-200/50 group-hover:border-blue-400/50 group-hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      src="./src/images/clients_employee_cars.jpg"
                      alt="Clientes, Vehículos y Empleados"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Gestión Integral
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Administra clientes, vehículos y empleados desde un panel
                      unificado
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-500 font-medium">
                        Explorar →
                      </span>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                        <span className="text-blue-500 group-hover:text-white text-sm">
                          👥
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Registro de Alquileres */}
              <div
                className="group cursor-pointer"
                onClick={handleCarRentalsClick}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-green-200/50 group-hover:border-green-400/50 group-hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      src="./src/images/Car-Rentals.jpg"
                      alt="Registro de alquileres"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Alquileres y Sanciones
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Controla todos los alquileres y gestiona sanciones
                      eficientemente
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-500 font-medium">
                        Gestionar →
                      </span>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                        <span className="text-green-500 group-hover:text-white text-sm">
                          🚗
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 - Mantenimiento */}
              <div
                className="group cursor-pointer"
                onClick={handleMaintenanceClick}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-200/50 group-hover:border-orange-400/50 group-hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      src="./src/images/mechanic-working.jpg"
                      alt="Control de mantenimiento"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Mantenimiento
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Programa y supervisa el mantenimiento de toda la flota
                      vehicular
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-orange-500 font-medium">
                        Supervisar →
                      </span>
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                        <span className="text-orange-500 group-hover:text-white text-sm">
                          🔧
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 - Reportes */}
              <div
                className="group cursor-pointer"
                onClick={handleStadisticClick}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-pink-200/50 group-hover:border-pink-400/50 group-hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      src="./src/images/reports2.jpg"
                      alt="Reportes y Estadísticas"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      Reportes y Analytics
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Analiza datos y genera reportes detallados del negocio
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pink-500 font-medium">
                        Analizar →
                      </span>
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-500 transition-colors duration-300">
                        <span className="text-pink-500 group-hover:text-white text-sm">
                          📊
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
