# SocietyHub 🏢

Smarter Society Management

SocietyHub is a mobile application designed to simplify residential society management. It helps society administrators and residents manage members, track maintenance payments, monitor expenses, and view financial reports through a clean, user-friendly interface.

## ✨ Features
- Authentication — User registration, login, and session management.
- Dashboard — Overview of society activities and financial information.
- Member Management — Add, view, and manage society members.
- Collections — Track maintenance collections and other society funds.
- Payment Management — Record payments and view payment history.
- Expense Tracking — Manage society expenses and transactions.
- Reports — Income, expense, fund balance, and collection reports.
- Help & Support — Provide assistance and contact society management.
- Splash Screen — Branded startup screen with session-based navigation.

## 🛠️ Tech Stack
- React Native
- Expo
- TypeScript
- Supabase
- PostgreSQL
- Ionicons

## 📁 Project Structure
SocietyHub/
├── assets/
│   └── images/
│       ├── splash-bg.png
│       └── logo.png
├── screens/
├── App.tsx
├── navigation.tsx
├── session.tsx
├── store.ts
├── theme.ts
├── types.ts
├── utils.ts
├── .env
├── .gitignore
├── app.json
├── package.json
└── README.md


The structure above represents the current project layout. You can organize screens, components, services, and assets into separate folders as the application grows.

## 🚀 Getting Started
### Prerequisites

Make sure you have installed:

- Node.js (LTS version recommended)
- npm
- Expo-compatible development environment
- A Supabase project

### 1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd SocietyHub


Replace <YOUR_REPOSITORY_URL> with your repository URL.

### 2. Install dependencies
npm install

### 3. Configure environment variables

Create a .env file in the project root:

EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key


Use the appropriate public client key for your Supabase project. If your project uses the newer publishable-key format, use that key instead of a legacy anon key.

**Security**: Never include your Supabase service_role or secret key in a mobile application. Expo public environment variables are embedded in the client bundle.

### 4. Configure Supabase
Create a project in the Supabase Dashboard.
Copy the project URL and publishable key into .env.
Configure your database tables, authentication, and Row Level Security (RLS) policies.
Ensure your database schema and permissions match the queries used by the application.

If you use a custom PostgreSQL schema such as society, configure the required schema access and API exposure settings where applicable.

### 5. Start the development server
npx expo start


Follow the terminal instructions to run the app in Expo Go, an emulator, or a development build, depending on your dependencies.

## 🔐 Environment Variables

Keep local environment files out of version control.

Example .gitignore entries:

.env
.env.*
!.env.example


You can commit an .env.example file containing placeholder values:

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=


Never commit real credentials.

## 🎨 UI Design

SocietyHub uses a consistent mobile design system featuring:

Navy-blue headers and primary actions
White cards with rounded corners
Teal accents for important actions and status indicators
Ionicons for clear visual navigation
Simple dashboards and readable financial summaries

## 🧪 Development

Run the following command to start the Expo development server:

npx expo start


Check the project's package.json for any additional scripts, such as linting, testing, or platform-specific commands.

## 🗺️ Roadmap

Potential future improvements include:

Help & Support center with frequently asked questions
Support ticket submission and tracking
Payment reminders and notifications
Enhanced financial analytics
Role-based access for administrators and residents
Improved payment reconciliation

## 🤝 Contributing
1. Create a feature branch.
2. Make your changes.
3. Test the application.
4. Submit a pull request with a description of your changes.

## 📄 License

No license has been specified yet. Add a license before distributing or allowing others to reuse the project.

## Prototype 
<img width="1254" height="1254" alt="image" src="https://github.com/user-attachments/assets/8181906e-f759-4a1b-90e0-81202f2ecfdf" />


**SocietyHub — Making society management simpler.**
