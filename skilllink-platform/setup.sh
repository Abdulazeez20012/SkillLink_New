#!/bin/bash

echo "🚀 SkillLink Platform Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed and running."
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install

if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

echo ""
echo "🗄️  Setting up Database..."
npx prisma generate
npx prisma migrate deploy

echo ""
echo "🌱 Seeding Database..."
npm run seed

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Default credentials:"
echo "  Admin: admin@skilllink.com / Admin123!"
echo "  Facilitator: facilitator@skilllink.com / Facilitator123!"
echo ""
echo "🎉 Happy coding!"
