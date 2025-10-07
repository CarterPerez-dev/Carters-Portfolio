// ===========================
// Blog Listing Page
// ©AngelaMos | 2025
// ===========================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingAnimation } from '@/lib/hooks';
import { usePublishedBlogs } from '@/lib/hooks/useBlogs';
import type { BlogPreviewResponse } from '@/lib/types/api/blogs';
import styles from './blog.module.scss';

export const Blog = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: blogData, isLoading, isError } = usePublishedBlogs(50, 0);

  const getCommand = useTypingAnimation({
    text: '> GET /api/posts HTTP/1.1',
    speed: 23,
    delay: 200,
  });

  const handlePostClick = (slug: string): void => {
    void navigate(`/blog/${slug}`);
  };

  const filteredBlogs =
    blogData?.blogs.filter((blog: BlogPreviewResponse) => {
      const matchesSearch =
        searchQuery === '' ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === null || blog.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    }) ?? [];

  const allTags = [
    ...new Set(
      blogData?.blogs.flatMap((blog: BlogPreviewResponse) => blog.tags) ??
        [],
    ),
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const getHttpStatus = (): string => {
    if (isError) return '500 Internal Server Error';
    if (isLoading) return '102 Processing';
    return '200 OK';
  };

  const renderPostsContent = (): React.JSX.Element => {
    if (isError) {
      return (
        <div className={styles.error}>
          <div>ERROR: Failed to fetch blog posts from server</div>
          <div className={styles.errorCommand}>
            {'> curl -X GET /api/posts --retry 3'}
          </div>
        </div>
      );
    }

    if (filteredBlogs.length === 0) {
      return (
        <div className={styles.empty}>
          <div>No blog posts match your search criteria</div>
        </div>
      );
    }

    return (
      <>
        {filteredBlogs.map((blog: BlogPreviewResponse, index: number) => (
          <div
            key={blog.id}
            className={styles.post}
          >
            <div className={styles.postHeader}>
              <span className={styles.postNumber}>
                #{String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.postDate}>
                {formatDate(blog.created_at)}
              </span>
            </div>
            <div className={styles.postTitle}>{blog.title}</div>
            {blog.tags.length > 0 ? (
              <div className={styles.postTags}>
                {blog.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className={styles.tagBadge}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            <div className={styles.postExcerpt}>{blog.excerpt}</div>
            <button
              onClick={() => handlePostClick(blog.slug)}
              className={styles.readButton}
            >
              {`> curl -X GET /blog/${blog.slug}`}
            </button>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.command}>{getCommand.displayText}</div>

        {!getCommand.isTyping ? (
          <>
            <div className={styles.httpStatus}>
              HTTP/1.1 {getHttpStatus()}
            </div>

            <div className={styles.searchBar}>
              <span className={styles.prompt}>{'> '}</span>
              <span>find . -type d -name </span>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  placeholder=""
                />
                <span
                  className={styles.blinkingCursor}
                  style={{ left: `${String(searchQuery.length * 9)}px` }}
                >
                  |
                </span>
              </div>
            </div>

            {allTags.length > 0 ? (
              <div className={styles.tagFilter}>
                <span className={styles.prompt}>{'> '}</span>
                <span>grep -r </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={
                    selectedTag === null ? styles.activeTag : styles.tag
                  }
                >
                  all
                </button>
                {allTags.map((tag: string) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={
                      selectedTag === tag ? styles.activeTag : styles.tag
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        {!getCommand.isTyping && !isLoading ? (
          <div className={styles.postsContainer}>{renderPostsContent()}</div>
        ) : null}

        {!getCommand.isTyping && isLoading ? (
          <div className={styles.loading}>
            <div>{'> Fetching posts from database...'}</div>
            <div className={styles.loadingCursor}>{'> _'}</div>
          </div>
        ) : null}

        {!getCommand.isTyping && !isLoading ? (
          <div className={styles.connectionStatus}>
            <div>
              Connection:{' '}
              <span className={styles.statusValue}>keep-alive</span>
            </div>
            <div className={styles.cursor}>{'> _'}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
