const CandidatesList = () => {
  const candidates = [
    {
      id: 1,
      name: "John Doe",
      party: "Party A",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Jane Smith",
      party: "Party B",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Candidates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center group">
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg transform transition-transform duration-300 group-hover:scale-105"
            />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{candidate.name}</h2>
            <p className="text-gray-500 mb-4 text-sm">{candidate.party}</p>
            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidatesList;
