
import { useState } from "react";

function Quiz({ quiz, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function handleAnswer(questionIndex, optionIndex) {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: optionIndex
    }));
  }

  function checkAnswers() {
    let score = 0;
    const incorrectTopics = [];

    quiz.questions.forEach((question, index) => {
      const selected = answers[index];
      const correct = Number(question.correctAnswer);

      if (selected === correct) {
        score++;
      } else {
        incorrectTopics.push(
          question.topic || question.question
        );
      }
    });

    const quizResult = {
      score,
      total: quiz.questions.length,
      incorrectTopics
    };

    setResult(quizResult);
    onComplete(quizResult);
  }

  return (
    <div className="quiz-container">
      <h3>{quiz.title || "Active Recall Quiz"}</h3>

      {quiz.questions.map((question, index) => (
        <div className="quiz-question" key={index}>
          <h3>
            {index + 1}. {question.question}
          </h3>

          {question.options.map((option, optionIndex) => (
            <label className="quiz-option" key={optionIndex}>
              <input
                type="radio"
                name={`question-${index}`}
                value={optionIndex}
                checked={answers[index] === optionIndex}
                disabled={result !== null}
                onChange={() => handleAnswer(index, optionIndex)}
              />

              <span>{option}</span>
            </label>
          ))}

          {result && (
            <div className="quiz-feedback">
              {answers[index] === Number(question.correctAnswer)
                ? "Correct! "
                : "Incorrect. "}

              Answer: {question.options[Number(question.correctAnswer)]}.
              {" "}

              {question.explanation || ""}
            </div>
          )}
        </div>
      ))}

      {!result ? (
        <button
          className="check-answers-button"
          onClick={checkAnswers}
          disabled={
            Object.keys(answers).length !== quiz.questions.length
          }
        >
          Check Answers
        </button>
      ) : (
        <button className="check-answers-button" disabled>
          Score: {result.score} / {result.total}
        </button>
      )}
    </div>
  );
}

export default Quiz;
