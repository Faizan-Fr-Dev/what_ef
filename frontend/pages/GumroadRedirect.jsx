import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const GumroadRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get("product") || "this awesome product";
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const targetUrl = queryParams.get("url") || "https://gumroad.com";
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  return <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Gumroad Product Details Page</h1>
                <p className="text-gray-300 text-lg mb-8">
                    You are being redirected to Gumroad to complete your purchase of <br />
                    <span className="text-yellow-400 font-bold">"{productName}"</span>
                </p>

                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-500 border-t-transparent" />
                        <span>Redirecting in {countdown} seconds...</span>
                    </div>

                    <button
    onClick={() => navigate("/comics")}
    className="text-gray-400 hover:text-white transition-colors text-sm underline underline-offset-4"
  >
                        Cancel and go back
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-700">
                    <p className="text-slate-500 text-sm italic">
                        Note: In a production environment, this page would automatically transition to the secure Gumroad checkout flow.
                    </p>
                </div>
            </div>
        </div>;
};
export default GumroadRedirect;
