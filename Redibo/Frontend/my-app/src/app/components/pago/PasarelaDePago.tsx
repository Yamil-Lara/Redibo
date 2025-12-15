"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FiCheckCircle, FiX, FiAlertCircle } from "react-icons/fi";
import ConfirmationModal from "@components/modal/ModalDeConfirmacion";
import ComprobanteDePago from "./ComprobanteDePago";

interface RentaDetails {
  vehiculo: string;
  fechaInicio: string;
  fechaFin: string;
  garantia: number;
  precio: number;
  dias: number;
  total: number;
  moneda: string;
  propietario?: string;
}

// Añadir después de la interfaz RentaDetails
interface PaymentDetails {
  monto: number;
  moneda: string;
  fechaPago: string;
  metodoPago: string;
  ultimosDigitos: string;
  cliente: string;
  fechaLiberacion: string;
  isGarantia?: boolean;
}

interface PagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentaDetails: RentaDetails;
  onPaymentComplete: () => void;
}

export default function PasarelaDePago({
  isOpen,
  onClose,
  rentaDetails,
  onPaymentComplete,
}: PagoModalProps) {
  const [showRentaConfirmModal, setShowRentaConfirmModal] = useState(false);
  const [showGarantiaConfirmModal, setShowGarantiaConfirmModal] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [isFormValid, setIsFormValid] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  //datos del comprobante
  const [showComprobanteRenta, setShowComprobanteRenta] = useState(false);
  const [showComprobanteGarantia, setShowComprobanteGarantia] = useState(false);
  const [pagoRentaDetails, setPagoRentaDetails] = useState<PaymentDetails>({
    monto: 0,
    moneda: "",
    fechaPago: "",
    metodoPago: "",
    ultimosDigitos: "",
    cliente: "",
    fechaLiberacion: "",
    isGarantia: false,
  });
  const [pagoGarantiaDetails, setPagoGarantiaDetails] =
    useState<PaymentDetails>({
      monto: 0,
      moneda: "",
      fechaPago: "",
      metodoPago: "",
      ultimosDigitos: "",
      cliente: "",
      fechaLiberacion: "",
      isGarantia: true,
    });

  // Campos del formulario
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Estados para validación de campos individuales
  const [isCardNameValid, setIsCardNameValid] = useState(false);
  const [isCardNumberValid, setIsCardNumberValid] = useState(false);
  const [isExpDateValid, setIsExpDateValid] = useState(false);
  const [isCvcValid, setIsCvcValid] = useState(false);

  const prepararDetallesPago = (tipo: "renta" | "garantia") => {
    // Obtener fecha actual formateada para ambos comprobantes
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Calcular fecha de liberación para garantía
    const fechaFin = new Date(rentaDetails.fechaFin);
    const fechaLiberacion = fechaFin.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Obtener últimos dígitos para tarjeta
    const ultimosDigitos =
      paymentMethod === "tarjeta"
        ? cardNumber.replace(/\s/g, "").slice(-4)
        : "0000"; // Para pago con QR

    // Determinar método de pago para ambos comprobantes
    const metodoPago = paymentMethod === "tarjeta" ? "Tarjeta" : "QR";

    // Crear el objeto de detalles según el tipo
    return {
      monto:
        tipo === "renta"
          ? rentaDetails.precio * rentaDetails.dias
          : rentaDetails.garantia,
      moneda: rentaDetails.moneda,
      fechaPago: fechaFormateada,
      metodoPago,
      ultimosDigitos,
      cliente: cardName || "Cliente",
      fechaLiberacion,
      isGarantia: tipo === "garantia",
    };
  };

  // Validación más estricta para la fecha de expiración
  const validateExpDate = (expDate: string) => {
    // Verificar formato MM/AA
    if (!/^\d{2}\/\d{2}$/.test(expDate)) return false;

    const [month, year] = expDate.split("/").map((part) => parseInt(part, 10));

    // Verificar que el mes sea válido (1-12)
    if (month < 1 || month > 12) return false;

    // Obtener fecha actual
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Últimos dos dígitos del año
    const currentMonth = currentDate.getMonth() + 1; // Enero es 0

    // Verificar que la fecha no sea anterior a la actual
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    // Verificar que la fecha no sea demasiado futura (máximo 10 años)
    const maxYear = currentYear + 10;
    if (year > maxYear) {
      return false;
    }

    return true;
  };

  // Validar formulario cada vez que cambien los campos
  useEffect(() => {
    // Validación individual de cada campo
    const nameValid =
      cardName.trim() !== "" &&
      cardName.trim().length >= 5 &&
      cardName.trim().length <= 30;

    const numberValid = cardNumber.replace(/\s/g, "").length === 16;

    const expValid = validateExpDate(expDate);

    const cvcValid = cvc.length === 3;

    setIsCardNameValid(nameValid);
    setIsCardNumberValid(numberValid);
    setIsExpDateValid(expValid);
    setIsCvcValid(cvcValid);

    // Validación general del formulario
    setIsFormValid(nameValid && numberValid && expValid && cvcValid);
  }, [cardName, cardNumber, expDate, cvc]);

  // Función para resetear el formulario
  const resetForm = () => {
    setCardName("");
    setCardNumber("");
    setExpDate("");
    setCvc("");
    setIsFormValid(false);
    setShowValidationErrors(false);
  };

  // Handler para cancelar
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Handlers para cada campo
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
      .toUpperCase();
    setCardName(value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(value);
  };

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpDate(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) return;
    setCvc(value);
  };

  const handleProcesarPago = () => {
    // Si el método de pago es QR, procedemos directamente
    if (paymentMethod === "qr") {
      onClose();
      setShowRentaConfirmModal(true);
      return;
    }

    // Si es pago con tarjeta, validamos el formulario
    setShowValidationErrors(true);

    if (isFormValid) {
      onClose();
      setShowRentaConfirmModal(true);
    }
  };

  const handleConfirmarPagoRenta = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Transición al siguiente modal
    setShowRentaConfirmModal(false);
    setShowGarantiaConfirmModal(true);
    setIsProcessing(false);
  };

  const handleComprobanteRentaAccepted = () => {
    setShowComprobanteRenta(false);
    // Mostrar comprobante de garantía después del de renta
    setShowComprobanteGarantia(true);
  };

  // Añadir esta función para finalizar el flujo completo
  const handleComprobanteGarantiaAccepted = () => {
    setShowComprobanteGarantia(false);
    resetForm();
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  const handleConfirmarPagoGarantia = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Finalizar el proceso completo
    setShowGarantiaConfirmModal(false);
    setShowSuccessModal(true);
      // Preparar detalles para el comprobante de renta
  setPagoRentaDetails(prepararDetallesPago("renta"));
  // Preparar detalles para el comprobante de garantía
  setPagoGarantiaDetails(prepararDetallesPago("garantia"));


    setIsProcessing(false);
  };

  const handleFinalizarPago = () => {
    setShowSuccessModal(false);
    // Mostrar primero el comprobante de renta
    setShowComprobanteRenta(true);
  };

  if (
    !isOpen &&
    !showRentaConfirmModal &&
    !showGarantiaConfirmModal &&
    !showSuccessModal &&
    !showComprobanteRenta &&
    !showComprobanteGarantia
  ) {
    return null;
  }

  // Función para generar la clase de input según validación
  const getInputClass = (isValid: boolean) => {
    if (!showValidationErrors)
      return "w-full p-2 border border-gray-300 rounded-lg";
    return `w-full p-2 border ${
      isValid ? "border-gray-300" : "border-red-500 bg-red-50"
    } rounded-lg ${!isValid ? "focus:ring-red-500 focus:border-red-500" : ""}`;
  };

  // Calcular el total general (renta + garantía)
  const totalGeneral =
    rentaDetails.precio * rentaDetails.dias + rentaDetails.garantia;

  return (
    <>
      {/* Modal de Pago */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full mt-15">
            <div className="bg-gray-100 rounded-lg px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Completar pago
              </h2>
              <button
                onClick={handleCancel}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Cerrar modal"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                Estás realizando el pago completo (renta y garantía).
              </p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">Resumen del pago</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Vehículo:</span>
                    <span className="font-medium">{rentaDetails.vehiculo}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Fechas:</span>
                    <span className="font-medium">
                      {rentaDetails.fechaInicio} - {rentaDetails.fechaFin}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Duración:</span>
                    <span className="font-medium">
                      {rentaDetails.dias} día(s)
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Coste de renta:</span>
                    <span>{rentaDetails.precio * rentaDetails.dias} Bs</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Coste de garantía:</span>
                    <span className="font-medium">
                      {rentaDetails.garantia} Bs
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Total a pagar:</span>
                    <span className="font-bold">
                      {totalGeneral} {rentaDetails.moneda}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    paymentMethod === "tarjeta"
                      ? "bg-[#FFA500] border-[#FFA500] text-white font-medium"
                      : "bg-gray-100 border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                  onClick={() => setPaymentMethod("tarjeta")}
                >
                  Pago con tarjeta
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    paymentMethod === "qr"
                      ? "bg-[#FFA500] border-[#FFA500] text-white font-medium"
                      : "bg-gray-100 border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                  onClick={() => setPaymentMethod("qr")}
                >
                  Pago con QR
                </button>
              </div>

              {paymentMethod === "tarjeta" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del titular de la tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="NOMBRE COMPLETO"
                      className={getInputClass(isCardNameValid)}
                      value={cardName}
                      onChange={handleCardNameChange}
                      maxLength={30}
                    />
                    {showValidationErrors && !isCardNameValid && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" />
                        Ingrese un nombre válido (mínimo 5 caracteres)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Información de la tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="1234 1234 1234 1234"
                      className={getInputClass(isCardNumberValid)}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                    {showValidationErrors && !isCardNumberValid && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" />
                        Ingrese un número de tarjeta válido (16 dígitos)
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de expiración
                      </label>
                      <input
                        type="text"
                        placeholder="MM / AA"
                        className={getInputClass(isExpDateValid)}
                        value={expDate}
                        onChange={handleExpDateChange}
                      />
                      {showValidationErrors && !isExpDateValid && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" />
                          Fecha inválida o expirada (MM/AA)
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="CVC"
                        className={getInputClass(isCvcValid)}
                        value={cvc}
                        onChange={handleCvcChange}
                        maxLength={3}
                      />
                      {showValidationErrors && !isCvcValid && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" />3 dígitos
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "qr" && (
                <div className="flex justify-center py-8">
                  <Image
                    src="/qr.png"
                    alt="Código QR"
                    width={200}
                    height={200}
                  />
                </div>
              )}

              {showValidationErrors &&
                !isFormValid &&
                paymentMethod === "tarjeta" && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm">
                    <p className="flex items-center">
                      <FiAlertCircle className="mr-2 text-lg" />
                      Por favor, complete todos los campos requeridos
                      correctamente.
                    </p>
                  </div>
                )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProcesarPago}
                  disabled={
                    paymentMethod === "tarjeta" &&
                    !isFormValid &&
                    showValidationErrors
                  }
                  className={`flex-1 px-4 py-2 ${
                    paymentMethod === "tarjeta" &&
                    !isFormValid &&
                    showValidationErrors
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#FFA500] hover:bg-[#e69500]"
                  } text-white rounded-md font-medium`}
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Pago de la Renta */}
      <ConfirmationModal
        isOpen={showRentaConfirmModal}
        onClose={() => setShowRentaConfirmModal(false)}
        onConfirm={handleConfirmarPagoRenta}
        title="¿Está seguro que desea pagar la renta?"
        message={`Una vez confirmada, esta acción no se puede deshacer. ¿Desea confirmar el pago de ${
          rentaDetails.precio * rentaDetails.dias
        } ${rentaDetails.moneda} por la renta del vehículo?`}
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />

      {/* Modal de Confirmación de Pago de la Garantia */}
      <ConfirmationModal
        isOpen={showGarantiaConfirmModal}
        onClose={() => setShowGarantiaConfirmModal(false)}
        onConfirm={handleConfirmarPagoGarantia}
        title="¿Está seguro que desea depositar la garantía?"
        message={`Una vez confirmada, esta acción no se puede deshacer. ¿Desea confirmar el depósito de ${rentaDetails.garantia} ${rentaDetails.moneda} de la garantía del vehículo? Este depósito le será devuelto a decisión del arrendador.`}
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />

      {/* Modal de Éxito */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={handleFinalizarPago}
        onConfirm={handleFinalizarPago}
        title="Pago realizado con éxito"
        message="Su pago de renta y garantía ha sido procesado correctamente. El arrendador será notificado."
        confirmText="Ver Comprobante de pago"
        variant="success"
        showSuccess={true}
        successIcon={<FiCheckCircle className="text-5xl text-[#FFA500]" />}
      />

      {/* Comprobante de Renta */}
      <ComprobanteDePago
        isOpen={showComprobanteRenta}
        onClose={() => setShowComprobanteRenta(false)}
        paymentDetails={pagoRentaDetails}
        onAccept={handleComprobanteRentaAccepted}
      />

      {/* Comprobante de Garantía */}
      <ComprobanteDePago
        isOpen={showComprobanteGarantia}
        onClose={() => setShowComprobanteGarantia(false)}
        paymentDetails={pagoGarantiaDetails}
        onAccept={handleComprobanteGarantiaAccepted}
      />
    </>
  );
}
