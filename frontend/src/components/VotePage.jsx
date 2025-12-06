import React, { useEffect, useState } from "react";
import axios from "axios";

function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voterId, setVoterId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // 1) Load candidates
        const res = await axios.get("http://localhost:5000/api/candidates/list");
        const candidatesArray = res.data || [];

        const formatted = candidatesArray.map((c) => ({
          _id: c._id,
          fullName: c.fullName,
          party: c.party,
          votes: c.votes ?? 0,
          candidatePhoto: `http://localhost:5000/${c.candidatePhoto}`,
          partyLogo: `http://localhost:5000/${c.partySymbol}`,
        }));

        setCandidates(formatted);

        // 2) Get voter ID
        const stored = localStorage.getItem("voterId");
        if (stored) setVoterId(stored);
      } catch (err) {
        console.error("Failed to load candidates:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const handleVote = async (candidateId) => {
    const stored = voterId || localStorage.getItem("voterId");

    if (!stored) {
      alert("You must verify your phone (OTP) before voting.");
      return;
    }

    try {
      const status = await axios.get(`http://localhost:5000/api/voters/status/${stored}`);

      if (status.data?.hasVoted) {
        setHasVoted(true);
        alert("You have already voted.");
        return;
      }
    } catch (err) {
      console.error("Voter status check failed:", err);
      alert("Unable to verify voter. Please try again.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/candidates/vote/${candidateId}`,
        { voterId: stored }
      );

      setHasVoted(true);
      alert("Vote submitted successfully!");

      // refresh candidates
      const res = await axios.get("http://localhost:5000/api/candidates/list");
      const refreshed = res.data.map((c) => ({
        _id: c._id,
        fullName: c.fullName,
        party: c.party,
        votes: c.votes ?? 0,
        candidatePhoto: `http://localhost:5000/${c.candidatePhoto}`,
        partyLogo: `http://localhost:5000/${c.partySymbol}`,
      }));

      setCandidates(refreshed);
    } catch (err) {
      console.error("Vote submission error:", err);
      const msg = err?.response?.data?.message || "Voting failed";
      alert(msg);
    }
  };

  if (loading) return <p className="text-center p-6">Loading candidates...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Vote for a Candidate</h1>
      <p className="text-sm text-gray-600 mb-6">Select your preferred candidate below</p>

      {candidates.length === 0 ? (
        <p className="text-gray-500">No candidates available.</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <div
              key={c._id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                {/* Candidate Photo */}
                <img
                  src={c.candidatePhoto}
                  alt={c.fullName}
                  className="w-16 h-16 object-cover rounded"
                />

                {/* Party Logo */}
                <img
                  src={c.partyLogo}
                  alt={c.party}
                  className="w-12 h-12 object-cover rounded"
                />

                <div>
                  <p className="text-lg font-semibold text-gray-900">{c.fullName}</p>
                  <p className="text-sm text-gray-600">{c.party}</p>
                </div>
              </div>

              {/* Vote button wrapper */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote(c._id)}
                  disabled={hasVoted}
                  className={`px-4 py-2 rounded font-semibold transition-all ${
                    hasVoted
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {hasVoted ? "✓ Voted" : "Vote"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VotePage;