import { Post } from './types';

export const CURRENT_USER = {
  id: 'u1',
  name: 'Sarah Chen',
  role: 'VP Engineering',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
  type: 'human' as const,
};

export const SQUADS = [
    { id: 'platform-infra', label: 'Platform & Infra', icon: 'HardDrives', description: 'Core reliability & cloud' },
    { id: 'growth', label: 'Growth Squad', icon: 'TrendUp', description: 'Acquisition & experiments' },
    { id: 'checkout', label: 'Checkout & Pay', icon: 'CreditCard', description: 'Payments processing' },
    { id: 'design-system', label: 'Design System', icon: 'Palette', description: 'UI components & brand' },
    { id: 'exec-briefing', label: 'Exec Briefing', icon: 'Briefcase', description: 'High-level KPIs' },
    { id: 'mobile-app', label: 'Mobile App', icon: 'DeviceMobile', description: 'iOS & Android' },
    { id: 'data-eng', label: 'Data Engineering', icon: 'Database', description: 'Pipelines & Warehousing' },
];

// --- Mock Charts ---
export const CHART_LATENCY = [
  { time: '10:00', value: 45 }, { time: '10:05', value: 48 }, { time: '10:10', value: 42 },
  { time: '10:15', value: 50 }, { time: '10:20', value: 240 }, { time: '10:25', value: 890 },
  { time: '10:30', value: 1200 }, { time: '10:35', value: 450 }, { time: '10:40', value: 120 },
];

export const CHART_QUEUE = [
    { time: '14:00', value: 10 }, { time: '14:10', value: 15 }, { time: '14:20', value: 80 },
    { time: '14:30', value: 150 }, { time: '14:40', value: 220 }, { time: '14:50', value: 180 },
];

export const CHART_CPU = [
    { time: '00m', value: 45 }, { time: '05m', value: 48 }, { time: '10m', value: 65 },
    { time: '15m', value: 85 }, { time: '20m', value: 92 }, { time: '25m', value: 98 },
    { time: '30m', value: 75 }, { time: '35m', value: 60 }, { time: '40m', value: 55 },
];

// --- Mock Detail Content ---

const LOG_INCIDENT_1 = JSON.stringify({
  level: "error",
  timestamp: "2023-10-27T10:22:15.112Z",
  service: "api-gateway",
  trace_id: "req_882910aa",
  error: "UpstreamTimeout",
  message: "Request to auth-service timed out after 5000ms",
  context: {
    pod: "api-gateway-7d8b9c",
    region: "us-east-1",
    user_tier: "enterprise"
  },
  stack_trace: [
    "at HTTPClient.request (src/utils/http.ts:45:12)",
    "at AuthService.validate (src/services/auth.ts:102:8)",
    "at processTicksAndRejections (node:internal/process/task_queues:96:5)"
  ]
}, null, 2);

const PR_DIFF_1 = `diff --git a/src/services/jwt.ts b/src/services/jwt.ts
index 827a...92b1 100644
--- a/src/services/jwt.ts
+++ b/src/services/jwt.ts
@@ -45,7 +45,7 @@ export async function validateToken(token: string) {
   // OPTIMIZATION: Remove redundant DB check for cached tokens
-  const user = await db.users.findById(decoded.id);
-  if (!user || !user.isActive) throw new Error("Invalid User");
+  // const user = await db.users.findById(decoded.id);
+  // if (!user || !user.isActive) throw new Error("Invalid User");
   
   return decoded;
 }`;

// --- Posts ---

