// ...existing code...
import React from "react";

export default function candidatesList({ candidates = [], onDelete, onVote }) {
  if (candidates.length === 0) {
    return <p>No candidates yet. Add one from "Add Candidate".</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>
      <div className="space-y-4">
        {candidates.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-gray-50 p-4 rounded border">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-500">{c.party}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">Votes: {c.votes}</div>
              {/* <button
                onClick={() => onVote(c.id)}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                + Vote
              </button> */}
              <button
                onClick={() => onDelete(c.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 // ...existing code...