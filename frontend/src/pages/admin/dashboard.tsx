// ===========================
// Admin Dashboard Page
// ©AngelaMos | 2025
// ===========================

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { ContactsSection } from './sections/contacts';
import { ProjectsSection } from './sections/projects';
import { BlogsSection } from './sections/blogs';
import styles from './dashboard.module.scss';

type TabType = 'contacts' | 'projects' | 'blogs';

export const AdminDashboard = (): React.JSX.Element => {
  const { admin, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('contacts');

  const handleLogout = (): void => {
    void logout();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.sessionInfo}>
          <div className={styles.line}>$ psql -U {admin?.name ?? admin?.email ?? 'admin'}</div>
          <div className={styles.line}>psql (17.2)</div>
          <div className={styles.line}>Type "help" for help.</div>
          <div className={styles.line}></div>
          <div className={styles.prompt}>
            portfolio=# SELECT * FROM <span className={styles.currentTable}>{activeTab}</span>;
          </div>
        </div>
        <button onClick={handleLogout} className={styles.exitButton}>
          \q [exit]
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'contacts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          contacts
        </button>
        <span className={styles.separator}>|</span>
        <button
          className={`${styles.tab} ${activeTab === 'projects' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          projects
        </button>
        <span className={styles.separator}>|</span>
        <button
          className={`${styles.tab} ${activeTab === 'blogs' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          blogs
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'contacts' ? <ContactsSection /> : null}
        {activeTab === 'projects' ? <ProjectsSection /> : null}
        {activeTab === 'blogs' ? <BlogsSection /> : null}
      </div>
    </div>
  );
};
