// ===========================
// Typing Text Component
// ©AngelaMos | 2025
// ===========================

import { useTypingAnimation } from '@/lib/hooks';
import styles from './typingText.module.scss';

interface TypingTextProps {
  text: string;
  variant?: 'title' | 'command' | 'status' | 'normal';
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export const TypingText = ({
  text,
  variant = 'normal',
  speed = 60,
  delay = 0,
  className = '',
  onComplete,
  showCursor = true,
}: TypingTextProps): React.JSX.Element => {
  const { displayText, isTyping, skipAnimation } = useTypingAnimation({
    text,
    speed,
    delay,
    ...(onComplete !== undefined && { onComplete }),
  });

  const variantClass = {
    title: styles.title,
    command: styles.command,
    status: styles.status,
    normal: styles.normal,
  }[variant];

  return (
    <span
      className={`${styles.typingText} ${variantClass} ${className} ${
        isTyping && showCursor ? styles.withCursor : ''
      }`}
      onClick={skipAnimation}
      role="presentation"
    >
      {displayText}
    </span>
  );
};
