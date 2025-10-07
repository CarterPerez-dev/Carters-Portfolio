// ===========================
// Projects Admin Section
// ©AngelaMos | 2025
// ===========================

import { useProjects, useToggleProjectVisibility, useToggleProjectFeatured, useSyncAllProjects } from '@/lib/hooks';
import styles from './projects.module.scss';

export const ProjectsSection = (): React.JSX.Element => {
  const { data, isLoading, error } = useProjects(50, false);
  const toggleVisibility = useToggleProjectVisibility();
  const toggleFeatured = useToggleProjectFeatured();
  const syncAll = useSyncAllProjects();

  const handleToggleVisibility = (id: string): void => {
    void toggleVisibility.mutateAsync(id);
  };

  const handleToggleFeatured = (id: string): void => {
    void toggleFeatured.mutateAsync(id);
  };

  const handleSyncAll = (): void => {
    void syncAll.mutateAsync(undefined);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading projects...</div>;
  }

  if (error !== null && error !== undefined) {
    return (
      <div className={styles.error}>
        Error loading projects: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const projects = data?.projects ?? [];
  const total = data?.total ?? 0;

  if (projects.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No projects found. Sync from GitHub?</div>
        <div className={styles.actions}>
          <button onClick={handleSyncAll} className={styles.actionButton}>
            [SYNC ALL]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.count}>({total.toString()} rows)</div>

      <div className={styles.tableWrapper}>
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.headerCells}>
              {'name'.padEnd(35)} | {'language'.padEnd(18)} | {'stars'.padEnd(8)} | {'visible'.padEnd(10)} | {'featured'.padEnd(10)}
            </div>
          </div>

          <div className={styles.body}>
            {projects.map((project) => {
              const nameStr = (project.name ?? '').substring(0, 35).padEnd(35);
              const langStr = (project.language ?? 'N/A').substring(0, 18).padEnd(18);
              const starsStr = (project.stars ?? 0).toString().padEnd(8);
              const visibleStr = ((project.is_visible ?? true) ? 'yes' : 'no').padEnd(10);
              const featuredStr = (project.featured ? 'yes' : 'no').padEnd(10);

              return (
                <div key={project.id} className={styles.rowGroup}>
                  <div className={styles.row}>
                    {nameStr} | {langStr} | {starsStr} | {visibleStr} | {featuredStr}
                  </div>
                  <div className={styles.rowActions}>
                    <button
                      onClick={() => handleToggleVisibility(project.id)}
                      className={styles.actionBtn}
                      disabled={toggleVisibility.isPending}
                    >
                      [{(project.is_visible ?? true) ? 'HIDE' : 'SHOW'}]
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(project.id)}
                      className={styles.actionBtn}
                      disabled={toggleFeatured.isPending}
                    >
                      [{project.featured ? 'UNFEATURE' : 'FEATURE'}]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <span className={styles.prompt}>portfolio=#</span>
        <button
          onClick={handleSyncAll}
          className={styles.actionButton}
          disabled={syncAll.isPending}
        >
          {syncAll.isPending ? '[SYNCING...]' : '[SYNC ALL FROM GITHUB]'}
        </button>
      </div>
    </div>
  );
};
