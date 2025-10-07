// ===========================
// Header Navigation
// ©AngelaMos | 2025
// ===========================

import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import styles from './header.module.scss';

const baseNavItems = [
  { path: '/', label: '$ROOT' },
  { path: '/experience', label: 'EXPERIENCE' },
  { path: '/projects', label: 'PROJECTS' },
  { path: '/blog', label: 'BLOGS' },
  { path: '/contact', label: 'CONTACT' },
];

export const Header = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const navItems = useMemo(
    () =>
      isAuthenticated
        ? [...baseNavItems, { path: '/admin', label: 'ADMIN' }]
        : baseNavItems,
    [isAuthenticated]
  );

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev <= 0 ? navItems.length - 1 : prev - 1;
          return newIndex;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev >= navItems.length - 1 ? 0 : prev + 1;
          return newIndex;
        });
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        void navigate(navItems[focusedIndex].path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, navigate, navItems]);

  const handleNavClick = (index: number): void => {
    setFocusedIndex(index);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span
            className={styles.redDot}
            aria-hidden="true"
          />
          <span className={styles.brandText}>CARTER</span>
        </div>

        <ul
          className={styles.navList}
          role="tablist"
        >
          {navItems.map((item, index) => (
            <li
              key={item.path}
              role="presentation"
            >
              <Link
                to={item.path}
                role="tab"
                aria-selected={location.pathname === item.path}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => handleNavClick(index)}
                onFocus={() => setFocusedIndex(index)}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.active : ''
                } ${focusedIndex === index ? styles.focused : ''}`}
              >
                {item.label === '$ROOT' ? (
                  <>
                    <span className={styles.dollarSign}>$</span>ROOT
                  </>
                ) : (
                  item.label
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
