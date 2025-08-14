#!/bin/bash

echo "🚀 Setting up IR Dev Test Vue 3 project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Project setup complete!"
    echo ""
    echo "To start development:"
    echo "  npm run dev"
    echo ""
    echo "To build for production:"
    echo "  npm run build"
    echo ""
    echo "Happy coding! 🚀"
else
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi
