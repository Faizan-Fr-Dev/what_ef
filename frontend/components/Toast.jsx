import { useEffect } from "react";
import { useToast } from "../context/ToastContext";
const Toast = () => {
  const { toasts, removeToast } = useToast();
  const toastColors = {
    success: "bg-green-500 border-green-700",
    error: "bg-red-500 border-red-700",
    info: "bg-blue-500 border-blue-700"
  };
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 5e3);
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);
  return <div className="fixed bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:right-5 md:translate-x-0 z-[300] flex flex-col items-center md:items-end gap-2 w-full max-w-[90vw] md:max-w-sm">
      {toasts.map((toast) => <div
    key={toast.id}
    className={`relative w-full max-w-sm rounded-md border-2 p-4 text-white shadow-lg transition-all duration-300 animate-fade-in-right ${toastColors[toast.type]}`}
  >
          <button
    onClick={() => removeToast(toast.id)}
    className="absolute top-1 right-1 text-white hover:text-gray-200"
  >
            &times;
          </button>
          <p>{toast.message}</p>
        </div>)}
    </div>;
};
export default Toast;
