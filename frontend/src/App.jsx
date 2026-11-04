
import { useEffect, useState } from "react";

import Header from "./components/Header";
import ResearchTools from "./components/ResearchTools";
import Results from "./components/Results";
import ResearchNotes from "./components/ResearchNotes";
import Quiz from "./components/Quiz";

import { processResearch } from "./services/api";
import {
  getStoredData,
  saveStoredData
} from "./services/chromeStorage";

function App() {
  const [notes, setNotes] = useState("");
  const [notesStatus, setNotesStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // Restore notes from Chrome Storage.
  useEffect(() => {
    async function restoreNotes() {
      try {
        const data = await getStoredData([
          "researchNotes",
          "quizHistory"
        ]);

        setNotes(data.researchNotes || "");
      } catch (err) {
        console.error("Unable to restore notes:", err);
      }
    }

    restoreNotes();
  }, []);

  // Get selected text from the active webpage.
  async function getSelectedText() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tabs.length || !tabs[0].id) {
      throw new Error("No active browser tab was found.");
    }

    const response = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => window.getSelection()?.toString().trim() || ""
    });

    return response?.[0]?.result || "";
  }

  // Process the selected text using the existing backend.
  async function handleProcess(operation) {
    setLoading(true);
    setError("");
    setContent("");
    setCurrentQuiz(null);
    setTitle("");

    setSubtitle("Processing your selected text...");

    try {
      const selectedText = await getSelectedText();

      if (!selectedText) {
        throw new Error(
          "No text selected. Select text on a webpage first."
        );
      }

      const result = await processResearch(
        selectedText,
        operation
      );

      if (operation === "generateQuiz") {
        setCurrentQuiz(result);
        setSubtitle(result.title || "Active Recall Quiz");
      } else {
        setTitle(
          operation === "summarize"
            ? "Summary"
            : "Research Gaps & Limitations"
        );

        setContent(result);
        setSubtitle(
          operation === "summarize"
            ? "Summary"
            : "Research Gaps & Limitations"
        );
      }
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );

      setSubtitle("Unable to complete the request");
    } finally {
      setLoading(false);
    }
  }

  // Save quiz results in Chrome Storage.
  async function handleQuizComplete(result) {
    try {
      const data = await getStoredData(["quizHistory"]);

      const history = Array.isArray(data.quizHistory)
        ? data.quizHistory
        : [];

      history.push({
        date: new Date().toISOString(),
        score: result.score,
        total: result.total,
        incorrectTopics: result.incorrectTopics
      });

      await saveStoredData({ quizHistory: history });
    } catch (err) {
      console.error("Unable to save quiz history:", err);
    }
  }

  // Save research notes.
  async function handleSaveNotes() {
    try {
      await saveStoredData({ researchNotes: notes });
      setNotesStatus("Notes saved successfully!");
    } catch (err) {
      setNotesStatus("Unable to save notes.");
    }
  }

  // Clear research notes.
  async function handleClearNotes() {
    setNotes("");

    try {
      await saveStoredData({ researchNotes: "" });
      setNotesStatus("Notes cleared.");
    } catch (err) {
      setNotesStatus("Unable to clear notes.");
    }
  }

  return (
    <main className="app">

      <Header />

      <ResearchTools
        onProcess={handleProcess}
        loading={loading}
      />

      {currentQuiz && !loading ? (
        <section className="section results-section">
          <div className="section-heading">
            <h2>Results</h2>
            <span className="status-dot"></span>
          </div>

          <p className="section-description">
            {subtitle}
          </p>

          <div className="results-content">
            <Quiz
              quiz={currentQuiz}
              onComplete={handleQuizComplete}
            />
          </div>
        </section>
      ) : (
        <Results
          title={title}
          subtitle={subtitle}
          content={content}
          loading={loading}
          error={error}
        />
      )}

      <ResearchNotes
        notes={notes}
        setNotes={setNotes}
        onSave={handleSaveNotes}
        onClear={handleClearNotes}
        notesStatus={notesStatus}
      />

      <footer>
        <p>AI-generated results may need verification.</p>
      </footer>

    </main>
  );
}

export default App;
