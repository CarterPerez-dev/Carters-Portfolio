// ===========================
// Contacts Admin Section
// ©AngelaMos | 2025
// ===========================

import { useState } from 'react';
import { useContactList } from '@/lib/hooks';
import styles from './contacts.module.scss';

export const ContactsSection = (): React.JSX.Element => {
  const [limit] = useState(50);
  const { data, isLoading, error } = useContactList(limit);

  if (isLoading) {
    return <div className={styles.loading}>Loading contacts...</div>;
  }

  if (error !== null && error !== undefined) {
    return (
      <div className={styles.error}>
        Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const contacts = data?.contacts ?? [];
  const total = data?.total ?? 0;

  if (contacts.length === 0) {
    return <div className={styles.empty}>No contact submissions yet.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.count}>({total.toString()} rows)</div>

      <div className={styles.tableWrapper}>
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.headerCells}>
              {'created'.padEnd(12)} | {'name'.padEnd(26)} | {'email'.padEnd(32)} | {'subject'.padEnd(26)} | {'body'.padEnd(50)}
            </div>
          </div>

          <div className={styles.body}>
            {contacts.map((contact) => {
              const date = new Date(contact.created_at);
              const dateStr = date.toISOString().split('T')[0];
              const nameStr = (contact.name ?? '').substring(0, 26).padEnd(26);
              const emailStr = (contact.email ?? '').substring(0, 32).padEnd(32);
              const subjectStr = (contact.subject ?? '').substring(0, 26).padEnd(26);
              const bodyPreview = (contact.body ?? '').replace(/\n/g, ' ').substring(0, 50).padEnd(50);

              return (
                <div key={contact.id} className={styles.row}>
                  {dateStr.padEnd(12)} | {nameStr} | {emailStr} | {subjectStr} | {bodyPreview}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <span className={styles.prompt}>portfolio=#</span>
      </div>
    </div>
  );
};
