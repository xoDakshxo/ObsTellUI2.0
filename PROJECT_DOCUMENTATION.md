# ObsTell UI 2.0 - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Design Philosophy](#design-philosophy)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Design System](#design-system)
6. [Components](#components)
7. [Application Flow](#application-flow)
8. [Features](#features)
9. [Data Models](#data-models)
10. [Keyboard Shortcuts](#keyboard-shortcuts)
11. [Development](#development)
12. [Deployment](#deployment)

---

## Project Overview

**ObsTell UI 2.0** is a modern, AI-powered observability and intelligence platform designed for engineering teams. It provides a unified interface for monitoring incidents, deployments, metrics, and team collaboration across multiple data sources (Slack, GitHub, Sentry, Grafana, Datadog).

### Key Highlights

- **Neobrutalist Design Language**: Bold borders, prominent shadows, high contrast
- **AI-Powered Intelligence**: ObsAgent provides contextual insights and recommendations
- **Multi-Source Integration**: Aggregates data from Slack, GitHub, Sentry, Grafana, and Datadog
- **Real-time Collaboration**: Feed-based updates with team mentions and threading
- **Command Palette**: Keyboard-first navigation with Cmd+K quick access
- **Dark Mode Support**: Fully responsive light and dark themes

---

## Design Philosophy

### Neobrutalism

ObsTell UI 2.0 implements a **neobrutalist design system** characterized by:

1. **Bold Borders**: Heavy 2px borders (`border-2`) create strong visual boundaries
2. **Hard Shadows**: Distinctive box shadows (`shadow-corp-sm`, `shadow-corp-md`, `shadow-corp-lg`) with no blur
   - `corp-sm`: `2px 2px 0px 0px`
   - `corp-md`: `4px 4px 0px 0px`
   - `corp-lg`: `6px 6px 0px 0px`
3. **High Contrast**: Clear separation between elements using dark borders on light surfaces
4. **Minimal Gradients**: Flat colors with occasional subtle background meshes
5. **Sharp Corners**: Rounded corners (`rounded-lg`, `rounded-xl`) but still geometric
6. **Prominent Typography**: Bold headings using Space Grotesk display font
7. **Interactive Feedback**: Active states with `translate-y`, `scale` transforms
8. **Monospace Accents**: JetBrains Mono for code and technical elements

### Color Philosophy

- **Light Mode**: Clean white surfaces (#FFFFFF) on light gray background (#F3F4F6)
- **Dark Mode**: Deep zinc backgrounds (#09090B, #18181B) with zinc borders (#3F3F46)
- **Primary Color**: Indigo (#6366F1 light, #818CF8 dark)
- **Semantic Colors**: Green (success), Yellow (warning), Red (danger/incidents)

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.1 | UI framework |
| **TypeScript** | 5.8.2 | Type safety |
| **Vite** | 6.2.0 | Build tool & dev server |
| **Tailwind CSS** | CDN | Utility-first styling |

### Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Recharts** | 3.5.1 | Data visualization (charts, graphs) |
| **@phosphor-icons/react** | 2.0.15 | Icon system (600+ icons) |

### Fonts

- **Inter**: Primary sans-serif font (body text)
- **Space Grotesk**: Display font (headings, labels)
- **JetBrains Mono**: Monospace font (code, technical data)

---

## Architecture

### Project Structure

```
ObsTellUI2.0/
├── components/
│   ├── ChatTrigger.tsx        # Floating chat activation button
│   ├── Commander.tsx           # Bottom command/input bar
│   ├── CommandPalette.tsx      # Cmd+K quick navigation modal
│   ├── ContextDrawer.tsx       # Right-side detail drawer
│   ├── Feed.tsx                # Main feed container
│   ├── FeedPost.tsx            # Individual post card
│   ├── RichEmbed.tsx           # Multi-type embed renderer
│   ├── RightSidebar.tsx        # AI chat sidebar
│   └── Sidebar.tsx             # Left navigation sidebar
├── App.tsx                     # Root application component
├── constants.ts                # Mock data, squads, users
├── types.ts                    # TypeScript type definitions
├── index.tsx                   # Application entry point
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

### Component Hierarchy

```
App
├── Sidebar (left navigation)
├── Feed (main content area)
│   └── FeedPost[] (post cards)
│       └── RichEmbed (graphs, metrics, videos, code, slack threads)
├── Commander (bottom input bar)
├── ChatTrigger (floating button)
├── RightSidebar (AI chat)
├── CommandPalette (Cmd+K modal)
└── ContextDrawer (detail overlay)
```

---

## Design System

### CSS Variables

#### Light Mode
```css
--corp-bg: #F3F4F6;         /* Background */
--corp-surface: #FFFFFF;     /* Card/surface color */
--corp-border: #18181B;      /* Border color (Zinc 900) */
--corp-text: #1F2937;        /* Primary text */
--corp-muted: #6B7280;       /* Secondary text */
--corp-primary: #6366F1;     /* Primary accent (Indigo) */
--corp-accent: #18181B;      /* Accent color */
```

#### Dark Mode
```css
--corp-bg: #09090B;          /* Background (Zinc 950) */
--corp-surface: #18181B;     /* Surface (Zinc 900) */
--corp-border: #3F3F46;      /* Border (Zinc 700) */
--corp-text: #FAFAFA;        /* Primary text (Zinc 50) */
--corp-muted: #A1A1AA;       /* Secondary text */
--corp-primary: #818CF8;     /* Primary (Indigo 400) */
--corp-accent: #FFFFFF;      /* Accent */
```

### Typography Scale

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Space Grotesk | 36px | 700 (Bold) |
| Post Headline | Space Grotesk | 20px | 700 (Bold) |
| Section Header | Space Grotesk | 11px | 700 (Bold, Uppercase) |
| Body Text | Inter | 15px | 400 (Regular) |
| Small Text | Inter | 12px | 500 (Medium) |
| Code/Mono | JetBrains Mono | 11-12px | 500 (Medium) |

### Spacing System

- **Sidebar Width**: 280px (collapsed: 72px)
- **Chat Width**: 400px
- **Feed Max Width**: 768px (3xl)
- **Card Padding**: 24px (p-6)
- **Vertical Rhythm**: 32px gaps between posts

### Border & Shadow Tokens

```css
/* Borders */
border-2: 2px solid var(--corp-border)

/* Shadows (Neobrutalist Hard Shadows) */
shadow-corp-sm: 2px 2px 0px 0px var(--corp-border)
shadow-corp-md: 4px 4px 0px 0px var(--corp-border)
shadow-corp-lg: 6px 6px 0px 0px var(--corp-border)
shadow-corp-xl: 6px 6px 0px 0px var(--corp-border)
```

### Animation

```css
/* Slide Up Animation */
@keyframes slideUp {
  0%: { transform: translateY(20px); opacity: 0; }
  100%: { transform: translateY(0); opacity: 1; }
}

/* Slide In Right Animation */
@keyframes slideInRight {
  0%: { transform: translateX(-10px); opacity: 0; }
  100%: { transform: translateX(0); opacity: 1; }
}
```

**Usage**: Applied to feed posts with staggered delays for cascade effect.

---

## Components

### 1. Sidebar (`Sidebar.tsx`)

**Purpose**: Primary navigation for the application.

**Features**:
- Collapsible (280px → 72px)
- Brand logo with workspace name
- Global search trigger (Cmd+K)
- Two navigation sections:
  - **My Radar**: Home, Mentions (with badge), Saved
  - **Squads**: Platform & Infra, Growth, Checkout, Design System, etc.
- User profile section with theme toggle
- System health indicator
- Keyboard shortcut: `Cmd+\` to toggle collapse

**State Management**:
- `isCollapsed`: Controls sidebar width
- `currentView`: Active navigation item
- `isDarkMode`: Theme state

**Design Details**:
- Logo: 44px circle with ObsTellLogo.png
- NavItem: Active state with `border-corp-border`, `shadow-corp-sm`, and `translate-x-1`
- Badge: Absolute positioned on collapsed icons, inline on expanded
- Footer: Pulsing green dot for "System Healthy"

### 2. Feed (`Feed.tsx`)

**Purpose**: Main content area displaying filtered posts.

**Features**:
- View-based filtering (home, mentions, saved, squad-specific)
- Animated gradient mesh background
- View header with icon, title, description, post count
- Member avatars for team views
- Date separator
- Staggered post animations
- Empty state with "All caught up" message
- Loading indicator

**Responsive Margins**:
```tsx
ml: sidebar collapsed ? 90px : 320px
mr: chat open ? 420px : 0px
```

**Background Mesh**:
- Light Mode: Indigo/Purple/Blue gradients with 30% opacity
- Dark Mode: Darker gradients with 15-20% opacity
- Heavy blur (120-150px)

### 3. FeedPost (`FeedPost.tsx`)

**Purpose**: Individual post card with rich content support.

**Post Types**:
1. **Incident**: Red ring, pulsing dot, fire reactions
2. **Success**: Green metrics, heart reactions
3. **Collaboration**: Code snippets, PR references
4. **Status**: Updates, deployments, announcements

**Structure**:
```
┌─────────────────────────────────────┐
│ [Avatar] Author • Role              │
│          Timestamp • #squad         │
│                                     │
│ ⚫ Headline (bold, large)           │
│                                     │
│ Body content with **bold**,        │
│ `code`, and @mentions              │
│                                     │
│ [Rich Embed: graph/metric/etc.]    │
│                                     │
│ [Source Icons: Slack, GitHub...]   │
│                                     │
│ ⚡ ObsAgent Insight: ...            │
│                                     │
│ [Like] [Reply] [Share]             │
└─────────────────────────────────────┘
```

**Features**:
- Markdown-like text rendering (bold, code, mentions)
- Rich embed support (graphs, metrics, videos, code, Slack threads)
- Source attribution with brand logos
- AI insight section with lightning icon
- Threaded replies (indented with left border)
- Hover effects: `-translate-y-[2px]`, `shadow-corp-md`
- Pinned indicator (floating badge on hover)

**Reactions**:
- Fire (incidents, escalation)
- Heart (likes, appreciation)
- Comment count
- Share button

### 4. RichEmbed (`RichEmbed.tsx`)

**Purpose**: Renders different types of embedded content.

**Embed Types**:

#### Graph Embed
- Uses Recharts AreaChart
- Fixed height container (208px)
- Indigo gradient fill
- Brand logo header (Grafana, Datadog)
- "LIVE 15m WINDOW" footer
- "View Logs" CTA

#### Metric Embed
- Large metric value (3xl font)
- Trend indicator (+/- percentage)
- Icon based on positive/negative trend
- Border colored by trend direction

#### Video Embed
- Thumbnail image
- Play button overlay (scales on hover)
- Loom branding badge
- Darkened overlay

#### Code Embed
- Dark code editor theme (#1E1E1E)
- VS Code-style header with traffic lights
- Syntax highlighting ready
- GitHub logo for PR-related code

#### Slack Thread Embed
- Message bubbles with avatars
- Timestamp per message
- "SLACK THREAD" badge
- Authentic Slack branding

**Brand Logos**: Authentic SVG logos from Wikimedia/CDN sources.

### 5. Commander (`Commander.tsx`)

**Purpose**: Bottom input bar for posting updates to the feed.

**Features**:
- Fixed positioning with responsive margins
- Glassmorphism: `bg-white/90 dark:bg-black/80 backdrop-blur-xl`
- Command icon prefix
- @ mention button
- Post button with paper plane icon
- Keyboard hint on hover ("Press ⏎ to share")
- Auto-clears on submit

**Behavior**:
- `onRun` callback: Triggers feed action (does NOT open chat)
- Enter key to submit
- Shift+Enter for multiline (prevented in current implementation)

### 6. RightSidebar (`RightSidebar.tsx`)

**Purpose**: AI chat interface for asking ObsAgent questions.

**Features**:
- Slide-in animation from right
- ObsAgent avatar in header
- Online status indicator (pulsing green dot)
- Chat history button
- Message bubbles (user: right/indigo, bot: left/gray)
- Typing indicator (bouncing dots)
- Auto-scroll to latest message
- Input with send button
- Empty state with Robot icon

**Message Structure**:
```typescript
interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}
```

**Animations**:
- Slide-in: `translate-x-[120%]` → `translate-x-0`
- Typing dots: Staggered bounce animation

### 7. CommandPalette (`CommandPalette.tsx`)

**Purpose**: Cmd+K quick navigation and search modal.

**Features**:
- Glassmorphism backdrop and modal
- Search input with MagnifyingGlass icon
- Keyboard navigation (↑↓ arrows, Enter to select)
- ESC to close
- Three sections:
  1. **Ask Intelligence**: Direct ObsAgent query
  2. **Jump to View**: Navigate to squads/views with shortcuts
  3. **Recent Context**: Recent files/logs

**Keyboard Shortcuts**:
- `G P`: Go to Platform & Infra
- `G C`: Go to Checkout & Pay
- `G D`: Go to Design System

**Selected State**:
- Indigo background with white text
- Arrow icon appears on hover/selection

### 8. ContextDrawer (`ContextDrawer.tsx`)

**Purpose**: Right-side overlay for detailed views.

**Drawer Types**:

#### Log View
- Terminal-style code block
- Copy button
- AI recommendation panel (yellow)
- Brand logo (Datadog, Sentry)

#### PR Diff View
- GitHub branch badge
- Additions/deletions count
- Syntax-highlighted diff
- File path header

#### Metrics View
- Grid of metric cards
- Each card: icon, label, value, delta
- Hover effects

#### Status Report View
- Service list with status dots
- Green (healthy), Yellow (degraded), Red (down)
- Latency badges
- Check/Warning icons

**Layout**:
- Width: 560px
- Header (80px): Title, subtitle, close button
- Scrollable content area
- Footer: "Close" and "Open Full View" buttons

### 9. ChatTrigger (`ChatTrigger.tsx`)

**Purpose**: Floating action button to open AI chat.

**Design**:
- Fixed bottom-right corner (bottom: 32px, right: 32px)
- 56px circular button
- ObsTellLogo.png as icon
- Hover: `-translate-y-1`, larger shadow
- Scales to 0 when chat is open
- Active state: `scale-95`

---

## Application Flow

### 1. Initial Load

1. `index.tsx` renders `<App />` into `#root`
2. App initializes state:
   - `currentView: 'home'`
   - `isCommandPaletteOpen: false`
   - `isDarkMode: false`
   - `isSidebarCollapsed: false`
   - `isChatOpen: false`
   - `chatMessages: []`
   - `drawerContext: { isOpen: false, data: undefined }`

### 2. Navigation Flow

**Sidebar Navigation**:
```
User clicks nav item → setCurrentView(viewId) → Feed filters posts
```

**Command Palette**:
```
User presses Cmd+K → CommandPalette opens → User selects item → onRun() → Chat opens or view changes
```

### 3. Post Interaction Flow

**Viewing Details**:
```
User clicks embed → handlePostEmbedClick(post) → setDrawerContext({ isOpen: true, data: post.detailContent }) → ContextDrawer slides in
```

**Reacting to Posts**:
```
User clicks Like/Fire → (Mock: no action) → Would update reactions count
```

**Replying**:
```
User clicks Reply → (Mock: no action) → Would open reply composer
```

### 4. Chat Interaction Flow

**Opening Chat**:
```
User clicks ChatTrigger → setIsChatOpen(true) → RightSidebar slides in
```

**Sending Message**:
```
User types query → Presses Enter → handleChatRun(query) → Adds user message → Sets typing state → Simulates bot response (1.5s delay) → Adds bot message
```

**From Command Palette**:
```
User opens palette → Types query → Selects "Ask ObsAgent" → onRun(query) → Same flow as above
```

### 5. Commander Flow

**Posting Update**:
```
User types in Commander → Presses Enter → handleFeedAction(query) → Console logs query → (Would create new post in real app)
```

**Note**: Commander does NOT open chat sidebar (per design).

### 6. Theme Toggle Flow

```
User clicks theme icon → setIsDarkMode(!isDarkMode) → useEffect adds/removes 'dark' class on documentElement → CSS variables update
```

### 7. Drawer Close Flow

```
User clicks backdrop OR close button → closeDrawer() → setDrawerContext({ ...prev, isOpen: false }) → Drawer slides out
```

---

## Features

### 1. Multi-View System

**Views**:
- **Home**: All posts from all squads
- **Mentions**: Posts with comments (mock filter)
- **Saved**: Pinned posts only
- **Squad Views**: Filtered by `squadId`

**Squads**:
1. Platform & Infra (HardDrives icon)
2. Growth Squad (TrendUp icon)
3. Checkout & Pay (CreditCard icon)
4. Design System (Palette icon)
5. Exec Briefing (Briefcase icon)
6. Mobile App (DeviceMobile icon)
7. Data Engineering (Database icon)

### 2. AI Intelligence (ObsAgent)

**Capabilities**:
- Contextual insights on every post
- Pattern matching with historical data
- Recommendations (e.g., "Cycle pods", "Promote experiment")
- Root cause analysis
- Deployment correlation

**Insight Examples**:
- "This pattern matches a previous memory leak in the redis connection pool."
- "This fix reduces complexity from O(N) to O(1)."
- "Causality detected: Schema change in Slack matches ColumnNotFound error."

### 3. Source Integration

**Supported Sources**:
- **Slack**: Thread embeds, deployment notifications
- **GitHub**: PR diffs, code snippets, commits
- **Sentry**: Error logs, stack traces
- **Grafana**: Metrics dashboards
- **Datadog**: APM metrics, traces

**Attribution**: Brand logos displayed in:
- Post source badges
- Embed headers
- Drawer headers

### 4. Rich Content Types

**Post Types**:
1. **Incident Posts**: Alert-style with red ring, fire icon
2. **Success Posts**: Green metrics, positive trends
3. **Collaboration Posts**: Code snippets, @mentions
4. **Status Posts**: Updates, announcements

**Embed Types**:
1. **Graphs**: Time-series charts with live data
2. **Metrics**: KPI cards with trend indicators
3. **Videos**: Loom recordings, walkthroughs
4. **Code**: Syntax-highlighted snippets, diffs
5. **Slack Threads**: Conversation context

### 5. Command Palette (Cmd+K)

**Features**:
- Fuzzy search (not implemented in mock)
- Keyboard navigation
- Quick navigation shortcuts
- Recent file access
- AI query entry point

**Sections**:
1. Ask Intelligence
2. Jump to View
3. Recent Context

### 6. Responsive Layout

**Breakpoints**:
- Sidebar collapse: 280px → 72px
- Chat open: Adds 400px right margin to feed
- Feed max-width: 768px (centered)

**Smooth Transitions**:
- Sidebar: `duration-500 cubic-bezier(0.25, 1, 0.5, 1)`
- Chat: `duration-500 cubic-bezier(0.25, 1, 0.5, 1)`
- Drawer: `duration-300 cubic-bezier(0.16, 1, 0.3, 1)`

### 7. Dark Mode

**Implementation**:
- `html.dark` class on root element
- CSS variable overrides
- All components use semantic tokens
- Automatic icon/logo inversions (e.g., GitHub logo)

**Trigger**: Moon/Sun icon in sidebar footer.

### 8. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open Command Palette |
| `Cmd+\` / `Ctrl+\` | Toggle Sidebar Collapse |
| `Esc` | Close Command Palette |
| `↑↓` | Navigate Command Palette |
| `Enter` | Select Command Palette Item |
| `Enter` | Send Chat Message |
| `Enter` | Post Commander Update |

---

## Data Models

### Post Model

```typescript
interface Post {
  id: string;
  author: User;
  timestamp: string;
  type: PostType; // 'incident' | 'success' | 'collaboration' | 'status'
  squadId: string;
  headline?: string;
  content: string;
  embed?: EmbedData;
  detailContent?: DetailContent;
  reactions: {
    fire?: number;
    heart?: number;
    pinned?: boolean;
  };
  comments: number;
  tags?: string[];
  sources?: SourceType[]; // 'slack' | 'github' | 'sentry' | 'grafana' | 'datadog'
  replies?: Post[];
  aiInsight?: string;
}
```

### User Model

```typescript
interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  type: UserType; // 'bot' | 'human'
  role?: string;
}
```

### Embed Data Model

```typescript
interface EmbedData {
  type: 'graph' | 'metric' | 'video' | 'code' | 'slack_thread';
  title?: string;
  graphData?: ChartDataPoint[];
  metricValue?: string;
  metricLabel?: string;
  metricTrend?: number;
  videoUrl?: string;
  codeSnippet?: string;
  impact?: string;
  slackMessages?: SlackMessage[];
}
```

### Detail Content Model

```typescript
interface DetailContent {
  type: DetailContentType; // 'log' | 'metrics' | 'pr_diff' | 'status_report'
  title: string;
  subtitle?: string;
  source?: SourceType;
  logData?: string; // JSON string
  metricData?: Array<{ label: string; value: string; delta?: string }>;
  prData?: {
    repo: string;
    branch: string;
    filesChanged: number;
    additions: number;
    deletions: number;
    diff: string;
  };
  statusItems?: Array<{
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    latency: string;
  }>;
}
```

### Chat Message Model

```typescript
interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}
```

---

## Keyboard Shortcuts

### Global

| Key | Action |
|-----|--------|
| `Cmd+K` | Open Command Palette |
| `Cmd+\` | Toggle Sidebar |
| `Esc` | Close Modal/Palette |

### Command Palette

| Key | Action |
|-----|--------|
| `↑` | Navigate Up |
| `↓` | Navigate Down |
| `Enter` | Select Item |
| `Esc` | Close Palette |

### Quick Navigation (from Command Palette)

| Key | Action |
|-----|--------|
| `G P` | Go to Platform & Infra |
| `G C` | Go to Checkout & Pay |
| `G D` | Go to Design System |

---

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

- URL: `http://localhost:5173`
- HMR enabled
- Fast refresh for React components

### File Structure Conventions

- **Components**: PascalCase files in `/components` folder
- **Utilities**: camelCase files in root or `/utils`
- **Types**: Defined in `types.ts`
- **Constants**: Defined in `constants.ts`

### Adding New Components

1. Create component file in `/components`
2. Define props interface
3. Export as named export
4. Import in `App.tsx`

### Adding New Post Types

1. Add type to `PostType` in `types.ts`
2. Update `FeedPost.tsx` rendering logic
3. Add mock data to `constants.ts`
4. Update styling for new type

### Adding New Embed Types

1. Add type to `EmbedData` in `types.ts`
2. Add rendering logic to `RichEmbed.tsx`
3. Create mock data in `constants.ts`

---

## Deployment

### Build

```bash
npm run build
```

Outputs to `/dist` folder.

### Environment Variables

Currently, the app uses CDN imports and does not require environment variables.

For future API integration:
```env
VITE_API_URL=https://api.obstell.com
VITE_GEMINI_API_KEY=your_api_key
```

### Hosting Recommendations

- **Vercel**: Zero-config deployment
- **Netlify**: Simple drag-and-drop
- **CloudFlare Pages**: Fast edge deployment
- **AWS S3 + CloudFront**: Scalable static hosting

### Production Checklist

- [ ] Set proper API endpoints
- [ ] Replace mock data with real API calls
- [ ] Configure authentication
- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics
- [ ] Optimize bundle size
- [ ] Add service worker for offline support
- [ ] Configure CSP headers
- [ ] Enable gzip/brotli compression

---

## Design Tokens Reference

### Colors

```javascript
// Light Mode
--corp-bg: #F3F4F6
--corp-surface: #FFFFFF
--corp-border: #18181B
--corp-text: #1F2937
--corp-muted: #6B7280
--corp-primary: #6366F1

// Dark Mode
--corp-bg: #09090B
--corp-surface: #18181B
--corp-border: #3F3F46
--corp-text: #FAFAFA
--corp-muted: #A1A1AA
--corp-primary: #818CF8
```

### Shadows (Neobrutalist)

```css
shadow-corp-sm: 2px 2px 0px 0px var(--corp-border)
shadow-corp-md: 4px 4px 0px 0px var(--corp-border)
shadow-corp-lg: 6px 6px 0px 0px var(--corp-border)
shadow-corp-xl: 6px 6px 0px 0px var(--corp-border)
```

### Border Widths

```css
border-1: 1px
border-2: 2px (default for neobrutalist style)
border-3: 3px
```

### Spacing

```css
Sidebar: 280px (collapsed: 72px)
Chat: 400px
Feed Max Width: 768px
Card Padding: 24px (p-6)
Post Gap: 32px (space-y-8)
```

---

## Future Enhancements

### Planned Features

1. **Real-time Updates**: WebSocket integration for live feed updates
2. **Notifications**: Push notifications for mentions and incidents
3. **Search**: Full-text search across posts and logs
4. **Filters**: Advanced filtering by date, type, source, squad
5. **Custom Views**: User-created saved views and filters
6. **Export**: PDF/CSV export for reports
7. **Integrations**: More source integrations (PagerDuty, Linear, Jira)
8. **AI Actions**: ObsAgent can execute actions (rollbacks, scaling)
9. **Mobile App**: React Native companion app
10. **Collaboration**: In-line commenting and resolution workflows

### Technical Improvements

- [ ] Replace mock data with real API
- [ ] Implement proper state management (Zustand/Redux)
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Implement proper error boundaries
- [ ] Add loading skeletons
- [ ] Optimize re-renders with React.memo
- [ ] Implement virtual scrolling for long feeds
- [ ] Add PWA support
- [ ] Implement proper authentication flow

---

## Credits

**Design & Development**: ObsTell Team
**Icons**: Phosphor Icons
**Charts**: Recharts
**Fonts**: Google Fonts (Inter, Space Grotesk, JetBrains Mono)
**Logo Sources**: Wikimedia Commons, Official Brand Assets

---

## License

Proprietary - All Rights Reserved

---

## Contact & Support

For questions or support, contact the ObsTell engineering team.

**Version**: 2.0.0
**Last Updated**: December 2025
