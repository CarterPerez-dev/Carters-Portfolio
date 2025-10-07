// ===========================
// Projects Page
// ©AngelaMos | 2025
// ===========================

import { useState, useEffect } from 'react';
import { FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useProjects, useSyncAllProjects } from '@/lib/hooks/useProjects';
import { useTypingAnimation } from '@/lib/hooks';
import { useUIStore } from '@/lib/store/ui.store';
import styles from './projects.module.scss';

export const Projects = (): React.JSX.Element => {
  const { projectsUI, toggleProjectExpanded } = useUIStore();
  const [selectedProject, setSelectedProject] = useState<number | null>(
    null,
  );

  const { data: projectsData, isLoading, error } = useProjects(50);
  const { mutate: syncProjects, isPending: isSyncing } =
    useSyncAllProjects();

  const searchCommand = useTypingAnimation({
    text: '> npm search @carter/* --detail',
    speed: 21,
    delay: 100,
  });

  const loadingText = useTypingAnimation({
    text: 'Fetching packages from registry...',
    speed: 20,
    delay: 0,
  });

  const isProjectExpanded = (projectId: string): boolean => {
    return projectsUI.expandedProjects.includes(projectId);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (
        projectsData?.projects === null ||
        projectsData?.projects === undefined
      )
        return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedProject((prev) => {
          if (prev === null) return 0;
          return Math.min(prev + 1, projectsData.projects.length - 1);
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedProject((prev) => {
          if (prev === null || prev === 0) return null;
          return prev - 1;
        });
      } else if (e.key === 'Enter' && selectedProject !== null) {
        const project = projectsData.projects[selectedProject];
        if (
          project?.github_url !== null &&
          project?.github_url !== undefined &&
          project.github_url.length > 0
        ) {
          window.open(project.github_url, '_blank');
        }
      } else if (e.key === 'd' && selectedProject !== null) {
        const project = projectsData.projects[selectedProject];
        if (
          project?.demo_url !== null &&
          project?.demo_url !== undefined &&
          project.demo_url.length > 0
        ) {
          window.open(project.demo_url, '_blank');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [projectsData, selectedProject]);

  const formatActivityBar = (score: number): string => {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays.toString()} days ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7).toString()} weeks ago`;
    if (diffDays < 365)
      return `${Math.floor(diffDays / 30).toString()} months ago`;
    return `${Math.floor(diffDays / 365).toString()} years ago`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        {import.meta.env.DEV ? (
          <button
            onClick={() => {
              syncProjects(undefined);
            }}
            disabled={isSyncing}
            className={styles.syncButton}
          >
            {isSyncing ? 'Syncing...' : '⟳ Sync from GitHub'}
          </button>
        ) : null}

        <div className={styles.commandLine}>{searchCommand.displayText}</div>

        {isLoading && !searchCommand.isTyping ? (
          <div className={styles.loading}>{loadingText.displayText}</div>
        ) : null}

        {error !== null && error !== undefined && !searchCommand.isTyping ? (
          <div className={styles.error}>
            npm ERR! Failed to fetch packages:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : null}

        {projectsData !== null &&
        projectsData !== undefined &&
        !isLoading &&
        !searchCommand.isTyping ? (
          <>
            <div className={styles.resultCount}>
              found {projectsData.total} packages
            </div>

            <div className={styles.projectsList}>
              {projectsData.projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`${styles.package} ${
                    selectedProject === index ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedProject(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.packageHeader}>
                    <span className={styles.packageName}>
                      @carter/
                      {project.name.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                    <span className={styles.packageMeta}>
                      <span className={styles.stars}>★{project.stars}</span>
                      <span className={styles.separator}>|</span>
                      <span className={styles.watchers}>
                        <FiEye className={styles.icon} />
                        {project.watchers ?? 0}
                      </span>
                      <span className={styles.separator}>|</span>
                      <span className={styles.forks}>⑂{project.forks}</span>
                    </span>
                  </div>

                  <div className={styles.packageDescription}>
                    {project.description ?? 'No description available'}
                  </div>

                  <div className={styles.packageDetails}>
                    {project.tech_stack !== null &&
                    project.tech_stack !== undefined &&
                    project.tech_stack.length > 0 ? (
                      <div className={styles.detailLine}>
                        <span className={styles.label}>stack:</span>
                        <span className={styles.value}>
                          {project.tech_stack.join(', ')}
                        </span>
                      </div>
                    ) : null}

                    {project.project_type !== null &&
                    project.project_type !== undefined &&
                    project.project_type !== 'other' ? (
                      <div className={styles.detailLine}>
                        <span className={styles.label}>category:</span>
                        <span className={styles.value}>
                          {project.project_type}
                        </span>
                      </div>
                    ) : null}

                    <div className={styles.detailLine}>
                      <span className={styles.label}>activity:</span>
                      <span className={styles.activityBar}>
                        {formatActivityBar(project.activity_score)}
                      </span>
                      <span className={styles.activityScore}>
                        {project.activity_score.toFixed(1)}%
                      </span>
                    </div>

                    <div className={styles.detailLine}>
                      <span className={styles.label}>last activity:</span>
                      <span className={styles.value}>
                        {formatDate(project.last_updated)}
                      </span>
                    </div>

                    <div className={styles.links}>
                      <span className={styles.label}>github:</span>
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.github_url.replace('https://', '')}
                      </a>
                    </div>

                    {project.featured ? (
                      <div className={styles.featured}>
                        <span className={styles.featuredBadge}>
                          ⭐ FEATURED
                        </span>
                      </div>
                    ) : null}

                    {isProjectExpanded(project.id) ? (
                      <div className={styles.expandedDetails}>
                        {project.long_description !== null &&
                        project.long_description !== undefined &&
                        project.long_description.length > 0 ? (
                          <div className={styles.detailSection}>
                            <span className={styles.label}>details:</span>
                            <p className={styles.longDescription}>
                              {project.long_description}
                            </p>
                          </div>
                        ) : null}

                        {project.topics !== null &&
                        project.topics !== undefined &&
                        project.topics.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>topics:</span>
                            <span className={styles.value}>
                              {project.topics.join(', ')}
                            </span>
                          </div>
                        ) : null}

                        {project.language !== null &&
                        project.language !== undefined &&
                        project.language.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>
                              primary language:
                            </span>
                            <span className={styles.value}>
                              {project.language}
                            </span>
                          </div>
                        ) : null}

                        {project.open_issues !== null &&
                        project.open_issues !== undefined &&
                        project.open_issues > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>
                              open issues:
                            </span>
                            <span className={styles.value}>
                              {project.open_issues}
                            </span>
                          </div>
                        ) : null}

                        {project.created_at !== null &&
                        project.created_at !== undefined &&
                        project.created_at.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>created:</span>
                            <span className={styles.value}>
                              {formatDate(project.created_at)}
                            </span>
                          </div>
                        ) : null}

                        {project.clone_url !== null &&
                        project.clone_url !== undefined &&
                        project.clone_url.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>clone:</span>
                            <a
                              href={project.clone_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.link}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {project.clone_url.replace('https://', '')}
                            </a>
                          </div>
                        ) : null}

                        {project.homepage_url !== null &&
                        project.homepage_url !== undefined &&
                        project.homepage_url.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>homepage:</span>
                            <a
                              href={project.homepage_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.link}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {project.homepage_url.replace('https://', '')}
                            </a>
                          </div>
                        ) : null}

                        {project.demo_url !== null &&
                        project.demo_url !== undefined &&
                        project.demo_url.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>demo:</span>
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.link}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {project.demo_url.replace('https://', '')}
                            </a>
                          </div>
                        ) : null}

                        {project.documentation_url !== null &&
                        project.documentation_url !== undefined &&
                        project.documentation_url.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>
                              documentation:
                            </span>
                            <a
                              href={project.documentation_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.link}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {project.documentation_url.replace(
                                'https://',
                                '',
                              )}
                            </a>
                          </div>
                        ) : null}

                        {project.case_study_url !== null &&
                        project.case_study_url !== undefined &&
                        project.case_study_url.length > 0 ? (
                          <div className={styles.detailLine}>
                            <span className={styles.label}>case study:</span>
                            <a
                              href={project.case_study_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.link}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {project.case_study_url.replace(
                                'https://',
                                '',
                              )}
                            </a>
                          </div>
                        ) : null}

                        {project.thumbnail !== null &&
                        project.thumbnail !== undefined &&
                        project.thumbnail.length > 0 ? (
                          <div className={styles.detailSection}>
                            <span className={styles.label}>thumbnail:</span>
                            <img
                              src={project.thumbnail}
                              alt={`${project.name} thumbnail`}
                              className={styles.thumbnail}
                            />
                          </div>
                        ) : null}

                        {project.screenshots !== null &&
                        project.screenshots !== undefined &&
                        project.screenshots.length > 0 ? (
                          <div className={styles.detailSection}>
                            <span className={styles.label}>
                              screenshots:
                            </span>
                            <div className={styles.screenshots}>
                              {project.screenshots.map((screenshot, idx) => (
                                <img
                                  key={`screenshot-${project.id}-${idx.toString()}`}
                                  src={screenshot}
                                  alt={`${project.name} screenshot ${(idx + 1).toString()}`}
                                  className={styles.screenshot}
                                />
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <button
                      className={styles.toggleButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProjectExpanded(project.id);
                      }}
                      aria-label={
                        isProjectExpanded(project.id)
                          ? 'Collapse details'
                          : 'Expand details'
                      }
                    >
                      {isProjectExpanded(project.id) ? (
                        <FiChevronUp className={styles.chevron} />
                      ) : (
                        <FiChevronDown className={styles.chevron} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.navigation}>
              <span>[↑↓] Navigate</span>
              <span>[ENTER] Open GitHub Repo</span>
              <span>[D] View Demo (if available)</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
