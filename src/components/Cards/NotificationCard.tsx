import ErrorIcon from '~/assets/imgs/svgs/error.svg';
import InfoIcon from '~/assets/imgs/svgs/info.svg';
import WarningIcon from '~/assets/imgs/svgs/warning.svg';
import '~/assets/scss/components/notification-card.scss';
import { useStore } from '~/stores';

interface NotificationContentDefinition {
  html: string;
}

interface NotificationDefinition {
  dismissedKey: string;
  notificationTitle?: string;
  notificationType?: string;
  notificationContent?: string;
}

function NotificationContent(props: NotificationContentDefinition) {
  return <span innerHTML={props.html} />;
}

const NotificationCard = (props: NotificationDefinition) => {
  const [store, { toggleShowNotificationCard }] = useStore();

  const handleDismiss = () => {
    localStorage.setItem(props.dismissedKey, 'true');
    toggleShowNotificationCard(false);
  };

  const getNotificationIcon = () => {
    switch (props.notificationType) {
      case 'warning':
        return (
          <WarningIcon
            role="img"
            aria-label="Warning Icon"
            class="warning-icon"
          />
        );
      case 'error':
        return (
          <ErrorIcon role="img" aria-label="Error Icon" class="error-icon" />
        );
      case 'info':
      default:
        return <InfoIcon role="img" aria-label="Info Icon" class="info-icon" />;
    }
  };

  return (
    <>
      <section class="notification-card">
        <div class="notification-card__header">
          {getNotificationIcon()}
          <h3>{props.notificationTitle}</h3>
        </div>
        <NotificationContent html={String(props.notificationContent)} />
        <button class="notification-btn" onClick={() => handleDismiss()}>
          Dismiss
        </button>
      </section>
    </>
  );
};

export default NotificationCard;
