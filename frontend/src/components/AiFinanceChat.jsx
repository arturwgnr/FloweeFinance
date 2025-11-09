import { useState, useEffect } from "react";

import "../styles/AiFinanceChat.css";

export default function AiFinanceChat() {
  const username = localStorage.getItem("username");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I'm Sage, your Flowee Assistant 💬" },
  ]);
  const [input, setInput] = useState("");

  function generateResponse(text) {
    const lower = text.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hey there 👋 How can I help you with your finances today?";
    }

    if (lower.includes("spent") && lower.includes("food")) {
      return "Looks like you want to know about Food expenses. I’ll check that for you soon!";
    }

    if (lower.includes("balance")) {
      return "Your current balance is being calculated... (mock data)";
    }

    return "I'm still learning to understand that, but I'm getting smarter every day 🌱";
  }

  function handleSend() {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    const aiResponse = generateResponse(input);
    setMessages((prev) => [
      ...prev,
      newMessage,
      { sender: "ai", text: aiResponse },
    ]);

    setInput("");
  }

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "ai" ? "ᨒ Sage" : `${username}`
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
