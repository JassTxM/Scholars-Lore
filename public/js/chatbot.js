document.addEventListener('DOMContentLoaded', async function () {
    // 1. SELECT ELEMENTS
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const minimizeButton = document.getElementById('minimize-chat');
    const closeButton = document.getElementById('close-chat');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chatbot-messages');
    const typingIndicator = document.getElementById('chatbot-typing');

    // 2. FETCH CONFIG FROM SERVER (To get your .env values safely)
    let API_URL = "";
    try {
        const configRes = await fetch('/config');
        const config = await configRes.json();
        API_URL = `https://generativelanguage.googleapis.com/v1/models/${config.model}:generateContent?key=${config.apiKey}`;
    } catch (err) {
        console.error("Could not load chatbot configuration:", err);
    }

    // 3. TOGGLE VISIBILITY
    chatbotButton.addEventListener('click', () => {
        const currentDisplay = window.getComputedStyle(chatbotPanel).display;
        if (currentDisplay === 'none') {
            chatbotPanel.style.display = 'flex';
            chatbotPanel.style.flexDirection = 'column';
            userInput.focus();
        } else {
            chatbotPanel.style.display = 'none';
        }
    });

    minimizeButton.addEventListener('click', () => chatbotPanel.style.display = 'none');
    closeButton.addEventListener('click', () => chatbotPanel.style.display = 'none');

    // 4. MESSAGE HANDLING
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message !== '') {
            addMessage(message, 'user');
            userInput.value = '';
            showTypingIndicator();

            getBotResponse(message)
                .then(response => {
                    hideTypingIndicator();
                    addMessage(response, 'bot');
                })
                .catch(() => {
                    hideTypingIndicator();
                    addMessage("Oops! Something went wrong. Try again.", 'bot');
                });
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'bot' ? 'bot-message' : 'user-message';
        
        if (sender === 'bot') {
            addTypingMessage(text);
        } else {
            messageDiv.innerText = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function addTypingMessage(fullText) {
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-message typing-message';
        chatMessages.appendChild(botMsg);

        let index = 0;
        const typingInterval = setInterval(() => {
            botMsg.innerHTML = fullText.slice(0, index) + '<span class="blinking-cursor">|</span>';
            index++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            if (index > fullText.length) {
                clearInterval(typingInterval);
                botMsg.innerHTML = fullText;
            }
        }, 30); 
    }

    function showTypingIndicator() {
        typingIndicator.innerHTML = `
            <div class="thinking-message">
                <span>Scholar is thinking</span>
                <span class="thinking-dots"></span>
            </div>
        `;
        // Inject styles only if they don't exist
        if (!document.getElementById('thinking-style')) {
            const style = document.createElement('style');
            style.id = 'thinking-style';
            style.textContent = `
                .thinking-message { display: flex; align-items: center; background-color: #ffffff; border-radius: 18px; padding: 8px 12px; font-size: 14px; color: #f9c87b; }
                .thinking-dots::after { content: '...'; display: inline-block; overflow: hidden; width: 0; animation: thinking 1.5s infinite steps(4); }
                @keyframes thinking { 0% { width: 0; } 100% { width: 24px; } }
                .blinking-cursor { font-weight: bold; animation: blink 1s step-start infinite; }
                @keyframes blink { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }
            `;
            document.head.appendChild(style);
        }
    }

    function hideTypingIndicator() { typingIndicator.innerHTML = ''; }

    function isInappropriate(message) {
        const keywords = ['stupid', 'idiot', 'hate', 'racist', 'sex', 'disrespect', 'offensive'];
        return keywords.some(key => message.toLowerCase().includes(key));
    }

    function getBotResponse(message) {
        const lower = message.toLowerCase();
        if (isInappropriate(message)) {
            return Promise.resolve("Let's keep the conversation respectful and educational.");
        }

        const replies = {
            "your name": "I'm Scholar, your AI guide to learning on Scholar's Lore.",
            "hello": "Hello! How can I support your studies today?",
            "joke": "Why did the student eat their homework? Because the teacher said it was a piece of cake!"
        };

        for (let key in replies) {
            if (lower.includes(key)) return Promise.resolve(replies[key]);
        }

        const systemPrompt = "You are Scholar, an AI educator. Professional, clear, supportive. Max 30 words.";

        return fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }]
            })
        })
        .then(res => res.json())
        .then(data => data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting to my brain. Try again?");
    }
});