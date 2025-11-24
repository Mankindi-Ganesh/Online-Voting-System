import React, { useEffect, useState } from "react";
import API from "../services/api";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      const { data } = await API.get("/candidates");
      setCandidates(data);
    } catch (err) {
      console.error("Error fetching candidates", err);
    }
  };

  const handleShortlist = async (id) => {
    try {
      await API.patch(`/candidates/shortlist/${id}`);
      fetchCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {candidates.map((c) => (
        <div key={c._id} className="p-4 border rounded">
          <h2>{c.name}</h2>
          <p>{c.party}</p>
          <p>Shortlisted: {c.shortlisted ? "✅" : "❌"}</p>
          {!c.shortlisted && <button onClick={() => handleShortlist(c._id)}>Shortlist</button>}
        </div>
      ))}
    </div>
  );
};

export default CandidateList;
