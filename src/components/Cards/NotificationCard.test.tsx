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
      content: 'hejhej',
      dismissedKey: 'nvdjsfv',
    };
    const { container } = render(() => <NotificationCard {...props} />);
    const div = container.querySelector('div.notification-card__header');
    expect(div).toHaveClass('notification-card__header');
  });

  test('<NotificationCard />  show info icon when type is info', () => {
    setMockStore({ showNotificationCard: true });
    const props = {
      content: `---
      type: 'info'
      title: 'Info'
      ---
This is an info message in Markdown. **Important!** _foo_
      `,
      dismissedKey: 'info-test',
    };
    render(() => <NotificationCard {...props} />);
    const icon = screen.getByRole('img', { name: /info icon/i });
    expect(icon).toHaveClass('info-icon');
  });
});
