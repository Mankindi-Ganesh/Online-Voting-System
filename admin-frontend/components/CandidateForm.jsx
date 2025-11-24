import React, { useState } from "react";
import API from "../services/api";

const CandidateForm = ({ onAdded }) => {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/candidates/add", { name, party, image });
      onAdded();
      setName(""); setParty(""); setImage("");
    } catch (err) {
      alert(err.response?.data.message || "Error adding candidate");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Party" value={party} onChange={(e) => setParty(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <button type="submit">Add Candidate</button>
    </form>
  );
};

export default CandidateForm;
