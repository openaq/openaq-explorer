import { render } from '@solidjs/testing-library';
import { StrengthBar } from '.';

describe('<StrengthBar/>', () => {
  test('bar with score below index not colored', () => {
    const { container } = render(() => (
      <StrengthBar index={4} score={3} color={'alert'} />
    ));
    const bar = container.querySelector('div');
    expect(bar).not.toHaveClass('strength-meter__bar--alert');
  });

  test('bar with score one above index colored', () => {
    const { container } = render(() => (
      <StrengthBar index={1} score={2} color={'alert'} />
    ));
    const bar = container.querySelector('div');
    expect(bar).toHaveClass('strength-meter__bar--alert');
  });

  test('bar with score equal to index not colored', () => {
    const { container } = render(() => (
      <StrengthBar index={2} score={2} color={'alert'} />
    ));
    const bar = container.querySelector('div');
    expect(bar).not.toHaveClass('strength-meter__bar--alert');
  });
});
