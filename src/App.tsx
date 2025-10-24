import { useLocation } from "wouter";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register the plugin
gsap.registerPlugin(MotionPathPlugin);

function App() {
  const [, setLocation] = useLocation();
  const carRef = useRef<HTMLImageElement>(null);
  const car2Ref = useRef<HTMLImageElement>(null);
  const car3Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Car 1 - Carretera superior (recorrido completo extendido)
    if (carRef.current) {
      gsap.set(carRef.current, { x: -80, y: 40 });

      gsap.to(carRef.current, {
        motionPath: {
          path: [
            { x: -80, y: 40 },
            { x: 100, y: 40 },
            { x: 280, y: 40 },
            { x: 460, y: 40 },
            { x: 640, y: 40 },
            { x: 820, y: 40 },
            { x: 1000, y: 40 },
            { x: 1180, y: 40 },
          ],
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          curviness: 0.2,
        },
        duration: 18, // Más lento y elegante
        ease: "none",
        repeat: -1,
        filter:
          "brightness(1.2) drop-shadow(0 3px 10px rgba(59, 130, 246, 0.6))",
      });
    }

    // Car 2 - Carretera media (dirección opuesta)
    if (car2Ref.current) {
      gsap.set(car2Ref.current, { x: 1180, y: 112 });

      gsap.to(car2Ref.current, {
        motionPath: {
          path: [
            { x: 1180, y: 112 },
            { x: 1000, y: 112 },
            { x: 820, y: 112 },
            { x: 640, y: 112 },
            { x: 460, y: 112 },
            { x: 280, y: 112 },
            { x: 100, y: 112 },
            { x: -80, y: 112 },
          ],
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          curviness: 0.2,
        },
        duration: 20,
        ease: "none",
        repeat: -1,
        filter:
          "brightness(1.2) drop-shadow(0 3px 10px rgba(34, 197, 94, 0.6))",
        delay: 4,
      });
    }

    // Car 3 - Carretera inferior
    if (car3Ref.current) {
      gsap.set(car3Ref.current, { x: -80, y: 184 });

      gsap.to(car3Ref.current, {
        motionPath: {
          path: [
            { x: -80, y: 184 },
            { x: 100, y: 184 },
            { x: 280, y: 184 },
            { x: 460, y: 184 },
            { x: 640, y: 184 },
            { x: 820, y: 184 },
            { x: 1000, y: 184 },
            { x: 1180, y: 184 },
          ],
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          curviness: 0.2,
        },
        duration: 22,
        ease: "none",
        repeat: -1,
        filter:
          "brightness(1.2) drop-shadow(0 3px 10px rgba(236, 72, 153, 0.6))",
        delay: 8,
      });
    }
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


  return (
    <>
      {/* Sistema de Carreteras Profesional */}
      <div className="mx-4 mt-8 mb-6">
        <div className="card bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-100 shadow-2xl border-2 border-emerald-200 hover:shadow-3xl transition-all duration-500">
          <div className="card-body p-8">
            <div className="relative h-58 overflow-hidden rounded-xl bg-gradient-to-b from-sky-200 via-emerald-100 to-green-200 shadow-inner border-2 border-emerald-200">
              {/* Paisaje de fondo */}
              <div className="absolute inset-0">
                {/* Montañas en el fondo */}
                <div className="absolute bottom-32 left-0 right-0 h-16">
                  <div className="absolute bottom-0 left-10 w-20 h-12 bg-gradient-to-t from-gray-400 to-gray-300 transform -skew-x-12 opacity-40"></div>
                  <div className="absolute bottom-0 left-24 w-24 h-16 bg-gradient-to-t from-gray-500 to-gray-400 transform skew-x-6 opacity-50"></div>
                  <div className="absolute bottom-0 right-32 w-28 h-14 bg-gradient-to-t from-gray-400 to-gray-300 transform -skew-x-6 opacity-45"></div>
                  <div className="absolute bottom-0 right-16 w-16 h-10 bg-gradient-to-t from-gray-300 to-gray-200 transform skew-x-12 opacity-35"></div>
                </div>

                {/* Casas del pueblo */}
                <div className="absolute top-0 left-8 ">
                  {/* Casa 1 */}
                  <div className="relative">
                    <div className="w-8 h-3 bg-gradient-to-b from-red-400 to-red-500 rounded-t-md"></div>
                    <div className="w-8 h-4 bg-gradient-to-b from-yellow-200 to-yellow-300 border border-yellow-400"></div>
                    <div className="absolute top-4 left-1 w-2 h-2 bg-blue-400 rounded-sm"></div>
                    <div className="absolute top-5 left-5 w-1.5 h-4 bg-brown-600 bg-amber-700"></div>
                  </div>
                </div>

                <div className="absolute top-2 left-24">
                  {/* Casa 2 */}
                  <div className="relative">
                    <div className="w-6 h-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-t-md  origin-bottom"></div>
                    <div className="w-6 h-4 bg-gradient-to-b from-pink-200 to-pink-300 border border-pink-400 "></div>
                    <div className="absolute top-3 left-1 w-1.5 h-1.5 bg-cyan-400 rounded-sm"></div>
                    <div className="absolute top-4 left-4 w-1.5 h-4 bg-brown-600 bg-amber-700"></div>
                  </div>
                </div>

                <div className="absolute top-1 right-32">
                  {/* Casa 3 */}
                  <div className="relative">
                    <div className="w-10 h-3 bg-gradient-to-b from-green-400 to-green-500 rounded-t-lg"></div>
                    <div className="w-10 h-7 bg-gradient-to-b from-orange-200 to-orange-300 border border-orange-400"></div>
                    <div className="absolute top-4 left-1 w-2 h-2 bg-blue-300 rounded-sm"></div>
                    <div className="absolute top-4 left-7 w-1.5 h-1.5 bg-blue-300 rounded-sm"></div>
                    <div className="absolute top-5 right-5 w-1.5 h-3 bg-amber-800"></div>
                  </div>
                </div>

                <div className="absolute top-0 left-88 ">
                  {/* Casa 4 */}
                  <div className="relative">
                    <div className="w-8 h-3 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-md"></div>
                    <div className="w-8 h-4 bg-gradient-to-b from-violet-200 to-violet-300 border border-violet-400"></div>
                    <div className="absolute top-4 left-1 w-2 h-2 bg-blue-400 rounded-sm"></div>
                    <div className="absolute top-5 left-5 w-1.5 h-4 bg-brown-600 bg-amber-700"></div>
                  </div>
                </div>

                {/* Árboles distribuidos */}
                <div className="absolute left-44 top-3 ">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full -mt-3"></div>
                    <div className="w-1 h-4 bg-amber-800 mx-auto"></div>
                  </div>
                </div>

                <div className="absolute top-1 left-60">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-b from-green-500 to-green-700 rounded-full -mt-4"></div>
                    <div className="w-1 h-5 bg-amber-700 mx-auto"></div>
                  </div>
                </div>

                <div className="absolute top-5 right-60">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full -mt-2"></div>
                    <div className="w-1 h-3 bg-amber-800 mx-auto"></div>
                  </div>
                </div>

                <div className="absolute top-2 right-80">
                  <div className="relative">
                    <div className="w-7 h-7 bg-gradient-to-b from-green-500 to-green-700 rounded-full -mt-3"></div>
                    <div className="w-1.5 h-6 bg-amber-700 mx-auto"></div>
                  </div>
                </div>

                <div className="absolute top-4 right-16">
                  <div className="relative">
                    <div className="w-5 h-5 bg-gradient-to-b from-green-400 to-green-600 rounded-full -mt-2"></div>
                    <div className="w-1 h-4 bg-amber-800 mx-auto"></div>
                  </div>
                </div>

                {/* Montañas marrones en el segundo carril */}
                <div className="absolute top-15 left-16">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[36px] border-r-[36px] border-b-[48px] border-l-transparent border-r-transparent border-b-amber-800"></div>
                    <div className="absolute top-2 left-2 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[42px] border-l-transparent border-r-transparent border-b-amber-600"></div>
                    <div className="absolute top-3 left-3 w-0 h-0 border-l-[22px] border-r-[22px] border-b-[28px] border-l-transparent border-r-transparent border-b-white opacity-30"></div>
                  </div>
                </div>

                <div className="absolute top-13 left-48">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[48px] border-r-[48px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-900"></div>
                    <div className="absolute top-3 left-3 w-0 h-0 border-l-[42px] border-r-[42px] border-b-[54px] border-l-transparent border-r-transparent border-b-amber-700"></div>
                    <div className="absolute top-0 left-9 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[36px] border-l-transparent border-r-transparent border-b-white opacity-25"></div>
                  </div>
                </div>

                <div className="absolute top-19 left-80">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[32px] border-r-[32px] border-b-[42px] border-l-transparent border-r-transparent border-b-yellow-800"></div>
                    <div className="absolute top-2 left-2 w-0 h-0 border-l-[28px] border-r-[28px] border-b-[36px] border-l-transparent border-r-transparent border-b-yellow-700"></div>
                    <div className="absolute top-0 left-6 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[24px] border-l-transparent border-r-transparent border-b-white opacity-20"></div>
                  </div>
                </div>


                <div className="absolute top-13 right-40">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[42px] border-r-[42px] border-b-[54px] border-l-transparent border-r-transparent border-b-amber-800"></div>
                    <div className="absolute top-2 left-2 w-0 h-0 border-l-[38px] border-r-[38px] border-b-[48px] border-l-transparent border-r-transparent border-b-amber-600"></div>
                    <div className="absolute top-2 left-3 w-0 h-0 border-l-[26px] border-r-[26px] border-b-[32px] border-l-transparent border-r-transparent border-b-white opacity-30"></div>
                  </div>
                </div>

                <div className="absolute top-15 right-16">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[28px] border-r-[28px] border-b-[36px] border-l-transparent border-r-transparent border-b-yellow-900"></div>
                    <div className="absolute top-2 left-2 w-0 h-0 border-l-[24px] border-r-[24px] border-b-[30px] border-l-transparent border-r-transparent border-b-yellow-800"></div>
                    <div className="absolute top-0 left-5 w-0 h-0 border-l-[18px] border-r-[18px] border-b-[22px] border-l-transparent border-r-transparent border-b-white opacity-25"></div>
                  </div>
                </div>

                <div className="absolute top-14 left-120">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[56px] border-l-transparent border-r-transparent border-b-amber-900"></div>
                    <div className="absolute top-3 left-2 w-0 h-0 border-l-[36px] border-r-[36px] border-b-[50px] border-l-transparent border-r-transparent border-b-amber-700"></div>
                    <div className="absolute top-0 left-7 w-0 h-0 border-l-[26px] border-r-[26px] border-b-[34px] border-l-transparent border-r-transparent border-b-white opacity-20"></div>
                  </div>
                </div>

                {/* Carreteras profesionales con mejor diseño */}
                {/* Carretera superior */}
                <div className="absolute top-6 left-0 right-0 h-8 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 shadow-lg">
                  <div className="absolute inset-x-0 top-1 h-0.5 bg-yellow-400 opacity-90"></div>
                  <div className="absolute inset-x-0 top-3.5 h-0.5 bg-white opacity-70 bg-dashed"></div>
                  <div className="absolute inset-x-0 bottom-1 h-0.5 bg-yellow-400 opacity-90"></div>
                  {/* Sombras laterales */}
                  <div className="absolute -top-1 left-0 right-0 h-1 bg-green-600 opacity-40"></div>
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-600 opacity-40"></div>
                </div>

                {/* Carretera media */}
                <div className="absolute top-24 left-0 right-0 h-8 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 shadow-lg">
                  <div className="absolute inset-x-0 top-1 h-0.5 bg-yellow-400 opacity-90"></div>
                  <div className="absolute inset-x-0 top-3.5 h-0.5 bg-white opacity-70 bg-dashed"></div>
                  <div className="absolute inset-x-0 bottom-1 h-0.5 bg-yellow-400 opacity-90"></div>
                  <div className="absolute -top-1 left-0 right-0 h-1 bg-green-600 opacity-40"></div>
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-600 opacity-40"></div>
                </div>

                {/* Carretera inferior */}
                <div className="absolute top-42 left-0 right-0 h-8 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 shadow-lg">
                  <div className="absolute inset-x-0 top-1 h-0.5 bg-yellow-400 opacity-90"></div>
                  <div className="absolute inset-x-0 top-3.5 h-0.5 bg-white opacity-70 bg-dashed"></div>
                  <div className="absolute inset-x-0 bottom-1 h-0.5 bg-yellow-400 opacity-90"></div>
                  <div className="absolute -top-1 left-0 right-0 h-1 bg-green-600 opacity-40"></div>
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-600 opacity-40"></div>
                </div>

                {/* Señales de tráfico */}
                <div className="absolute top-14 left-16">
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-white -mt-1"></div>
                  <div className="w-1 h-4 bg-gray-400 mx-auto"></div>
                </div>

                <div className="absolute top-36 right-24">
                  <div className="w-3 h-2 bg-blue-500 border border-white -mt-1 text-xs text-center">
                  <div className="w-1 h-4 bg-gray-400 mx-auto"></div>
                    🚗
                  </div>
                </div>

                {/* Autos en las carreteras */}
                <img
                  ref={carRef}
                  src="./src/images/car.png"
                  alt="Auto en carretera principal"
                  className="w-10 h-auto absolute z-20"
                  style={{ willChange: "transform" }}
                />

                <img
                  ref={car2Ref}
                  src="./src/images/car.png"
                  alt="Auto en carretera secundaria"
                  className="w-9 h-auto absolute z-20"
                  style={{ willChange: "transform" }}
                />

                <img
                  ref={car3Ref}
                  src="./src/images/car.png"
                  alt="Auto en carretera terciaria"
                  className="w-8 h-auto absolute z-20"
                  style={{ willChange: "transform" }}
                />

                {/* Nubes decorativas */}
                <div className="absolute top-1 right-10 w-6 h-3 bg-white opacity-60 rounded-full"></div>
                <div className="absolute top-1 right-8 w-4 h-2 bg-white opacity-50 rounded-full"></div>
                <div className="absolute top-2 left-80 w-8 h-4 bg-white opacity-40 rounded-full"></div>
                <div className="absolute top-3 left-100 w-5 h-3 bg-white opacity-55 rounded-full"></div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Títulos principales */}
      <div className="flex flex-col items-center justify-center mt-6 gap-4">
        <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
          Polymorph-Rides
        </h1>
        <h2 className="text-xl bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
          el mismo auto, para muchos propósitos!
        </h2>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-2 relative z-10">
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-blue-200 to-purple-200 m-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl hover:scale-110 transition-transform duration-300"
              src="./src/images/clients_employee_cars.jpg"
              alt="Clientes, Vehiculos y Empleados"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Clientes, Vehiculos y Empleados
            </h3>
            <p className="card-text">
              Consulta la informacion detallada de cada uno aqui
            </p>
            <div
              className="btn btn-secondary hover:btn-primary transition-all duration-300 hover:scale-105"
              onClick={handleClientEmployeeCarsClick}
            >
              Click aqui
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-green-200 to-blue-200 m-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl hover:scale-110 transition-transform duration-300"
              src="./src/images/Car-Rentals.jpg"
              alt="Registro de alquileres"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Registro de alquileres
            </h3>
            <p className="card-text">
              Informacion sobre los alquileres realizados.
            </p>
            <div
              className="btn btn-secondary hover:btn-success transition-all duration-300 hover:scale-105"
              onClick={handleCarRentalsClick}
            >
              Click aqui
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-orange-200 to-red-200 m-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl hover:scale-110 transition-transform duration-300"
              src="./src/images/mechanic-working.jpg"
              alt="Control de mantenimiento"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Control de mantenimiento
            </h3>
            <p className="card-text">
              Consulta la informacion sobre el mantenimiento de los vehiculos
              aqui
            </p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl bg-gradient-to-b from-pink-200 to-purple-200 m-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50">
          <figure className="h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-t-xl hover:scale-110 transition-transform duration-300"
              src="./src/images/reports2.jpg"
              alt="Reportes"
            />
          </figure>
          <div className="card-body">
            <h3 className="card-title bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Reportes
            </h3>
            <p className="card-text">
              Consulta la informacion sobre los reportes generados aqui
            </p>
            <div className="btn btn-secondary hover:btn-accent transition-all duration-300 hover:scale-105" onClick={handleStadisticClick}>
              click aqui
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
