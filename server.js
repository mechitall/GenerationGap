const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenRouter client
const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '',
    defaultHeaders: {
        'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:3000',
        'X-Title': 'GenerationGap AI Therapist',
    }
});

// Store conversation history in memory (in production, use a database)
const conversations = new Map();

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Therapist API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: 'Message and sessionId are required' });
        }

        // Get or create conversation history
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                {
                    role: 'system',
                    content: `You are a compassionate and professional AI therapist. Your role is to:
1. Listen actively and empathetically to users' concerns
2. Provide supportive responses without diagnosing or prescribing medication
3. Use evidence-based therapeutic techniques like CBT, mindfulness, and active listening
4. Encourage users to seek professional help when appropriate
5. Maintain confidentiality and create a safe space for discussion
6. Ask clarifying questions to better understand the user's situation
7. Validate feelings while offering constructive perspectives

Remember: You are not a replacement for professional therapy. Always encourage users to seek professional help for serious mental health concerns.`
                }
            ]);
        }

        const conversationHistory = conversations.get(sessionId);
        conversationHistory.push({ role: 'user', content: message });

        // Make request to Gemini model through OpenRouter
        const completion = await client.chat.completions.create({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 500,
        });

        const aiResponse = completion.choices[0].message.content;
        conversationHistory.push({ role: 'assistant', content: aiResponse });

        // Limit conversation history to last 20 messages to prevent token overflow
        if (conversationHistory.length > 21) {
            const systemMessage = conversationHistory[0];
            conversationHistory.splice(1, 2);
        }

        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        
        // Handle specific error types
        if (error.response?.status === 401) {
            res.status(401).json({ 
                error: 'Authentication failed. Please check your OpenRouter API key.' 
            });
        } else if (error.response?.status === 429) {
            res.status(429).json({ 
                error: 'Rate limit exceeded. Please try again later.' 
            });
        } else {
            res.status(500).json({ 
                error: 'An error occurred while processing your request. Please try again.' 
            });
        }
    }
});

// Clear conversation endpoint
app.post('/api/clear', (req, res) => {
    const { sessionId } = req.body;
    if (sessionId && conversations.has(sessionId)) {
        conversations.delete(sessionId);
        res.json({ message: 'Conversation cleared' });
    } else {
        res.status(400).json({ error: 'Invalid sessionId' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`AI Therapist server is running on http://localhost:${PORT}`);
    if (!process.env.OPENROUTER_API_KEY) {
        console.warn('WARNING: OPENROUTER_API_KEY is not set. Please set it in your .env file.');
    }
});