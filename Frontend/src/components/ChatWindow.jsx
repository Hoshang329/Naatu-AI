import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// The initial messages the user will see
const initialMessages = [
  {
    sender: 'ai',
    text: "Hi there! I'm the Naatu Ruchulu expert. I know everything about our authentic chicken pickle."
  },
  {
    sender: 'ai',
    text: "Ask me anything, or try one of these questions:"
  },
  // We'll render this one differently as clickable buttons
  {
    sender: 'ai-examples',
    text: [
      "What are the ingredients?",
      "How spicy is it?",
      "What's the shelf life?"
    ]
  }
];

function ChatWindow() {
  // We initialize the state with our welcome messages
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { sender: 'user', text: textToSend };
    // Remove example questions when user sends their first message
    const filteredMessages = messages.filter(msg => msg.sender !== 'ai-examples');
    setMessages([...filteredMessages, userMessage]);

    if (!messageText) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/ask', {
        question: textToSend,
      });
      const aiMessage = { sender: 'ai', text: response.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        sender: 'ai',
        text: "I'm sorry, I'm having a little trouble connecting. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // A new handler for the Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  }
  
  // Handler for clicking the example questions
  const handleExampleClick = (question) => {
    sendMessage(question);
  };

  return (
    <> {/* Using a Fragment <> since we have multiple top-level elements */}
      <div className="message-list" ref={messageListRef}>
        {messages.map((message, index) => {
          if (message.sender === 'ai-examples') {
            return (
              <div key={index} className="example-questions">
                {message.text.map((q, i) => (
                  <button key={i} onClick={() => handleExampleClick(q)} className="example-question">
                    {q}
                  </button>
                ))}
              </div>
            );
          }
          return (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          );
        })}
        {isLoading && (
          <div className="message ai">
            <span className="typing-indicator"></span>
          </div>
        )}
      </div>
      <div className="input-area"> {/* Changed class name to match CSS */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything about NAATU Chicken Pickle..."
          disabled={isLoading}
        />
        <button onClick={() => sendMessage()} disabled={isLoading}>Send</button>
      </div>
    </>
  );
}

export default ChatWindow;