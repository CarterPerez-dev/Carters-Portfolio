// ===========================
// Blogs Admin Section
// ©AngelaMos | 2025
// ===========================

import { useState } from 'react';
import { useAllBlogs, useDeleteBlog, usePublishBlog, useUnpublishBlog } from '@/lib/hooks';
import styles from './blogs.module.scss';

export const BlogsSection = (): React.JSX.Element => {
  const { data, isLoading, error } = useAllBlogs(50, 0);
  const deleteBlog = useDeleteBlog();
  const publishBlog = usePublishBlog();
  const unpublishBlog = useUnpublishBlog();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteClick = (id: string): void => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = (id: string): void => {
    void deleteBlog.mutateAsync(id);
    setDeleteConfirmId(null);
  };

  const handleDeleteCancel = (): void => {
    setDeleteConfirmId(null);
  };

  const handlePublish = (id: string): void => {
    void publishBlog.mutateAsync(id);
  };

  const handleUnpublish = (id: string): void => {
    void unpublishBlog.mutateAsync(id);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading blogs...</div>;
  }

  if (error !== null && error !== undefined) {
    return (
      <div className={styles.error}>
        Error loading blogs: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const blogs = data?.blogs ?? [];
  const total = data?.total ?? 0;

  if (blogs.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No blog posts yet.</div>
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
              {'created'.padEnd(12)} | {'title'.padEnd(45)} | {'status'.padEnd(15)}
            </div>
          </div>

          <div className={styles.body}>
            {blogs.map((blog) => {
              const date = new Date(blog.created_at);
              const dateStr = date.toISOString().split('T')[0];
              const titleStr = (blog.title ?? '').substring(0, 45).padEnd(45);
              const statusStr = blog.published ? 'published' : 'draft';

              return (
                <div key={blog.id} className={styles.rowGroup}>
                  <div className={styles.row}>
                    {dateStr.padEnd(12)} | {titleStr} | {statusStr.padEnd(15)}
                  </div>
                  <div className={styles.rowActions}>
                    {deleteConfirmId === blog.id ? (
                      <>
                        <button
                          onClick={() => handleDeleteConfirm(blog.id)}
                          className={styles.deleteBtn}
                          disabled={deleteBlog.isPending}
                        >
                          [CONFIRM DELETE]
                        </button>
                        <button
                          onClick={handleDeleteCancel}
                          className={styles.actionBtn}
                        >
                          [CANCEL]
                        </button>
                      </>
                    ) : (
                      <>
                        {blog.published ? (
                          <button
                            onClick={() => handleUnpublish(blog.id)}
                            className={styles.actionBtn}
                            disabled={unpublishBlog.isPending}
                          >
                            [UNPUBLISH]
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(blog.id)}
                            className={styles.actionBtn}
                            disabled={publishBlog.isPending}
                          >
                            [PUBLISH]
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(blog.id)}
                          className={styles.deleteBtn}
                          disabled={deleteBlog.isPending}
                        >
                          [DELETE]
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <span className={styles.prompt}>portfolio=#</span>
        <span className={styles.hint}>Note: Create/Edit via DB</span>
      </div>
    </div>
  );
};
