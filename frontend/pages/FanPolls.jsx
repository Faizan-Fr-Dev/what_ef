import { useState, useEffect } from "react";
import { PollStatus } from "../types";
import { getPolls, submitVote } from "../serviceshttps://what-ef-production.up.railway.app/api";
import PollCard from "../components/PollCard";
import { useAuth } from "../context/AuthContext";
const FanPolls = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const pollsData = await getPolls(user?.user_id);
        setPolls(pollsData);
      } catch (error) {
        console.error("Failed to fetch polls", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [user]);
  const handleVote = async (pollId, optionId, userId) => {
    const activeUserId = userId || user?.user_id;
    if (!activeUserId) return;
    try {
      const updatedPoll = await submitVote(pollId, optionId, activeUserId);
      if (updatedPoll) {
        setPolls(
          (currentPolls) => currentPolls.map((p) => p.poll_id === pollId ? updatedPoll : p)
        );
      }
    } catch (error) {
      console.error("Failed to submit vote", error);
    }
  };
  if (loading) {
    return <div className="text-center text-yellow-400 text-2xl">Loading Polls...</div>;
  }
  const activePolls = polls.filter((p) => p.status === PollStatus.ACTIVE);
  const closedPolls = polls.filter((p) => p.status === PollStatus.CLOSED);
  return <div className="container mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Fan Polls</h1>

      <section>
        <h2 className="text-2xl font-semibold text-red-500 mb-4 border-b-2 border-red-500 pb-2">Active Polls</h2>
        <div className="grid grid-cols-1 gap-6">
          {activePolls.length > 0 ? activePolls.map((poll) => <PollCard key={poll.poll_id} poll={poll} onVote={handleVote} />) : <p className="text-gray-400">No active polls at the moment.</p>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-500 mb-4 border-b-2 border-gray-500 pb-2">Closed Polls</h2>
        <div className="grid grid-cols-1 gap-6">
          {closedPolls.length > 0 ? closedPolls.map((poll) => <PollCard key={poll.poll_id} poll={poll} onVote={handleVote} />) : <p className="text-gray-400">No closed polls found.</p>}
        </div>
      </section>
    </div>;
};
export default FanPolls;
