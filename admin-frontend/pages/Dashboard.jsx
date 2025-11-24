import React from "react";
import CandidateForm from "../components/CandidateForm";
import CandidateList from "../components/CandidateList";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <CandidateForm onAdded={() => window.location.reload()} />
      <CandidateList />
    </div>
  );
};

export default Dashboard;
