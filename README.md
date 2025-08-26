# GenerationGap AI Therapist

An AI-powered therapist application that uses Google's Gemini model through OpenRouter to provide supportive mental health conversations.

## Features

- 🤖 AI-powered therapeutic conversations using Google Gemini 2.0 Flash (free tier)
- 💬 Real-time chat interface with a modern, accessible design
- 🔒 Privacy-focused: conversations are not permanently stored
- 🎨 Beautiful, responsive UI with calming colors and smooth animations
- ⚡ Fast responses with typing indicators
- 🧹 Clear conversation feature to start fresh

## Technology Stack

- **Backend**: Node.js with Express
- **AI Model**: Google Gemini 2.0 Flash (free) via OpenRouter API
- **Frontend**: Vanilla JavaScript with modern CSS
- **API Client**: OpenAI SDK (compatible with OpenRouter)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenRouter API key (free tier available)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GenerationGap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your OpenRouter API key:
     ```
     OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```

4. **Get your OpenRouter API key**
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Go to your dashboard and generate an API key
   - Note: The free Gemini model may have rate limits

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Start chatting with the AI therapist!

## Usage

1. Type your message in the text area at the bottom
2. Press Enter or click Send to send your message
3. The AI therapist will respond with supportive and helpful messages
4. Click Clear to start a new conversation

## Important Notes

⚠️ **Disclaimer**: This AI therapist is not a replacement for professional mental health care. It's designed to provide supportive conversation and general guidance. For serious mental health concerns, please consult with a qualified mental health professional.

## API Configuration

The application uses the free tier of Google's Gemini model through OpenRouter:
- Model: `google/gemini-2.0-flash-exp:free`
- Rate limits may apply based on OpenRouter's free tier
- Consider upgrading to a paid tier for production use

## Project Structure

```
GenerationGap/
├── server.js           # Express server and API endpoints
├── package.json        # Node.js dependencies
├── .env.example       # Environment variables template
├── public/            # Frontend files
│   ├── index.html    # Main HTML page
│   ├── styles.css    # Styling
│   └── script.js     # Frontend JavaScript
└── README.md         # This file
```

## Security Considerations

- API keys should never be exposed in the frontend
- Conversations are stored in memory and cleared on server restart
- For production, implement proper session management and data persistence
- Consider implementing rate limiting and user authentication

## Future Enhancements

- [ ] Add user authentication
- [ ] Implement conversation history with database storage
- [ ] Add more therapeutic techniques and resources
- [ ] Support for multiple languages
- [ ] Voice input/output capabilities
- [ ] Integration with crisis hotline resources
- [ ] Analytics and conversation insights

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.