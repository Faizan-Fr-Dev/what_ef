const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = false
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-slate-800 rounded-lg shadow-2xl p-6 max-w-md w-full border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
    onClick={onCancel}
    className="px-4 py-2 rounded-md text-gray-300 hover:bg-slate-700 transition-colors"
  >
                        {cancelText}
                    </button>
                    <button
    onClick={onConfirm}
    className={`px-4 py-2 rounded-md text-white font-bold transition-colors shadow-lg ${isDangerous ? "bg-red-600 hover:bg-red-700" : "bg-yellow-400 text-slate-900 hover:bg-yellow-500"}`}
  >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>;
};
export default ConfirmationModal;
