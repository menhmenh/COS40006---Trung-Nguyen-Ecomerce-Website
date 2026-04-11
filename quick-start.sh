#!/bin/bash
# FR15 Quick Start Script
# Run this to test FR15 locally before deployment

set -e

echo "🚀 FR15 Coffee Subscription System - Quick Start"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Setup
echo -e "${BLUE}📦 Step 1: Backend Setup${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Building TypeScript..."
npm run build

echo -e "${GREEN}✅ Backend built successfully${NC}"
echo ""

# Database Migration
echo -e "${BLUE}📊 Step 2: Database Migration${NC}"
echo "Running database migration..."
npm run migrate

echo -e "${GREEN}✅ Database initialized${NC}"
echo ""

# Frontend Setup
echo -e "${BLUE}🎨 Step 3: Frontend Setup${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo -e "${GREEN}✅ Frontend ready${NC}"
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✨ FR15 Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. ${BLUE}Start Backend:${NC}"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. ${BLUE}Start Frontend (new terminal):${NC}"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. ${BLUE}Open Browser:${NC}"
echo "   http://localhost:3000/account"
echo ""
echo "4. ${BLUE}Test Features:${NC}"
echo "   - Create subscription"
echo "   - View subscription dashboard"
echo "   - Check invoices"
echo "   - Manage payment methods"
echo ""
echo -e "${GREEN}Happy Testing! 🎉${NC}"
