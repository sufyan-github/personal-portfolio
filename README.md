> **Production (19 October 2026):** https://abusufyan.online · Admin: https://abusufyan.online/admin
> Frontend: Cloudflare Pages project `abusufyan-portfolio`. Backend: owner-controlled Supabase project `onedszkviytisunlmoip` (Singapore).
> The older Lovable Cloud backend `xxulvfpdvemsvvyrdxim` is preserved but is no longer the production target. Historical private messages were not exported from it.

### Operating the current portfolio

Sign in at `/admin` using the owner passphrase. Content collections use field-based editing with an advanced JSON option. Changes save to Supabase and appear after refreshing the public site. The portal includes education, skills, experience, projects, research, credentials, achievements, community content, navigation, translations, portfolio assistant knowledge, and feature settings. Media controls support uploads, captions, ordering, visibility, and disposable-image deletion. Choose the asset category for certificate/project images, copy their URL, and paste it into the relevant content field. CV uploads replace the public resume. Inbox messages are private. Blog posts and testimonials start as drafts and require explicit publishing.

The live assistant uses a Cloudflare Pages Function at `/api/assistant` with the native Workers AI binding (`@cf/meta/llama-3.1-8b-instruct-fp8`). It streams generated answers using the admin-managed `ai_profile` collection from Supabase. `VITE_ASSISTANT_URL` points the frontend to this route. The accurate Supabase portfolio guide remains the fallback if inference is unavailable or quota-limited; no separate AI provider key is required for the live Cloudflare setup. The Supabase function also supports optional `OPENAI_API_KEY` / `OPENAI_MODEL` or `LOVABLE_API_KEY` if an alternate provider is configured later. See https://developers.cloudflare.com/pages/functions/bindings/#workers-ai for binding operations and https://developers.cloudflare.com/workers-ai/platform/pricing/ for usage limits.

Contact messages save once to the private inbox and send two transactional emails through Resend: an owner notification to `abusufyan.cse20@gmail.com` and a visitor confirmation. The verified sender is `Md. Abu Sufyan <portfolio@notifications.abusufyan.online>`. The domain-restricted, sending-only `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are configured only in Supabase secrets. Owner notifications reply to the visitor; confirmations reply to the owner. Each delivery is attempted independently, and email failure never reports an already-saved contact as failed. Per-delivery acceptance is recorded in contact analytics; final delivery events are available in Resend.

Resend remains on the Free transactional plan (3,000 emails/month, 100/day), with pay-as-you-go disabled and no billing details added. Two emails per submission means up to 50 submissions/day and 1,500/month if no other email consumes the allowance. If the quota is exhausted, messages remain available in the admin inbox even when email cannot be sent. Do not enable paid upgrades or overages without owner approval.

Verified on 19 October 2026 using the live website contact form: exactly one contact submission, with both owner notification and visitor confirmation marked delivered by Resend. Automated tests cover HTML escaping, reply-to routing, missing configuration, storage failures, and failure of either delivery independently.

Build with `npm ci && npm run build`, check with `npm test`, `npm run lint`, and `npx tsc --noEmit -p tsconfig.app.json`. Deploy only `dist` using `npx wrangler pages deploy dist --project-name abusufyan-portfolio --branch main --commit-dirty=true`. Cloudflare Pages native SPA routing preserves `/admin` and `/resume`; do not add rewrites to `/index.html`.

The new backend was provisioned with `supabase/bootstrap-standalone.sql`, then `supabase/migrations/20261019000000_repair_portfolio_photos.sql`, then `supabase/seed-reviewed-content.sql`. **Do not replay the historical migrations or bootstrap on this live database.** The reviewed seed only inserts absent content; it does not overwrite admin edits. Deploy named functions with `npx supabase functions deploy admin-api send-contact-email portfolio-chat --project-ref onedszkviytisunlmoip --no-verify-jwt --use-api`. Admin endpoints still require signed admin tokens. Keep all secrets in Supabase secrets, never Vite variables or the Git repository.

---

# Personal Portfolio - Md. Abu Sufyan

A modern, professional portfolio website showcasing AI/ML expertise, projects, research, and professional experience. Built with React, TypeScript, and Tailwind CSS for optimal performance and user experience.

## ✨ Features

- **Modern Design System**: Professional neutral palette with strategic blue accent
- **Responsive Layout**: Flawless experience across mobile, tablet, and desktop
- **Performance Optimized**: Lighthouse 90+ scores for Performance/Best Practices/SEO
- **Accessibility First**: WCAG AA+ compliant, keyboard navigable, screen reader friendly
- **Animated Elements**: Subtle Lottie animations and micro-interactions
- **SEO Optimized**: Semantic HTML, meta tags, structured data
- **Component-Based**: Reusable React components with TypeScript
- **JSON-Driven Content**: Easy content updates via JSON configuration files

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: Lottie React, CSS animations
- **Build Tool**: Vite
- **Backend**: Supabase (database, authentication)
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn)
│   ├── Hero.tsx        # Hero section with Lottie animation
│   ├── About.tsx       # About section
│   ├── Projects.tsx    # Projects showcase
│   ├── Skills.tsx      # Skills & expertise
│   ├── Contact.tsx     # Contact form
│   └── ...             # Other sections
├── data/               # JSON configuration files
│   ├── hero.json       # Hero section content
│   ├── projects.json   # Projects data
│   ├── skills.json     # Skills data
│   └── ...             # Other data files
├── pages/              # Page components
│   └── Index.tsx       # Main page
├── assets/             # Images and static assets
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── index.css           # Global styles & design system
```

