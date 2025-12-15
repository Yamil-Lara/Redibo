'use client'

import { ReactNode } from 'react'
import { FiCheckCircle, FiX } from 'react-icons/fi'

interface ModalDeConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
  showSuccess?: boolean;
  variant?: 'confirmation' | 'success';
  successIcon?: ReactNode;
}

export default function ModalDeConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'ACEPTAR',
  cancelText = 'CANCELAR',
  isProcessing = false,
  variant = 'confirmation',
  showSuccess = false,
  successIcon = <FiCheckCircle className="text-5xl text-[#FFA500]" />
}: ModalDeConfirmacionProps) {
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8 relative">
        <div className="bg-[#EFE2D2] rounded-lg px-6 py-4">
          <h2 className="text-xl font-bold text-black text-center">{title}</h2>
        </div>
        
        {variant === 'success' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <FiX className="text-gray-500 text-lg" />
          </button>
        )}

        <div className="p-6 space-y-4 text-center">
          {showSuccess && (
            <div className="flex justify-center">
              {successIcon}
            </div>
          )}
          
          <p className="text-black">{message}</p>
          
          {variant === 'confirmation' ? (
            <div className="flex justify-between flex-row">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#11295B] hover:bg-[#0a1a33] text-white rounded-lg font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className="px-6 py-3 bg-[#FFA500] hover:bg-[#e69500] text-black rounded-lg font-medium disabled:bg-yellow-300"
              >
                {isProcessing ? 'Procesando...' : confirmText}
              </button>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-[#FFA500] hover:bg-[#e69500] text-black rounded-md font-medium"
              >
                {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}