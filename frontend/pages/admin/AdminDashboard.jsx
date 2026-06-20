const AdminDashboard = () => {
  return <div>
            <h1 className="text-3xl font-bangers text-white mb-6">Internal Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg border-l-4 border-yellow-400">
                    <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
                    <p className="text-gray-400 mb-4">View register users, promote admins, or ban accounts.</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg border-l-4 border-cyan-400">
                    <h3 className="text-xl font-bold text-white mb-2">Manage Catalogue</h3>
                    <p className="text-gray-400 mb-4">Add new comics, update prices, or manage bundles.</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-white mb-2">Fan Engagement</h3>
                    <p className="text-gray-400 mb-4">Create polls and manage custom edition requests.</p>
                </div>
            </div>
            <div className="mt-8 bg-slate-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-300">All systems operational</span>
                </div>
            </div>
        </div>;
};
export default AdminDashboard;
