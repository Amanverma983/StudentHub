# StudentHub 🎓⚡

**The All-in-One Student Career Platform** — earn from assignment gigs, build ATS resumes, and create stunning portfolios.

![StudentHub Banner](https://via.placeholder.com/1200x630/04040A/7C3AED?text=StudentHub)

## ✨ Features

### For Writers
- 📋 **Assignment Marketplace** — Browse & claim handwritten gigs (₹80/page base rate)
- 📊 **Earnings Dashboard** — Track income, ratings, and completed gigs
- 📄 **Resume Builder** — ATS-optimized templates with live preview + PDF export
- 🌐 **Portfolio Maker** — 4 stunning themes: Glassmorphism, Terminal, Bento, Neon

### For Customers
- 📝 **Post Assignments** — Set requirements, pages, deadline & urgency level
- 👥 **Browse Writers** — Hire from verified, rated student writers
- 📈 **Order Tracking** — Monitor assignment status in real-time
- 🛡️ **Quality Guarantee** — Built-in review and rating system

### Career Tools (Both Roles)
- **Resume Builder** with 3 ATS-friendly templates (Modern Dark, Minimal Pro, Executive)
- **Portfolio Maker** with 4 immersive themes
- **PDF Export** via `@react-pdf/renderer`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm / pnpm / yarn
- Supabase account (free tier works)

### 1. Clone & Install
```bash
git clone <your-repo>
cd studenthub
npm install
```

### 2. Configure Supabase
```bash
cp .env.example .env.local
```

Fill in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database
Copy and run `supabase-schema.sql` in your Supabase SQL Editor.

### 4. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Access (No Setup Required)

The app includes mock authentication. Just start the dev server and use:

| Role | Email | Password |
|------|-------|----------|
| Writer | `writer@demo.com` | `demo1234` |
| Customer | `customer@demo.com` | `demo1234` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router + Turbopack) |
| Database/Auth | Supabase (PostgreSQL + Auth) |
| Styling | Tailwind CSS + Custom CSS Variables |
| Animations | Framer Motion |
| Icons | Lucide React |
| PDF Export | @react-pdf/renderer |
| Forms | React Hook Form |
| State | React Context API |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.jsx          # Root layout with providers
│   ├── page.jsx            # Landing page
│   ├── auth/
│   │   ├── login/page.jsx  # Login with demo shortcuts
│   │   └── signup/page.jsx # Signup with role selection
│   └── dashboard/
│       ├── layout.jsx      # Auth-guarded dashboard shell
│       ├── page.jsx        # Role-based dashboard home
│       ├── marketplace/    # Gig board + post modal
│       ├── resume/         # Full resume editor + preview
│       └── portfolio/      # Portfolio builder + live preview
├── components/
│   ├── ui/                 # Button, Navbar, shared UI
│   ├── landing/            # Hero, features, testimonials
│   └── dashboard/          # Sidebar, MobileNav
├── context/
│   ├── AuthContext.jsx     # Auth state + mock login
│   └── MarketplaceContext.jsx # Gig state management
├── lib/
│   ├── supabase.js         # Browser client
│   ├── supabase-server.js  # Server client (SSR)
│   └── utils.js            # Helpers, formatters
└── styles/
    └── globals.css         # Design system + Tailwind
```

---

## 🎨 Design System

### Colors
```css
--violet-primary: #7C3AED  /* Main brand */
--gold-primary:   #F59E0B  /* Writer/earnings accent */
--void:           #04040A  /* Background */
--surface:        #0A0A14  /* Card surfaces */
--ink:            #F8F8FF  /* Primary text */
--ink-muted:      #9BA3B5  /* Secondary text */
```

### Typography
- **Display**: Syne (800 weight for headings)
- **Body**: DM Sans (clean, readable)

### Effects
- **Glassmorphism**: `backdrop-filter: blur(16px)` + transparent borders
- **Glows**: Violet `box-shadow: 0 0 40px rgba(124,58,237,0.3)`
- **Gradient Text**: Violet → Gold via `background-clip: text`

---

## 🔄 Migrating from Mock Auth to Supabase

Replace `AuthContext.jsx` mock logic with real Supabase calls:

```javascript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

// Sign up
const { data, error } = await supabase.auth.signUp({
  email, password,
  options: { data: { name, role } }
});

// Get session
const { data: { user } } = await supabase.auth.getUser();
```

---

## 📄 License

MIT — Free for personal and commercial use.

---

Built with ❤️ for Indian students. Star the repo if it helped you! ⭐
