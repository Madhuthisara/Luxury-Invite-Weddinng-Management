// components/Toast.tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    isOpen: boolean;
    message: string;
    type?: 'success' | 'error';
    onClose: () => void;
}

export const Toast = ({ isOpen, message, type = 'success', onClose }: ToastProps) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 bg-white border border-stone-200/80 rounded-2xl shadow-xl shadow-stone-900/5 min-w-[280px] sm:min-w-[320px] max-w-md"
                >
                    {type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                    )}

                    <span className="text-xs font-medium text-stone-700 tracking-wide flex-1">
                        {message}
                    </span>

                    <button
                        onClick={onClose}
                        className="p-1 text-stone-400 hover:text-stone-600 transition-colors rounded-lg hover:bg-stone-50 cursor-pointer"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};