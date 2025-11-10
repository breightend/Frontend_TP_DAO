import logo from "../images/logo.png";

export default function Navbar() {
  return (
    <>
      <div className="navbar bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/30">
        <div className="flex-1">
          <a className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <img
                src={logo}
                alt="Polymorph-Rides Logo"
                className="w-12 h-12 object-contain filter drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Polymorph-Rides
              </span>
              <span className="text-xs text-gray-300/80 -mt-1">
                Transformando la movilidad
              </span>
            </div>
          </a>
        </div>
        <div className="flex-none">
          <div className="hidden md:flex items-center space-x-1">
          </div>
        </div>
      </div>
    </>
  );
}
