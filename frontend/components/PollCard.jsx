import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import GuestModal from "./GuestModal";
const PollCard = ({ poll, onVote }) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.vote_count, 0);
  const hasVoted = poll.user_vote !== void 0 && poll.user_vote !== null;
  const isClosed = poll.status === "closed";
  const showResults = hasVoted || isClosed;
  const handleVoteClick = () => {
    if (!selectedOption) return;
    if (user) {
      onVote(poll.poll_id, selectedOption, user.user_id);
    } else {
      setIsGuestModalOpen(true);
    }
  };
  const handleGuestSuccess = (guestUser) => {
    if (selectedOption && guestUser) {
      onVote(poll.poll_id, selectedOption, guestUser.user_id);
    }
  };
  return <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700 relative">
      <GuestModal
    isOpen={isGuestModalOpen}
    onClose={() => setIsGuestModalOpen(false)}
    onSuccess={handleGuestSuccess}
    actionName="vote"
  />
      {hasVoted && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          VOTED
        </div>}
      {isClosed && <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
          CLOSED
        </div>}

      <h3 className="text-xl font-bold text-yellow-400 mb-2">{poll.question}</h3>
      <p className="text-gray-400 text-sm mb-4">
        Ends: {new Date(poll.end_date).toLocaleDateString()}
      </p>

      <div className="space-y-3">
        {poll.options.map((option) => {
    const percentage = totalVotes === 0 ? 0 : Math.round(option.vote_count / totalVotes * 100);
    const isUserVote = poll.user_vote === option.option_id;
    return <div
      key={option.option_id}
      className={`p-3 rounded-md border ${isUserVote ? "border-green-500 bg-slate-700" : "border-slate-600 bg-slate-900"} relative overflow-hidden`}
    >
              {showResults && <div
      className="absolute top-0 left-0 h-full bg-slate-700 opacity-30 transition-all duration-500"
      style={{ width: `${percentage}%` }}
    />}

              <div className="relative z-10 flex items-center justify-between">
                <label className="flex items-center cursor-pointer flex-grow">
                  <input
      type="radio"
      name={`poll-${poll.poll_id}`}
      value={option.option_id}
      disabled={hasVoted || isClosed}
      checked={selectedOption === option.option_id}
      onChange={() => setSelectedOption(option.option_id)}
      className="form-radio h-4 w-4 text-yellow-400 focus:ring-yellow-400 bg-slate-800 border-gray-500"
    />
                  <span className="ml-3 text-gray-200">
                    {option.option_text}
                    {isUserVote && <span className="text-green-400 text-xs ml-2">(Your Vote)</span>}
                  </span>
                </label>
                {showResults && <span className="text-sm font-bold text-gray-400">{percentage}%</span>}
              </div>
            </div>;
  })}
      </div>

      {!hasVoted && !isClosed && <button
    onClick={handleVoteClick}
    disabled={!selectedOption}
    className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
          Cast Vote
        </button>}
      {hasVoted && <p className="mt-4 text-center text-gray-400 text-sm">Thanks for voting!</p>}
      {isClosed && !hasVoted && <p className="mt-4 text-center text-gray-400 text-sm">This poll is closed.</p>}
    </div>;
};
export default PollCard;
