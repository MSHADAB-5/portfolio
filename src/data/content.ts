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
  tier: 'Expert' | 'Advanced' | 'Working';
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
  svgPath: string;
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
  visualType: 'ansible-yaml' | 'chatops-bot' | 'self-healing' | 'germany-ops' | 'patents-hub';
  accent: string;
}

export interface AwardItem {
  year: string;
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
  headline: 'Infrastructure that heals itself.',
  subheadline:
    'Platform Engineer at Mercedes-Benz R&D building large-scale infrastructure automation, self-healing systems, and AI-augmented operational tooling. I make infrastructure reliable, automated, and intelligent.',
  manifesto:
    'At scale, manual operations fail silently. Across 100+ test and production environments powering 10+ vehicle programs, I engineer Ansible/AWX automation frameworks, autonomous fault-recovery loops, and Azure OpenAI ChatOps agents that detect, diagnose, and heal degraded infrastructure before human operators ever get paged.',
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
    'Platform Automation Engineer',
    'DevOps & Infrastructure at Mercedes-Benz',
    'Building Self-Healing Systems',
    'AI-Augmented Operations',
    'Ansible · Docker · CI/CD · Python',
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
    value: 3,
    suffix: '',
    superscript: '*',
    label: 'Patents Filed',
    detail: '2 in review process, 1 in filing process with IP team as department Innovation SPOC',
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
      '3 patents in pipeline (2 in review process, 1 in filing process with IP team)',
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
      'Own the Ansible/AWX automation framework powering 100+ environments. Design CI/CD pipelines (Jenkins, GitLab CI), build self-healing infrastructure, and manage large-scale platform operations for multiple vehicle programs.',
    highlights: [
      'Architected and maintain Ansible/AWX provisioning across Linux, Windows, and QNX targets',
      'Built event-driven self-healing recovery loops that remediate degraded environments automatically',
      'Designed multi-stage Jenkins & GitLab CI/CD pipelines serving 10+ vehicle programs',
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
      'Ansible-powered platform managing provisioning, configuration, and lifecycle of 100+ test environments. Supports parallel execution, on-demand reservations, and multi-platform deployments (Linux, Windows, QNX).',
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
      'Microsoft Teams bot with Azure OpenAI integration enabling conversational infrastructure management. Uses structured prompt engineering for alert summarization and agent-style routing to automation workflows.',
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
    id: 'germany-deployment',
    index: '04',
    eyebrow: 'CROSS-SITE ENGINEERING · SINDELFINGEN PLANT',
    title: 'On-Site Germany Deployment',
    subtitle: '3-month mission-critical infrastructure delivery in Sindelfingen',
    description:
      '3-month on-site deployment at Mercedes-Benz Sindelfingen plant. Resolved infrastructure bottlenecks, optimized CI/CD workflows, and strengthened cross-site coordination during critical delivery phase.',
    metrics: [
      { label: 'Duration', value: '3 Months On-Site' },
      { label: 'Corridor', value: 'BLR ⇄ STR' },
      { label: 'Focus', value: 'CI/CD & Plant Infra' },
    ],
    tags: ['DevOps', 'CI/CD', 'Cross-site', 'Sindelfingen'],
    visualType: 'germany-ops',
    accent: '#ff9f0a',
  },
  {
    id: 'patents-innovation',
    index: '05',
    eyebrow: 'INTELLECTUAL PROPERTY · R&D LEADERSHIP',
    title: 'Patents & Innovation SPOC',
    subtitle: 'Driving AI & automation invention disclosures across the department',
    description:
      'Department-level Innovation SPOC driving AI/automation adoption across teams. 3 patents filed — 2 in review process, 1 in filing process with IP team. Conduct ideation workshops, mentor engineers on innovation practices, and manage the patent filing pipeline.',
    metrics: [
      { label: 'Patents Filed', value: '3*' },
      { label: 'In Review', value: '2 Disclosures' },
      { label: 'In Filing', value: '1 With IP Team' },
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
