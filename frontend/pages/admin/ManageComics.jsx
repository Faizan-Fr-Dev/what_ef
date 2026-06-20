import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getComics, createComic, updateComic, deleteComic } from "../../services/api";
import ConfirmationModal from "../../components/ConfirmationModal";
const ManageComics = () => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComic, setEditingComic] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [comicToDelete, setComicToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    cover_url: "",
    release_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    gumroad_link: ""
  });
  useEffect(() => {
    fetchComics();
  }, []);
  const fetchComics = async () => {
    try {
      setComics(await getComics());
    } catch {
      addToast("Failed to load comics", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (comic) => {
    setEditingComic(comic);
    setFormData(comic);
    setIsFormOpen(true);
  };
  const handleDeleteClick = (comic) => {
    setComicToDelete(comic);
    setDeleteModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!formData.title?.trim() || !formData.description?.trim() || formData.price === void 0 || formData.price < 0 || !formData.cover_url?.trim()) {
      addToast("Please fill out all required fields. Price must be a non-negative number.", "error");
      return;
    }
    try {
      if (editingComic) {
        await updateComic(currentUser.user_id, editingComic.comic_id, formData);
        setComics(comics.map((c) => c.comic_id === editingComic.comic_id ? { ...c, ...formData } : c));
        addToast("Comic updated", "success");
      } else {
        const newComic = await createComic(currentUser.user_id, formData);
        setComics([...comics, newComic]);
        addToast("Comic created", "success");
      }
      setIsFormOpen(false);
      setEditingComic(null);
      setFormData({ title: "", description: "", price: 0, cover_url: "", release_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], gumroad_link: "" });
    } catch {
      addToast("Operation failed", "error");
    }
  };
  const handleConfirmDelete = async () => {
    if (!currentUser || !comicToDelete) return;
    try {
      await deleteComic(currentUser.user_id, comicToDelete.comic_id);
      setComics(comics.filter((c) => c.comic_id !== comicToDelete.comic_id));
      addToast("Comic deleted", "success");
    } catch {
      addToast("Delete failed", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };
  if (loading) return <div className="text-white">Loading...</div>;
  return <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bangers text-white">Manage Comics</h1>
                <button onClick={() => {
    setEditingComic(null);
    setIsFormOpen(true);
  }} className="bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded shadow hover:bg-yellow-500">
                    + Add New Comic
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comics.map((comic) => <div key={comic.comic_id} className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{comic.title}</h3>
                            <p className="text-gray-400 text-sm mb-2 line-clamp-3">{comic.description}</p>
                            <span className="text-yellow-400 font-bold">${comic.price.toFixed(2)}</span>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2 border-t border-slate-700 pt-4">
                            <button onClick={() => handleEdit(comic)} className="text-cyan-400 hover:text-cyan-300 font-medium">Edit</button>
                            <button onClick={() => handleDeleteClick(comic)} className="text-red-500 hover:text-red-400 font-medium">Delete</button>
                        </div>
                    </div>)}
            </div>

            {
    /* Edit/Create Modal */
  }
            {isFormOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto pt-10 pb-10 px-4">
                    <div className="bg-slate-800 rounded-lg shadow-2xl p-6 max-w-lg w-full border border-slate-700">
                        <h2 className="text-2xl font-bangers text-white mb-4">{editingComic ? "Edit Comic" : "New Comic"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-yellow-400 outline-none" required />
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-yellow-400 outline-none h-24" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} placeholder="Price" className="bg-slate-900 text-white p-3 rounded border border-slate-600" required />
                                <input type="date" value={formData.release_date} onChange={(e) => setFormData({ ...formData, release_date: e.target.value })} className="bg-slate-900 text-white p-3 rounded border border-slate-600" required />
                            </div>
                            <input value={formData.cover_url} onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })} placeholder="Cover Image URL" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600" required />
                            <input value={formData.gumroad_link} onChange={(e) => setFormData({ ...formData, gumroad_link: e.target.value })} placeholder="Gumroad Link" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600" />

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-300 hover:bg-slate-700 rounded">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-yellow-400 text-slate-900 font-bold rounded hover:bg-yellow-500">Save</button>
                            </div>
                        </form>
                    </div>
                </div>}

            <ConfirmationModal
    isOpen={deleteModalOpen}
    title="Delete Comic"
    message={`Delete "${comicToDelete?.title}"?`}
    isDangerous={true}
    onConfirm={handleConfirmDelete}
    onCancel={() => setDeleteModalOpen(false)}
  />
        </div>;
};
export default ManageComics;
