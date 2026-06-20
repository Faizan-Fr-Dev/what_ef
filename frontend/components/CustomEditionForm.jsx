import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { createCustomEdition } from "../services/api";
const CustomEditionForm = ({ comics, onNewEdition }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [comicId, setComicId] = useState("");
  const [customName, setCustomName] = useState("");
  const [avatarRef, setAvatarRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comicId || !customName || !user) {
      addToast("Please fill out all required fields.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await createCustomEdition(user.user_id, parseInt(comicId), customName, avatarRef);
      addToast("Custom edition requested successfully!", "success");
      onNewEdition();
      setComicId("");
      setCustomName("");
      setAvatarRef("");
    } catch (error) {
      addToast("Failed to submit request.", "error");
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="bg-gray-800 p-6 rounded-lg border-2 border-red-600">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Have your own Custom Edition built!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comic" className="block text-sm font-medium text-gray-300">Choose a Comic</label>
          <select id="comic" value={comicId} onChange={(e) => setComicId(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 text-white">
            <option value="">Select a comic...</option>
            {comics.map((comic) => <option key={comic.comic_id} value={comic.comic_id}>{comic.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="customName" className="block text-sm font-medium text-gray-300">Your Custom Name</label>
          <input type="text" id="customName" value={customName} onChange={(e) => setCustomName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 text-white" />
        </div>
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-300">Avatar Reference URL (Optional)</label>
          <input type="text" id="avatar" value={avatarRef} onChange={(e) => setAvatarRef(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 text-white" />
        </div>
        <div>
          <button
    type="submit"
    disabled={submitting}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-500"
  >
            {submitting ? "Submitting..." : "Request Custom Edition"}
          </button>
        </div>
      </form>
    </div>;
};
export default CustomEditionForm;
