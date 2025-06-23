# Simple Task Manager

A simple and efficient task management web application built with the T3 Stack.

## 🚀 Features

- ✅ Create, edit, and delete tasks
- 📝 Add descriptions to tasks
- 🎯 Set task priorities (Low, Medium, High)
- ✔️ Mark tasks as completed
- 📱 Responsive design
- ⚡ Real-time updates with tRPC

## 🛠️ Tech Stack

This project is built using the T3 Stack:

- **Framework**: [Next.js](https://nextjs.org)
- **Language**: [TypeScript](https://typescriptlang.org)
- **Database**: [Prisma](https://prisma.io) with SQLite
- **API**: [tRPC](https://trpc.io)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **State Management**: [TanStack Query](https://tanstack.com/query)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/addness/simple-task-manager.git
   cd simple-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   └── trpc/      # tRPC API handlers
│   ├── _app.tsx       # App wrapper
│   └── index.tsx      # Home page
├── server/            # Server-side code
│   ├── api/           # tRPC routers
│   │   ├── routers/   # API route handlers
│   │   ├── root.ts    # Main router
│   │   └── trpc.ts    # tRPC setup
│   └── db.ts          # Database connection
├── styles/            # Global styles
└── utils/             # Utility functions
    └── api.ts         # tRPC client setup
```

## 🗄️ Database Schema

The application uses a simple database schema with a single `Task` model:

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Built with ❤️ using the T3 Stack
