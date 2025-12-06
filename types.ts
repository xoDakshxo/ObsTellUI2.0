
export type UserType = 'bot' | 'human';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  type: UserType;
  role?: string;
}

export type PostType = 'incident' | 'success' | 'collaboration' | 'status';

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface SlackMessage {
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
}

export type SourceType = 'slack' | 'github' | 'sentry' | 'grafana' | 'datadog';

export interface EmbedData {
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

// Structured content for the drawer to render specific views
export type DetailContentType = 'log' | 'metrics' | 'pr_diff' | 'status_report';

export interface DetailContent {
  type: DetailContentType;
  title: string;
  subtitle?: string;
  source?: SourceType; // Added for branding in drawer
  // Specific data structures based on type
  logData?: string; // JSON string
  metricData?: Array<{ label: string; value: string; delta?: string }>;
  prData?: { repo: string; branch: string; filesChanged: number; additions: number; deletions: number; diff: string };
  statusItems?: Array<{ name: string; status: 'healthy' | 'degraded' | 'down'; latency: string }>;
}

export interface Post {
  id: string;
  author: User;
  timestamp: string;
  type: PostType;
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
  sources?: SourceType[];
  replies?: Post[];
  // New AI Element for every post
  aiInsight?: string;
}

export interface DrawerContext {
  isOpen: boolean;
  data?: DetailContent; // Now uses the structured type
}

export type ViewType = 'home' | 'mentions' | 'saved' | string;

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
    isThinking?: boolean; // For bot loading state
}
