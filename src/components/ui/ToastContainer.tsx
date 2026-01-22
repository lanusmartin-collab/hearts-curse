"use client";

import { useToast, ToastType } from "@/lib/context/ToastContext";
import { X, CheckCircle, AlertTriangle, Info, Scroll } from "lucide-react";
import { useEffect, useState } from "react";

const ToastItem = ({ toast }: { toast: any }) => {
    const { removeToast } = useToast();
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(toast.id), 300);
    };

    const icons = {
        info: <Info className="w-5 h-5 text-blue-400" />,
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        error: <AlertTriangle className="w-5 h-5 text-red-400" />,
        quest: <Scroll className="w-5 h-5 text-yellow-600" />
    };

    const colors = {
        info: "border-blue-900 bg-blue-950/90",
        success: "border-green-900 bg-green-950/90",
        warning: "border-yellow-900 bg-yellow-950/90",
        error: "border-red-900 bg-red-950/90",
        quest: "border-yellow-700 bg-black/90 shadow-[0_0_15px_rgba(202,138,4,0.3)]"
    };

    return (
        <div
            className={`
                relative w-80 p-4 rounded-lg border shadow-lg backdrop-blur-sm flex gap-3 items-start pointer-events-auto
                transition-all duration-300 transform
                ${colors[toast.type as ToastType] || colors.info}
                ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100 animate-slide-in-right"}
            `}
        >
            <div className="shrink-0 mt-0.5">{icons[toast.type as ToastType]}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-100">{toast.message}</p>
            </div>
            <button onClick={handleDismiss} className="shrink-0 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function ToastContainer() {
    const { toasts } = useToast();

    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
