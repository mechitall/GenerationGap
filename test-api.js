const OpenAI = require('openai');
require('dotenv').config();

// Test script to verify OpenRouter API connection
async function testAPI() {
    console.log('Testing OpenRouter API connection...\n');

    if (!process.env.OPENROUTER_API_KEY) {
        console.error('❌ Error: OPENROUTER_API_KEY is not set in .env file');
        console.log('\nPlease follow these steps:');
        console.log('1. Sign up at https://openrouter.ai/');
        console.log('2. Generate an API key from your dashboard');
        console.log('3. Add it to your .env file');
        return;
    }

    const client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'GenerationGap AI Therapist Test',
        }
    });

    try {
        console.log('Sending test message to Gemini model...\n');
        
        const completion = await client.chat.completions.create({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant. Respond briefly.'
                },
                {
                    role: 'user',
                    content: 'Hello! Can you confirm you are working through OpenRouter?'
                }
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        console.log('✅ Success! API is working correctly.\n');
        console.log('Response from Gemini:');
        console.log(completion.choices[0].message.content);
        console.log('\nYou can now start the server with: npm start');

    } catch (error) {
        console.error('❌ Error connecting to OpenRouter API:\n');
        
        if (error.response?.status === 401) {
            console.error('Authentication failed. Please check your API key.');
        } else if (error.response?.status === 429) {
            console.error('Rate limit exceeded. Please try again later.');
        } else {
            console.error(error.message);
        }

        console.log('\nTroubleshooting steps:');
        console.log('1. Verify your API key is correct in the .env file');
        console.log('2. Check if you have credits in your OpenRouter account');
        console.log('3. Ensure the free Gemini model is available in your region');
    }
}

testAPI();