import React, { useState, useEffect } from "react";
import CandidateForm from "./candidateForm";
import axios from "axios";

function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/candidates")
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddCandidate = async (candidate) => {
    try {
      const res = await axios.post("http://localhost:5000/api/candidates", candidate);
      setCandidates([...candidates, res.data]); // update UI
    } catch (err) {
      console.error(err);
      alert("Failed to add candidate");
    }
  };

  return (
    <div>
      <CandidateForm onAdd={handleAddCandidate} />
      <h2>Candidates List</h2>
      <ul>
        {candidates.map((c, i) => (
          <li key={i}>{c.fullName} - {c.party} - Votes: {c.votes}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCandidates;
