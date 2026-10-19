import { describe, expect, it } from 'vitest';
import { completeCommand, runCommand } from '../src/terminal/commands';

describe('portfolio command parser', () => {
  it('normalizes whitespace and case', () => {
    expect(runCommand('  WHOAMI ').lines.join(' ')).toContain('Mohammed Shadab');
    expect(runCommand('cat   resume.md').lines.join(' ')).toContain('EXPERIENCE');
  });
  it('supports all content commands', () => {
    for (const command of ['help', 'whoami', 'skills', 'projects', 'experience', 'awards', 'ls']) {
      expect(runCommand(command).lines.length).toBeGreaterThan(0);
    }
  });
  it('returns explicit allowlisted UI actions', () => {
    expect(runCommand('clear').action).toBe('clear');
    expect(runCommand('contact').action).toBe('contact');
    expect(runCommand('sudo hire-me').action).toBe('contact');
  });
  it('does not interpret shell syntax or scripts', () => {
    for (const input of ['whoami; rm -rf /', '$(whoami)', '<img src=x onerror=alert(1)>', 'cat ../../.env']) {
      expect(runCommand(input).tone).toBe('warn');
      expect(runCommand(input).action).toBeUndefined();
    }
  });
  it('bounds input and handles empty commands', () => {
    expect(runCommand('a'.repeat(257)).tone).toBe('warn');
    expect(runCommand('  ').lines).toEqual([]);
  });
  it('returns a bounded command history', () => {
    expect(runCommand('history', Array(100).fill('help')).lines).toHaveLength(50);
  });
  it('completes only recognized commands', () => {
    expect(completeCommand('who')).toEqual(['whoami']);
    expect(completeCommand('cat ')).toEqual(['cat resume.md']);
    expect(completeCommand('invalid')).toEqual([]);
  });
  it('renders both new certifications without undefined or null', () => {
    const output = runCommand('awards').lines.join('\n');
    expect(output).toContain('Impact Mentor Training (IMT)');
    expect(output).toContain('ISTQB Certified Tester');
    expect(output).not.toContain('undefined');
    expect(output).not.toContain('null');
  });
  it('lists the new observability tools without an undefined tier', () => {
    const output = runCommand('skills').lines.join('\n');
    for (const tool of ['Grafana', 'Prometheus', 'Datadog', 'ELK Stack', 'Dozzle', 'Agentic AI']) {
      expect(output).toContain(tool);
    }
    expect(output).not.toContain('undefined');
    expect(output).not.toContain('null');
  });
  it('omits the Germany project while keeping it in experience', () => {
    const projects = runCommand('projects').lines.join('\n');
    expect(projects).not.toContain('Germany');
    expect(projects).not.toContain('Sindelfingen');
    const experience = runCommand('experience').lines.join('\n');
    expect(experience).toContain('Sindelfingen');
  });
});
