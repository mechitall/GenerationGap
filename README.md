# Family Connect App 🌟

A modern web application designed to bridge the communication gap between parents and teenagers through shared journaling and AI-powered therapeutic insights.

## 🎯 Mission

Family Connect aims to strengthen family bonds by creating a safe, private space where both parents and teenagers can express their thoughts, feelings, and experiences. Our AI therapist provides gentle guidance to help families understand each other better and improve communication.

## ✨ Features

- **Shared Journaling**: Create private family spaces for open communication
- **AI Therapy Insights**: Get professional guidance from our AI therapist using OpenRouter models
- **Mood Tracking**: Express emotions through intuitive mood selection
- **Family Profiles**: Set up personalized family spaces with parent and teen profiles
- **Real-time Updates**: See new entries and insights as they're added
- **Responsive Design**: Beautiful, modern interface that works on all devices
- **Privacy-First**: Secure, private family spaces with no data sharing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd family-connect-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend client (port 3000).

### Production Build

```bash
npm run build
```

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Server**: Express.js with security middleware
- **AI Integration**: OpenRouter API for therapeutic insights
- **Data Storage**: In-memory storage (can be extended to use databases)
- **Security**: Helmet, CORS, rate limiting

### Frontend (React/TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Custom CSS with CSS variables and utility classes
- **Animations**: Framer Motion for smooth interactions
- **State Management**: React Context for family data
- **Routing**: React Router for navigation

## 📱 Usage

### 1. Family Setup
- Navigate to `/setup`
- Enter family name, parent name, and teen name
- Create your family profile

### 2. Journal Entries
- Click "New Journal Entry" to share thoughts
- Select your role (parent or teen)
- Choose your current mood
- Write your thoughts and feelings
- Submit to get AI insights

### 3. AI Insights
- Each entry automatically receives therapeutic guidance
- Insights focus on understanding and communication
- Gentle, supportive advice for family growth

## 🔧 Configuration

### OpenRouter Models
The app uses OpenRouter to access various AI models. You can modify the model in `server/index.js`:

```javascript
model: 'anthropic/claude-3.5-sonnet' // Default model
```

Available models include:
- `anthropic/claude-3.5-sonnet` (recommended)
- `openai/gpt-4`
- `google/gemini-pro`
- And many more via OpenRouter

### Customization
- Modify colors in `client/src/index.css` CSS variables
- Adjust AI prompts in `server/index.js`
- Customize mood options in `client/src/pages/JournalPage.tsx`

## 🛡️ Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Protection**: Secure cross-origin requests
- **Helmet Security**: HTTP security headers
- **Private Family Spaces**: Isolated data per family

## 🚀 Deployment

### Environment Variables
Ensure these are set in production:
```env
NODE_ENV=production
PORT=5000
OPENROUTER_API_KEY=your_production_key
```

### Database Integration
For production, consider replacing in-memory storage with:
- PostgreSQL
- MongoDB
- Redis
- Or any other database of your choice

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenRouter**: For providing access to multiple AI models
- **React Community**: For the amazing framework
- **Families**: For inspiring this project and helping us understand the importance of communication

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check our documentation
- Reach out to our team

---

**Made with ❤️ for families everywhere**

*Family Connect - Bridging generations, one conversation at a time.*