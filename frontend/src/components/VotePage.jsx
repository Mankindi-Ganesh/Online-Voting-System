// ...existing code...
import React, { useEffect, useState } from "react";
import axios from "axios";

function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voterId, setVoterId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // helper: safely parse hasVoted coming from backend
  const parseHasVoted = (value) => {
    return value === true || value === "true" || value === 1 || value === "1";
  };

  useEffect(() => {
    async function init() {
      try {
        // 1) Load candidates
        const res = await axios.get(
          "http://localhost:5000/api/candidates/list"
        );
        setCandidates(res.data || []);

        // 2) If voterId is stored, validate it and get status
        const stored = localStorage.getItem("voterId");
        if (stored) {
          try {
            const status = await axios.get(
              `http://localhost:5000/api/voters/status/${stored}`
            );

            setVoterId(stored);
            setHasVoted(parseHasVoted(status.data?.hasVoted));
          } catch (err) {
            console.warn("Stored voterId invalid:", err?.response?.data || err.message);
            localStorage.removeItem("voterId");
            setVoterId(null);
            setHasVoted(false);
          }
        }
      } catch (err) {
        console.error("Failed to load candidates or validate voter:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleVote = async (id) => {
    // re-check localStorage for voter id
    let stored =
      voterId ||
      localStorage.getItem("voterId") ||
      localStorage.getItem("voter_id") ||
      localStorage.getItem("voter");

    if (!stored) {
      alert("You must verify your phone (OTP) before voting.");
      return;
    }

    // validate against backend just before voting
    try {
      const status = await axios.get(
        `http://localhost:5000/api/voters/status/${stored}`
      );
      const alreadyVoted = parseHasVoted(status.data?.hasVoted);

      if (alreadyVoted) {
        setHasVoted(true);
        setVoterId(stored);
        alert("You have already voted.");
        return;
      }

      // voter is valid and has not voted yet
      setVoterId(stored);
      setHasVoted(false);
    } catch (err) {
      console.error("Status check failed:", err);
      localStorage.removeItem("voterId");
      setVoterId(null);
      setHasVoted(false);
      alert("You must verify your phone (OTP) before voting.");
      return;
    }

    // now submit vote
    try {
      await axios.post(
        `http://localhost:5000/api/candidates/vote/${id}`,
        { voterId: stored }
      );

      setHasVoted(true);
      alert("Vote submitted!");

      // refresh results
      const list = await axios.get("http://localhost:5000/api/candidates/list");
      setCandidates(list.data || []);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Voting failed";
      alert(msg);
    }
  };

  if (loading) return <p>Loading candidates...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Vote for a Candidate</h1>

      <ul className="space-y-4">
        {candidates.map((c) => (
          <li
            key={c._id || c.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">{c.fullName}</p>
              <p className="text-sm text-gray-700">{c.party}</p>
            </div>

            <button
              onClick={() => handleVote(c._id || c.id)}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              disabled={hasVoted}
            >
              {hasVoted ? "Voted" : "Vote"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VotePage;
