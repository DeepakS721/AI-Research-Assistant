
function ResearchNotes({
  notes,
  setNotes,
  onSave,
  onClear,
  notesStatus
}) {
  return (
    <section className="section notes-section">
      <div className="section-heading">
        <span className="section-icon">✎</span>
        <h2>Research Notes</h2>
      </div>

      <p className="section-description">
        Write, save, and manage your key takeaways.
      </p>

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Write your research notes here..."
        rows={6}
      />

      <div className="notes-actions">
        <button
          className="secondary-button"
          onClick={onSave}
        >
          ♧ Save Notes
        </button>

        <button
          className="clear-button"
          onClick={onClear}
        >
          ♜ Clear Notes
        </button>
      </div>

      <p className="status-message" role="status">
        {notesStatus}
      </p>
    </section>
  );
}

export default ResearchNotes;
