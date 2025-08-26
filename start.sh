#!/bin/bash

echo "🌟 Starting Family Connect App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install dependencies if node_modules don't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
    echo ""
fi

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    echo "⚠️  Environment file not found!"
    echo "📝 Please create server/.env file with your OpenRouter API key:"
    echo "   OPENROUTER_API_KEY=your_api_key_here"
    echo ""
    echo "🔑 Get your API key from: https://openrouter.ai/"
    echo ""
    read -p "Press Enter to continue anyway..."
    echo ""
fi

echo "🚀 Starting the application..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the application
npm run dev