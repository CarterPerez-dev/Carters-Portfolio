// ===========================
// Contact Page
// ©AngelaMos | 2025
// ===========================

import { useState, useEffect, type FormEvent } from 'react';
import { useTypingAnimation } from '@/lib/hooks';
import { useSubmitContact } from '@/lib/hooks/useContact';
import { useUIStore } from '@/lib/store/ui.store';
import type { ContactCreateRequest } from '@/lib/types/api/contact';
import styles from './contact.module.scss';

export const Contact = (): React.JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuthenticated, setShowAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { contactForm, setContactFormField, clearContactForm } =
    useUIStore();

  const submitContactMutation = useSubmitContact();

  const sshCommand = useTypingAnimation({
    text: '> ssh guest@carterperez.dev',
    speed: 40,
    delay: 200,
  });

  const passwordPrompt = useTypingAnimation({
    text: 'Password: ',
    speed: 40,
    delay: 100,
  });

  const passwordText = useTypingAnimation({
    text: '********',
    speed: 80,
    delay: 100,
  });

  const authenticating = useTypingAnimation({
    text: 'Authenticating...',
    speed: 30,
    delay: 100,
  });

  const welcomeMessage = useTypingAnimation({
    text: 'Welcome! Leave a message for Carter:',
    speed: 30,
    delay: 100,
  });

  useEffect(() => {
    if (!sshCommand.isTyping) {
      if (sshCommand.displayText === '> ssh guest@carterperez.dev') {
        setShowPassword(true);
        setShowWelcome(true);
        setShowAuthenticated(true);
        setShowForm(true);
        setShowAlternatives(true);
      } else if (!showPassword) {
        setTimeout(() => setShowPassword(true), 1200);
      }
    }
  }, [sshCommand.isTyping, sshCommand.displayText, showPassword]);

  useEffect(() => {
    if (showPassword && !passwordText.isTyping && !showWelcome) {
      setTimeout(() => setShowWelcome(true), 800);
    }
  }, [showPassword, passwordText.isTyping, showWelcome]);

  useEffect(() => {
    if (showWelcome && !authenticating.isTyping && !showAuthenticated) {
      setTimeout(() => setShowAuthenticated(true), 3000);
    }
  }, [showWelcome, authenticating.isTyping, showAuthenticated]);

  useEffect(() => {
    if (showWelcome && !welcomeMessage.isTyping && !showForm) {
      setTimeout(() => setShowForm(true), 500);
    }
  }, [showWelcome, welcomeMessage.isTyping, showForm]);

  useEffect(() => {
    if (showForm && !showAlternatives) {
      setTimeout(() => setShowAlternatives(true), 800);
    }
  }, [showForm, showAlternatives]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (contactForm.subject.length === 0 || contactForm.body.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const formDataToSubmit: ContactCreateRequest = {
      name: contactForm.name.length > 0 ? contactForm.name : null,
      email: contactForm.email.length > 0 ? contactForm.email : null,
      phone: contactForm.phone.length > 0 ? contactForm.phone : null,
      linkedin:
        contactForm.linkedin.length > 0 ? contactForm.linkedin : null,
      subject: contactForm.subject,
      body: contactForm.body,
    };

    try {
      await submitContactMutation.mutateAsync(formDataToSubmit);
      clearContactForm();
    } catch (error) {
      console.error('Contact submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.sshSession}>
          <div className={styles.commandLine}>{sshCommand.displayText}</div>

          {showPassword ? (
            <div className={styles.passwordLine}>
              <span>{passwordPrompt.displayText}</span>
              <span className={styles.password}>
                {passwordText.displayText}
              </span>
            </div>
          ) : null}

          {showWelcome ? (
            <>
              <div
                className={`${styles.authLine} ${showAuthenticated ? styles.authenticated : ''}`}
              >
                {!showAuthenticated
                  ? authenticating.displayText
                  : 'Authenticated!'}
              </div>
              <div className={styles.welcomeLine}>
                {welcomeMessage.displayText}
              </div>
            </>
          ) : null}

          {showForm ? (
            <form
              onSubmit={(e) => void handleSubmit(e)}
              className={styles.contactForm}
            >
              <div className={styles.formGroup}>
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={contactForm.name ?? ''}
                  onChange={(e) =>
                    setContactFormField('name', e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={contactForm.email ?? ''}
                  onChange={(e) =>
                    setContactFormField('email', e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone:</label>
                <input
                  id="phone"
                  type="tel"
                  value={contactForm.phone ?? ''}
                  onChange={(e) =>
                    setContactFormField('phone', e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="linkedin">LinkedIn:</label>
                <input
                  id="linkedin"
                  type="url"
                  value={contactForm.linkedin ?? ''}
                  onChange={(e) =>
                    setContactFormField('linkedin', e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject: *</label>
                <input
                  id="subject"
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactFormField('subject', e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message: *</label>
                <textarea
                  id="message"
                  value={contactForm.body}
                  onChange={(e) =>
                    setContactFormField('body', e.target.value)
                  }
                  className={styles.textarea}
                  rows={6}
                  required
                />
              </div>

              <div className={styles.commandPrompt}>
                <span className={styles.prompt}>$</span>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'sending...' : 'submit_message'}
                </button>
              </div>
            </form>
          ) : null}
        </div>

        {showAlternatives ? (
          <div className={styles.alternativeContact}>
            <div className={styles.sectionTitle}>
              &gt; ls other_contact_methods/
            </div>
            <div className={styles.contactOutput}>
              <div>
                email:{' '}
                <a
                  href="mailto:inquiry@certgames.com"
                  className={styles.contactLink}
                >
                  inquiry@certgames.com
                </a>
              </div>
              <div>
                github:{' '}
                <a
                  href="https://github.com/CarterPerez-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  github.com/CarterPerez-dev
                </a>
              </div>
              <div>
                linkedin:{' '}
                <a
                  href="https://www.linkedin.com/in/carterperez-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  linkedin.com/in/carterperez-dev
                </a>
              </div>
              <div>phone: 410-212-7288</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
