import { useEffect, useMemo, useState } from "react";

const DEFAULT_CANDIDATES = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Diana" },
];

const LS_VOTES = "votes";
const LS_VOTED = "voted"; // stores true/false

export default function App() {
  const [candidates, setCandidates] = useState(DEFAULT_CANDIDATES);
  const [votes, setVotes] = useState({}); // {1: 3, 2: 5, ...}
  const [selectedId, setSelectedId] = useState(null);
  const [voted, setVoted] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const savedVotes = JSON.parse(localStorage.getItem(LS_VOTES));
      const savedVoted = JSON.parse(localStorage.getItem(LS_VOTED));
      if (savedVotes && typeof savedVotes === "object") setVotes(savedVotes);
      if (typeof savedVoted === "boolean") setVoted(savedVoted);
    } catch (_) {}
  }, []);

  // Persist votes on change
  useEffect(() => {
    localStorage.setItem(LS_VOTES, JSON.stringify(votes));
  }, [votes]);

  // Persist voted flag
  useEffect(() => {
    localStorage.setItem(LS_VOTED, JSON.stringify(voted));
  }, [voted]);

  const totalVotes = useMemo(
    () => Object.values(votes).reduce((a, b) => a + b, 0),
    [votes]
  );

  const handleVote = () => {
    if (!selectedId || voted) return;
    setVotes((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] || 0) + 1,
    }));
    setVoted(true);
  };

  const resetAll = () => {
    if (!confirm("Type OK to reset all votes (demo only).")) return;
    setVotes({});
    setVoted(false);
    setSelectedId(null);
    localStorage.removeItem(LS_VOTES);
    localStorage.removeItem(LS_VOTED);
  };

  return (
    <div className="container">
      <h2 className="title">Vote for a Candidate</h2>
      <div className="grid">
        {candidates.map((c) => (
          <div key={c.id} className="card">
            <label className="row">
              <input
                type="radio"
                className="radio"
                name="candidate"
                value={c.id}
                checked={selectedId === c.id}
                onChange={() => setSelectedId(c.id)}
                disabled={voted}
              />
              <div>
                <div className="name">{c.name}</div>
                <div className="small">Votes: {votes[c.id] || 0}</div>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="footer">
        <button
          className="btn"
          onClick={handleVote}
          disabled={!selectedId || voted}
        >
          {voted ? "You already voted" : "Cast Vote"}
        </button>
        <button className="btn reset" onClick={resetAll}>
          Reset All
        </button>
        <span className="small">Total votes: {totalVotes}</span>
      </div>

      <h2 className="title" style={{ marginTop: 32 }}>
        Results
      </h2>
      <div className="grid">
        {candidates.map((c) => {
          const v = votes[c.id] || 0;
          const pct = totalVotes ? ((v / totalVotes) * 100).toFixed(1) : 0;
          return (
            <div key={c.id} className="card">
              <div className="row">
                <div className="name">{c.name}</div>
                <div className="small">
                  {v} votes · {pct}%
                </div>
              </div>
              <div className="progress" aria-hidden>
                <div className="bar" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="notice" style={{ marginTop: 24 }}>
        <div className="small">
          ⚠️ This is a demo. Real elections need a backend, authentication,
          audit logs, and anti-cheating.
        </div>
      </div>
    </div>
  );
}
