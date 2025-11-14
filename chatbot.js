// Get references to DOM elements
const form = document.getElementById("chatbox-form");
const input = document.getElementById("chatbox-input");
const messages = document.getElementById("chatbox-messages");

// Function to add a message to the chat area
function addMessage(text, sender) {
  // Create a new div for the message
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  messages.appendChild(msgDiv);
  // Scroll to the bottom so new messages are visible
  messages.scrollTop = messages.scrollHeight;
}

// Function to get a response from the chatbot (using OpenAI API)
async function getBotResponse(userMessage) {
  // Add a comment to explain the API call
  // This uses OpenAI's API with the 'messages' parameter
  const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your actual API key
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  // Prepare the messages array for the API
  const messagesArr = [
    {
      role: "system",
      content:
        "You are a helpful assistant for L'Oréal's product catalog. Give tailored recommendations and answer questions about L'Oréal products.",
    },
    { role: "user", content: userMessage },
  ];

  // Make the API request using fetch and async/await
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Use gpt-4o model
        messages: messagesArr,
      }),
    });
    const data = await response.json();
    // Get the bot's reply from the response
    const botReply = data.choices[0].message.content;
    return botReply;
  } catch (error) {
    // If there's an error, show a friendly message
    return "Sorry, I couldn't connect to the chatbot. Please try again later.";
  }
}

// Handle form submission (when user sends a message)
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent page reload
  const userMessage = input.value.trim();
  if (userMessage === "") return; // Ignore empty messages

  // Add user's message to chat
  addMessage(userMessage, "user");
  input.value = ""; // Clear input

  // Show bot is typing...
  addMessage("Typing...", "bot");

  // Get bot response
  const botReply = await getBotResponse(userMessage);

  // Remove 'Typing...' message
  const typingMsg = messages.querySelector(".message.bot:last-child");
  if (typingMsg && typingMsg.textContent === "Typing...") {
    messages.removeChild(typingMsg);
  }

  // Add bot's reply to chat
  addMessage(botReply, "bot");
});
