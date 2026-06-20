import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getBundles, createBundle, updateBundle, deleteBundle, getComics, updateComic } from "../../serviceshttps://what-ef-production.up.railway.app/api";
import ConfirmationModal from "../../components/ConfirmationModal";
const ManageBundles = () => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [bundles, setBundles] = useState([]);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [formData, setFormData] = useState({ bundle_name: "", description: "", discount_percent: 0 });
  const [selectedComics, setSelectedComics] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [bundlesData, comicsData] = await Promise.all([getBundles(), getComics()]);
      setBundles(bundlesData);
      setComics(comicsData);
    } catch {
      addToast("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenForm = (bundle) => {
    if (bundle) {
      setEditingBundle(bundle);
      setFormData(bundle);
      setSelectedComics(comics.filter((c) => c.bundle_id === bundle.bundle_id).map((c) => c.comic_id));
    } else {
      setEditingBundle(null);
      setFormData({ bundle_name: "", description: "", discount_percent: 0 });
      setSelectedComics([]);
    }
    setIsFormOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!formData.bundle_name?.trim() || !formData.description?.trim() || formData.discount_percent === void 0 || formData.discount_percent < 0 || formData.discount_percent > 100) {
      addToast("Please fill out all fields correctly. Discount must be between 0 and 100.", "error");
      return;
    }
    try {
      let bundleId;
      if (editingBundle) {
        await updateBundle(currentUser.user_id, editingBundle.bundle_id, formData);
        setBundles(bundles.map((b) => b.bundle_id === editingBundle.bundle_id ? { ...b, ...formData } : b));
        bundleId = editingBundle.bundle_id;
        addToast("Bundle updated", "success");
      } else {
        const newBundle = await createBundle(currentUser.user_id, formData);
        setBundles([...bundles, newBundle]);
        bundleId = newBundle.bundle_id;
        addToast("Bundle created", "success");
      }
      const comicsToUnassign = comics.filter((c) => c.bundle_id === bundleId && !selectedComics.includes(c.comic_id));
      const comicsToAssign = comics.filter((c) => selectedComics.includes(c.comic_id) && c.bundle_id !== bundleId);
      await Promise.all([
        ...comicsToUnassign.map((c) => updateComic(currentUser.user_id, c.comic_id, { ...c, bundle_id: null })),
        ...comicsToAssign.map((c) => updateComic(currentUser.user_id, c.comic_id, { ...c, bundle_id: bundleId }))
      ]);
      const updatedComics = await getComics();
      setComics(updatedComics);
      setIsFormOpen(false);
      setEditingBundle(null);
      setFormData({ bundle_name: "", description: "", discount_percent: 0 });
      setSelectedComics([]);
    } catch {
      addToast("Operation failed", "error");
    }
  };
  const confirmDelete = async () => {
    if (!currentUser || !bundleToDelete) return;
    try {
      await deleteBundle(currentUser.user_id, bundleToDelete.bundle_id);
      setBundles(bundles.filter((b) => b.bundle_id !== bundleToDelete.bundle_id));
      addToast("Bundle deleted", "success");
    } catch {
      addToast("Delete failed", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };
  const toggleComicSelection = (comicId) => {
    setSelectedComics(
      (prev) => prev.includes(comicId) ? prev.filter((id) => id !== comicId) : [...prev, comicId]
    );
  };
  if (loading) return <div>Loading...</div>;
  return <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bangers text-white">Manage Bundles</h1>
                <button onClick={() => handleOpenForm()} className="bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded shadow hover:bg-yellow-500">+ New Bundle</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bundles.map((bundle) => <div key={bundle.bundle_id} className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">{bundle.bundle_name}</h3>
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{bundle.discount_percent}% OFF</span>
                        </div>
                        <p className="text-gray-400 mb-4">{bundle.description}</p>

                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-gray-300 mb-2">Comics in Bundle:</h4>
                            <div className="flex flex-wrap gap-2">
                                {comics.filter((c) => c.bundle_id === bundle.bundle_id).map((c) => <span key={c.comic_id} className="bg-slate-700 text-xs px-2 py-1 rounded text-cyan-400 border border-slate-600">
                                        {c.title}
                                    </span>)}
                                {comics.filter((c) => c.bundle_id === bundle.bundle_id).length === 0 && <span className="text-gray-500 text-xs text-italic">No comics assigned</span>}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button onClick={() => handleOpenForm(bundle)} className="text-cyan-400 font-bold hover:underline">Edit</button>
                            <button onClick={() => {
    setBundleToDelete(bundle);
    setDeleteModalOpen(true);
  }} className="text-red-500 font-bold hover:underline">Delete</button>
                        </div>
                    </div>)}
            </div>

            {isFormOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-lg p-6 max-w-lg w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bangers text-white mb-4">{editingBundle ? "Edit Bundle" : "New Bundle"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input value={formData.bundle_name} onChange={(e) => setFormData({ ...formData, bundle_name: e.target.value })} placeholder="Bundle Name" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600" required />
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 h-24" required />
                            <input type="number" value={formData.discount_percent} onChange={(e) => setFormData({ ...formData, discount_percent: parseFloat(e.target.value) })} placeholder="Discount %" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600" required />

                            <div className="pt-4 border-t border-slate-700">
                                <label className="block text-gray-300 font-bold mb-2">Select Comics</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-900 p-2 rounded border border-slate-600">
                                    {comics.map((comic) => <label key={comic.comic_id} className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded cursor-pointer">
                                            <input
    type="checkbox"
    checked={selectedComics.includes(comic.comic_id)}
    onChange={() => toggleComicSelection(comic.comic_id)}
    className="rounded border-gray-600 text-yellow-400 focus:ring-yellow-400 bg-slate-800"
  />
                                            <span className={selectedComics.includes(comic.comic_id) ? "text-white" : "text-gray-400"}>
                                                {comic.title}
                                                {comic.bundle_id && comic.bundle_id !== editingBundle?.bundle_id && <span className="text-xs text-red-500 ml-1">(In another bundle)</span>}
                                            </span>
                                        </label>)}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-300">Cancel</button>
                                <button type="submit" className="bg-yellow-400 text-slate-900 px-4 py-2 rounded font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>}

            <ConfirmationModal isOpen={deleteModalOpen} title="Delete Bundle" message="Delete this bundle?" onConfirm={confirmDelete} onCancel={() => setDeleteModalOpen(false)} isDangerous={true} />
        </div>;
};
export default ManageBundles;
