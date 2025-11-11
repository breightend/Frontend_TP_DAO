import { useState, useEffect } from "react";
import {
  getEmployeeById,
  deleteEmployee,
} from "../../services/employeeService";
import EditEmployee from "./EditEmployee";
import {
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";

interface SpecificEmployeeProps {
  employeeId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

interface Employee {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  tipoDocumento?: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  fechaInicioActividad: string;
  legajo?: string;
  direccion?: string;
  puesto?: string;
  salario?: string;
}

export default function SpecificEmployee({
  employeeId,
  isOpen,
  onClose,
  onDelete,
  onEdit,
}: SpecificEmployeeProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (employeeId && isOpen) {
      fetchEmployee();
    }
  }, [employeeId, isOpen]);

  const fetchEmployee = async () => {
    if (!employeeId) return;

    setIsLoading(true);
    setError("");

    try {
      const employeeData = await getEmployeeById(employeeId);
      setEmployee(employeeData);
    } catch (error) {
      console.error("Error fetching employee:", error);
      setError("Error al cargar la información del empleado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employee?.id) return;

    const confirmDelete = window.confirm(
      `¿Está seguro que desea eliminar al empleado ${employee.nombre} ${employee.apellido}?`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteEmployee(employee.id);

      // Close modal and notify parent
      onClose();
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Error al eliminar el empleado");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchEmployee(); // Refresh employee data
    if (onEdit) {
      onEdit();
    }
  };

  const handleEditModal = () => {
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-AR");
    } catch {
      return dateString;
    }
  };

  const formatSalary = (salary?: string) => {
    if (!salary) return "No especificado";
    try {
      const numSalary = parseFloat(salary);
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(numSalary);
    } catch {
      return salary;
    }
  };

  const getPuestoColor = (puesto?: string) => {
    if (!puesto) return "badge-ghost";
    const colors: { [key: string]: string } = {
      Gerente: "badge-primary",
      Manager: "badge-primary",
      Supervisor: "badge-secondary",
      Empleado: "badge-accent",
      Vendedor: "badge-info",
      Recepcionista: "badge-success",
      default: "badge-ghost",
    };
    return colors[puesto] || colors["default"];
  };

  if (!isOpen) return null;

  return (
    <>
      <dialog className="modal modal-open">
        <div className="modal-box max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">Información del Empleado</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : employee ? (
            <div className="space-y-6">
              {/* Employee Header */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-20">
                          <User size={40} />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">
                          {employee.nombre} {employee.apellido}
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-base-content/60">
                            ID: {employee.id}
                          </p>
                          {employee.legajo && (
                            <p className="text-base-content/60">
                              Legajo: {employee.legajo}
                            </p>
                          )}
                          {employee.puesto && (
                            <span
                              className={`badge ${getPuestoColor(
                                employee.puesto
                              )} badge-lg`}
                            >
                              {employee.puesto}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Personal Information */}
                <div className="card bg-base-100 border border-base-300">
                  <div className="card-body p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <CreditCard className="text-primary" size={20} />
                      <h4 className="font-semibold">Identificación</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-base-content/60">DNI</p>
                        <p className="font-semibold">{employee.dni}</p>
                      </div>
                      {employee.tipoDocumento && (
                        <div>
                          <p className="text-sm text-base-content/60">
                            Tipo de Documento
                          </p>
                          <p className="font-semibold">
                            {employee.tipoDocumento}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card bg-base-100 border border-base-300">
                  <div className="card-body p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Mail className="text-primary" size={20} />
                      <h4 className="font-semibold">Contacto</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-info" />
                        <div>
                          <p className="text-sm text-base-content/60">Email</p>
                          <p className="font-semibold break-all">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-success" />
                        <div>
                          <p className="text-sm text-base-content/60">
                            Teléfono
                          </p>
                          <p className="font-semibold">{employee.telefono}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {employee.direccion && (
                  <div className="card bg-base-100 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <MapPin className="text-primary" size={20} />
                        <h4 className="font-semibold">Dirección</h4>
                      </div>
                      <p className="font-semibold">{employee.direccion}</p>
                    </div>
                  </div>
                )}

                {/* Birth Date */}
                <div className="card bg-base-100 border border-base-300">
                  <div className="card-body p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="text-primary" size={20} />
                      <h4 className="font-semibold">Fecha de Nacimiento</h4>
                    </div>
                    <p className="font-semibold text-lg">
                      {formatDate(employee.fechaNacimiento)}
                    </p>
                  </div>
                </div>

                {/* Start Date */}
                <div className="card bg-base-100 border border-base-300">
                  <div className="card-body p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="text-primary" size={20} />
                      <h4 className="font-semibold">Fecha de Inicio</h4>
                    </div>
                    <p className="font-semibold text-lg">
                      {formatDate(employee.fechaInicioActividad)}
                    </p>
                  </div>
                </div>

                {/* Salary */}
                {employee.salario && (
                  <div className="card bg-base-100 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <DollarSign className="text-primary" size={20} />
                        <h4 className="font-semibold">Salario</h4>
                      </div>
                      <p className="font-semibold text-lg text-success">
                        {formatSalary(employee.salario)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-base-300">
                <button
                  className="btn btn-primary"
                  onClick={handleEditModal}
                  disabled={isDeleting}
                >
                  <Edit size={16} />
                  Editar Empleado
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Eliminando..." : "Eliminar Empleado"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-base-content/60">
                No se pudo cargar la información del empleado
              </p>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>

      {/* Edit Employee Modal */}
      {showEditModal && employee && (
        <EditEmployee employee={employee} onSuccess={handleEditSuccess} />
      )}
    </>
  );
}
