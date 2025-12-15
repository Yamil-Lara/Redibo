'use client';
import React, { useState } from "react";
import ModalDeConfirmacion from "../modal/ModalDeConfirmacion";

interface RegistrarMantenimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MantenimientoData) => void;
  formData: MantenimientoData;
  setFormData: React.Dispatch<React.SetStateAction<MantenimientoData>>;
  onCancel?: () => void;
}

interface MantenimientoData {
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  costo: string;
  tipoMantenimiento: string;
  kilometraje: string;
}

const RegistrarMantenimientoModal: React.FC<RegistrarMantenimientoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  onCancel,
}) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [dateErrors, setDateErrors] = useState<{ fechaInicio?: string; fechaFin?: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation modal
  const [isProcessing, setIsProcessing] = useState(false); // State for processing

  const validateDate = (dateStr: string, fieldName: string) => {
    if (!dateStr) return true;

    const parts = dateStr.split('/');
    if (parts.length !== 3 || parts.some((part) => !part)) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Formato inválido (dd/mm/yyyy)' }));
      return false;
    }

    const [dd, mm, yyyy] = parts.map(Number);

    if (isNaN(dd)) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Día debe ser un número' }));
      return false;
    }
    if (dd < 1 || dd > 31) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Día inválido (01-31)' }));
      return false;
    }

    if (isNaN(mm)) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Mes debe ser un número' }));
      return false;
    }
    if (mm < 1 || mm > 12) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Mes inválido (01-12)' }));
      return false;
    }

    if (isNaN(yyyy)) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Año debe ser un número' }));
      return false;
    }
    if (yyyy < 2025 || yyyy > 2030) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Año inválido (2025-2030)' }));
      return false;
    }

    const date = new Date(yyyy, mm - 1, dd);
    if (date.getFullYear() !== yyyy || date.getMonth() + 1 !== mm || date.getDate() !== dd) {
      setDateErrors((prev) => ({ ...prev, [fieldName]: 'Fecha inválida' }));
      return false;
    }

    setDateErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    return true;
  };

  const validateFields = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    const parseDate = (fecha: string) => {
      const [d, m, y] = fecha.split('/').map(Number);
      return new Date(y, m - 1, d);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0); // ✅ Eliminar la hora para comparación precisa

    if (!formData.fechaInicio || !validateDate(formData.fechaInicio, 'fechaInicio')) {
      newErrors.fechaInicio = true;
      setDateErrors(prev => ({
        ...prev,
        fechaInicio: 'Este campo es obligatorio',
      }));
      isValid = false;
    } else {
      const fechaInicioDate = parseDate(formData.fechaInicio);
      if (fechaInicioDate < today) {
        newErrors.fechaInicio = true;
        setDateErrors(prev => ({
          ...prev,
          fechaInicio: 'La fecha de inicio no puede ser anterior a hoy',
        }));
        isValid = false;
      } else {
        setDateErrors(prev => ({ ...prev, fechaInicio: '' })); // Limpia el error si está todo ok
      }
    }

  if (formData.fechaFin && !validateDate(formData.fechaFin, 'fechaFin')) {
    newErrors.fechaFin = true;
    isValid = false;
  }

  // ✅ Validar que fechaFin no sea anterior a fechaInicio
  if (
    formData.fechaInicio &&
    formData.fechaFin &&
    validateDate(formData.fechaInicio, 'fechaInicio') &&
    validateDate(formData.fechaFin, 'fechaFin')
  ) {
    const fechaInicioDate = parseDate(formData.fechaInicio);
    const fechaFinDate = parseDate(formData.fechaFin);

    if (fechaFinDate < fechaInicioDate) {
      newErrors.fechaFin = true;
      setDateErrors(prev => ({
        ...prev,
        fechaFin: 'La fecha de fin no puede ser anterior a la de inicio',
      }));
      isValid = false;
    }
  }

  if (!formData.descripcion || formData.descripcion.length < 20) {
    newErrors.descripcion = true;
    isValid = false;
  }

  if (!formData.kilometraje || isNaN(Number(formData.kilometraje))) {
    newErrors.kilometraje = true;
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};



  const handleSubmit = () => {
    if (validateFields()) {
      setShowConfirmation(true); // Show confirmation modal instead of submitting directly
    }
  };

  const handleConfirmSubmit = () => {
    setIsProcessing(true);
    setShowConfirmation(false);
    onSubmit(formData); // Call the onSubmit function passed from the parent
    setIsProcessing(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleDateChange = (field: 'fechaInicio' | 'fechaFin', value: string) => {
    let cleanedValue = value.replace(/[^0-9/]/g, '');

    if (cleanedValue.length > 10) {
      cleanedValue = cleanedValue.slice(0, 10);
    }

    let formattedValue = cleanedValue;
    if (cleanedValue.length > 2 && cleanedValue.indexOf('/') === -1) {
      formattedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2)}`;
    }
    if (formattedValue.length > 5 && formattedValue.split('/').length < 3) {
      formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5)}`;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    setErrors((prev) => ({ ...prev, [field]: false }));
    validateDate(formattedValue, field);
  };

  const handleNumberChange = (field: 'costo' | 'kilometraje', value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');

    setFormData((prev) => ({
      ...prev,
      [field]: cleanedValue,
    }));

    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (field: keyof MantenimientoData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const getInputClass = (fieldName: string) => {
    const baseClass =
      'w-full p-2.5 border rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)]';
    return errors[fieldName]
      ? `${baseClass} border-red-500 bg-red-50`
      : `${baseClass} border-gray-300`;
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-[var(--hueso)] w-full p-4">
          <h2 className="text-2xl font-semibold text-center text-[var(--azul-oscuro)]">
            Registrar Mantenimiento
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Fecha de inicio (dd/mm/yyyy) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fechaInicio}
              onChange={(e) => handleDateChange('fechaInicio', e.target.value)}
              placeholder="dd/mm/yyyy"
              className={getInputClass('fechaInicio')}
              required
            />
            {errors.fechaInicio && (
              <p className="mt-1 text-sm text-red-600">
                {dateErrors.fechaInicio || "*La fecha de inicio no puede ser anterior a hoy"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Fecha de Fin (dd/mm/yyyy)
            </label>
            <input
              type="text"
              value={formData.fechaFin}
              onChange={(e) => handleDateChange('fechaFin', e.target.value)}
              placeholder="dd/mm/yyyy"
              className={getInputClass('fechaFin')}
            />
            {errors.fechaFin && (
              <p className="mt-1 text-sm text-red-600">{dateErrors.fechaFin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => {
                const textOnlyValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                if (textOnlyValue.length <= 150) {
                  handleChange('descripcion', textOnlyValue);
                }
              }}
              className={getInputClass('descripcion')}
              rows={3}
              maxLength={150}
              required
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">
                {formData.descripcion.length < 20
                  ? 'La descripción debe tener al menos 20 caracteres'
                  : 'Este campo es obligatorio'}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.descripcion.length}/150
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Costo (Opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.costo}
                onChange={(e) => handleNumberChange('costo', e.target.value)}
                className={`${getInputClass('costo')} pr-10`}
                inputMode="numeric"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                Bs
              </span>
            </div>
            {errors.costo && (
              <p className="mt-1 text-sm text-red-600">Solo se permiten números</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Tipo de Mantenimiento
            </label>
            <div className="relative">
              <select
                value={formData.tipoMantenimiento}
                onChange={(e) => handleChange('tipoMantenimiento', e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)] appearance-none bg-white text-gray-700"
              >
                <option value="PREVENTIVO">Preventivo</option>
                <option value="CORRECTIVO">Correctivo</option>
                <option value="REVISION">Revisión</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Kilometraje <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.kilometraje}
                onChange={(e) => handleNumberChange('kilometraje', e.target.value)}
                className={`${getInputClass('kilometraje')} pr-10`}
                inputMode="numeric"
                required
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                km
              </span>
            </div>
            {errors.kilometraje && (
              <p className="mt-1 text-sm text-red-600">
                {isNaN(Number(formData.kilometraje))
                  ? 'Solo se permiten números'
                  : 'Este campo es obligatorio'}
              </p>
            )}
          </div>

          <div className="flex justify-between mt-6 space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-[var(--azul-oscuro)] hover:bg-[#0a1f42] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-[var(--naranja)] hover:bg-[#e69500] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ModalDeConfirmacion
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirmar Mantenimiento"
        message="¿Está seguro que desea registrar el mantenimiento? Una vez registrado, los datos no podrán modificarse."
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />
    </div>
  ) : null;
};

export default RegistrarMantenimientoModal;