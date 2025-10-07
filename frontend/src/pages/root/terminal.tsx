// ===========================
// Terminal Component
// ©AngelaMos | 2025
// ===========================

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { usePasswordLogin, useGitHubOAuth } from '@/lib/hooks';
import { useUIStore } from '@/lib/store/ui.store';
import { useAuthStore } from '@/lib/store';
import { ADMIN_CONFIG } from '@/constants';
import { TREE_OUTPUT } from './rootTree';
import styles from './root.module.scss';

type AuthMode = 'normal' | 'su_oauth_prompt' | 'su_password_input';

export const Terminal = (): React.JSX.Element => {
  const { terminal, addTerminalHistory, clearTerminalHistory } = useUIStore();
  const { isAuthenticated, admin } = useAuthStore();
  const [currentInput, setCurrentInput] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('normal');
  const [passwordInput, setPasswordInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputLineRef = useRef<HTMLDivElement>(null);

  const passwordLogin = usePasswordLogin();
  const initiateGitHubOAuth = useGitHubOAuth();

  const handleCommand = (input: string): void => {
    const cmd = input.trim().toLowerCase();
    let output = '';

    switch (cmd) {
      case 'help':
        output =
          'Available commands:\n  help - Show this help message\n  clear - Clear command history\n  whoami - Display user info\n  ls - List skills\n  cat - Show current status\n  tree - Show project structure\n  su admin - Admin authentication';
        break;
      case 'clear':
        clearTerminalHistory();
        setCurrentInput('');
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      case 'whoami':
        if (isAuthenticated && admin !== null && admin !== undefined) {
          output = `${admin.name ?? admin.email} (admin)`;
        } else {
          output = 'Carter Perez - Full Stack Developer';
        }
        break;
      case 'ls':
      case 'ls skills/':
        output =
          '/TypeScript  /React  /Python  /FastAPI  /Rust  /Axum  /MongoDB  /PostgreSQL';
        break;
      case 'cat':
      case 'cat current.status':
        output =
          'Location: Annapolis, MD\nCurrently: Expanding my cybersecurity platform - @CertGames.com\nSide-Project: Open source FastAPI package\nCertifications: Comptia A+, Security+, Network+, CySA+, Pentest+, CASP+';
        break;
      case 'tree':
        output = TREE_OUTPUT;
        break;
      case 'su admin':
        if (isAuthenticated) {
          output = 'Already authenticated as admin';
        } else {
          setAuthMode('su_oauth_prompt');
          setCurrentInput('');
          setTimeout(() => {
            inputRef.current?.focus();
            inputLineRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          }, 0);
          return;
        }
        break;
      default:
        output = `command not found: ${input}`;
        break;
    }

    addTerminalHistory({
      command: input,
      output,
      timestamp: Date.now(),
    });

    setCurrentInput('');
    setTimeout(() => {
      inputRef.current?.focus();
      inputLineRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 0);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (authMode === 'su_oauth_prompt') {
        const response = currentInput.trim().toLowerCase();
        if (response === 'y') {
          addTerminalHistory({
            command: `OAuth? (y/n): ${response}`,
            output: '⟳ Redirecting to GitHub OAuth...',
            timestamp: Date.now(),
          });
          setCurrentInput('');
          setAuthMode('normal');
          setTimeout(() => {
            initiateGitHubOAuth();
          }, 500);
        } else if (response === 'n') {
          addTerminalHistory({
            command: `OAuth? (y/n): ${response}`,
            output: '',
            timestamp: Date.now(),
          });
          setAuthMode('su_password_input');
          setCurrentInput('');
          setPasswordInput('');
          setTimeout(() => inputRef.current?.focus(), 0);
        } else {
          addTerminalHistory({
            command: `OAuth? (y/n): ${response}`,
            output: 'Invalid input. Please enter y or n',
            timestamp: Date.now(),
          });
          setAuthMode('su_oauth_prompt');
          setCurrentInput('');
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        return;
      }

      if (authMode === 'su_password_input') {
        void passwordLogin
          .mutateAsync({
            email: ADMIN_CONFIG.EMAIL,
            password: passwordInput,
          })
          .then(() => {
            addTerminalHistory({
              command: `Password: ${'*'.repeat(passwordInput.length)}`,
              output: '✓ Authentication successful',
              timestamp: Date.now(),
            });
            setAuthMode('normal');
            setPasswordInput('');
            setCurrentInput('');
          })
          .catch(() => {
            addTerminalHistory({
              command: `Password: ${'*'.repeat(passwordInput.length)}`,
              output: '✗ Authentication failed',
              timestamp: Date.now(),
            });
            setAuthMode('normal');
            setPasswordInput('');
            setCurrentInput('');
          });
        return;
      }

      if (currentInput.trim().length > 0) {
        handleCommand(currentInput);
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleGlobalClick = (): void => {
      inputRef.current?.focus();
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const getPromptSymbol = (): string => {
    if (authMode === 'su_oauth_prompt') {
      return 'OAuth? (y/n): ';
    }
    if (authMode === 'su_password_input') {
      return 'Password: ';
    }
    return '$';
  };

  return (
    <div className={styles.interactiveTerminal}>
      {terminal.history.map((entry) => (
        <div
          key={String(entry.timestamp)}
          className={styles.historyEntry}
        >
          <div className={styles.historyCommand}>$ {entry.command}</div>
          <div className={styles.historyOutput}>{entry.output}</div>
        </div>
      ))}
      <div
        ref={inputLineRef}
        className={styles.inputLine}
        onClick={() => inputRef.current?.focus()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className={styles.promptSymbol}>{getPromptSymbol()}</span>
        <span className={styles.inputDisplay}>
          {authMode === 'su_password_input'
            ? '*'.repeat(passwordInput.length)
            : currentInput}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={authMode === 'su_password_input' ? passwordInput : currentInput}
          onChange={(e) => {
            if (authMode === 'su_password_input') {
              setPasswordInput(e.target.value);
            } else {
              setCurrentInput(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          className={styles.terminalInput}
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
};
