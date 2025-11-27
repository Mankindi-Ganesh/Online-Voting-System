// ...existing code...
import React from "react";          

function ResultBar({ percent }) {
  return (
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        style={{ width: `${percent}%` }}
        className="h-3 bg-blue-500"
      />
    </div>
  );
}

function votingResults({ candidates = [] }) {
  const total = candidates.reduce((s, c) => s + (c.votes || 0), 0) || 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Voting Results</h2>
      {candidates.length === 0 ? (
        <p>No candidates available.</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => {
            const percent = total === 0 ? 0 : Math.round((c.votes / total) * 100);
            return (
              <div key={c.id} className="bg-gray-50 p-4 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-gray-500">{c.party}</div>
                  </div>
                  <div className="text-sm text-gray-700">{c.votes} votes</div>
                </div>
                <ResultBar percent={percent} />
                <div className="text-sm text-gray-500 mt-2">{percent}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default votingResults;
 // ...existing code...