export interface StatItem {
  value: number;
  suffix: string;
  superscript?: string;
  label: string;
  detail: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  shortYear: string;
  title: string;
  company: string;
  location: string;
  badge: string;
  description: string;
  highlights: string[];
}

export interface SkillItem {
  name: string;
  tier?: 'Expert' | 'Advanced' | 'Working';
  detail: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  caption: string;
  items: SkillItem[];
}

export interface OrbitTool {
  name: string;
  category: string;
  color: string;
  svgPath?: string;
  iconUrl?: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  visualType: 'ansible-yaml' | 'chatops-bot' | 'self-healing' | 'patents-hub';
  accent: string;
}

export interface AwardItem {
  year?: string;
  title: string;
  org: string;
  description: string;
  badge: string;
}

export interface PipelineStage {
  id: string;
  step: string;
  title: string;
  tool: string;
  latency: string;
  status: string;
  description: string;
  command: string;
}

export interface TerminalScriptLine {
  type: 'cmd' | 'info' | 'success' | 'warn' | 'output';
  prompt?: string;
  text: string;
}

export const PROFILE = {
  name: 'Mohammed Shadab',
  firstName: 'Mohammed',
  lastName: 'Shadab',
  initials: 'MS.',
  badge: 'Available for Opportunities',
  role: 'Platform Engineer',
  company: 'Mercedes-Benz R&D India',
  companyFull: 'Mercedes-Benz Research and Development India',
  plantLocation: 'Sindelfingen, Germany',
  overline: 'Platform Engineer · Mercedes-Benz R&D India',
  headline: 'I build. I solve. I deliver.',
  subheadline:
    'At Mercedes-Benz R&D, I own an ADAS ECU test farm with 100+ benches and lead a team to deliver and sustain reliable day-to-day operations. I work across DevOps, AIOps and platform operations, turning complex problems into dependable tools and staying accountable through high-pressure delivery.',
  manifesto:
    'I take ownership from the first user request to the last production issue. I lead two engineers and keep a 100+ environment bench farm ready for the teams who depend on it. I automate recurring work, introduce useful technologies, and tackle problems early to prevent escalations. When delivery gets difficult, I stay with the problem and see it through.',
  location: 'Bengaluru, Karnataka, India',
  coordinates: {
    bengaluru: { lat: 12.9716, lng: 77.5946, label: 'Bengaluru · MBRDI HQ' },
    sindelfingen: { lat: 48.7093, lng: 9.0032, label: 'Sindelfingen · MB AG Plant' },
  },
  email: 'mohammedshadab555@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/-mshadab',
  linkedinDisplay: 'linkedin.com/in/-mshadab',
  githubUrl: 'https://github.com/MSHADAB-5',
  githubDisplay: 'github.com/MSHADAB-5',
  typedPhrases: [
    'End-to-end bench-farm ownership',
    'Leading a team of two engineers',
    'DevOps · AIOps · User enablement',
    'Calm under pressure. Persistent.',
    'Automation that helps people',
  ],
} as const;

/**
 * Phone number stored in char-code segments so static HTML scrapers
 * never see the raw phone string in index.html or bundled strings.
 * Decodes to +91-9741039435 only on explicit user interaction.
 */
const PHONE_CHAR_CODES: readonly number[] = [
  43, 57, 49, 45, 57, 55, 52, 49, 48, 51, 57, 52, 51, 53,
];

export function decodePhoneNumber(): string {
  return String.fromCharCode(...PHONE_CHAR_CODES);
}

export function getMaskedPhonePreview(): string {
  return '+91-9741••••35';
}

export const HERO_STATS: readonly StatItem[] = [
  {
    value: 100,
    suffix: '+',
    label: 'Environments Managed',
    detail: 'Linux, Windows & QNX test and validation targets orchestrated via Ansible/AWX',
  },
  {
    value: 3,
    suffix: '+',
    label: 'Years Experience',
    detail: 'Platform automation, CI/CD pipelines & resilient operations at Mercedes-Benz R&D',
  },
  {
    value: 2,
    suffix: '',
    label: 'Engineers Led',
    detail: 'Currently leading two engineers across bench-farm operations, automation and user support',
  },
  {
    value: 10,
    suffix: '+',
    label: 'Programs Supported',
    detail: 'Multi-generation vehicle software and hardware-in-the-loop platforms',
  },
];

