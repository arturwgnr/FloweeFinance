import { useState } from "react";

import "../styles/AiFinanceChat.css";

export default function AiFinanceChat() {
  const username = localStorage.getItem("username");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I'm Sage, your Flowee Assistant 💬" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function generateResponse(text) {
    const lower = text.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
      return `Hey ${username} 👋 How can I help you with your finances today?`;
    }

    if (lower.includes("spent") && lower.includes("food")) {
      return "Looks like you want to know about Food expenses. I’ll check that for you soon!";
    }

    if (lower.includes("balance")) {
      return "Your current balance is being calculated... (I don't know yet BUNHEE!!!)";
    }
    if (lower.includes("burra")) {
      return "WHAT? You are a prick!!! I'm done! 😠";
    }

    return "I'm still learning to understand that, but I'm getting smarter every day 🌱";
  }

  function handleSend() {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    const aiResponse = generateResponse(input);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "ai" ? "ai" : "user"}`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="message ai typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
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
