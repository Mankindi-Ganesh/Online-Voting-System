import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates/list");
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/candidates/delete/${id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      alert("Candidate deleted successfully");
    } catch (err) {
      console.error("Error deleting candidate:", err);
      alert("Failed to delete candidate");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading candidates...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Candidates List</h2>

      {candidates.length === 0 ? (
        <p className="text-gray-500">No candidates available.</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <div key={c._id || c.id} className="flex items-center justify-between bg-gray-50 p-4 rounded border">
              <div>
                <div className="font-medium">{c.fullName}</div>
                <div className="text-sm text-gray-500">{c.party}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">Votes: {c.votes}</div>
                <button
                  onClick={() => handleDelete(c._id || c.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCandidates;