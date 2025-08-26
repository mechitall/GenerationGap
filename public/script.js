// Generate a unique session ID for this user
const sessionId = generateSessionId();

// DOM elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearButton');
const typingIndicator = document.getElementById('typingIndicator');

// Event listeners
sendButton.addEventListener('click', sendMessage);
clearButton.addEventListener('click', clearConversation);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
});

// Generate session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Send message to the API
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Clear input and disable send button
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendButton.disabled = true;

    // Add user message to chat
    addMessage(message, 'user');

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send message to API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                sessionId: sessionId
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Add AI response to chat
            addMessage(data.response, 'assistant');
        } else {
            // Show error message
            addMessage(data.error || 'Sorry, an error occurred. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I couldn\'t connect to the server. Please check your connection and try again.', 'error');
    } finally {
        // Hide typing indicator and re-enable send button
        hideTypingIndicator();
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.classList.add('active');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

// Clear conversation
async function clearConversation() {
    if (!confirm('Are you sure you want to clear the conversation? This cannot be undone.')) {
        return;
    }

    try {
        // Clear conversation on server
        await fetch('/api/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: sessionId }),
        });

        // Clear messages from UI
        messagesContainer.innerHTML = '';
        
        // Add welcome message
        addMessage('Conversation cleared. How can I help you today?', 'assistant');
    } catch (error) {
        console.error('Error clearing conversation:', error);
        addMessage('Sorry, I couldn\'t clear the conversation. Please refresh the page.', 'error');
    }
}

// Initial welcome message
window.addEventListener('DOMContentLoaded', () => {
    addMessage('Hello! I\'m here to listen and support you. Whatever you\'re going through, you can share it with me in a safe and judgment-free space. How are you feeling today?', 'assistant');
    messageInput.focus();
});