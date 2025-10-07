// ===========================
// Root Page
// ©AngelaMos | 2025
// ===========================

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTypingAnimation } from '@/lib/hooks';
import { useUIStore } from '@/lib/store/ui.store';
import { Terminal } from './terminal';
import styles from './root.module.scss';

export const Root = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTerminalHistory } = useUIStore();

  useEffect(() => {
    const state = location.state as { githubAuthSuccess?: boolean } | null;
    if (state?.githubAuthSuccess === true) {
      addTerminalHistory({
        command: 'su admin',
        output: '✓ GitHub authentication successful',
        timestamp: Date.now(),
      });
      void navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, addTerminalHistory]);

  const whoamiCommand = useTypingAnimation({
    text: '$ whoami',
    speed: 45,
    delay: 200,
  });

  const whoamiResult = useTypingAnimation({
    text: 'Carter Perez - Full Stack Developer',
    speed: 20,
    delay: 700,
  });

  const pwdCommand = useTypingAnimation({
    text: '$ pwd',
    speed: 45,
    delay: 1500,
  });

  const pwdResult = useTypingAnimation({
    text: '/building/cool/stuff',
    speed: 20,
    delay: 1900,
  });

  const skillsCommand = useTypingAnimation({
    text: '$ ls skills/',
    speed: 45,
    delay: 2600,
  });

  const statusCommand = useTypingAnimation({
    text: '$ cat current.status',
    speed: 45,
    delay: 3500,
  });

  const resumeCommand = useTypingAnimation({
    text: '$ wget resume',
    speed: 45,
    delay: 5200,
  });

  const handleNavigation = (path: string): void => {
    void navigate(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.commandBlock}>
          <div className={styles.command}>{whoamiCommand.displayText}</div>
          {!whoamiCommand.isTyping ? (
            <div className={styles.output}>{whoamiResult.displayText}</div>
          ) : null}
        </div>

        {!whoamiResult.isTyping ? (
          <div className={styles.commandBlock}>
            <div className={styles.command}>{pwdCommand.displayText}</div>
            {!pwdCommand.isTyping ? (
              <div className={styles.output}>{pwdResult.displayText}</div>
            ) : null}
          </div>
        ) : null}

        {!pwdResult.isTyping ? (
          <div className={styles.commandBlock}>
            <div className={styles.command}>{skillsCommand.displayText}</div>
            {!skillsCommand.isTyping ? (
              <div className={styles.skillsGrid}>
                <span className={styles.skill}>/TypeScript</span>
                <span className={styles.skill}>/React</span>
                <span className={styles.skill}>/Python</span>
                <span className={styles.skill}>/FastAPI</span>
                <span className={styles.skill}>/Rust</span>
                <span className={styles.skill}>/Axum</span>
                <span className={styles.skill}>/MongoDB</span>
                <span className={styles.skill}>/PostgreSQL</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {!skillsCommand.isTyping ? (
          <div className={styles.commandBlock}>
            <div className={styles.command}>{statusCommand.displayText}</div>
            {!statusCommand.isTyping ? (
              <div className={styles.statusOutput}>
                <div>Location: Annapolis, MD</div>
                <div>
                  Currently: Expanding my cybersecurity platform -
                  @CertGames.com
                </div>
                <div>Side-Project: Open source FastAPI package</div>
                <div>
                  Certifications: Comptia A+, Security+, Network+, CySA+,
                  Pentest+, CASP+
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {!statusCommand.isTyping ? (
          <div className={styles.commandBlock}>
            <div className={styles.command}>{resumeCommand.displayText}</div>
            {!resumeCommand.isTyping ? (
              <div className={styles.output}>
                <a
                  href="/CarterPerez.pdf"
                  download="CarterPerez.pdf"
                  className={styles.resumeLink}
                >
                  carterperez.pdf
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        {!resumeCommand.isTyping ? (
          <div className={styles.navigation}>
            <div className={styles.prompt}>
              <span className={styles.promptSymbol}>{'$'}</span>
              <span className={styles.promptText}>ls -a</span>
            </div>
            <div className={styles.navOptions}>
              <button
                onClick={() => handleNavigation('/experience')}
                className={styles.navButton}
              >
                .experience.sh
              </button>
              <button
                onClick={() => handleNavigation('/projects')}
                className={styles.navButton}
              >
                .projects.sh
              </button>
              <button
                onClick={() => handleNavigation('/blog')}
                className={styles.navButton}
              >
                .blogs.sh
              </button>
              <button
                onClick={() => handleNavigation('/contact')}
                className={styles.navButton}
              >
                .contact.sh
              </button>
            </div>
          </div>
        ) : null}

        {!resumeCommand.isTyping ? <Terminal /> : null}
      </div>
    </div>
  );
};
