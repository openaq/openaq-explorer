import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import NotificationCard from './NotificationCard';
import { createStore } from 'solid-js/store';

vi.stubGlobal('URL.createObjectURL', vi.fn());

const [mockStore, setMockStore] = createStore({
  showNotificationCard: true,
  toggleShowNotificationCard: vi.fn(),
});

vi.mock('~/stores', () => {
  return {
    useStore: () => [
      mockStore,
      { toggleShowNotificationCard: mockStore.toggleShowNotificationCard },
    ],
  };
});

describe('<NotificationCard />', () => {
  test('<NotificationCard />  Elements renders when showNotificationCard is set to true', () => {
    setMockStore({ showNotificationCard: true });
    const props = {
      notificationType: 'info',
      notificationTitle: 'Information',
      notificationContent: 'This is information about...',
      dismissedKey: 'ihfg943',
    };
    const { container } = render(() => <NotificationCard {...props} />);
    const div = container.querySelector('div.notification-card__header');
    expect(div).toHaveClass('notification-card__header');
  });

  test('<NotificationCard />  show info icon when type is info', () => {
    setMockStore({ showNotificationCard: true });
    const props = {
      notificationType: 'info',
      notificationTitle: 'Information',
      notificationContent: 'This is information about...',
      dismissedKey: 'ihfg943',
    };
    render(() => <NotificationCard {...props} />);
    const icon = screen.getByRole('img', { name: /info icon/i });
    expect(icon).toHaveClass('info-icon');
  });

  test('<NotificationCard />  show warning icon when type is warning', () => {
    setMockStore({ showNotificationCard: true });
    const props = {
      notificationType: 'warning',
      notificationTitle: 'An error occurred',
      notificationContent: 'Something went wrong.',
      dismissedKey: 'evfds123',
    };
    render(() => <NotificationCard {...props} />);
    const icon = screen.getByRole('img', { name: /Warning Icon/i });
    expect(icon).toHaveClass('warning-icon');
  });

  test('<NotificationCard />  show error icon when type is error', () => {
    setMockStore({ showNotificationCard: true });
    const props = {
      notificationType: 'error',
      notificationTitle: 'An error occurred',
      notificationContent: 'Something went wrong.',
      dismissedKey: 'evfds123',
    };
    render(() => <NotificationCard {...props} />);
    const icon = screen.getByRole('img', { name: /Error Icon/i });
    expect(icon).toHaveClass('error-icon');
  });

  test('<NotificationCard />  render correct notification title and content', () => {
    setMockStore({ showNotificationCard: true });
    const props = {
      notificationType: 'error',
      notificationTitle: 'An error occurred',
      notificationContent: 'Something went wrong',
      dismissedKey: 'evfds123',
    };
    render(() => <NotificationCard {...props} />);
    const h3 = screen.getByRole('heading');
    expect(h3.innerHTML).toEqual('An error occurred');
    const span = screen.getByText('Something went wrong');
    expect(span.innerHTML).toEqual('Something went wrong');
  });
});
