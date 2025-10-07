// ===========================
// Experience Page
// ©AngelaMos | 2025
// ===========================

import { useTypingAnimation } from '@/lib/hooks';
import styles from './experience.module.scss';

interface JobCommit {
  hash: string;
  author: string;
  email: string;
  date: string;
  company: string;
  role: string;
  description: string[];
  tech?: string[];
}

const experiences: JobCommit[] = [
  {
    hash: '8a4f5b6',
    author: 'Carter Perez',
    email: 'inquiry@certgames.com',
    date: 'May 2025 - Present',
    company: 'Cyber Skyline',
    role: 'Cybersecurity Software Engineer',
    description: [
      "Backend engineer for the CISA President's Cup CTF Competition, developed core competition systems including scoring engine, real-time notifications, support ticketing, and team/event management - #1 contributor with 56K+ lines",
      'Engineered WebSocket notification system coordinating multi-instance Flask deployments via Redis pub/sub, implementing per-instance user session tracking to route messages across horizontally scaled containers without shared Socket.IO state',
      'Developed composable decorator middleware for authentication, resource loading, and error handling - standardizing security patterns and eliminating boilerplate across 60+ endpoints',
    ],
    tech: [
      'Python',
      'Flask',
      'Redis',
      'Docker',
      'SQLAlchemy',
      'SocketIO',
      'Nginx',
    ],
  },
  {
    hash: '3d9e2f1',
    author: 'Carter Perez',
    email: 'inquiry@certgames.com',
    date: 'Sep 2024 - Present',
    company: 'CertGames',
    role: 'Senior Wizard IV',
    description: [
      'Solo developed a full stack cybersecurity learning platform and IOS app serving 600+ active users',
      'Engineered a gamification engine with XP/achievement features, real-time leaderboards, games, virtual shop economy, AI tools, and 15,000 practice questions across multiple domains',
      'Established rigorous testing pyramid with 5,250+ automated tests (unit, integration, E2E) achieving 96% code coverage; configured pytest with custom fixtures, mocking strategies, and CI/CD integration preventing 95% of regressions',
      'Implemented comprehensive security layer with pattern detection guards, request size validation, behavioral tracking, IP blocklisting, JWT token blocklisting, and automated threat intelligence reducing attack surface by 90%',
    ],
    tech: [
      'Flask',
      'MongoDB',
      'React',
      'TypeScript',
      'Redis',
      'SocketIO',
      'Nginx',
      'Docker',
      'SCSS',
    ],
  },
  {
    hash: '7c2a8e9',
    author: 'Carter Perez',
    email: 'inquiry@certgames.com',
    date: 'May 2024 - May 2025',
    company: 'Sealing Technologies (Parsons)',
    role: 'Systems Integration Technician',
    description: [
      'Played a key role in consulting on the assembly and logistics of $40M worth of servers, network switches, and Cyber kits',
      'Managed and optimized QA workflows for custom server builds, aligning with strict timelines and regulatory standards',
      'Authored multiple technical blogs detailing efficient quality assurance processes for high-stakes assembly projects',
      'Developed SOPs to standardize assembly procedures across teams and streamline onboarding',
    ],
    tech: [
      'Linux',
      'Networking',
      'Hardware',
      'QA',
      'Technical Writing',
      'Logistics and Assembly Management',
    ],
  },
  {
    hash: 'f5e3c2a',
    author: 'Carter Perez',
    email: 'inquiry@certgames.com',
    date: 'Mar 2022 - May 2024',
    company: "Jimmy John's",
    role: 'General Manager',
    description: [
      'Supervised 15+ staff members, optimizing task delegation and daily procedures for smooth operations',
      'Diagnosed and repaired POS systems and networks across five stores, maintaining service reliability',
      'Reduced delivery times by 8 minutes weekly, securing recognition as top performing GM within 5 store franchise',
      'Optimized workflows to eliminate excess labor costs and COGS, resulting in smoother operations',
    ],
    tech: [
      'POS Systems',
      'Network Troubleshooting',
      'Operations',
      'Leadership',
      'Risk Management',
    ],
  },
];

export const Experience = (): React.JSX.Element => {
  const gitCommand = useTypingAnimation({
    text: '> git log --author="Carter Perez" --pretty=full',
    speed: 27,
    delay: 210,
  });

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.gitCommand}>{gitCommand.displayText}</div>

        {!gitCommand.isTyping ? (
          <div className={styles.commits}>
            {experiences.map((job, index) => (
              <div
                key={job.hash}
                className={styles.commit}
              >
                <div className={styles.commitHash}>
                  commit {job.hash}
                  {index === 0 ? (
                    <span className={styles.head}>
                      {' '}
                      (HEAD -&gt; main, origin/main)
                    </span>
                  ) : null}
                </div>
                <div className={styles.commitMeta}>
                  <div>
                    Author: {job.author} &lt;{job.email}&gt;
                  </div>
                  <div>Date: {job.date}</div>
                </div>
                <div className={styles.commitMessage}>
                  <div className={styles.jobTitle}>
                    {job.role} @ {job.company}
                  </div>
                  <ul className={styles.description}>
                    {job.description.map((item) => (
                      <li key={`${job.hash}-${item.substring(0, 20)}`}>
                        - {item}
                      </li>
                    ))}
                  </ul>
                  {job.tech !== undefined && job.tech !== null ? (
                    <div className={styles.techStack}>
                      Tech: {job.tech.join(', ')}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
