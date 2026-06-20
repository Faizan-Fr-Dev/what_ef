import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import GuestModal from "./GuestModal";
import { useNavigate } from "react-router-dom";
const ComicCard = ({ comic, onBuy }) => {
  const { user } = useAuth();
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleRedirect = () => {
    if (comic.gumroad_link) {
      window.open(comic.gumroad_link, "_blank");
    } else {
      navigate(`/gumroad?product=${encodeURIComponent(comic.title)}`);
    }
  };
  const handleBuyClick = () => {
    if (user) {
      onBuy(comic);
    } else {
      setIsGuestModalOpen(true);
    }
  };
  const handleGuestSuccess = () => {
    onBuy(comic);
  };
  return <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 hover:border-yellow-400 transition-colors duration-300 flex flex-col h-full">
            <GuestModal
    isOpen={isGuestModalOpen}
    onClose={() => setIsGuestModalOpen(false)}
    onSuccess={handleGuestSuccess}
    actionName="buy"
  />
            <div
    className="aspect-[3/4] overflow-hidden relative group cursor-pointer bg-slate-900"
    onClick={handleRedirect}
  >
                <img
    src={comic.cover_url}
    alt={comic.title}
    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
  />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-yellow-400 text-black font-bold py-1 px-3 rounded shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Details
                    </span>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3
    className="text-xl font-bold text-white mb-1 truncate cursor-pointer hover:text-yellow-400 transition-colors"
    title={comic.title}
    onClick={handleRedirect}
  >
                    {comic.title}
                </h3>
                <p className="text-gray-400 text-xs mb-3">{new Date(comic.release_date).getFullYear()} • {comic.sales_count} Sold</p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{comic.description}</p>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-400">${comic.price.toFixed(2)}</span>
                    <button
    onClick={handleBuyClick}
    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
  >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>;
};
export default ComicCard;
