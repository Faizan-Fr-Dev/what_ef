const BundleCard = ({ bundle, onBuy }) => {
  return <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden flex flex-col hover:border-yellow-400 transition-all duration-300">
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">{bundle.bundle_name}</h3>
        <p className="text-gray-300 mb-4">{bundle.description}</p>

        {(() => {
    const comics = bundle.comics || [];
    const totalValue = comics.reduce((acc, c) => acc + (Number(c.price) || 0), 0);
    const discountPercent = Number(bundle.discount_percent) || 0;
    const discountPrice = totalValue * (1 - discountPercent / 100);
    const displayPrice = isNaN(discountPrice) ? 0 : discountPrice;
    const displayTotal = isNaN(totalValue) ? 0 : totalValue;
    return <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-3xl font-bold text-white">${displayPrice.toFixed(2)}</span>
              {displayTotal > displayPrice && <span className="text-gray-500 line-through text-sm">
                  ${displayTotal.toFixed(2)}
                </span>}
            </div>;
  })()}

        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide">Included Comics:</h4>
          <ul className="list-disc list-inside text-gray-400 text-sm">
            {bundle.comics?.map((comic) => <li key={comic.comic_id} className="truncate">{comic.title}</li>)}
            {!bundle.comics?.length && <li>No comics included yet.</li>}
          </ul>
        </div>
      </div>
      <div className="bg-slate-900 p-4 border-t border-slate-700">
        <button
    onClick={() => onBuy(bundle)}
    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors text-lg"
  >
          Buy Bundle
        </button>
      </div>
    </div>;
};
export default BundleCard;
