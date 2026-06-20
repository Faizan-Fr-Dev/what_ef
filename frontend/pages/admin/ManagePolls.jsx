import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getPolls, createPoll, updatePollStatus, deletePoll } from "../../services/api";
import { PollStatus } from "../../types";
import ConfirmationModal from "../../components/ConfirmationModal";
const ManagePolls = () => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endDate, setEndDate] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  useEffect(() => {
    fetchPolls();
  }, []);
  const fetchPolls = async () => {
    try {
      setPolls(await getPolls());
    } catch {
      addToast("Error loading polls", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateOption = () => setOptions([...options, ""]);
  const handleOptionChange = (idx, val) => {
    const newOpts = [...options];
    newOpts[idx] = val;
    setOptions(newOpts);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const filteredOptions = options.filter((o) => o.trim() !== "");
    if (filteredOptions.length < 2) {
      addToast("Please provide at least 2 options for the poll.", "error");
      return;
    }
    try {
      await createPoll(currentUser.user_id, {
        question,
        start_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        end_date: endDate,
        options: filteredOptions
      });
      addToast("Poll created", "success");
      setIsFormOpen(false);
      setQuestion("");
      setOptions(["", ""]);
      setEndDate("");
      fetchPolls();
    } catch {
      addToast("Creation failed", "error");
    }
  };
  const toggleStatus = async (poll) => {
    if (!currentUser) return;
    const newStatus = poll.status === PollStatus.ACTIVE ? PollStatus.CLOSED : PollStatus.ACTIVE;
    try {
      await updatePollStatus(currentUser.user_id, poll.poll_id, newStatus);
      setPolls(polls.map((p) => p.poll_id === poll.poll_id ? { ...p, status: newStatus } : p));
      addToast(`Poll ${newStatus}`, "success");
    } catch {
      addToast("Status update failed", "error");
    }
  };
  const confirmDelete = async () => {
    if (!currentUser || !pollToDelete) return;
    try {
      await deletePoll(currentUser.user_id, pollToDelete.poll_id);
      setPolls(polls.filter((p) => p.poll_id !== pollToDelete.poll_id));
      addToast("Poll deleted", "success");
    } catch {
      addToast("Delete failed", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };
  if (loading) return <div>Loading...</div>;
  return <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bangers text-white">Manage Polls</h1>
                <button onClick={() => setIsFormOpen(true)} className="bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded shadow hover:bg-yellow-500">+ New Poll</button>
            </div>

            <div className="space-y-4">
                {polls.map((poll) => <div key={poll.poll_id} className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-white">{poll.question}</h3>
                            <p className="text-xs text-gray-400">Ends: {new Date(poll.end_date).toLocaleDateString()} | Status: <span className={poll.status === "active" ? "text-green-400" : "text-red-400"}>{poll.status}</span></p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => toggleStatus(poll)} className="text-cyan-400 hover:text-cyan-300 text-sm font-bold">
                                {poll.status === "active" ? "Close" : "Reopen"}
                            </button>
                            <button onClick={() => {
    setPollToDelete(poll);
    setDeleteModalOpen(true);
  }} className="text-red-500 hover:text-red-400 text-sm font-bold">Delete</button>
                        </div>
                    </div>)}
            </div>

            {
    /* Create Modal */
  }
            {isFormOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-lg p-6 max-w-lg w-full border border-slate-700">
                        <h2 className="text-2xl font-bangers text-white mb-4">Create Poll</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600" required />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600" required />
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Options</label>
                                {options.map((opt, idx) => <input key={idx} value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} placeholder={`Option ${idx + 1}`} className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600" required />)}
                                <button type="button" onClick={handleCreateOption} className="text-yellow-400 text-sm hover:underline">+ Add Option</button>
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-300">Cancel</button>
                                <button type="submit" className="bg-yellow-400 text-slate-900 px-4 py-2 rounded font-bold">Create</button>
                            </div>
                        </form>
                    </div>
                </div>}

            <ConfirmationModal isOpen={deleteModalOpen} title="Delete Poll" message="Are you sure?" onConfirm={confirmDelete} onCancel={() => setDeleteModalOpen(false)} isDangerous={true} />
        </div>;
};
export default ManagePolls;
