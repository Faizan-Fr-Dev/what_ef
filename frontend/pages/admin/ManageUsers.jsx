import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getUsers, deleteUser, updateUserRole } from "../../services/api";
import ConfirmationModal from "../../components/ConfirmationModal";
const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    if (!currentUser) return;
    try {
      const data = await getUsers(currentUser.user_id);
      setUsers(data);
    } catch (error) {
      addToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!currentUser || !userToDelete) return;
    try {
      await deleteUser(currentUser.user_id, userToDelete.user_id);
      addToast("User deleted successfully", "success");
      setUsers(users.filter((u) => u.user_id !== userToDelete.user_id));
    } catch (error) {
      addToast("Failed to delete user", "error");
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };
  const handleRoleUpdate = async (userId, currentRole) => {
    if (!currentUser) return;
    const newRole = currentRole === "user" ? "admin" : "user";
    try {
      await updateUserRole(currentUser.user_id, userId, newRole);
      setUsers(users.map((u) => u.user_id === userId ? { ...u, role: newRole } : u));
      addToast(`User role updated to ${newRole}`, "success");
    } catch (error) {
      addToast("Failed to update role", "error");
    }
  };
  if (loading) return <div className="text-white">Loading users...</div>;
  return <div>
            <h1 className="text-3xl font-bangers text-white mb-6">Manage Users</h1>
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-x-auto border border-slate-700">
                <table className="w-full text-left text-gray-300 min-w-[600px] md:min-w-full">
                    <thead className="bg-slate-900 text-yellow-400 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {users.map((user) => <tr key={user.user_id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="p-4">{user.user_id}</td>
                                <td className="p-4 font-bold text-white">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === "admin" ? "bg-yellow-400 text-slate-900" : "bg-slate-600 text-white"}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {user.user_id !== currentUser?.user_id && <>
                                            <button
    onClick={() => handleRoleUpdate(user.user_id, user.role)}
    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium mr-2"
  >
                                                {user.role === "user" ? "Make Admin" : "Demote"}
                                            </button>
                                            <button
    onClick={() => handleDeleteClick(user)}
    className="text-red-500 hover:text-red-400 text-sm font-medium"
  >
                                                Delete
                                            </button>
                                        </>}
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
    isOpen={deleteModalOpen}
    title="Delete User"
    message={`Are you sure you want to delete ${userToDelete?.name}? This cannot be undone.`}
    confirmText="Delete User"
    isDangerous={true}
    onConfirm={handleConfirmDelete}
    onCancel={() => setDeleteModalOpen(false)}
  />
        </div>;
};
export default ManageUsers;
