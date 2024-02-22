import styles from './LocationMarker.module.scss';

export function ReferenceGradeMarker() {
  return (
    <div class={styles['reference-grade-marker']}>
      <div class={styles['reference-grade-marker__border']} />
      <div class={styles['reference-grade-marker__fill']} />
    </div>
  );
}

export function LowCostSensorMarker() {
  return (
    <div class={styles['low-cost-sensor-marker']}>
      <div class={styles['low-cost-sensor-marker__fill']} />
    </div>
  );
}

export function NoRecentUpdateMarker() {
  return (
    <div class={styles['no-recent-data-marker']}>
      <div class={styles['no-recent-data-marker__border']} />
      <div class={styles['no-recent-data-marker__fill']} />
      <div class={styles['no-recent-data-marker__dot']} />
    </div>
  );
}

export function PoorCoverageMarker() {
  return (
    <div class={styles['poor-coverage-marker']}>
      <div class={styles['poor-coverage-marker__border']} />
      <div class={styles['poor-coverage-marker__fill']} />
      <div class={styles['poor-coverage-marker__dot']} />
    </div>
  );
}
