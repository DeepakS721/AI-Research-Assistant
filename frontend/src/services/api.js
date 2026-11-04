
const API_URL =
  "https://research-assistant-api-6iym.onrender.com/api/research/process";

export async function processResearch(content, operation) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content,
      operation
    })
  });

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  const responseText = await response.text();

  if (operation === "generateQuiz") {
    let quiz;

    try {
      quiz = JSON.parse(responseText);
    } catch {
      throw new Error("The AI did not return valid quiz JSON.");
    }

    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      throw new Error("The generated quiz contains no questions.");
    }

    return quiz;
  }

  return responseText;
}
