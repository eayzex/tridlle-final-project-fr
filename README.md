# Triddle - Modern Form Builder

Triddle is a professional form builder application with smooth animations and intuitive UX.

## Project Structure

The project is divided into two main parts:

- **Frontend**: Next.js application with React, TailwindCSS, and Framer Motion
- **Backend**: Express.js API with MongoDB database

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Set up the backend:

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
npm run dev
\`\`\`

3. Set up the frontend:

\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local if your backend is not running on the default port
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- User authentication (signup, login, logout)
- Create, edit, and delete forms
- Drag and drop form builder
- Share forms with public links
- Collect and view form responses
- Dark/light mode toggle
- Mobile-first responsive design

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- TailwindCSS
- Framer Motion
- ShadCN UI Components

### Backend
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- TypeScript

## License

MIT
