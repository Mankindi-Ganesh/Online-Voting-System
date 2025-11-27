import React, { useEffect, useState } from "react";
import axios from "axios";

function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/candidates")
      .then(res => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleVote = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/candidates/vote/${id}`);
      alert("Vote submitted!");
    } catch (err) {
      console.error(err);
      alert("Voting failed");
    }
  };

  if (loading) return <p>Loading candidates...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Vote for a Candidate</h1>

      <ul className="space-y-4">
        {candidates.map((c) => (
          <li key={c._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{c.fullName}</p>
              <p className="text-sm text-gray-700">{c.party}</p>
            </div>

            <button
              onClick={() => handleVote(c._id)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VotePage;
