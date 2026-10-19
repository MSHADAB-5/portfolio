import { AWARDS, EXPERIENCE_TIMELINE, PROFILE, PROJECTS, SKILL_CATEGORIES } from '../data/content';

export interface CommandResult {
  lines: string[];
  tone?: 'success' | 'info' | 'warn';
  action?: 'clear' | 'contact';
}
export const COMMANDS = [
  'help', 'whoami', 'experience', 'skills', 'projects', 'awards',
  'contact', 'ls', 'cat resume.md', 'clear', 'history', 'sudo hire-me',
] as const;
export const MAX_COMMAND_LENGTH = 256;

export function completeCommand(value: string): string[] {
  const query = value.trimStart().toLowerCase();
  return COMMANDS.filter((command) => command.startsWith(query));
}

export function runCommand(input: string, history: readonly string[] = []): CommandResult {
  if (input.length > MAX_COMMAND_LENGTH) return { lines: ['Command is too long (maximum 256 characters).'], tone: 'warn' };
  const command = input.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!command) return { lines: [] };
  switch (command) {
    case 'help':
      return { tone: 'info', lines: [
        'SHADAB / PORTFOLIO SHELL', '',
        'This is a local, simulated terminal. Nothing runs on a server.',
        ...COMMANDS.map((name) => `  ${name}`), '',
        'Use ↑ / ↓ for history. Tab to complete. Escape to leave input.',
      ] };
    case 'whoami':
      return { lines: [PROFILE.name, `${PROFILE.role} / ${PROFILE.companyFull}`, PROFILE.location, '', PROFILE.subheadline] };
    case 'experience':
      return { lines: EXPERIENCE_TIMELINE.flatMap((entry) => [`${entry.date} / ${entry.title}`, `  ${entry.company}`, `  ${entry.description}`, '']) };
    case 'skills':
      return { lines: SKILL_CATEGORIES.flatMap((group) => [group.title.toUpperCase(), ...group.items.map((item) => `  ${item.name} / ${item.tier}`), '']) };
    case 'projects':
      return { lines: PROJECTS.flatMap((project) => [`${project.index} / ${project.title}`, `  ${project.description}`, `  ${project.tags.join(' · ')}`, '']) };
    case 'awards':
      return { tone: 'success', lines: AWARDS.flatMap((award) => [`${award.year} / ${award.title}`, `  ${award.description}`, '']) };
    case 'contact':
      return { action: 'contact', lines: ['Opening contact sheet...', PROFILE.email, PROFILE.linkedinUrl] };
    case 'ls':
      return { tone: 'info', lines: ['resume.md  projects/  skills/  experience/  awards/  contact/'] };
    case 'cat resume.md':
      return { lines: [
        `${PROFILE.name} / ${PROFILE.role}`, PROFILE.subheadline, '',
        'EXPERIENCE', ...EXPERIENCE_TIMELINE.map((entry) => `${entry.date}: ${entry.title}`),
        '', 'PROJECTS', ...PROJECTS.map((project) => project.title),
        '', 'CONTACT', PROFILE.email, PROFILE.linkedinUrl,
      ] };
    case 'clear':
      return { action: 'clear', lines: [] };
    case 'history':
      return { lines: history.slice(-50).map((entry, i) => `${String(i + 1).padStart(3)}  ${entry}`) };
    case 'sudo hire-me':
      return { tone: 'success', action: 'contact', lines: ['[OK] Great choice. No root access required.', '[OK] Opening a connection to your next platform engineer.'] };
    default:
      return { tone: 'warn', lines: [`Command not found: ${input.trim()}`, 'Type help to see the available commands.'] };
  }
}
