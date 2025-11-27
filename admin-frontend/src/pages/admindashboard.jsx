// ...existing code...
import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CandidatesList from "./candidatesList";     // ensure file is named candidatesList.jsx
import CandidateForm from "./candidateForm";       // ensure file is named candidateForm.jsx
import VotingResults from "./votingResults";        // ensure file is named votingResults.jsx and export default

export default function AdminDashboard() {
  const [view, setView] = useState("list");
  const [candidates, setCandidates] = useState([]);

  async function addCandidate(candidate) {
    // Persist candidate to backend and update local state from saved record
    try {
      const res = await axios.post("http://localhost:5000/api/candidates", candidate);
      const saved = res.data;
      setCandidates((prev) => [...prev, { id: saved._id || Date.now(), votes: saved.votes ?? 0, ...saved }]);
      setView("list");
    } catch (err) {
      console.error("Failed to add candidate to backend:", err);
      // Fallback: still add locally so admin can continue
      setCandidates((prev) => [...prev, { id: Date.now(), votes: 0, ...candidate }]);
      setView("list");
      alert("Failed to persist candidate to server — added locally only.");
    }
  }

  function deleteCandidate(id) {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }

  function incrementVote(id) {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, votes: c.votes + 1 } : c)));
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active={view} onNavigate={setView} className="w-64" />
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage candidates and view results</p>
        </header>

        <section className="bg-white rounded shadow p-6">
          {view === "list" && (
            <CandidatesList candidates={candidates} onDelete={deleteCandidate} onVote={incrementVote} />
          )}

          {view === "form" && <CandidateForm onAdd={addCandidate} />}

          {view === "results" && <VotingResults candidates={candidates} />}
        </section>
      </main>
    </div>
  );
}
// ...existing code...


/**
 * AdminDashboard is a component that manages candidates and displays
 * the results of votes. It contains a sidebar to navigate between
 * the list of candidates, a form to add a new candidate, and
 * a page to view the results of the votes.
 *
 * The component has two states: 'list' | 'form' | 'results'. The
 * state is controlled by the sidebar and the component renders
 * the corresponding view based on the state.
 *
 * The component also takes care of adding a new candidate, deleting
 * an existing candidate, and incrementing the votes of a candidate.
 */