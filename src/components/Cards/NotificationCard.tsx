import { WarningIcon } from '~/assets/imgs/svgs/notification-icons/warning-svg';
import '~/assets/scss/components/notification-card.scss';

export const NotificationCard = () => {
  return (
    <>
      <section class="notification-card">
        <div class="notification-card__header">
          <WarningIcon role="img" aria-label="Warning Icon" width={32} height={32} class="notification-icon"  />
          {/* <ErrorIcon role="img" aria-label="Warning Icon" width={32} height={32}  />
          <InfoIcon role="img" aria-label="Warning Icon" width={32} height={32}  /> */}
          <h3>Title</h3>
        </div>
        <p>
        If this notification goes away, assume everything is fine. Or horribly broken.
        </p>

        <button class="notification-btn">Dismiss</button>
      </section>
    </>
  );
};
