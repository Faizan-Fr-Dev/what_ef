import { DeliveryStatus } from "../types";
const statusStyles = {
  [DeliveryStatus.PENDING]: { text: "text-yellow-300", bg: "bg-yellow-800" },
  [DeliveryStatus.IN_PROGRESS]: { text: "text-blue-300", bg: "bg-blue-800" },
  [DeliveryStatus.DELIVERED]: { text: "text-green-300", bg: "bg-green-800" }
};
const CustomEditionCard = ({ edition }) => {
  const status = statusStyles[edition.delivery_status];
  return <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center space-x-4">
      {edition.avatar_reference && <img src={edition.avatar_reference} alt={edition.custom_name} className="w-16 h-16 rounded-full object-cover" />}
      <div className="flex-1">
        <p className="font-bold text-lg text-white">{edition.custom_name}</p>
        <p className="text-sm text-gray-400">Based on: {edition.comic?.title}</p>
        <p className="text-xs text-gray-500">Requested: {new Date(edition.request_date).toLocaleDateString()}</p>
      </div>
      <div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${status.bg} ${status.text}`}>
          {edition.delivery_status.replace("_", " ").toUpperCase()}
        </span>
      </div>
    </div>;
};
export default CustomEditionCard;
