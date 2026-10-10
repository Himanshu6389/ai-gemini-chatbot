# 🤖 AI Gemini Chatbot

### Your intelligent AI conversation partner, powered by Google Gemini.

<p align="center">
  <a href="https://ai-gemini-chatbot-rho.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20App-00C853?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Google-Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" alt="Google Gemini">
  <img src="https://img.shields.io/badge/Database-Neon-00E599?style=flat-square&logo=postgresql&logoColor=black" alt="Neon PostgreSQL">
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Vercel">
</p>

A modern, responsive AI chatbot built with **Next.js, TypeScript, React, and Google Gemini**. The application provides an interactive chat experience with user authentication, persistent conversations, and a clean user interface.

<p align="center">
  <a href="https://ai-gemini-chatbot-rho.vercel.app"><strong>🚀 Live Demo</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Himanshu6389/ai-gemini-chatbot"><strong>📂 Source Code</strong></a>
</p>

---

## ✨ Features

- 🧠 **AI-Powered Conversations** — Generate AI responses using Google's Gemini models.
- 🔐 **User Authentication** — Authentication and account management powered by Clerk.
- 💬 **Conversation Management** — Store and retrieve conversations with database-backed persistence.
- 🗄️ **Persistent Data Storage** — Neon PostgreSQL with Drizzle ORM for database operations.
- ⚡ **API Rate Limiting** — Upstash Redis helps control request frequency.
- 📱 **Responsive Interface** — Designed to work across desktop and mobile screen sizes.
- 🎨 **Modern UI** — Clean layouts, interactive components, and a polished landing page.
- 🛡️ **Request Validation** — Input validation and API error handling.
- ☁️ **Cloud Deployment** — Deployed on Vercel and accessible through a web browser.

## 🌐 Live Application

**Try the chatbot:** [ai-gemini-chatbot-rho.vercel.app](https://ai-gemini-chatbot-rho.vercel.app)

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | Application framework and routing |
| [React](https://react.dev/) | Interactive user interface |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | Styling and responsive layouts |
| [Google Gemini](https://ai.google.dev/) | AI response generation |
| [Clerk](https://clerk.com/) | Authentication and user management |
| [Neon PostgreSQL](https://neon.tech/) | Persistent database storage |
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe database queries |
| [Upstash Redis](https://upstash.com/) | API rate limiting |
| [Vercel](https://vercel.com/) | Hosting and deployment |

## 🏗️ How It Works

1. **Authentication:** Users sign in through Clerk.
2. **Prompt submission:** Users enter a message in the chat interface.
3. **Backend processing:** The API handles incoming requests and validation.
4. **AI generation:** Google Gemini generates a response.
5. **Conversation storage:** The database layer supports saving and retrieving conversation data.
6. **Rate limiting:** Upstash Redis helps control request frequency according to the configured rules.

## 📁 Project Structure

The project follows the Next.js App Router architecture.

```text
ai-gemini-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   └── conversations/
│   ├── chat/
│   ├── sign-in/
│   └── sign-up/
├── components/
├── lib/
├── public/
├── drizzle.config.ts
├── next.config.ts
├── package.json
└── README.md
```

*Note: This is a representative overview. Your actual directories and files may differ.*

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm
- Google Gemini API key
- Clerk application credentials
- Neon PostgreSQL database
- Upstash Redis credentials

### 1. Clone the Repository

```bash
git clone https://github.com/Himanshu6389/ai-gemini-chatbot.git
cd ai-gemini-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project's root directory and configure the following variables with credentials from the relevant services:

```env
CLERK_SECRET_KEY=
DATABASE_URL=
DATABASE_URL_UNPOOLED=
GEMINI_API_KEY=
NEON_BRANCH=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
UPSTASH_REDIS_REST_TOKEN=
UPSTASH_REDIS_REST_URL=
```

**Security reminder:** Never commit `.env.local` or publish API keys, database credentials, or authentication secrets.

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server after building |
| `npm run lint` | Check code quality with ESLint |

## 🔒 Security Best Practices

- Store sensitive credentials in environment variables.
- Keep `.env.local` out of version control.
- Configure environment variables separately for local development and deployment.
- Apply appropriate rate limits to API endpoints.
- Never expose server-side secrets in client-side code.
- Review authentication and database access permissions.

## ☁️ Deployment

This application is deployed using **Vercel**.

To deploy your own instance:

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables in the project settings.
3. Deploy using the Next.js defaults.
4. Review the build logs and test the deployed application.

Updates pushed to the configured production branch can trigger automatic deployments.

## 🧪 Quality Checks

Run these commands before publishing changes:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

These checks help identify linting issues, TypeScript errors, and production-build problems.

## 🔮 Future Improvements

Potential enhancements include:

- 📚 Improved chat history search and organization.
- 🧵 Multiple conversation threads with better navigation.
- 📋 Copy and export AI responses.
- 🌙 Light and dark theme support.
- ⚙️ Customizable model and response settings.
- 🧪 Expanded automated testing.
- ♿ Additional accessibility improvements.

## 👨‍💻 Author

**Himanshu Kumar**

- GitHub: [@Himanshu6389](https://github.com/Himanshu6389)

## 📄 License

No license has been specified for this repository yet. Add a `LICENSE` file if you intend to publish it under a particular open-source license.

---

<p align="center">
  <strong>Built with ❤️ using Next.js and Google Gemini</strong>
  <br>
  <a href="https://ai-gemini-chatbot-rho.vercel.app">Explore the Live Application</a>
</p>
