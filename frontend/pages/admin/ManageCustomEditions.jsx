import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getAdminCustomEditions, updateCustomEditionStatus } from "../../services/api";
const ManageCustomEditions = () => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchRequests();
  }, []);
  const fetchRequests = async () => {
    if (!currentUser) return;
    try {
      const data = await getAdminCustomEditions(currentUser.user_id);
      setRequests(data);
    } catch (error) {
      addToast("Error loading requests", "error");
    } finally {
      setLoading(false);
    }
  };
  const updateStatus = async (id, status) => {
    if (!currentUser) return;
    try {
      await updateCustomEditionStatus(currentUser.user_id, id, status);
      setRequests((prevRequests) => prevRequests.map(
        (r) => r.edition_id === id ? { ...r, delivery_status: status } : r
      ));
      addToast(`Status updated to ${status}`, "success");
    } catch (error) {
      addToast("Update failed", "error");
    }
  };
  if (loading) return <div>Loading...</div>;
  return <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bangers text-white mb-6">Custom Edition Requests</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {
    /* Pending Column */
  }
                <div className="bg-slate-800 rounded-lg p-4 shadow-lg border-t-4 border-red-500 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <h3 className="text-xl font-bold text-white mb-4 sticky top-0 bg-slate-800 pb-2">Pending ({requests.filter((r) => r.delivery_status === "pending").length})</h3>
                    {requests.filter((r) => r.delivery_status === "pending").map(
    (r) => <RequestCard key={r.edition_id} req={r} onUpdateStatus={updateStatus} />
  )}
                </div>

                {
    /* In Progress Column */
  }
                <div className="bg-slate-800 rounded-lg p-4 shadow-lg border-t-4 border-yellow-400 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <h3 className="text-xl font-bold text-white mb-4 sticky top-0 bg-slate-800 pb-2">In Progress ({requests.filter((r) => r.delivery_status === "in_progress").length})</h3>
                    {requests.filter((r) => r.delivery_status === "in_progress").map(
    (r) => <RequestCard key={r.edition_id} req={r} onUpdateStatus={updateStatus} />
  )}
                </div>

                {
    /* Delivered Column */
  }
                <div className="bg-slate-800 rounded-lg p-4 shadow-lg border-t-4 border-green-500 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <h3 className="text-xl font-bold text-white mb-4 sticky top-0 bg-slate-800 pb-2">Delivered ({requests.filter((r) => r.delivery_status === "delivered").length})</h3>
                    {requests.filter((r) => r.delivery_status === "delivered").map(
    (r) => <RequestCard key={r.edition_id} req={r} onUpdateStatus={updateStatus} />
  )}
                </div>
            </div>
        </div>;
};
const RequestCard = ({ req, onUpdateStatus }) => <div className="bg-slate-700 p-4 rounded-lg mb-4 text-sm shadow border border-slate-600">
        <h4 className="font-bold text-white mb-1">{req.custom_name}</h4>
        <p className="text-gray-400 mb-2">User: {req.user?.name} ({req.user?.email})</p>
        <p className="text-yellow-400 mb-3 text-xs">Comic: {req.comic?.title}</p>
        {req.avatar_reference && <a href={req.avatar_reference} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline block mb-3 text-xs">View Avatar Ref</a>}

        <select
  value={req.delivery_status}
  onChange={(e) => onUpdateStatus(req.edition_id, e.target.value)}
  className="w-full bg-slate-900 text-white p-2 rounded text-xs border border-slate-600 outline-none focus:border-yellow-400"
>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
        </select>
    </div>;
export default ManageCustomEditions;
