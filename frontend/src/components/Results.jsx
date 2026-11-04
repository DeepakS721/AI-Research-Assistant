
function Results({ title, subtitle, content, loading, error }) {
  return (
    <section className="section results-section">
      <div className="section-heading">
        <span className="section-icon">▥</span>
        <h2>Results</h2>
        <span className="status-dot"></span>
      </div>

      <p className="section-description">
        {subtitle || "Your AI-generated results will appear here."}
      </p>

      <div className="results-content" aria-live="polite">
        {loading && (
          <div className="empty-state">
            <span className="empty-icon">⏳</span>
            <p>{subtitle || "Processing your selected text..."}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && content && (
          <div className="result-block formatted-result">
            <h3 className="result-title">{title}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{content}</p>
          </div>
        )}

        {!loading && !error && !content && (
          <div className="empty-state">
            <span className="empty-icon">▤ ✦</span>
            <p>Select text on a webpage and start exploring.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Results;
