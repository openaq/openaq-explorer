import { test, expect, vi, describe } from "vitest"
import { render } from "@solidjs/testing-library"
import { SensorType } from './SensorType';

describe('<SensorType />', () => {
  vi.stubGlobal('URL.createObjectURL', vi.fn());

  test('<SensorType /> shows correct Reference grade Marker', () => {
    const { container } = render(() => <SensorType isMonitor={true} />);
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('Reference grade');
    const marker = container.querySelector('.reference-grade-marker');
    expect(marker).toBeInTheDocument();
  });

  test('<SensorType /> shows correct Air sensor Marker', () => {
    const { container } = render(() => <SensorType isMonitor={false} />);
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('Air sensor');
    const marker = container.querySelector('.low-cost-sensor-marker');
    expect(marker).toBeInTheDocument();
  });
});