## 🎨 Design System

### Color Palette
- **Background**: Slate/Navy (`240 10% 3.9%`)
- **Primary**: Professional Blue (`217 91% 60%`)
- **Accent**: Fresh Green (`142 71% 45%`)
- **Text**: High contrast white (`0 0% 98%`)

### Typography
- **Display**: Space Grotesk (headings)
- **Body**: Inter (text)
- **Line Height**: 1.5–1.7 for optimal readability

### Animations
All animations respect `prefers-reduced-motion` for accessibility:
- Fade transitions
- Hover effects
- Smooth scrolling
- Lottie animations

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ or Bun
- npm/yarn/pnpm/bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
# Build
npm run build
# or
bun run build

# Preview production build
npm run preview
# or
bun run preview
```

## 📝 Content Management

### Updating Content

Content is managed through JSON files in `src/data/`:

#### Hero Section (`src/data/hero.json`)
```json
{
  "name": "Your Name",
  "title": "Your Title",
  "summary": "Your summary...",
  "chips": [...],
  "socials": [...],
  "ctas": [...]
}
```

#### Projects (`src/data/projects.json`)
```json
[
  {
    "id": "p01",
    "title": "Project Title",
    "description": "Description...",
    "technologies": ["React", "Python"],
    "project_type": "AI/ML",
    "year": "2025",
    "featured": true,
    "github_url": "https://...",
    "demo_url": "https://...",
    "image_url": "/path/to/image.jpg"
  }
]
```

#### Skills (`src/data/skills.json`)
#### Navigation (`src/data/navigation.json`)
#### And more...

### Adding Images

1. Place images in `src/assets/` for ES6 imports
2. Or place in `public/` for direct references
3. Update JSON files with image paths

## 🎯 Key Sections

1. **Hero**: Eye-catching introduction with Lottie animation
2. **About**: Professional background and expertise
3. **Skills**: Technical skills organized by category
4. **Projects**: Featured projects with live demos and code
5. **Research**: Publications and research interests
6. **Certifications**: Professional certifications
7. **Experience**: Work history and roles
8. **Contact**: Contact form with Supabase integration

## 🔧 Customization

### Colors
Edit `src/index.css` - modify CSS variables in `:root`:
```css
--primary: 217 91% 60%;  /* Change primary color */
--accent: 142 71% 45%;   /* Change accent color */
```

### Fonts
Update `index.html` and `tailwind.config.ts`:
```html
<!-- Add Google Font link -->
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

```ts
// tailwind.config.ts
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
}
```

### Components
All components are in `src/components/` - edit directly or create new ones.

## 📱 Responsive Breakpoints

- Mobile: ≤639px
- Tablet: 640px–1023px
- Desktop: 1024px–1279px
- Large Desktop: ≥1280px

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Skip links
- Alt text on images
- Color contrast ratios meet WCAG AA

## 🚢 Deployment

### Deploy to Vercel/Netlify/Lovable

```bash
# Build the project
npm run build

# Deploy the `dist` folder
```

Or use platform-specific commands:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **Lovable**: Use the built-in deployment feature via [Lovable Project](https://lovable.dev/projects/315aad15-22d6-431f-a2f7-2159bc0be7c6)

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

**Md. Abu Sufyan**
- GitHub: [@sufyan-github](https://github.com/sufyan-github)
- LinkedIn: [md-abu-sufyan](https://linkedin.com/in/md-abu-sufyan)
- Email: abusufyan.cse20@gmail.com

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
