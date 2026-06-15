# EduSetu - Phase 1: Foundation & Core Experience

Phase 1 of EduSetu focused on building a rock-solid foundation, integrating powerful AI models, creating a breathtaking user interface, and solving complex engineering challenges around API quotas and database synchronization.

Below is a detailed breakdown of every feature and architectural decision implemented in Phase 1.

---

## 1. AI Generative Engine (Gemini Integration)
- **Dynamic Roadmaps**: Built a Next.js Server API (`/api/generate`) that connects to the Google Gemini API (supporting 2.0-flash, 2.5-flash, and flash-lite).
- **Structured JSON Schema**: Engineered the system prompt to force Gemini to return strict, parseable JSON containing Nodes, Edges, Time Allocations, and Prioritization levels (Critical, High, Medium).
- **Fallback Keys**: Implemented a round-robin/fallback architecture for API keys (`GEMINI_API_KEY_1`, `2`, `3`) to handle quota limits natively.

## 2. Interactive Canvas (React Flow)
- **Node Graph Rendering**: Utilized `@xyflow/react` to render the roadmap.
- **Auto-Layout Algorithm**: Integrated `dagre` to automatically calculate the spatial positioning of nodes in a Top-to-Bottom tree structure, ensuring no overlapping nodes.
- **Custom Nodes**: Built `RoadmapNode.tsx` with dynamic category icons (Prerequisite, Core, Practice, Project), status indicators, and beautiful dark-glassmorphism styling.

## 3. Database & Authentication (Supabase)
- **Schema**: Created the `roadmaps` table in Supabase PostgreSQL, saving the full JSON structures (`nodes`, `edges`) alongside user references.
- **Authentication**: Built a robust Login/Signup system featuring:
  - Secure Email/Password registration.
  - **Google OAuth Integration**: One-click "Continue with Google" securely wired via `supabase.auth.signInWithOAuth`.
- **Private Data Isolation**: Ensured Row Level Security (RLS) so users only see and interact with their own generated roadmaps.

## 4. UI/UX "Apple-SaaS" Facelift
- **Aesthetic Overhaul**: Migrated the entire application to a premium, "Linear-style" design language.
  - Body background set to `#0a0a0a`.
  - Massive use of glassmorphism: `bg-zinc-900/40 backdrop-blur-2xl border border-white/10`.
  - Micro-interactions via Framer Motion (`whileTap`, `whileHover`, `<AnimatePresence>`).
- **Webkit Autofill Fix**: Eradicated the jarring white background in Chrome autofill using shadow insertion.
- **Copywriting**: Rewrote the Landing Page Hero to be human-centric ("EduSetu. Every goal deserves a clear path.").

## 5. Engineering Optimizations
- **Optimistic UI & Database Debounce**: Solved the "last-write-wins" race condition. When a user marks a node as completed, the UI updates instantly (0ms latency). The database write is debounced by 750ms. If multiple checkboxes are clicked rapidly, only one clean `UPDATE` request is sent to Supabase.
- **Memory Leak Prevention**: Built strict `useEffect` cleanups to destroy the debounce timer if the user navigates away before the sync finishes.

## 6. Advanced Features
- **YouTube Dynamic Video Caching**: 
  - Integrated the YouTube Data API v3 to fetch video tutorials when a user clicks a node.
  - **Quota Preservation**: Built a custom caching layer directly inside the `nodes` JSON in the database. When videos are fetched, they are cached with a 30-day TTL (Time To Live). The app checks `isCacheValid` before making any external API calls.
- **"Explain This" AI Streaming**:
  - Added a "✨ Explain Concept" button to the side sheet.
  - Integrated `@google/generative-ai` to open a Server-Sent Events (SSE) `ReadableStream`.
  - The UI streams the AI's explanation character-by-character directly onto the glassmorphic canvas.
- **Viral Export Loop**: Integrated `html-to-image` to allow users to download a high-resolution PNG of their roadmap for sharing on social media.

---

**Status:** Phase 1 is officially complete and ready for Vercel production deployment.
