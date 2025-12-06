import React, { useState } from "react";

function CandidateForm({ onAdd }) {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");

  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [partyLogo, setPartyLogo] = useState(null);

  const [previewCandidate, setPreviewCandidate] = useState("");
  const [previewLogo, setPreviewLogo] = useState("");

  // -----------------------------
  // HANDLE IMAGE PREVIEW
  // -----------------------------
  function handleImageChange(e, setFile, setPreview) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  // -----------------------------
  // RESET FORM
  // -----------------------------
  function resetForm() {
    setName("");
    setParty("");
    setCandidatePhoto(null);
    setPartyLogo(null);
    setPreviewCandidate("");
    setPreviewLogo("");
  }

  // -----------------------------
  // HANDLE SUBMIT
  // -----------------------------
  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !party.trim() || !candidatePhoto || !partyLogo) {
      alert("All fields including images are required!");
      return;
    }

    onAdd({
      fullName: name.trim(),
      party: party.trim(),
      candidatePhoto,
      partyLogo, // key matches backend Multer field
    });

    resetForm();
  }

  // -----------------------------
  // RENDER FORM
  // -----------------------------
  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 p-4 rounded border"
      >
        <div>
          <label className="block text-sm">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm">Party</label>
          <input
            type="text"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm">Candidate Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setCandidatePhoto, setPreviewCandidate)
            }
            className="w-full border p-2 rounded"
            required
          />
          {previewCandidate && (
            <img
              src={previewCandidate}
              alt={name || "Candidate"}
              className="w-24 h-24 mt-2 rounded object-cover border"
            />
          )}
        </div>

        <div>
          <label className="block text-sm">Party Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setPartyLogo, setPreviewLogo)
            }
            className="w-full border p-2 rounded"
            required
          />
          {previewLogo && (
            <img
              src={previewLogo}
              alt={party || "Party"}
              className="w-20 h-20 mt-2 rounded object-cover border"
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>

          <button
            type="button"
            onClick={resetForm}
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
