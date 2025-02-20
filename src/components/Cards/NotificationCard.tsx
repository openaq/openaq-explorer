import { createSignal } from 'solid-js';
import ErrorIcon from '~/assets/imgs/svgs/error.svg';
import InfoIcon from '~/assets/imgs/svgs/info.svg';
import WarningIcon from '~/assets/imgs/svgs/warning.svg';
import '~/assets/scss/components/notification-card.scss';

import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkFrontmatter from "remark-frontmatter"
import remarkParseFrontmatter from "remark-parse-frontmatter"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

import content from '~/content/notification.md?raw';


interface NotificationContentDefinition {
  html: string;
}

function NotificationContent(props: NotificationContentDefinition) {

  return <span innerHTML={props.html} />;
}

export const NotificationCard = () => {
  const [showCard, setShowCard] = createSignal(true);

  const {data: {frontmatter}, value} = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkParseFrontmatter)
  .use(remarkRehype, {
  })
  .use(rehypeStringify)
  .processSync(content)

  const notificationType = import.meta.env.VITE_NOTIFICATION_TYPE;
  const notificationTitle = import.meta.env.VITE_NOTIFICATION_TITLE;
  const notificationText = import.meta.env.VITE_NOTIFICATION_TEXT;

  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'warning':
        return (
          <>
            <WarningIcon
              role="img"
              aria-label="Warning Icon"
              class="notification-icon"
            />
          </>
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
      {showCard() && (
        <section class="notification-card">
          <div class="notification-card__header">
            {getNotificationIcon()}
            <h3>{notificationTitle}</h3>
          </div>
          <NotificationContent html={value}/>

          <button class="notification-btn" onClick={() => setShowCard(false)}>
            Dismiss
          </button>
        </section>
      )}
    </>
  );
};
