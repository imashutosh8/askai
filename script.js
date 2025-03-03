async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    let userMessage = inputField.value.trim();
    if (!userMessage) return;

    displayMessage(userMessage, "user-message");
    inputField.value = "";

    let loadingDiv = document.createElement("div");
    loadingDiv.className = "message bot-message loading";
    loadingDiv.textContent = "Thinking...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const API_KEY = 'AIzaSyAxqawdV2oEBY9dMF75nnoFpcLKSsQm8lg'; // Replace with your actual Gemini API key
        const MODEL_NAME = 'gemini-pro';

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAxqawdV2oEBY9dMF75nnoFpcLKSsQm8lg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage,
                    }],
                }],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
        chatBox.removeChild(loadingDiv);
        displayMessage(botReply, "bot-message");
    } catch (error) {
        chatBox.removeChild(loadingDiv);
        displayMessage("Error: " + error.message, "bot-message");
    }
}

function displayMessage(text, className) {
    const chatBox = document.getElementById("chatBox");
    let messageDiv = document.createElement("div");
    messageDiv.className = "message " + className;
    messageDiv.innerHTML = marked.parse(text);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
