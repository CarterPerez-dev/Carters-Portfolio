// ===========================
// Individual Blog Post Page
// ©AngelaMos | 2025
// ===========================

import { useParams, useNavigate } from 'react-router-dom';
import { useTypingAnimation } from '@/lib/hooks';
import { useBlogBySlug } from '@/lib/hooks/useBlogs';
import styles from './blogPost.module.scss';

export const BlogPost = (): React.JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, isError } = useBlogBySlug(slug ?? '');

  const getCommand = useTypingAnimation({
    text: `> curl -X GET /blog/${slug ?? ''} HTTP/1.1`,
    speed: 10,
    delay: 200,
  });

  const handleBackClick = (): void => {
    void navigate('/blog');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const getHttpStatus = (): string => {
    if (isError) return '404 Not Found';
    if (isLoading) return '102 Processing';
    return '200 OK';
  };

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.requestHeader}>
          <div className={styles.command}>{getCommand.displayText}</div>

          {!getCommand.isTyping ? (
            <div className={styles.httpHeaders}>
              <div>HTTP/1.1 {getHttpStatus()}</div>
              <div>Content-Type: text/markdown</div>
              {blog !== undefined && blog !== null ? (
                <>
                  <div>X-Author: {blog.author}</div>
                  <div>X-Published: {formatDate(blog.created_at)}</div>
                  <div>X-Last-Modified: {formatDate(blog.updated_at)}</div>
                  <div>X-Tags: {blog.tags.join(', ')}</div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <div className={styles.loadingBox}>
            <div className={styles.boxHeader}>LOADING</div>
            <div className={styles.boxContent}>
              <div>{'> Fetching post from database...'}</div>
              <div>{'> Rendering markdown content...'}</div>
              <div className={styles.loadingCursor}>{'> _'}</div>
            </div>
          </div>
        ) : null}

        {!getCommand.isTyping && isError ? (
          <div className={styles.errorBox}>
            <div className={styles.boxHeader}>ERROR 404</div>
            <div className={styles.boxContent}>
              <div>Blog post not found: {slug}</div>
              <div className={styles.errorCommand}>
                {'> curl -X GET /api/posts HTTP/1.1'}
              </div>
              <button
                onClick={handleBackClick}
                className={styles.backButton}
              >
                {'< Back to blog list'}
              </button>
            </div>
          </div>
        ) : null}

        {!getCommand.isTyping &&
        !isLoading &&
        blog !== undefined &&
        blog !== null ? (
          <div className={styles.postContent}>
            <div className={styles.postHeader}>
              <div className={styles.postTitle}>{blog.title}</div>
              <div className={styles.postMeta}>
                <span>Author: {blog.author}</span>
                <span className={styles.separator}>|</span>
                <span>Published: {formatDate(blog.created_at)}</span>
              </div>
              {blog.tags.length > 0 ? (
                <div className={styles.postTags}>
                  {blog.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className={styles.tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className={styles.contentBox}>
              <div className={styles.boxHeader}>CONTENT</div>
              <div className={styles.boxContent}>
                <div
                  className={styles.markdown}
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </div>

            <div className={styles.postFooter}>
              <div className={styles.footerMeta}>
                <div>Content-Length: {blog.content.length} bytes</div>
                <div>Last-Modified: {formatDate(blog.updated_at)}</div>
              </div>
              <button
                onClick={handleBackClick}
                className={styles.backButton}
              >
                {'< curl -X GET /api/posts'}
              </button>
            </div>
          </div>
        ) : null}

        {!getCommand.isTyping &&
        !isLoading &&
        blog !== undefined &&
        blog !== null ? (
          <div className={styles.connectionStatus}>
            <div>Connection: close</div>
            <div className={styles.cursor}>{'> _'}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
