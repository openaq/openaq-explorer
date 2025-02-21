import { createEffect, createSignal } from 'solid-js';
import ErrorIcon from '~/assets/imgs/svgs/error.svg';
import InfoIcon from '~/assets/imgs/svgs/info.svg';
import WarningIcon from '~/assets/imgs/svgs/warning.svg';
import '~/assets/scss/components/notification-card.scss';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import warningContent from '~/content/notification-warning.md?raw';
import errorContent from '~/content/notification-error.md?raw';
import infoContent from '~/content/notification-info.md?raw';

interface NotificationContentDefinition {
  html: string;
}

interface Frontmatter {
  type: string;
  title: string;
}

function NotificationContent(props: NotificationContentDefinition) {
  return <span innerHTML={props.html} />;
}

const getNotificationContent = (type: string) => {
  switch (type) {
    case 'warning':
      return warningContent;
    case 'error':
      return errorContent;
    case 'info':
    default:
      return infoContent;
  }
};

export const NotificationCard = () => {
  const [showCard, setShowCard] = createSignal(true);
  const showNotification = import.meta.env.VITE_SHOW_NOTIFICATION === 'true';
  const [isInitialized, setIsInitialized] = createSignal(false); //
  const isClient = typeof window !== 'undefined';

  createEffect(() => {
    if (isClient) {
      const hasDismissedCard =
        localStorage.getItem('notificationDismissed') === 'true';
      if (hasDismissedCard) {
        setShowCard(false);
      }
      setIsInitialized(true);
    }
  });

  const handleDismiss = () => {
    if (isClient) {
      localStorage.setItem('notificationDismissed', 'true');
    }
    setShowCard(false);
  };

  const {
    data: { frontmatter },
    value,
  } = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkParseFrontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(getNotificationContent('warning'));

  const typedFrontmatter = frontmatter as Frontmatter;

  const notificationType = typedFrontmatter?.type;
  const notificationTitle = typedFrontmatter?.title;

  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'warning':
        return (
          <WarningIcon
            role="img"
            aria-label="Warning Icon"
            class="notification-icon"
          />
        );
      case 'error':
        return (
          <ErrorIcon
            role="img"
            aria-label="Error Icon"
            class="notification-icon"
          />
        );
      case 'info':
      default:
        return (
          <InfoIcon
            role="img"
            aria-label="Info Icon"
            class="notification-icon"
          />
        );
    }
  };

  return (
    <>
      {isInitialized() && showCard() && showNotification && (
        <section class="notification-card">
          <div class="notification-card__header">
            {getNotificationIcon()}
            <h3>{notificationTitle}</h3>
          </div>
          <NotificationContent html={String(value)} />
          <button class="notification-btn" onClick={handleDismiss}>
            Dismiss
          </button>
        </section>
      )}
    </>
  );
};
