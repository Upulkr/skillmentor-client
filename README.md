# SkillMentor Client 🎓

A premium, modern React frontend for the SkillMentor platform. Built with a focus on speed, aesthetics, and a seamless user experience for students and mentors.

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query) v5
- **Styling**: Tailwind CSS + Lucide React (Icons)
- **Authentication**: Clerk
- **Forms**: React Hook Form + Zod

## ✨ Key Features

- **Dynamic Student Dashboard**: A centralized hub to track upcoming sessions, pending payments, and recent activity.
- **Advanced Booking System**:
  - Real-time validation for dates and times.
  - Automatic 30-minute buffer enforcement for same-day bookings.
  - Prevention of past-date scheduling.
- **Mentor Profiles**: Rich profiles featuring bios, subject lists, and live student reviews.
- **Review & Rating System**:
  - Interactive star rating system.
  - Real-time cache invalidation for instant feedback visibility.
- **Payment Workflow**: Easy upload system for tracking session payments (slips).
- **Responsive Design**: Fully optimized for both desktop and mobile viewing with a glassmorphism aesthetic.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Bun or NPM

### Setup

1. Clone the repository and install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

2. Create a `.env` file with your Clerk credentials:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
   VITE_API_URL=http://localhost:8080/api/v1
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

## 📂 Architecture

- `src/components`: UI components (including reusable blocks like Badge, ReviewModal, etc.)
- `src/hooks`: Custom TanStack Query hooks for API interaction.
- `src/pages`: Main view components (Dashboard, MentorProfile, Payment, etc.)
- `src/store`: Zustand store for authentication and global state.
- `src/api`: Axios configuration and interceptors.
