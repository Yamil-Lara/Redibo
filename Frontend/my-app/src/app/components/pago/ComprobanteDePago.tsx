'use client'

import { useState, useRef } from 'react'
import { FiDownload, FiX } from 'react-icons/fi'

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

interface ComprobanteDePagoProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails: PaymentDetails;
  onAccept: () => void;
}

export default function ComprobanteDePago({
  isOpen,
  onClose,
  paymentDetails,
  onAccept
}: ComprobanteDePagoProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const comprobateRef = useRef<HTMLDivElement>(null)

  if (!isOpen) {
    return null
  }

  const handleDownload = () => {
    setIsDownloading(true)
    
    try {
      if (comprobateRef.current) {
        // Crear una copia del contenido para manipularlo
        const printContent = comprobateRef.current.cloneNode(true) as HTMLElement
        
        // Aplicar estilos específicos para la impresión
        printContent.style.width = "100%"
        printContent.style.maxWidth = "500px"
        printContent.style.margin = "0 auto"
        printContent.style.padding = "20px"
        printContent.style.borderRadius = "0"
        printContent.style.boxShadow = "none"
        
        // Crear un nuevo documento HTML para imprimir
        const printWindow = window.open('', '_blank')
        
        if (printWindow) {
          // Establecer el contenido del documento y estilos básicos
          printWindow.document.open()
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Comprobante de Pago - ${paymentDetails.cliente}</title>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                  .container { max-width: 500px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 15px; }
                  h2 { color: #002D62; margin-bottom: 20px; }
                  .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eaeaea; }
                  .label { color: #666; }
                  .value { font-weight: 500; }
                  .garantia-note { background-color: #FFF8E1; border: 1px solid #FFE082; padding: 15px; border-radius: 6px; margin-top: 20px; }
                  .garantia-badge { background-color: #FFF8E1; color: #FFA000; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; display: inline-block; }
                  @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>Comprobante de Pago</h2>
                    ${paymentDetails.isGarantia ? '<span class="garantia-badge">Garantía</span>' : ''}
                  </div>
                  
                  <div class="info-row">
                    <span class="label">Monto</span>
                    <span class="value">${paymentDetails.monto.toFixed(2)} ${paymentDetails.moneda}</span>
                  </div>
                  
                  <div class="info-row">
                    <span class="label">Fecha de Pago</span>
                    <span class="value">${paymentDetails.fechaPago}</span>
                  </div>
                  
                  <div class="info-row">
                    <span class="label">Método de Pago</span>
                    <span class="value">
                      ${paymentDetails.metodoPago === 'QR' 
                        ? paymentDetails.metodoPago 
                        : `${paymentDetails.metodoPago} •••• ${paymentDetails.ultimosDigitos}`
                      }
                    </span>
                  </div>
                  
                  <div class="info-row">
                    <span class="label">Cliente</span>
                    <span class="value">${paymentDetails.cliente}</span>
                  </div>
                  
                  <div class="info-row">
                    <span class="label">Fecha de Liberación</span>
                    <span class="value">${paymentDetails.fechaLiberacion}</span>
                  </div>
                  
                  ${paymentDetails.isGarantia ? `
                    <div class="garantia-note">
                      <p style="margin: 0; font-size: 14px;">La garantía será liberada automáticamente al finalizar el periodo de renta, siempre y cuando no existan cargos adicionales.</p>
                    </div>
                  ` : ''}
                </div>
              </body>
            </html>
          `)
          printWindow.document.close()
          
          // Dar tiempo para que se carguen los estilos
          setTimeout(() => {
            // Imprimir o guardar como PDF (según el navegador)
            printWindow.print()
            
            // Cerrar ventana después de imprimir (algunos navegadores)
            // La mayoría de navegadores mantendrán la ventana abierta después de guardar PDF
            // printWindow.close()
            
            setIsDownloading(false)
          }, 500)
        } else {
          throw new Error('No se pudo abrir la ventana de impresión')
        }
      }
    } catch (error) {
      console.error('Error al generar el comprobante:', error)
      alert('Hubo un error al generar el comprobante de pago')
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Contenido que se capturará para el PDF */}
        <div ref={comprobateRef} className="bg-white rounded-lg p-2">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#002D62]">
              Comprobante de Pago
            </h2>
            <div className="flex items-center gap-2">
              {paymentDetails.isGarantia && (
                <span className="bg-[#FFF8E1] text-[#FFA000] px-3 py-1 rounded-full text-sm font-medium">
                  Garantía
                </span>
              )}
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Monto</span>
                <span className="font-semibold text-black">{paymentDetails.monto.toFixed(2)} {paymentDetails.moneda}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Fecha de Pago</span>
                <span className="font-medium">{paymentDetails.fechaPago}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Método de Pago</span>
              <span className="font-medium">
                {paymentDetails.metodoPago === 'QR' 
                  ? paymentDetails.metodoPago 
                  : `${paymentDetails.metodoPago} •••• ${paymentDetails.ultimosDigitos}`
                }
              </span>
            </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Cliente</span>
                <span className="font-medium">{paymentDetails.cliente}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Fecha de Liberación</span>
                <span className="font-medium">{paymentDetails.fechaLiberacion}</span>
              </div>
            </div>
            
            {paymentDetails.isGarantia && (
              <div className="bg-[#FFF8E1] p-4 rounded-lg border border-[#FFE082] mt-4">
                <p className="text-sm text-gray-700">
                  La garantía será liberada automáticamente al finalizar el periodo de renta, siempre y cuando no existan cargos adicionales.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Botones de acción que no se incluirán en el PDF */}
        <div className="px-6 pb-6">
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`flex-1 px-4 py-3 bg-[#F7F7F7] hover:bg-gray-200 text-gray-800 rounded-md font-medium flex items-center justify-center gap-2 ${
                isDownloading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <FiDownload className="text-lg" />
              {isDownloading ? 'Descargando...' : 'Descargar'}
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-3 bg-[#FFA500] hover:bg-[#e69500] text-white rounded-md font-medium"
            >
              Aceptar
            </button>
          </div>
        </div>
        
        {/* Botón para cerrar el modal */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Cerrar modal"
        >
          <FiX className="text-gray-500 text-lg" />
        </button>
      </div>
    </div>
  )
}