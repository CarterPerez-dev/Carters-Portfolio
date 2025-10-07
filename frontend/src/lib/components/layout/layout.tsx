// ===========================
// Main Layout Wrapper
// ©AngelaMos | 2025
// ===========================

import { type ReactNode } from 'react';

import { Starfield } from '@/lib/components/space';
import { Header } from './header';
import styles from './layout.module.scss';

interface LayoutProps {
  children: ReactNode;
  showTerminalFrame?: boolean;
}

export const Layout = ({
  children,
  showTerminalFrame = true,
}: LayoutProps): React.JSX.Element => {
  return (
    <>
      <Starfield />

      <div
        className={
          showTerminalFrame ? styles.terminalWindow : styles.fullscreen
        }
      >
        {showTerminalFrame ? (
          <div className={styles.terminalHeader}>
            <div className={styles.terminalButtons}>
              <span className={styles.button} />
              <span className={styles.button} />
              <span className={styles.button} />
            </div>
          </div>
        ) : null}

        <Header />

        <main className={styles.content}>{children}</main>
      </div>
    </>
  );
};