export const MOCK_POSTS: Post[] = [
  // 1. High Priority Incident
  {
    id: 'p1',
    author: { id: 'bot', name: 'ObsAgent', type: 'bot', role: 'Intelligence' },
    timestamp: '2m ago',
    type: 'incident',
    squadId: 'platform-infra',
    headline: 'High Latency on API Gateway',
    content: "Detected unusual p99 latency spike (reached **1.2s**). Correlated with recent deployment to `auth-service`.",
    embed: {
      type: 'graph',
      title: 'p99 Latency (ms)',
      graphData: CHART_LATENCY,
      impact: 'Affecting 5% of traffic'
    },
    detailContent: {
        type: 'log',
        title: 'Incident Analysis',
        subtitle: 'Selected Error Logs (Sampled)',
        logData: LOG_INCIDENT_1
    },
    sources: ['datadog', 'sentry', 'github'],
    reactions: { fire: 12, pinned: true },
    comments: 4,
    tags: ['latency', 'p0', 'auth'],
    aiInsight: "This pattern matches a previous memory leak in the redis connection pool. Recommended action: Cycle pods."
  },
  // 2. Collaboration/Fix
  {
    id: 'p2',
    author: { id: 'u2', name: 'Daksh Bagga', role: 'Staff Engineer', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daksh&backgroundColor=c0aede', type: 'human' },
    timestamp: '15m ago',
    type: 'collaboration',
    squadId: 'platform-infra',
    content: "@ObsAgent I've identified the bottleneck. The new JWT validation logic is doing a redundant DB lookup. \n\nPushing a hotfix in PR #4052. Rollback not required.",
    embed: {
      type: 'code',
      codeSnippet: "if (token.isValid && !cache.has(token.id)) {\n  // Removing this redundant await\n  return true;\n}",
      title: 'Fix: Remove redundant verification'
    },
    detailContent: {
        type: 'pr_diff',
        title: 'PR #4052: Optimize JWT Validation',
        subtitle: 'Merged by Daksh Bagga',
        prData: {
            repo: 'backend-monorepo',
            branch: 'fix/jwt-perf',
            filesChanged: 1,
            additions: 2,
            deletions: 4,
            diff: PR_DIFF_1
        }
    },
    replies: [
        {
            id: 'p2-r1',
            author: { id: 'bot', name: 'ObsAgent', type: 'bot', role: 'Intelligence' },
            timestamp: 'Just now',
            type: 'status',
            squadId: 'platform-infra',
            content: "Acknowledged. Monitoring `api-gateway` latency for recovery. Incident status updated to **Fix in Progress**.",
            reactions: { heart: 0 },
            comments: 0
        }
    ],
    reactions: { heart: 8, fire: 2 },
    comments: 1,
    aiInsight: "This fix reduces the complexity of `validateToken` from O(N) to O(1) for cached sessions. Expected latency drop: -250ms."
  },
  // 3. New Slack Source Incident Context
  {
    id: 'p_slack_context',
    author: { id: 'bot', name: 'ObsAgent', type: 'bot', role: 'Intelligence' },
    timestamp: '45m ago',
    type: 'incident',
    squadId: 'data-eng',
    headline: 'Pipeline Failure: ETL-Primary',
    content: "The ETL pipeline failed to materialize the `daily_revenue` table. This appears to be caused by a schema change discussed in Slack earlier.",
    embed: {
        type: 'slack_thread',
        title: 'Context from #data-ops',
        slackMessages: [
            { author: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', timestamp: '10:42 AM', text: "Hey folks, I'm renaming the `amt` column to `amount_cents` in the raw events table." },
            { author: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', timestamp: '10:45 AM', text: "Make sure to update the dbt models, otherwise the nightly build will fail." },
            { author: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', timestamp: '10:46 AM', text: "Ah right, adding that to my to-do list." }
        ]
    },
    sources: ['slack', 'sentry'],
    reactions: { fire: 5 },
    comments: 2,
    tags: ['etl', 'data-quality'],
    aiInsight: "Causality detected: The schema change mentioned by James in Slack (renaming `amt`) matches the `ColumnNotFound` error in Sentry."
  },
  // 4. Growth Win
  {
    id: 'p3',
    author: { id: 'bot', name: 'ObsAgent', type: 'bot', role: 'Intelligence' },
    timestamp: '1h ago',
    type: 'success',
    squadId: 'growth',
    headline: 'Experiment Result: Sticky Header',
    content: "The **Sticky Header** experiment has reached significance. \n\nVariant B shows a clear uplift in engagement metrics across mobile users.",
    embed: {
      type: 'metric',
      metricValue: '+14.2%',
      metricLabel: 'Session Duration',
      metricTrend: 14.2,
    },
    detailContent: {
        type: 'metrics',
        title: 'Experiment: Sticky Header',
        subtitle: 'Variant B vs Control (Mobile Only)',
        metricData: [
            { label: 'Session Duration', value: '4m 12s', delta: '+14.2%' },
            { label: 'Bounce Rate', value: '42.5%', delta: '-5.1%' },
            { label: 'Checkout Conv.', value: '2.1%', delta: '+0.4%' },
            { label: 'Sample Size', value: '45,200', delta: '' }
        ]
    },
    sources: ['grafana', 'datadog'],
    reactions: { heart: 24 },
    comments: 8,
    tags: ['growth', 'experiment'],
    aiInsight: "This experiment is performing in the top 5% of all UI tests this year. Suggestion: Promote to 100% rollout immediately."
  },
  // 5. Design System
  {
    id: 'p4',
    author: { id: 'u3', name: 'Elena Rostova', role: 'Product Lead', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfbf', type: 'human' },
    timestamp: '3h ago',
    type: 'status',
    squadId: 'design-system',
    headline: 'Q4 Design System Update',
    content: "We've officially deprecated `ButtonLegacy`. Please migrate all usages to `ButtonNext` by end of sprint.\n\nSee the migration guide below.",
    embed: {
        type: 'video',
        title: 'Migration Walkthrough',
        videoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800'
    },
    detailContent: {
        type: 'status_report',
        title: 'Component Status',
        subtitle: 'Design System v4.2',
        statusItems: [
            { name: 'ButtonLegacy', status: 'down', latency: 'Deprecated' },
            { name: 'ButtonNext', status: 'healthy', latency: 'Stable' },
            { name: 'TextInput', status: 'healthy', latency: 'Stable' },
            { name: 'Modal', status: 'degraded', latency: 'Beta' }
        ]
    },
    reactions: { heart: 5, fire: 1 },
    comments: 12,
    aiInsight: "There are still 42 usages of `ButtonLegacy` in the codebase. ObsAgent can open a PR to auto-migrate these."
  },
  // 6. Executive Briefing
  {
    id: 'p5',
    author: { id: 'bot', name: 'ObsAgent', type: 'bot', role: 'Intelligence' },
    timestamp: '4h ago',
    type: 'status',
    squadId: 'exec-briefing',
    headline: 'Weekly Revenue Forecast',
    content: "Current MRR trajectory is slightly above forecast due to Enterprise plan upgrades.",
    embed: {
        type: 'metric',
        metricValue: '$1.2M',
        metricLabel: 'Projected MRR',
        metricTrend: 2.4
    },
    detailContent: {
        type: 'metrics',
        title: 'Financial Health',
        subtitle: 'Q4 Forecast',
        metricData: [
            { label: 'MRR', value: '$1.24M', delta: '+2.4%' },
            { label: 'New Logos', value: '142', delta: '+12%' },
            { label: 'Churn', value: '0.8%', delta: '-0.1%' }
        ]
    },
    sources: ['grafana'],
    reactions: { heart: 45 },
    comments: 2,
    aiInsight: "Growth is driven by the 'Enterprise' segment (+12%). 'Starter' plans are flat. Consider re-targeting 'Starter' users."
  },
  // 7. Checkout Incident
  {
    id: 'p6',
    author: { id: 'u4', name: 'Marcus Chen', role: 'DevOps', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=d1d4f9', type: 'human' },
    timestamp: '5h ago',
    type: 'incident',
    squadId: 'checkout',
    headline: 'Stripe Webhook Delays',
    content: "Seeing a 5 minute delay in webhook processing. Queue depth is growing.",
    embed: {
        type: 'graph',
        title: 'Queue Depth',
        graphData: CHART_QUEUE,
    },
    detailContent: {
        type: 'log',
        title: 'Webhook Processing Logs',
        subtitle: 'Worker Pool #4',
        logData: JSON.stringify({
            level: "warn",
            message: "Queue processing lagging behind by 300s",
            worker_id: "worker-4a",
            queue_size: 2450,
            avg_process_time: "450ms"
        }, null, 2)
    },
    sources: ['datadog', 'sentry'],
    reactions: { fire: 4 },
    comments: 6,
    tags: ['incident', 'payments'],
    aiInsight: "Worker utilization is at 100% despite auto-scaling. Suggest checking for a poison pill message blocking the queue."
  },
  // 8. New: Slack Deployment Notification
  {
    id: 'p_slack_deploy',
    author: { id: 'u2', name: 'Daksh Bagga', role: 'Staff Engineer', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daksh&backgroundColor=c0aede', type: 'human' },
    timestamp: '6h ago',
    type: 'status',
    squadId: 'platform-infra',
    content: "Just merged the new caching layer for `product-service` to main. \n\nDeployment triggered via Slack command.",
    embed: {
        type: 'slack_thread',
        title: 'Deployment Triggered in #deployments',
        slackMessages: [
             { author: 'Daksh Bagga', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daksh&backgroundColor=c0aede', timestamp: '2:15 PM', text: "/deploy product-service --branch=feat/redis-cache" },
             { author: 'DeployBot', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bot', timestamp: '2:15 PM', text: "🚀 Deployment started for `product-service`. ETA 4m." },
             { author: 'DeployBot', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bot', timestamp: '2:19 PM', text: "✅ Deployment successful. Version `v2.5.0` is now live." }
        ]
    },
    sources: ['slack', 'github'],
    reactions: { heart: 12 },
    comments: 0,
    tags: ['deploy', 'infra'],
    aiInsight: "Deployment successfully correlated with a 15% drop in database read IOPS. Cache hit ratio increased to 92%."
  }
];