
function ResearchTools({ onProcess, loading }) {
  const tools = [
    {
      operation: "summarize",
      icon: "▤",
      title: "Summarize Selected Text",
      className: "summarize"
    },
    {
      operation: "analyzeGaps",
      icon: "⌕",
      title: "Analyze Research Gaps",
      className: "analyze"
    },
    {
      operation: "generateQuiz",
      icon: "🧠",
      title: "Generate Active Recall Quiz",
      className: "quiz"
    }
  ];

  return (
    <section className="tool-card">
      <h2>✧ AI Research Tools</h2>

      <p className="section-description">
        Select text on any webpage, then choose a tool to get AI-powered insights.
      </p>

      <div className="tool-grid">
        {tools.map((tool) => (
          <button
            key={tool.operation}
            className={`tool-button ${tool.className}`}
            onClick={() => onProcess(tool.operation)}
            disabled={loading}
          >
            <span className="tool-icon">{tool.icon}</span>

            <span>{tool.title}</span>

            <span className="tool-arrow">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ResearchTools;
