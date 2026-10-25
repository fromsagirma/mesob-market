import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is required.");
      return;
    }
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (data.models) {
      console.log(data.models.map(m => m.name).join("\n"));
    } else {
      console.log("No models returned:", data);
    }
  } catch (error) {
    console.error("List error:", error.message);
  }
}
listModels();
