import { useState, useEffect } from "react";
import { getBundles } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import BundleCard from "../components/BundleCard";
import GuestModal from "../components/GuestModal";
const SeriesBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [pendingBundle, setPendingBundle] = useState(null);
  useEffect(() => {
    fetchBundles();
  }, []);
  const fetchBundles = async () => {
    setLoading(true);
    try {
      const data = await getBundles();
      setBundles(data);
    } catch (error) {
      console.error("Failed to fetch bundles", error);
    } finally {
      setLoading(false);
    }
  };
  const handleBuy = (bundle) => {
    if (user) {
      processPurchase(bundle);
    } else {
      setPendingBundle(bundle);
      setIsGuestModalOpen(true);
    }
  };
  const processPurchase = async (bundle) => {
    navigate(`/gumroad?product=${encodeURIComponent(bundle.bundle_name)}`);
  };
  const handleGuestSuccess = () => {
    if (pendingBundle) {
      navigate(`/gumroad?product=${encodeURIComponent(pendingBundle.bundle_name)}`);
      setPendingBundle(null);
    }
    setIsGuestModalOpen(false);
  };
  if (loading) {
    return <div className="text-center text-yellow-400 text-2xl">Loading Bundles...</div>;
  }
  return <div className="container mx-auto">
      <GuestModal
    isOpen={isGuestModalOpen}
    onClose={() => setIsGuestModalOpen(false)}
    onSuccess={handleGuestSuccess}
    actionName="buy bundle"
  />
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Series Bundles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {bundles.map((bundle) => <BundleCard key={bundle.bundle_id} bundle={bundle} onBuy={handleBuy} />)}
      </div>
      {bundles.length === 0 && <p className="text-center text-gray-400 mt-8">No bundles available right now.</p>}
    </div>;
};
export default SeriesBundles;
