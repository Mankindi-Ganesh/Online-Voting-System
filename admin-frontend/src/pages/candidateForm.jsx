import React, { useState } from "react";

function CandidateForm({ onAdd }) {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !party.trim()) return;

    onAdd({ fullName: name.trim(), party: party.trim() });

    setName("");
    setParty("");
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
        <div>
          <label className="block text-sm text-gray-600">Full name</label>
          <input
            value={name}          // <-- FIXED
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Party</label>
          <input
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            placeholder="e.g. Independent"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Add
          </button>
          <button
            type="button"
            onClick={() => { setName(""); setParty(""); }}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default CandidateForm;
