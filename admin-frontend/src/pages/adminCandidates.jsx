import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);

  // -----------------------------
  // FETCH ALL CANDIDATES
  // -----------------------------
  async function fetchCandidates() {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates/list");
      setCandidates(res.data); // backend returns array directly
    } catch (error) {
      console.log("Error loading candidates:", error);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Candidates</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Party Logo</th>
            <th>Full Name</th>
            <th>Party</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan="4">No candidates found</td>
            </tr>
          ) : (
            candidates.map((c) => (
              <tr key={c._id}>
                <td>
                  <img
                    src={`http://localhost:5000/${c.candidatePhoto}`}
                    alt={`${c.fullName} photo`}
                    width="70"
                    height="70"
                    style={{ borderRadius: "6px" }}
                  />
                </td>

                <td>
                  <img
                    src={`http://localhost:5000/${c.partySymbol}`}
                    alt={`${c.party} symbol`}
                    width="70"
                    height="70"
                    style={{ borderRadius: "6px" }}
                  />
                </td>

                <td>{c.fullName}</td>
                <td>{c.party}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}