# EduSetu - Phase 2: Engagement, Community, & Expansion

With the robust core engine and premium UI established in Phase 1, Phase 2 focuses on turning EduSetu from a single-player utility into a highly engaging, habit-forming, and community-driven SaaS platform.

Below are the planned milestones and features for Phase 2.

---

## 1. Gamification & Progression System
To keep users motivated through their learning journey, we will introduce RPG-like progression mechanics.
- **Global XP & Leveling**: Users earn XP for every node they mark as "Completed". Earning enough XP levels up their profile (e.g., "Novice" -> "Scholar" -> "Master").
- **Daily Streaks**: Introduce a streak counter (🔥) that tracks consecutive days of activity (completing a node, or generating a roadmap). 
- **Analytics Dashboard**: A centralized dashboard showing overall completion percentages, time spent learning, and a heatmap of activity (similar to GitHub commits).

## 2. Community & Social Features
Transitioning from private-only to a public sharing model to create a viral growth loop.
- **Public Roadmaps**: Users can toggle a roadmap from "Private" to "Public".
- **Unique Slugs**: Generating clean shareable URLs (e.g., `edusetu.com/r/learn-react-2026`).
- **Upvoting & Trending**: A community discovery page where the highest-rated user-generated roadmaps rise to the top.
- **Forking/Cloning**: Allow a user to "Fork" someone else's public roadmap, bringing a copy into their own private dashboard to customize and complete.

## 3. Advanced AI Rerouting
Learning is non-linear. The AI should adapt if the user hits a roadblock.
- **"I'm Stuck" Button**: If a user cannot grasp a specific node (e.g., "React Hooks"), they can click "I'm Stuck". The app will call Gemini to break that single node down into 3 smaller, bite-sized prerequisite sub-nodes, dynamically injecting them into the React Flow canvas.
- **Quiz Generation**: After completing a major section (e.g., "Core" category), the AI generates a quick 3-question multiple-choice quiz to validate understanding before allowing the user to proceed.

## 4. Notifications & Retention Loop
Implementing proactive engagement to reduce churn.
- **Email Reminders (Resend + Cron)**: If a user hasn't completed a node in 5 days, send a stylized email: *"Your React Roadmap is waiting for you. Just 2 steps left to master Hooks!"*
- **Push Notifications**: Optional browser push notifications for daily learning reminders.

## 5. Monetization & Premium Tiers (Optional)
Introducing Stripe integration for power users.
- **Free Tier**: 3 Roadmap generations per month, standard YouTube fetching, basic nodes.
- **Pro Tier ($9/mo)**: Unlimited roadmap generations, deep AI streaming explanations, "I'm Stuck" dynamic rerouting, and ad-free YouTube embeds.

## 6. Mobile Optimization & PWA
- **Responsive Canvas Touch Controls**: Enhancing the React Flow experience on mobile devices (pinch-to-zoom, touch-friendly side sheets).
- **Progressive Web App (PWA)**: Allow users to "Install" EduSetu on their iOS/Android home screens for native app-like access without app store deployment.

---

**Objective:** By the end of Phase 2, EduSetu will be a monetizable, self-sustaining community platform capable of viral organic growth.
