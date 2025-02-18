import { test, expect, vi, describe } from 'vitest';
import { render } from '@solidjs/testing-library';
import { Toast } from '.';
import { createStore } from 'solid-js/store';

const [mockStore, setMockStore] = createStore({
  toastOpen: false,
});

vi.mock('~/stores', () => {
  return {
    useStore: () => [mockStore],
  };
});

describe('<Toast/>', () => {
  const message = 'API Key copied to clipboard';

  test('toast is translated when store toastOpen is false', () => {
    const { container } = render(() => <Toast message={message} />);
    const toast = container.querySelector('div');
    expect(toast).toHaveClass('toast--translate');
  });

  test('toast is nottranslated when store toastOpen is true', () => {
    setMockStore({ toastOpen: true });
    const { container } = render(() => <Toast message={message} />);
    const toast = container.querySelector('div');
    expect(toast).not.toHaveClass('toast--translate');
  });

  test('toast shows message', () => {
    const { container } = render(() => <Toast message={message} />);
    const span = container.querySelector('span');
    expect(span).toHaveTextContent(message);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
