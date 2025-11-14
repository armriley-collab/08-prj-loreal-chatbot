/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// Add your Cloudflare worker URL here
const CLOUDFLARE_API_URL = "https://loreal-api.armriley.workers.dev/"; // <-- Replace with your Cloudflare URL

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Show user's message
  chatWindow.textContent = userMessage;

  // Prepare messages array for OpenAI API
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant for L'Oréal's product catalog.",
    },
    { role: "user", content: userMessage },
  ];

  // Make request to Cloudflare worker
  try {
    const response = await fetch(CLOUDFLARE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you get a 401 error, you may need to add an authorization header below:
        // "Authorization": "Bearer YOUR_API_KEY"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
      }),
    });
    const data = await response.json();
    // Show bot's reply from OpenAI response
    chatWindow.textContent = data.choices[0].message.content;
  } catch (error) {
    // If you see a 401 error in the console, it means "Unauthorized".
    // Check if your Cloudflare worker or API needs an API key or authentication.
    chatWindow.textContent =
      "Sorry, there was a problem connecting to the chatbot. (Check for API key or authentication requirements.)";
  }
});
