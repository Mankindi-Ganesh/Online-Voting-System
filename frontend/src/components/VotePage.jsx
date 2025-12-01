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
        // 1) Always load candidates from backend
        const res = await axios.get("http://localhost:5000/api/candidates/list");
        setCandidates(res.data || []);

        // 2) Get voterId from localStorage (set by OTP verification page)
        const stored = localStorage.getItem("voterId");
        if (stored) {
          setVoterId(stored);
          // do NOT call /voters/status here — only call it right before voting
        }
      } catch (err) {
        console.error("Failed to load candidates:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // ...existing code...
const handleVote = async (candidateId) => {
  const stored = voterId || localStorage.getItem("voterId");

  if (!stored) {
    alert("You must verify your phone (OTP) before voting.");
    return;
  }

  // validate voter status right before voting
  try {
    const status = await axios.get(`http://localhost:5000/api/voters/status/${stored}`);
    if (status.data?.hasVoted) {
      setHasVoted(true);
      alert("You have already voted.");
      return;
    }
  } catch (err) {
    console.error("Voter status check failed:", err);
    if (err.response?.status >= 500) {
      alert("Temporary server error. Please retry in a moment.");
      return;
    }
    if (err.response?.status === 404) {
      localStorage.removeItem("voterId");
      alert("Session expired or account not found. Please register and verify again.");
      return;
    }
    alert("Unable to verify voter. Please try again.");
    return;
  }

  // submit vote with voterId in body
  try {
    const voteRes = await axios.post(
      `http://localhost:5000/api/candidates/vote/${candidateId}`,
      { voterId: stored }  // pass voterId here
    );

    console.log("Vote submitted:", voteRes.data);

    setHasVoted(true);
    alert("Vote submitted successfully!");

    // refresh candidates to show updated vote count
    const list = await axios.get("http://localhost:5000/api/candidates/list");
    setCandidates(list.data || []);
  } catch (err) {
    console.error("Vote submission error:", err);
    const msg = err?.response?.data?.message || "Voting failed";
    alert(msg);
  }
};
// ...existing code...

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
              key={c._id || c.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900">{c.fullName}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700"></p>
                  <p className="text-xs text-gray-500"></p>
                </div>

                <button
                  onClick={() => handleVote(c._id || c.id)}
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