export const PIPELINE_STAGES: readonly PipelineStage[] = [
  {
    id: 'commit',
    step: '01',
    title: 'GitOps Commit',
    tool: 'Git · GitLab',
    latency: '120ms',
    status: 'VERIFIED',
    description:
      'Signed infrastructure-as-code definitions, role inventories, and pipeline templates versioned with branch policies.',
    command: 'git push origin main',
  },
  {
    id: 'build',
    step: '02',
    title: 'Pipeline Orchestration',
    tool: 'Jenkins · GitLab CI',
    latency: '38s',
    status: 'BUILT',
    description:
      'Multi-stage Groovy & YAML pipelines spin up ephemeral Docker builders and validate playbooks in parallel.',
    command: 'jenkins build --pipeline=platform-core',
  },
  {
    id: 'gate',
    step: '03',
    title: 'Lint & Security Gate',
    tool: 'RBAC · Policy Check',
    latency: '14s',
    status: 'PASSED',
    description:
      'Automated dry-runs, credential boundary checks, and role-based access validation prior to fleet rollout.',
    command: 'ansible-playbook deploy.yml --check --diff',
  },
  {
    id: 'deploy',
    step: '04',
    title: 'Fleet Provisioning',
    tool: 'Ansible · AWX',
    latency: '1m 55s',
    status: '112 OK',
    description:
      'High-concurrency AWX job templates provision and configure 100+ heterogeneous Linux, Windows, and QNX nodes.',
    command: 'ansible-playbook -i inventory/prod deploy.yml --forks=50',
  },
  {
    id: 'monitor',
    step: '05',
    title: 'Live Health Probes',
    tool: 'Python · Telemetry',
    latency: '42ms',
    status: 'NOMINAL',
    description:
      'Continuous health probes track CPU, service responsiveness, and environment reservation state across the fleet.',
    command: 'python3 monitor.py --mode=live --interval=5s',
  },
  {
    id: 'heal',
    step: '06',
    title: 'Autonomous Self-Healing',
    tool: 'Event-Driven Recovery',
    latency: '12s',
    status: 'HEALED',
    description:
      'Degraded nodes automatically trigger isolated recovery playbooks—service restart, cache flush, or full re-provision.',
    command: 'python3 monitor.py --auto-heal --target=env-047',
  },
  {
    id: 'chatops',
    step: '07',
    title: 'AI ChatOps Summary',
    tool: 'Teams Bot · Azure OpenAI',
    latency: '1.1s',
    status: 'SUMMARIZED',
    description:
      'Structured GPT-4 prompts synthesize root-cause context in Microsoft Teams and route one-click remediation actions.',
    command: 'curl -s teams-bot/api/status | python3 -m json.tool',
  },
];

export const EXPERIENCE_TIMELINE: readonly TimelineItem[] = [
  {
    id: 'sindelfingen-2025',
    date: 'Oct – Dec 2025',
    shortYear: '2025',
    title: 'On-Site Deployment — Sindelfingen, Germany',
    company: 'Mercedes-Benz AG, Sindelfingen Plant',
    location: 'Sindelfingen, Germany',
    badge: 'International Deployment',
    description:
      'Deployed on-site at the Sindelfingen manufacturing plant for 3 months during a critical delivery phase. Resolved infrastructure bottlenecks, optimized CI/CD workflows, and improved cross-site coordination between India and Germany teams.',
    highlights: [
      'Unblocked critical-path test & manufacturing plant infrastructure on the ground in Germany',
      'Streamlined CI/CD release handoffs between Bengaluru R&D and Sindelfingen engineering teams',
      'Hardened environment stability during peak vehicle program milestones',
    ],
  },
  {
    id: 'ai-spoc-2024',
    date: '2024 – Present',
    shortYear: '2024',
    title: 'AI-Augmented Operations & Innovation SPOC',
    company: 'Mercedes-Benz Research and Development India',
    location: 'Bengaluru, India',
    badge: 'Innovation SPOC · Excellence Award',
    description:
      'Built a Teams ChatOps bot with Azure OpenAI integration for intelligent alert summarization. Driving AI/automation adoption as department Innovation SPOC. Received Achievement of Excellence Award.',
    highlights: [
      'Engineered Microsoft Teams ChatOps bot integrated with Azure OpenAI for conversational ops',
      'Led department-wide ideation workshops and mentored engineers on patent filing',
      'Patent pipeline: one application in the grant pipeline and two submissions in jury review',
    ],
  },
  {
    id: 'platform-eng-2023',
    date: 'July 2023 – Present',
    shortYear: '2023',
    title: 'Software Engineer — Platform & Infrastructure Automation',
    company: 'Mercedes-Benz Research and Development India',
    location: 'Bengaluru, India',
    badge: 'Core Platform Ownership',
    description:
      'Own the end-to-end operation of a 100+ environment bench farm and currently lead two engineers. Work across platform operations, CI/CD, automation and user support to keep vehicle programs moving, prevent escalations and resolve critical blockers under pressure.',
    highlights: [
      'Lead two engineers and coordinate cross-functional delivery, user support and bench-farm reliability',
      'Automate provisioning, reservations and recovery across Linux, Windows and QNX with Ansible/AWX',
      'Introduce monitoring, Teams ChatOps and CI/CD improvements to reduce manual work and address issues before escalation',
    ],
  },
  {
    id: 'be-sit-2019',
    date: '2019 – 2023',
    shortYear: '2019',
    title: 'B.E. in Electronics & Communications',
    company: 'Siddaganga Institute of Technology, Tumkur',
    location: 'Tumkur, Karnataka',
    badge: 'CGPA 8.08/10 · Best Paper Award',
    description:
      'CGPA: 8.08/10. Won Best Paper Award at ICoAC 2023 (Anna University) for "Design of Voice Automated Floor Cleaning Robot". Active in robotics and embedded systems projects.',
    highlights: [
      'Best Paper Award at 12th International Conference on Advanced Computing (ICoAC 2023), Anna University',
      'Built embedded & robotics systems combining hardware control with voice automation',
    ],
  },
];

