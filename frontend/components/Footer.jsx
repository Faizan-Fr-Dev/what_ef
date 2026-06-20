import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "../serviceshttps://what-ef-production.up.railway.app/api";
import { useToast } from "../context/ToastContext";
const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const handleSubscribe = async () => {
    if (!email) {
      addToast("Please enter your email address.", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast("Please enter a valid email address.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await subscribeToNewsletter(email);
      addToast(response.message || "Successfully subscribed!", "success");
      setEmail("");
    } catch (error) {
      addToast(error.message || "Failed to subscribe.", "error");
    } finally {
      setLoading(false);
    }
  };
  return <footer className="bg-slate-950 text-gray-300 border-t border-slate-800 pt-12 pb-6 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {
    /* Brand Section */
  }
                    <div className="col-span-1">
                        <Link to="/" className="text-3xl text-yellow-400 font-bangers hover:text-yellow-300 transition-colors">
                            What Ef?
                        </Link>
                        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                            Dive into the multiverse of limitless storytelling. Discover unique customized comics, exclusive bundles, and join the community of creators.
                        </p>
                    </div>

                    {
    /* Quick Links */
  }
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-yellow-500/30 pb-2 inline-block">Explore</h3>
                        <ul className="space-y-2">
                            <li><Link to="/comics" className="hover:text-yellow-400 transition-colors text-sm">Comics Catalogue</Link></li>
                            <li><Link to="/bundles" className="hover:text-yellow-400 transition-colors text-sm">Series Bundles</Link></li>
                            <li><Link to="/polls" className="hover:text-yellow-400 transition-colors text-sm">Fan Polls</Link></li>
                            <li><Link to="/custom" className="hover:text-yellow-400 transition-colors text-sm">Custom Editions</Link></li>
                        </ul>
                    </div>

                    {
    /* Newsletter / Social */
  }
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-yellow-500/30 pb-2 inline-block">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-4">Get the latest comic drops and poll alerts.</p>
                        <div className="flex flex-col space-y-2">
                            <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:border-yellow-400 text-sm"
    disabled={loading}
  />
                            <button
    onClick={handleSubscribe}
    disabled={loading}
    className={`bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded transition-colors text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
  >
                                {loading ? "Subscribing..." : "Subscribe"}
                            </button>
                        </div>
                    </div>
                </div>


                <div className="border-t border-slate-800 pt-6 flex justify-center text-xs text-gray-500 hover:text-gray-400 transition-colors">
                    <p>&copy; {(/* @__PURE__ */ new Date()).getFullYear()} What Ef? Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>;
};
export default Footer;
