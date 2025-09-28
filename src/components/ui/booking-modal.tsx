"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarUrl: string;
  title?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  calendarUrl,
  title = "Book a Meeting"
}: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl mx-4 h-[90vh] max-h-[800px] bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar iframe */}
        <div className="h-full pb-16">
          <iframe
            src={calendarUrl}
            className="w-full h-full border-0"
            title="Book an appointment"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

// Hook for easy modal management
export function useBookingModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal
  };
}