export const PROJECTS: readonly ProjectItem[] = [
  {
    id: 'automation-framework',
    index: '01',
    eyebrow: 'INFRASTRUCTURE AS CODE · FLEET ORCHESTRATION',
    title: 'Environment Automation Framework',
    subtitle: 'Ansible & AWX platform orchestrating 100+ multi-OS environments on demand',
    description:
      'I own the bench-farm lifecycle across 100+ test environments, from provisioning and reservations to user support and recovery. Built Ansible/AWX automation for repeatable Linux, Windows and QNX operations, reducing manual work for engineering teams.',
    metrics: [
      { label: 'Managed Fleet', value: '100+ Envs' },
      { label: 'Concurrency', value: '50 Forks' },
      { label: 'Target OS', value: 'Linux · Win · QNX' },
    ],
    tags: ['Ansible', 'AWX', 'IaC', 'Python', 'RBAC'],
    visualType: 'ansible-yaml',
    accent: '#2997ff',
  },
  {
    id: 'teams-chatops-bot',
    index: '02',
    eyebrow: 'AI-AUGMENTED OPERATIONS · CONVERSATIONAL INFRA',
    title: 'Teams ChatOps Bot',
    subtitle: 'Azure OpenAI operational copilot inside Microsoft Teams',
    description:
      'Built a Microsoft Teams application connecting on-premises operations to Teams through an intranet-to-internet bridge. Integrated Azure OpenAI for alert summaries, diagnostic suggestions and routing to automation workflows, giving engineers conversational access to environment and pipeline health.',
    metrics: [
      { label: 'AI Engine', value: 'Azure OpenAI' },
      { label: 'Interface', value: 'MS Teams Bot' },
      { label: 'Routing', value: 'Agent Workflows' },
    ],
    tags: ['Python', 'Azure OpenAI', 'Bot Framework', 'REST API'],
    visualType: 'chatops-bot',
    accent: '#64d2ff',
  },
  {
    id: 'self-healing-platform',
    index: '03',
    eyebrow: 'AUTONOMOUS RELIABILITY · ZERO-TOUCH RECOVERY',
    title: 'Self-Healing Platform',
    subtitle: 'Closed-loop fault detection and automated remediation engine',
    description:
      'Automated fault detection and recovery system. Detects degraded environments via health probes, triggers recovery sequences (restart, reset, re-provision) without human intervention. Reduced downtime significantly.',
    metrics: [
      { label: 'Detection', value: 'Live Probes' },
      { label: 'Remediation', value: 'Zero-Touch' },
      { label: 'Recovery Loop', value: 'Restart → Re-provision' },
    ],
    tags: ['Python', 'Ansible', 'Monitoring', 'Event-Driven'],
    visualType: 'self-healing',
    accent: '#30d158',
  },
  {
    id: 'patents-innovation',
    index: '04',
    eyebrow: 'INTELLECTUAL PROPERTY · R&D LEADERSHIP',
    title: 'Patents & Innovation SPOC',
    subtitle: 'Driving AI & automation invention disclosures across the department',
    description:
      'Department Innovation SPOC driving AI/GenAI adoption, workshops and mentoring across teams. Manage one patent application in the grant pipeline and two submissions in jury review.',
    metrics: [
      { label: 'Patent Pipeline', value: '3 Submissions' },
      { label: 'Jury Review', value: '2 Submissions' },
      { label: 'Grant Pipeline', value: '1 Application' },
    ],
    tags: ['Patents', 'Innovation', 'Mentoring', 'Workshops', 'AI Adoption'],
    visualType: 'patents-hub',
    accent: '#bf5af2',
  },
];

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    id: 'infra',
    title: 'Infrastructure & Automation',
    caption: 'Fleet-scale configuration management, containers & multi-OS environments',
    items: [
      {
        name: 'Ansible / AWX',
        tier: 'Expert',
        detail: 'Role architecture, dynamic inventories, RBAC & 100+ environment orchestration',
      },
      {
        name: 'Linux (RHEL / Ubuntu)',
        tier: 'Expert',
        detail: 'Systemd, kernel/network tuning, permissions, storage & service hardening',
      },
      {
        name: 'Infrastructure as Code',
        tier: 'Expert',
        detail: 'Idempotent provisioning, declarative state & automated environment lifecycles',
      },
      {
        name: 'Docker',
        tier: 'Expert',
        detail: 'Multi-stage builds, Compose stacks, isolated CI runners & service containers',
      },
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD & DevOps',
    caption: 'Release pipelines, GitOps workflows & cross-site delivery gates',
    items: [
      {
        name: 'Jenkins',
        tier: 'Expert',
        detail: 'Declarative & scripted Groovy pipelines, shared libraries & distributed agents',
      },
      {
        name: 'Git & GitOps',
        tier: 'Expert',
        detail: 'Branching strategies, webhook-driven automation & auditable infra changes',
      },
      {
        name: 'GitLab CI/CD',
        tier: 'Advanced',
        detail: 'Multi-stage DAG pipelines, runner orchestration & artifact caching',
      },
    ],
  },
  {
    id: 'code',
    title: 'Programming & Scripting',
    caption: 'Automation daemons, health monitors & pipeline DSLs',
    items: [
      {
        name: 'Shell / Bash',
        tier: 'Expert',
        detail: 'POSIX automation, system diagnostics, bootstrap scripts & log pipelines',
      },
      {
        name: 'Groovy / YAML',
        tier: 'Advanced',
        detail: 'Jenkinsfile DSLs, Ansible playbooks & structured config schemas',
      },
      {
        name: 'Python',
        tier: 'Advanced',
        detail: 'Self-healing daemons, REST integrations, CLI tooling & ChatOps backends',
      },
    ],
  },
  {
    id: 'observability',
    title: 'Observability & Monitoring',
    caption: 'Metrics, dashboards, log analytics & container-level visibility',
    items: [
      {
        name: 'Grafana',
        detail: 'Dashboards and alerting panels visualizing metrics, logs and traces',
      },
      {
        name: 'Prometheus',
        detail: 'Time-series metrics collection, PromQL queries & alert rules',
      },
      {
        name: 'Datadog',
        detail: 'SaaS observability for infrastructure monitoring, APM & log management',
      },
      {
        name: 'ELK Stack',
        detail: 'Elasticsearch, Logstash & Kibana pipeline for centralized log search and analysis',
      },
      {
        name: 'Dozzle',
        detail: 'Lightweight real-time log viewer for Docker containers',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Operational Tooling',
    caption: 'LLM-powered incident summarization & conversational infrastructure workflows',
    items: [
      {
        name: 'Teams Bot Framework',
        tier: 'Advanced',
        detail: 'Adaptive cards, webhook handlers & interactive command routing in MS Teams',
      },
      {
        name: 'Prompt Engineering',
        tier: 'Working',
        detail: 'Structured system prompts, deterministic JSON outputs & alert triage chains',
      },
      {
        name: 'Azure OpenAI API',
        tier: 'Working',
        detail: 'GPT-4 integration for telemetry summarization and guided remediation',
      },
      {
        name: 'Agentic AI',
        detail: 'Goal-driven agents that chain tools, probes and playbooks into autonomous ops workflows',
      },
    ],
  },
];

export const ORBIT_TOOLS: readonly OrbitTool[] = [
  {
    name: 'Ansible',
    category: 'Automation',
    color: '#EE0000',
    svgPath:
      'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-.24.24-.576.336-.912.24-.144-.048-.288-.12-.408-.216l-5.712-4.584-1.8 4.464c-.168.408-.624.6-.984.432-.36-.168-.552-.624-.384-1.032l4.464-11.016c.144-.36.504-.576.888-.528.384.048.696.312.816.672l3.216 10.608c.12.36.024.72-.192.96zm-2.328-3.552l-2.04-6.72-1.848 4.56 3.888 2.16z',
  },
  {
    name: 'Docker',
    category: 'Containers',
    color: '#2496ED',
    svgPath:
      'M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z',
  },
  {
    name: 'Linux',
    category: 'OS',
    color: '#FCC624',
    svgPath:
      'M12 2C9.24 2 7 4.24 7 7v4.27c-1.24 1.41-2 3.21-2 5.23 0 3.04 2.46 5.5 5.5 5.5h3c3.04 0 5.5-2.46 5.5-5.5 0-2.02-.76-3.82-2-5.23V7c0-2.76-2.24-5-5-5zm-1.5 5a1 1 0 110 2 1 1 0 010-2zm3 0a1 1 0 110 2 1 1 0 010-2zM12 10.5c1.38 0 2.5.67 2.5 1.5S13.38 13.5 12 13.5 9.5 12.83 9.5 12s1.12-1.5 2.5-1.5z',
  },
  {
    name: 'Jenkins',
    category: 'CI/CD',
    color: '#D24939',
    svgPath:
      'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.24 4.2c2.52 0 4.56 2.04 4.56 4.56v3.12c0 2.52-2.04 4.56-4.56 4.56s-4.56-2.04-4.56-4.56V8.76c0-2.52 2.04-4.56 4.56-4.56zM7.2 17.64c1.32-.96 2.98-1.52 4.8-1.52s3.48.56 4.8 1.52c-1.26 1.34-2.94 2.16-4.8 2.16s-3.54-.82-4.8-2.16z',
  },
  {
    name: 'GitLab CI',
    category: 'CI/CD',
    color: '#FC6D26',
    svgPath:
      'm23.6 9.593-.033-.086L20.3.98a.851.851 0 0 0-.336-.405.875.875 0 0 0-1.001.054.875.875 0 0 0-.29.44l-2.205 6.748H7.537l-2.206-6.75a.857.857 0 0 0-.29-.44.875.875 0 0 0-1-.053.859.859 0 0 0-.336.404L.433 9.502l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.011.009.03.022 4.976 3.726 2.462 1.863 1.5 1.132a1.008 1.008 0 0 0 1.22 0l1.5-1.132 2.461-1.863 5.006-3.749.014-.01a6.068 6.068 0 0 0 2.009-7.003z',
  },
  {
    name: 'Python',
    category: 'Code',
    color: '#3776AB',
    svgPath:
      'M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.914 0zM8.708 1.85c.578 0 1.046.47 1.046 1.048 0 .578-.468 1.047-1.046 1.047-.579 0-1.047-.469-1.047-1.047 0-.578.468-1.048 1.047-1.048zm3.378 22.15c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42H9.451s-3.24-.052-3.24 3.148v5.292S5.72 24 12.086 24zm3.206-1.85c-.578 0-1.046-.47-1.046-1.048 0-.578.468-1.047 1.046-1.047.579 0 1.047.469 1.047 1.047 0 .578-.468 1.048-1.047 1.048z',
  },
  {
    name: 'Bash',
    category: 'Scripting',
    color: '#4EAA25',
    svgPath:
      'M21.41 4.69 12.95.28a2 2 0 0 0-1.9 0L2.59 4.69A2 2 0 0 0 1.5 6.46v11.08a2 2 0 0 0 1.09 1.77l8.46 4.41a2 2 0 0 0 1.9 0l8.46-4.41a2 2 0 0 0 1.09-1.77V6.46a2 2 0 0 0-1.09-1.77zM7.5 15l-3-3 3-3 1.06 1.06L6.62 12l1.94 1.94L7.5 15zm7.5 1h-5v-1.5h5V16z',
  },
  {
    name: 'Git',
    category: 'GitOps',
    color: '#F05032',
    svgPath:
      'M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.907l2.658 2.66c.649-.223 1.387-.078 1.903.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187',
  },
  {
    name: 'AWX / Tower',
    category: 'Orchestration',
    color: '#2997FF',
    svgPath:
      'M12 2L2 7l10 5 10-5-10-5zm0 7.5L5.2 6.1 12 2.7l6.8 3.4L12 9.5zm0 2.5l-10-5v5l10 5 10-5V7l-10 5zm0 5l-10-5v5l10 5 10-5v-5l-10 5z',
  },
  {
    name: 'Azure OpenAI',
    category: 'AI Ops',
    color: '#64D2FF',
    svgPath:
      'M12 1.5l2.6 6.1 6.4.6-4.8 4.3 1.4 6.3L12 15.5l-5.6 3.3 1.4-6.3-4.8-4.3 6.4-.6L12 1.5z',
  },
  {
    name: 'ChatOps Bot',
    category: 'MS Teams',
    color: '#BF5AF2',
    svgPath:
      'M4 4h16a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2zm4 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  },
  {
    name: 'Self-Heal',
    category: 'Reliability',
    color: '#30D158',
    svgPath:
      'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z',
  },
  {
    name: 'Grafana',
    category: 'Dashboards',
    color: '#F46800',
    svgPath:
      'M23.02 10.59a8.578 8.578 0 0 0-.862-3.034 8.911 8.911 0 0 0-1.789-2.445c.337-1.342-.413-2.505-.413-2.505-1.292-.08-2.113.4-2.416.62-.052-.02-.102-.044-.154-.064-.22-.089-.446-.172-.677-.247-.231-.073-.47-.14-.711-.197a9.867 9.867 0 0 0-.875-.161C14.557.753 12.94 0 12.94 0c-1.804 1.145-2.147 2.744-2.147 2.744l-.018.093c-.098.029-.2.057-.298.088-.138.042-.275.094-.413.143-.138.055-.275.107-.41.166a8.869 8.869 0 0 0-1.557.87l-.063-.029c-2.497-.955-4.716.195-4.716.195-.203 2.658.996 4.33 1.235 4.636a11.608 11.608 0 0 0-.607 2.635C1.636 12.677.953 15.014.953 15.014c1.926 2.214 4.171 2.351 4.171 2.351.003-.002.006-.002.006-.005.285.509.615.994.986 1.446.156.19.32.371.488.548-.704 2.009.099 3.68.099 3.68 2.144.08 3.553-.937 3.849-1.173a9.784 9.784 0 0 0 3.164.501h.08l.055-.003.107-.002.103-.005.003.002c1.01 1.44 2.788 1.646 2.788 1.646 1.264-1.332 1.337-2.653 1.337-2.94v-.058c0-.02-.003-.039-.003-.06.265-.187.52-.387.758-.6a7.875 7.875 0 0 0 1.415-1.7c1.43.083 2.437-.885 2.437-.885-.236-1.49-1.085-2.216-1.264-2.354l-.018-.013-.016-.013a.217.217 0 0 1-.031-.02c.008-.092.016-.18.02-.27.011-.162.016-.323.016-.48v-.253l-.005-.098-.008-.135a1.891 1.891 0 0 0-.01-.13c-.003-.042-.008-.083-.013-.125l-.016-.124-.018-.122a6.215 6.215 0 0 0-2.032-3.73 6.015 6.015 0 0 0-3.222-1.46 6.292 6.292 0 0 0-.85-.048l-.107.002h-.063l-.044.003-.104.008a4.777 4.777 0 0 0-3.335 1.695c-.332.4-.592.84-.768 1.297a4.594 4.594 0 0 0-.312 1.817l.003.091c.005.055.007.11.013.164a3.615 3.615 0 0 0 .698 1.82 3.53 3.53 0 0 0 1.827 1.282c.33.098.66.14.971.137.039 0 .078 0 .114-.002l.063-.003c.02 0 .041-.003.062-.003.034-.002.065-.007.099-.01.007 0 .018-.003.028-.003l.031-.005.06-.008a1.18 1.18 0 0 0 .112-.02c.036-.008.072-.013.109-.024a2.634 2.634 0 0 0 .914-.415c.028-.02.056-.041.085-.065a.248.248 0 0 0 .039-.35.244.244 0 0 0-.309-.06l-.078.042c-.09.044-.184.083-.283.116a2.476 2.476 0 0 1-.475.096c-.028.003-.054.006-.083.006l-.083.002c-.026 0-.054 0-.08-.002l-.102-.006h-.012l-.024.006c-.016-.003-.031-.003-.044-.006-.031-.002-.06-.007-.091-.01a2.59 2.59 0 0 1-.724-.213 2.557 2.557 0 0 1-.667-.438 2.52 2.52 0 0 1-.805-1.475 2.306 2.306 0 0 1-.029-.444l.006-.122v-.023l.002-.031c.003-.021.003-.04.005-.06a3.163 3.163 0 0 1 1.352-2.29 3.12 3.12 0 0 1 .937-.43 2.946 2.946 0 0 1 .776-.101h.06l.07.002.045.003h.026l.07.005a4.041 4.041 0 0 1 1.635.49 3.94 3.94 0 0 1 1.602 1.662 3.77 3.77 0 0 1 .397 1.414l.005.076.003.075c.002.026.002.05.002.075 0 .024.003.052 0 .07v.065l-.002.073-.008.174a6.195 6.195 0 0 1-.08.639 5.1 5.1 0 0 1-.267.927 5.31 5.31 0 0 1-.624 1.13 5.052 5.052 0 0 1-3.237 2.014 4.82 4.82 0 0 1-.649.066l-.039.003h-.287a6.607 6.607 0 0 1-1.716-.265 6.776 6.776 0 0 1-3.4-2.274 6.75 6.75 0 0 1-.746-1.15 6.616 6.616 0 0 1-.714-2.596l-.005-.083-.002-.02v-.056l-.003-.073v-.096l-.003-.104v-.07l.003-.163c.008-.22.026-.45.054-.678a8.707 8.707 0 0 1 .28-1.355c.128-.444.286-.872.473-1.277a7.04 7.04 0 0 1 1.456-2.1 5.925 5.925 0 0 1 .953-.763c.169-.111.343-.213.524-.306.089-.05.182-.091.273-.135.047-.02.093-.042.138-.062a7.177 7.177 0 0 1 .714-.267l.145-.045c.049-.015.098-.026.148-.041.098-.029.197-.052.296-.076.049-.013.1-.02.15-.033l.15-.032.151-.028.076-.013.075-.01.153-.024c.057-.01.114-.013.171-.023l.169-.021c.036-.003.073-.008.106-.01l.073-.008.036-.003.042-.002c.057-.003.114-.008.171-.01l.086-.006h.023l.037-.003.145-.007a7.999 7.999 0 0 1 1.708.125 7.917 7.917 0 0 1 2.048.68 8.253 8.253 0 0 1 1.672 1.09l.09.077.089.078c.06.052.114.107.171.159.057.052.112.106.166.16.052.055.107.107.159.164a8.671 8.671 0 0 1 1.41 1.978c.012.026.028.052.04.078l.04.078.075.156c.023.051.05.1.07.153l.065.15a8.848 8.848 0 0 1 .45 1.34.19.19 0 0 0 .201.142.186.186 0 0 0 .172-.184c.01-.246.002-.532-.024-.856z',
  },
  {
    name: 'Prometheus',
    category: 'Metrics',
    color: '#E6522C',
    svgPath:
      'M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.628-5.373-12-12-12zm0 22.46c-1.885 0-3.414-1.26-3.414-2.814h6.828c0 1.553-1.528 2.813-3.414 2.813zm5.64-3.745H6.36v-2.046h11.28v2.046zm-.04-3.098H6.391c-.037-.043-.075-.086-.111-.13-1.155-1.401-1.427-2.133-1.69-2.879-.005-.025 1.4.287 2.395.511 0 0 .513.119 1.262.255-.72-.843-1.147-1.915-1.147-3.01 0-2.406 1.845-4.508 1.18-6.207.648.053 1.34 1.367 1.387 3.422.689-.951.977-2.69.977-3.755 0-1.103.727-2.385 1.454-2.429-.648 1.069.168 1.984.894 4.256.272.854.237 2.29.447 3.201.07-1.892.395-4.652 1.595-5.605-.529 1.2.079 2.702.494 3.424.671 1.164 1.078 2.047 1.078 3.716a4.642 4.642 0 01-1.11 2.996c.792-.149 1.34-.283 1.34-.283l2.573-.502s-.374 1.538-1.81 3.019z',
  },
  {
    name: 'Datadog',
    category: 'Observability',
    color: '#632CA6',
    svgPath:
      'M19.57 17.04l-1.997-1.316-1.665 2.782-1.937-.567-1.706 2.604.087.82 9.274-1.71-.538-5.794zm-8.649-2.498l1.488-.204c.241.108.409.15.697.223.45.117.97.23 1.741-.16.18-.088.553-.43.704-.625l6.096-1.106.622 7.527-10.444 1.882zm11.325-2.712l-.602.115L20.488 0 .789 2.285l2.427 19.693 2.306-.334c-.184-.263-.471-.581-.96-.989-.68-.564-.44-1.522-.039-2.127.53-1.022 3.26-2.322 3.106-3.956-.056-.594-.15-1.368-.702-1.898-.02.22.017.432.017.432s-.227-.289-.34-.683c-.112-.15-.2-.199-.319-.4-.085.233-.073.503-.073.503s-.186-.437-.216-.807c-.11.166-.137.48-.137.48s-.241-.69-.186-1.062c-.11-.323-.436-.965-.343-2.424.6.421 1.924.321 2.44-.439.171-.251.288-.939-.086-2.293-.24-.868-.835-2.16-1.066-2.651l-.028.02c.122.395.374 1.223.47 1.625.293 1.218.372 1.642.234 2.204-.116.488-.397.808-1.107 1.165-.71.358-1.653-.514-1.713-.562-.69-.55-1.224-1.447-1.284-1.883-.062-.477.275-.763.445-1.153-.243.07-.514.192-.514.192s.323-.334.722-.624c.165-.109.262-.178.436-.323a9.762 9.762 0 0 0-.456.003s.42-.227.855-.392c-.318-.014-.623-.003-.623-.003s.937-.419 1.678-.727c.509-.208 1.006-.147 1.286.257.367.53.752.817 1.569.996.501-.223.653-.337 1.284-.509.554-.61.99-.688.99-.688s-.216.198-.274.51c.314-.249.66-.455.66-.455s-.134.164-.259.426l.03.043c.366-.22.797-.394.797-.394s-.123.156-.268.358c.277-.002.838.012 1.056.037 1.285.028 1.552-1.374 2.045-1.55.618-.22.894-.353 1.947.68.903.888 1.609 2.477 1.259 2.833-.294.295-.874-.115-1.516-.916a3.466 3.466 0 0 1-.716-1.562 1.533 1.533 0 0 0-.497-.85s.23.51.23.96c0 .246.03 1.165.424 1.68-.039.076-.057.374-.1.43-.458-.554-1.443-.95-1.604-1.067.544.445 1.793 1.468 2.273 2.449.453.927.186 1.777.416 1.997.065.063.976 1.197 1.15 1.767.306.994.019 2.038-.381 2.685l-1.117.174c-.163-.045-.273-.068-.42-.153.08-.143.241-.5.243-.572l-.063-.111c-.348.492-.93.97-1.414 1.245-.633.359-1.363.304-1.838.156-1.348-.415-2.623-1.327-2.93-1.566 0 0-.01.191.048.234.34.383 1.119 1.077 1.872 1.56l-1.605.177.759 5.908c-.337.048-.39.071-.757.124-.325-1.147-.946-1.895-1.624-2.332-.599-.384-1.424-.47-2.214-.314l-.05.059a2.851 2.851 0 0 1 1.863.444c.654.413 1.181 1.481 1.375 2.124.248.822.42 1.7-.248 2.632-.476.662-1.864 1.028-2.986.237.3.481.705.876 1.25.95.809.11 1.577-.03 2.106-.574.452-.464.69-1.434.628-2.456l.714-.104.258 1.834 11.827-1.424zM15.05 6.848c-.034.075-.085.125-.007.37l.004.014.013.032.032.073c.14.287.295.558.552.696.067-.011.136-.019.207-.023.242-.01.395.028.492.08.009-.048.01-.119.005-.222-.018-.364.072-.982-.626-1.308-.264-.122-.634-.084-.757.068a.302.302 0 0 1 .058.013c.186.066.06.13.027.207m1.958 3.392c-.092-.05-.52-.03-.821.005-.574.068-1.193.267-1.328.372-.247.191-.135.523.047.66.511.382.96.638 1.432.575.29-.038.546-.497.728-.914.124-.288.124-.598-.058-.698m-5.077-2.942c.162-.154-.805-.355-1.556.156-.554.378-.571 1.187-.041 1.646.053.046.096.078.137.104a4.77 4.77 0 0 1 1.396-.412c.113-.125.243-.345.21-.745-.044-.542-.455-.456-.146-.749',
  },
  {
    name: 'ELK Stack',
    category: 'Log Analytics',
    color: '#00BFB3',
    svgPath:
      'M1.875 0C.839 0 0 .84 0 1.875v4.792h24V1.875C24 .839 23.16 0 22.125 0zM0 8.889v6.222h24V8.89zm0 8.444v4.792C0 23.161.84 24 1.875 24h9v-6.667zm13.125 0V24h9C23.161 24 24 23.16 24 22.125v-4.792z',
  },
  {
    name: 'Dozzle',
    category: 'Container Logs',
    color: '#FFB31A',
    iconUrl: 'icons/dozzle.svg',
  },
  {
    name: 'Agentic AI',
    category: 'Autonomous Ops',
    color: '#FF9F0A',
    svgPath:
      'M12 3a2.6 2.6 0 1 1 0 5.2A2.6 2.6 0 0 1 12 3zM5 15.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zm14 0a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zM12.5 7.9l-7.1 10.6-.9-.6 7.1-10.6zm-1 0l7.1 10.6.9-.6-7.1-10.6z',
  },
];

export const AWARDS: readonly AwardItem[] = [
  {
    year: '2025',
    title: 'Achievement of Excellence Award',
    org: 'Mercedes-Benz Research and Development India',
    description:
      'Sustained impact resolving critical pipeline and infrastructure escalations at Mercedes-Benz',
    badge: 'Excellence · Platform Engineering',
  },
  {
    year: '2024',
    title: 'Bronze Award',
    org: 'Mercedes-Benz Research and Development India',
    description: 'Handling high-priority production escalations under pressure',
    badge: 'Operational Reliability',
  },
  {
    year: '2023',
    title: 'Best Paper Award — ICoAC 2023',
    org: '12th International Conference on Advanced Computing · Anna University, Chennai',
    description:
      'Awarded Best Paper for "Design of Voice Automated Floor Cleaning Robot" at Anna University, Chennai',
    badge: 'IEEE / ICoAC Research',
  },
  {
    title: 'Impact Mentor Training (IMT)',
    org: 'Mercedes-Benz · The DO School',
    description:
      'Mentorship programme covering active listening, coaching conversations and sustainability-led impact projects',
    badge: 'Mentoring · Certificate',
  },
  {
    title: 'ISTQB Certified Tester — Foundation Level (CTFL)',
    org: 'International Software Testing Qualifications Board',
    description:
      'Foundation certification in test design, defect management and quality practices applied to development work',
    badge: 'Certification · Quality Engineering',
  },
];

export const TERMINAL_BOOT_SCRIPT: readonly TerminalScriptLine[] = [
  {
    type: 'cmd',
    prompt: '$ ',
    text: 'docker compose up -d infra-monitor alert-engine chatops-bot',
  },
  { type: 'info', text: '[+] Running 3/3' },
  { type: 'success', text: ' ✓ Container infra-monitor    Started   0.8s' },
  { type: 'success', text: ' ✓ Container alert-engine     Started   1.2s' },
  { type: 'success', text: ' ✓ Container chatops-bot      Started   1.5s' },
  { type: 'output', text: '' },
  {
    type: 'cmd',
    prompt: '$ ',
    text: 'ansible-playbook -i inventory/prod deploy.yml --forks=50',
  },
  {
    type: 'output',
    text: 'PLAY [Provision & Configure Environments] *************************************',
  },
  { type: 'info', text: 'TASK [provision]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%' },
  { type: 'success', text: 'ok=112  changed=18  unreachable=0  failed=0  ✓' },
  { type: 'output', text: '' },
  {
    type: 'cmd',
    prompt: '$ ',
    text: 'python3 monitor.py --mode=live --auto-heal',
  },
  { type: 'info', text: '┌─────────────────────────────────────────────────┐' },
  { type: 'info', text: '│  LIVE PLATFORM HEALTH DASHBOARD                 │' },
  { type: 'info', text: '├─────────────────────────────────────────────────┤' },
  { type: 'success', text: '│  Environments Online:  108/112  (96.4%)    ✓   │' },
  { type: 'info', text: '│  Pipelines Running:    23       active          │' },
  { type: 'info', text: '│  Avg Response Time:    42ms     nominal         │' },
  { type: 'output', text: '│  Alerts Today:         3       (auto-resolved) │' },
  { type: 'info', text: '└─────────────────────────────────────────────────┘' },
  { type: 'output', text: '' },
  {
    type: 'warn',
    text: '[WARN] env-047: CPU spike detected (89%) — evaluating...',
  },
  {
    type: 'info',
    text: '[AUTO-HEAL] Triggering: service restart + cache clear...',
  },
  {
    type: 'success',
    text: '[OK] env-047: recovered in 12s. Health restored. ✓',
  },
  { type: 'output', text: '' },
  {
    type: 'cmd',
    prompt: '$ ',
    text: 'git push origin main && jenkins build --trigger',
  },
  { type: 'info', text: '[Pipeline] Build → Test → Security Gate → Deploy' },
  {
    type: 'success',
    text: '[Pipeline] ✓ All stages passed — deployed in 3m 47s',
  },
  { type: 'output', text: '' },
  {
    type: 'cmd',
    prompt: '$ ',
    text: 'curl -s teams-bot/api/status | python3 -m json.tool',
  },
  { type: 'info', text: '{' },
  { type: 'info', text: '  "bot_status": "online",' },
  { type: 'info', text: '  "ai_engine": "azure-openai-gpt4",' },
  { type: 'info', text: '  "alerts_summarized_today": 47,' },
  { type: 'info', text: '  "auto_remediated": 12,' },
  { type: 'success', text: '  "uptime": "99.97%"' },
  { type: 'info', text: '}' },
  { type: 'output', text: '' },
  {
    type: 'cmd',
    prompt: '$ ',
    text: 'echo "Day complete. Zero escalations. Platform stable."',
  },
  {
    type: 'success',
    text: 'Day complete. Zero escalations. Platform stable. — Type `help` below ↓',
  },
];

export const SELF_HEAL_SCENARIOS = [
  {
    nodeId: 47,
    code: 'env-047',
    os: 'RHEL 9.4',
    issue: 'CPU spike 89% · worker deadlock',
    action: 'ansible-playbook heal_service.yml --limit=env-047',
    recoveryTime: '12s',
  },
  {
    nodeId: 19,
    code: 'env-019',
    os: 'QNX 7.1 RTOS',
    issue: 'Target heartbeat timeout (320ms)',
    action: 'awx-cli job launch --template=qnx-reset',
    recoveryTime: '9s',
  },
  {
    nodeId: 83,
    code: 'env-083',
    os: 'Ubuntu 24.04',
    issue: 'Docker daemon socket stall',
    action: 'systemctl restart docker && compose up -d',
    recoveryTime: '11s',
  },
  {
    nodeId: 64,
    code: 'env-064',
    os: 'Win Server 2022',
    issue: 'Agent workspace cache saturation',
    action: 'ansible-playbook purge_workspace.yml',
    recoveryTime: '8s',
  },
] as const;
